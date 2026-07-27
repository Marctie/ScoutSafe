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
}

@Injectable({ providedIn: 'root' })
export class EnvironmentalRiskService {
  private http = inject(HttpClient);


  async assess(lat: number, lng: number): Promise<RiskAssessment> {
    const [weather, seismic] = await Promise.all([
      this.fetchWeather(lat, lng),
      this.fetchSeismic(lat, lng)
    ]);
    return { ...weather, seismic, updatedAt: new Date() };
  }

  private async fetchWeather(lat: number, lng: number): Promise<Omit<RiskAssessment, 'seismic' | 'updatedAt'>> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_sum,windspeed_10m_max,snowfall_sum,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
    try {
      const data: any = await firstValueFrom(this.http.get(url));
      const precip = Math.max(...(data.daily?.precipitation_sum ?? [0]));
      const wind = Math.max(...(data.daily?.windspeed_10m_max ?? [0]));
      const snow = Math.max(...(data.daily?.snowfall_sum ?? [0]));
      const minTemp = Math.min(...(data.daily?.temperature_2m_min ?? [20]));
      return {
        flood: this.floodRisk(precip),
        wind: this.windRisk(wind),
        snow: this.snowRisk(snow),
        temperature: this.tempRisk(minTemp)
      };
    } catch {
      return {
        flood: { name: 'Rischio Alluvione', icon: '🌊', level: 'nessuno', description: 'Dati non disponibili' },
        wind: { name: 'Pericolo Vento', icon: '💨', level: 'nessuno', description: 'Dati non disponibili' },
        snow: { name: 'Neve/Ghiaccio', icon: '❄️', level: 'nessuno', description: 'Dati non disponibili' },
        temperature: { name: 'Temperatura', icon: '🌡️', level: 'nessuno', description: 'Dati non disponibili' }
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

  private floodRisk(precip: number): RiskItem {
    const base = { name: 'Rischio Alluvione', icon: '🌊', value: `${precip.toFixed(1)} mm/giorno` };
    if (precip > 20) return { ...base, level: 'alto', description: `Precipitazioni intense previste (${precip.toFixed(1)}mm). Evitare zone basse e vicino a corsi d'acqua.` };
    if (precip > 5) return { ...base, level: 'medio', description: `Piogge moderate previste (${precip.toFixed(1)}mm). Monitorare canali e torrenti.` };
    if (precip > 0) return { ...base, level: 'basso', description: `Piogge leggere (${precip.toFixed(1)}mm). Condizioni generalmente sicure.` };
    return { ...base, level: 'nessuno', description: 'Nessuna precipitazione significativa prevista.' };
  }

  private windRisk(wind: number): RiskItem {
    const base = { name: 'Pericolo Vento', icon: '💨', value: `${wind.toFixed(0)} km/h` };
    if (wind > 60) return { ...base, level: 'alto', description: `Vento molto forte (${wind.toFixed(0)} km/h). Rinforzare tutti i picchetti e i tiranti.` };
    if (wind > 30) return { ...base, level: 'medio', description: `Vento moderato (${wind.toFixed(0)} km/h). Verificare la tensione dei tiranti.` };
    return { ...base, level: 'basso', description: `Vento leggero (${wind.toFixed(0)} km/h). Condizioni ideali per il campeggio.` };
  }

  private snowRisk(snow: number): RiskItem {
    const base = { name: 'Neve / Ghiaccio', icon: '❄️', value: `${snow.toFixed(1)} cm` };
    if (snow > 10) return { ...base, level: 'alto', description: `Nevicate abbondanti previste (${snow.toFixed(1)}cm). Preparare attrezzatura invernale.` };
    if (snow > 1) return { ...base, level: 'medio', description: `Possibili nevicate (${snow.toFixed(1)}cm). Attenzione al ghiaccio.` };
    return { ...base, level: 'nessuno', description: 'Nessuna neve prevista.' };
  }

  private tempRisk(minTemp: number): RiskItem {
    const base = { name: 'Temperatura Min.', icon: '🌡️', value: `${minTemp.toFixed(1)}°C` };
    if (minTemp < 0) return { ...base, level: 'alto', description: `Temperatura sotto zero (${minTemp.toFixed(1)}°C). Rischio ipotermia. Equipaggiamento invernale obbligatorio.` };
    if (minTemp < 10) return { ...base, level: 'medio', description: `Temperatura fresca (${minTemp.toFixed(1)}°C). Sacco a pelo adeguato consigliato.` };
    return { ...base, level: 'basso', description: `Temperatura mite (${minTemp.toFixed(1)}°C). Condizioni favorevoli.` };
  }
}
