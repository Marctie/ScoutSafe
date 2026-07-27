import { Component, inject } from '@angular/core';
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
  private auth = inject(AuthService);
  private sessionSvc = inject(SessionService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toast = inject(ToastController);

  sessions: ScoutSession[] = [];

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

  exportBackup() {
    const user = this.auth.currentUser;
    if (!user) return;
    const json = this.sessionSvc.exportBackup(user.uid);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoutsafe_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  triggerImport(input: HTMLInputElement) {
    input.click();
  }

  async onImportFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const user = this.auth.currentUser;
    if (!user) return;

    try {
      const text = await file.text();
      const count = await this.sessionSvc.importBackup(text, user.uid);
      await this.load();
      const t = await this.toast.create({
        message: count > 0 ? `${count} sessioni importate` : 'Nessuna sessione valida trovata nel file',
        duration: 2500,
        color: count > 0 ? 'success' : 'warning'
      });
      t.present();
    } catch {
      const t = await this.toast.create({ message: 'File non valido: impossibile importare il backup', duration: 3000, color: 'danger' });
      t.present();
    }
  }
}
