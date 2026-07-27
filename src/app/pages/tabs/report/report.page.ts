import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { PdfReportService } from '../../../services/pdf-report.service';
import { campDetailsStore } from '../setup/setup.page';
import { lastKnotResults, lastKnotQuery } from '../knots/knots.page';
import { lastRiskAssessment } from '../risks/risks.page';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: false
})
export class ReportPage {
  notes = '';
  saved = false;
  today = new Date();

  constructor(
    private auth: AuthService,
    private sessionSvc: SessionService,
    private pdfSvc: PdfReportService,
    private toast: ToastController,
    private loading: LoadingController
  ) {}

  get camp() { return campDetailsStore; }
  get knotResults() { return lastKnotResults; }
  get knotQuery() { return lastKnotQuery; }
  get risks() { return lastRiskAssessment; }

  get hasData() { return this.camp && (this.knotResults.length > 0 || this.risks); }

  get riskItems() {
    if (!this.risks) return [];
    return [this.risks.flood, this.risks.wind, this.risks.temperature, this.risks.snow, this.risks.seismic];
  }

  levelLabel(level: string): string {
    return { nessuno: 'Nessuno', basso: 'Basso', medio: 'Medio', alto: 'ALTO' }[level] ?? level;
  }

  async save() {
    const user = this.auth.currentUser;
    if (!user || !this.camp) return;
    const loader = await this.loading.create({ message: 'Salvataggio...' });
    await loader.present();
    try {
      await this.sessionSvc.saveSession({
        userId: user.uid,
        createdAt: new Date(),
        camp: this.camp,
        knotQuery: this.knotQuery ?? undefined,
        knotResults: this.knotResults,
        risks: this.risks ?? undefined,
        notes: this.notes
      });
      this.saved = true;
      const t = await this.toast.create({ message: 'Sessione salvata nello storico!', duration: 2000, color: 'success' });
      t.present();
    } catch {
      const t = await this.toast.create({ message: 'Errore durante il salvataggio', duration: 3000, color: 'danger' });
      t.present();
    } finally {
      await loader.dismiss();
    }
  }

  async exportPdf() {
    if (!this.camp) return;
    try {
      this.pdfSvc.generate({
        camp: this.camp,
        createdAt: this.today,
        knotResults: this.knotResults,
        risks: this.risks,
        notes: this.notes
      });
    } catch {
      const t = await this.toast.create({ message: 'Errore durante la generazione del PDF', duration: 3000, color: 'danger' });
      t.present();
    }
  }
}
