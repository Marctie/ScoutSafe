import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type RiskLevel = 'nessuno' | 'basso' | 'medio' | 'alto';

export interface RiskItem {
  name: string;
  icon: string;
  level: RiskLevel;
  description: string;
  value?: string;
}

export interface RiskAssessment {
  flood: RiskItem;
  wind: RiskItem;
  seismic: RiskItem;
  temperature: RiskItem;
  snow: RiskItem;
  updatedAt: Date;
  /** Avviso sulla plausibilita' della posizione (es. mare aperto, zona polare). Assente se la posizione non desta sospetti. */
  locationWarning?: string;
}

const ARCTIC_CIRCLE_LAT = 66.5;

@Injectable({ providedIn: 'root' })
export class EnvironmentalRiskService {
  private http = inject(HttpClient);

  async assess(lat: number, lng: number): Promise<RiskAssessment> {
    const [weather, seismic, locationWarning] = await Promise.all([
      this.fetchWeather(lat, lng),
      this.fetchSeismic(lat, lng),
      this.checkLocation(lat, lng)
    ]);
    return { ...weather, seismic, updatedAt: new Date(), locationWarning };
  }

  /**
   * Verifica se la posizione e' plausibile per un campo scout (terraferma abitabile,
   * non in area polare estrema). Non blocca l'analisi: aggiunge solo un avviso.
   */
  private async checkLocation(lat: number, lng: number): Promise<string | undefined> {
    const warnings: string[] = [];

    if (Math.abs(lat) >= ARCTIC_CIRCLE_LAT) {
      warnings.push(
        "Questa posizione e' oltre il circolo polare: condizioni climatiche estreme (freddo intenso, ghiacci permanenti, luce/buio prolungati) non sono sempre catturate dalla sola previsione meteo a breve termine."
      );
    }

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
      const data: any = await firstValueFrom(this.http.get(url));
      if (!data || data.error || !data.address) {
        warnings.push(
          "Le coordinate indicate non risultano su terraferma abitata (potrebbe essere mare aperto, un ghiacciaio o una zona remota disabitata): ricontrolla la posizione inserita nella scheda Campo prima di fidarti dell'analisi rischi."
        );
      }
    } catch {
      // Servizio di geocodifica non raggiungibile: non blocchiamo l'analisi dei rischi per questo.
    }

    return warnings.length > 0 ? warnings.join(' ') : undefined;
  }

  /** Massimo tra i valori numerici validi dell'array, ignorando null/undefined/NaN. */
  private maxOf(values: (number | null | undefined)[] | undefined, fallback: number): number {
    const valid = (values ?? []).filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    return valid.length > 0 ? Math.max(...valid) : fallback;
  }

  /** Minimo tra i valori numerici validi dell'array, ignorando null/undefined/NaN. */
  private minOf(values: (number | null | undefined)[] | undefined, fallback: number): number {
    const valid = (values ?? []).filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    return valid.length > 0 ? Math.min(...valid) : fallback;
  }

  /** Somma dei valori numerici validi dell'array, ignorando null/undefined/NaN. */
  private sumOf(values: (number | null | undefined)[] | undefined): number {
    const valid = (values ?? []).filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    return valid.reduce((acc, v) => acc + v, 0);
  }

  private async fetchWeather(lat: number, lng: number): Promise<Omit<RiskAssessment, 'seismic' | 'updatedAt' | 'locationWarning'>> {
    // Previsione a 7 giorni: copre la durata tipica di un campo e allinea soglie/affidabilita' dichiarate nel manuale.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_sum,windspeed_10m_max,snowfall_sum,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`;
    try {
      const data: any = await firstValueFrom(this.http.get(url));
      const daily = data?.daily;
      if (!daily) throw new Error('Risposta senza dati giornalieri');

      const precipMax = this.maxOf(daily.precipitation_sum, 0);
      const precipTotal = this.sumOf(daily.precipitation_sum);
      const windMax = this.maxOf(daily.windspeed_10m_max, 0);
      const snowMax = this.maxOf(daily.snowfall_sum, 0);
      const snowTotal = this.sumOf(daily.snowfall_sum);
      const minTemp = this.minOf(daily.temperature_2m_min, 20);

      return {
        flood: this.floodRisk(precipMax, precipTotal),
        wind: this.windRisk(windMax),
        snow: this.snowRisk(snowMax, snowTotal),
        temperature: this.tempRisk(minTemp)
      };
    } catch {
      return {
        flood: { name: 'Rischio Alluvione', icon: '🌊', level: 'nessuno', description: 'Dati non disponibili: impossibile valutare questo rischio per la posizione indicata.' },
        wind: { name: 'Pericolo Vento', icon: '💨', level: 'nessuno', description: 'Dati non disponibili: impossibile valutare questo rischio per la posizione indicata.' },
        snow: { name: 'Neve/Ghiaccio', icon: '❄️', level: 'nessuno', description: 'Dati non disponibili: impossibile valutare questo rischio per la posizione indicata.' },
        temperature: { name: 'Temperatura', icon: '🌡️', level: 'nessuno', description: 'Dati non disponibili: impossibile valutare questo rischio per la posizione indicata.' }
      };
    }
  }

  private async fetchSeismic(lat: number, lng: number): Promise<RiskItem> {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lng}&maxradiuskm=150&minmagnitude=2.5&starttime=${start}&endtime=${end}`;
    try {
      const data: any = await firstValueFrom(this.http.get(url));
      const quakes: any[] = data.features ?? [];
      const maxMag = quakes.length > 0 ? Math.max(...quakes.map((q: any) => q.properties.mag)) : 0;
      if (maxMag >= 5) return { name: 'Attività Sismica', icon: '🌍', level: 'alto', description: `Sisma M${maxMag.toFixed(1)} nelle ultime settimane nel raggio di 150km`, value: `M${maxMag.toFixed(1)}` };
      if (maxMag >= 4) return { name: 'Attività Sismica', icon: '🌍', level: 'medio', description: `Sisma M${maxMag.toFixed(1)} registrato vicino all'area`, value: `M${maxMag.toFixed(1)}` };
      if (quakes.length > 0) return { name: 'Attività Sismica', icon: '🌍', level: 'basso', description: `${quakes.length} piccoli sismi (M<4) nelle vicinanze`, value: `${quakes.length} eventi` };
      return { name: 'Attività Sismica', icon: '🌍', level: 'nessuno', description: 'Nessuna attività sismica significativa nelle ultime settimane', value: '0 eventi' };
    } catch {
      return { name: 'Attività Sismica', icon: '🌍', level: 'nessuno', description: 'Dati non disponibili' };
    }
  }

  private floodRisk(maxDaily: number, total: number): RiskItem {
    const base = { name: 'Rischio Alluvione', icon: '🌊', value: `${maxDaily.toFixed(1)} mm/giorno · tot. 7gg ${total.toFixed(0)} mm` };
    if (maxDaily > 20 || total > 60) return { ...base, level: 'alto', description: `Precipitazioni intense previste (picco ${maxDaily.toFixed(1)}mm/giorno, totale settimanale ${total.toFixed(0)}mm). Evitare zone basse e vicino a corsi d'acqua.` };
    if (maxDaily > 5 || total > 25) return { ...base, level: 'medio', description: `Piogge moderate previste (picco ${maxDaily.toFixed(1)}mm/giorno, totale settimanale ${total.toFixed(0)}mm). Monitorare canali e torrenti.` };
    if (maxDaily > 0 || total > 0) return { ...base, level: 'basso', description: `Piogge leggere (totale settimanale ${total.toFixed(0)}mm). Condizioni generalmente sicure.` };
    return { ...base, level: 'nessuno', description: 'Nessuna precipitazione significativa prevista nei prossimi 7 giorni.' };
  }

  private windRisk(wind: number): RiskItem {
    const base = { name: 'Pericolo Vento', icon: '💨', value: `${wind.toFixed(0)} km/h` };
    if (wind > 60) return { ...base, level: 'alto', description: `Vento molto forte (${wind.toFixed(0)} km/h). Rinforzare tutti i picchetti e i tiranti.` };
    if (wind > 30) return { ...base, level: 'medio', description: `Vento moderato (${wind.toFixed(0)} km/h). Verificare la tensione dei tiranti.` };
    return { ...base, level: 'basso', description: `Vento leggero (${wind.toFixed(0)} km/h). Condizioni ideali per il campeggio.` };
  }

  private snowRisk(maxDaily: number, total: number): RiskItem {
    const base = { name: 'Neve / Ghiaccio', icon: '❄️', value: `${maxDaily.toFixed(1)} cm/giorno · tot. 7gg ${total.toFixed(0)} cm` };
    if (maxDaily > 10 || total > 25) return { ...base, level: 'alto', description: `Nevicate abbondanti previste (picco ${maxDaily.toFixed(1)}cm/giorno, totale settimanale ${total.toFixed(0)}cm). Preparare attrezzatura invernale.` };
    if (maxDaily > 1 || total > 3) return { ...base, level: 'medio', description: `Possibili nevicate (totale settimanale ${total.toFixed(0)}cm). Attenzione al ghiaccio.` };
    return { ...base, level: 'nessuno', description: 'Nessuna nevicata significativa prevista nei prossimi 7 giorni.' };
  }

  private tempRisk(minTemp: number): RiskItem {
    const base = { name: 'Temperatura Min.', icon: '🌡️', value: `${minTemp.toFixed(1)}°C` };
    if (minTemp < 0) return { ...base, level: 'alto', description: `Temperatura sotto zero (${minTemp.toFixed(1)}°C). Rischio ipotermia. Equipaggiamento invernale obbligatorio.` };
    if (minTemp < 10) return { ...base, level: 'medio', description: `Temperatura fresca (${minTemp.toFixed(1)}°C). Sacco a pelo adeguato consigliato.` };
    return { ...base, level: 'basso', description: `Temperatura mite (${minTemp.toFixed(1)}°C). Condizioni favorevoli.` };
  }
}
