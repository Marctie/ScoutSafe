import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {
  constructor(private auth: AuthService, private router: Router, private alertCtrl: AlertController) {}

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Esci',
      message: 'Vuoi davvero uscire?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { text: 'Esci', handler: async () => { await this.auth.logout(); this.router.navigate(['/auth/login']); } }
      ]
    });
    await alert.present();
  }
}
