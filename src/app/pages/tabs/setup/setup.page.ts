import { Component, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { GeolocationService } from '../../../services/geolocation.service';
import { CampDetails } from '../../../models/camp.model';
import * as L from 'leaflet';

// Fix default Leaflet icon paths for bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export let campDetailsStore: CampDetails | null = null;

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
  standalone: false
})
export class SetupPage implements AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private geo = inject(GeolocationService);
  private toast = inject(ToastController);
  private loading = inject(LoadingController);

  form: FormGroup;
  private map?: L.Map;
  private marker?: L.Marker;

  constructor() {
    this.form = this.fb.group({
      name: ['Campo Scout', [Validators.required, Validators.minLength(3)]],
      lat: [41.9028, [Validators.required, Validators.min(-90), Validators.max(90)]],
      lng: [12.4964, [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 300);
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initMap() {
    const lat = this.form.value.lat;
    const lng = this.form.value.lng;
    this.map = L.map('map-container').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.marker = L.marker([lat, lng]).addTo(this.map).bindPopup(this.form.value.name);
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.form.patchValue({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) });
      this.updateMarker();
    });
  }

  private updateMarker() {
    if (!this.map) return;
    const { lat, lng, name } = this.form.value;
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lng]).addTo(this.map).bindPopup(name || 'Campo');
    this.map.setView([lat, lng], this.map.getZoom());
  }

  async getGPS() {
    const loader = await this.loading.create({ message: 'Rilevamento posizione...' });
    await loader.present();
    try {
      const pos = await this.geo.getCurrentPosition();
      this.form.patchValue({ lat: +pos.lat.toFixed(6), lng: +pos.lng.toFixed(6) });
      this.updateMarker();
      const t = await this.toast.create({ message: `Posizione rilevata! Precisione: ~${pos.accuracy?.toFixed(0) ?? '?'}m`, duration: 2000, color: 'success' });
      t.present();
    } catch (e: any) {
      const t = await this.toast.create({ message: e.message, duration: 3000, color: 'danger' });
      t.present();
    } finally {
      await loader.dismiss();
    }
  }

  save() {
    if (this.form.invalid) return;
    campDetailsStore = this.form.value as CampDetails;
    this.updateMarker();
    this.toast.create({ message: 'Campo salvato!', duration: 2000, color: 'success' }).then(t => t.present());
  }
}
