import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { App } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import { GeolocationService } from './services/geolocation.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  private geo = inject(GeolocationService);
  private appStateListener?: PluginListenerHandle;

  async ngOnInit() {
    // Richiesta permesso GPS al primo avvio dell'app.
    await this.geo.ensurePermission();

    // Controllo in background: quando l'app torna in primo piano (es. l'utente
    // ha revocato il permesso dalle impostazioni e poi e' tornato), lo richiede di nuovo.
    this.appStateListener = await App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.geo.ensurePermission();
      }
    });
  }

  ngOnDestroy() {
    this.appStateListener?.remove();
  }
}
