import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { ScoutSession } from '../../../models/session.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage {
  sessions: ScoutSession[] = [];

  constructor(
    private auth: AuthService,
    private sessionSvc: SessionService,
    private router: Router,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {}

  ionViewWillEnter() { this.load(); }

  get email(): string {
    return this.auth.currentUser?.email ?? '';
  }

  get initials(): string {
    return this.email.slice(0, 2).toUpperCase();
  }

  get lastSession(): ScoutSession | null {
    return this.sessions[0] ?? null;
  }

  get highRiskCount(): number {
    return this.sessions.filter(s => {
      const r = s.risks;
      if (!r) return false;
      return [r.flood, r.wind, r.temperature, r.snow, r.seismic].some(i => i?.level === 'alto');
    }).length;
  }

  private async load() {
    const user = this.auth.currentUser;
    if (!user) return;
    this.sessions = await this.sessionSvc.getUserSessions(user.uid);
  }

  async clearHistory() {
    const alert = await this.alertCtrl.create({
      header: 'Svuota storico',
      message: 'Vuoi eliminare tutte le sessioni salvate? L\'operazione non è reversibile.',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina tutto', role: 'destructive',
          handler: async () => {
            for (const s of this.sessions) {
              if (s.id) await this.sessionSvc.deleteSession(s.id);
            }
            this.sessions = [];
            const t = await this.toast.create({ message: 'Storico svuotato', duration: 2000, color: 'success' });
            t.present();
          }
        }
      ]
    });
    await alert.present();
  }

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
