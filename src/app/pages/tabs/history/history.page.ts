import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { ScoutSession } from '../../../models/session.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage implements OnInit {
  sessions: ScoutSession[] = [];
  loading = false;
  expanded: string | null = null;

  constructor(
    private auth: AuthService,
    private sessionSvc: SessionService,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {}

  ngOnInit() { this.load(); }

  async load() {
    const user = this.auth.currentUser;
    if (!user) return;
    this.loading = true;
    try {
      this.sessions = await this.sessionSvc.getUserSessions(user.uid);
    } catch {
      const t = await this.toast.create({ message: 'Errore nel caricamento storico', duration: 2000, color: 'danger' });
      t.present();
    } finally {
      this.loading = false;
    }
  }

  toggle(id: string) {
    this.expanded = this.expanded === id ? null : id;
  }

  async deleteSession(session: ScoutSession) {
    const alert = await this.alertCtrl.create({
      header: 'Elimina sessione',
      message: `Eliminare la sessione "${session.camp.name}"?`,
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina', role: 'destructive',
          handler: async () => {
            try {
              await this.sessionSvc.deleteSession(session.id!);
              this.sessions = this.sessions.filter(s => s.id !== session.id);
              const t = await this.toast.create({ message: 'Sessione eliminata', duration: 2000, color: 'success' });
              t.present();
            } catch {
              const t = await this.toast.create({ message: 'Errore durante l\'eliminazione', duration: 2000, color: 'danger' });
              t.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  levelLabel(level: string): string {
    return { nessuno: 'Nessuno', basso: 'Basso', medio: 'Medio', alto: 'ALTO' }[level] ?? level;
  }
}
