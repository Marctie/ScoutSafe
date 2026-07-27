import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy?: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {

  /** Vero se il permesso di localizzazione (fine o approssimata) e' concesso. */
  async hasPermission(): Promise<boolean> {
    try {
      const status = await Geolocation.checkPermissions();
      return status.location === 'granted' || status.coarseLocation === 'granted';
    } catch {
      // Piattaforma/browser senza Permissions API (es. alcuni browser desktop): non blocchiamo l'uso,
      // il prompt nativo del browser scattera' comunque al primo getCurrentPosition().
      return true;
    }
  }

  /** Controlla i permessi e, se non concessi, li richiede subito. Ritorna true se concessi al termine. */
  async ensurePermission(): Promise<boolean> {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location === 'granted' || status.coarseLocation === 'granted') return true;
      const requested = await Geolocation.requestPermissions();
      return requested.location === 'granted' || requested.coarseLocation === 'granted';
    } catch {
      return true;
    }
  }

  async getCurrentPosition(): Promise<GeoPosition> {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      };
    } catch {
      // Fallback to browser navigator
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) { reject(new Error('Geolocalizzazione non supportata')); return; }
        navigator.geolocation.getCurrentPosition(
          p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
          e => reject(new Error('Impossibile ottenere la posizione: ' + e.message)),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    }
  }
}
