import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy?: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
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
