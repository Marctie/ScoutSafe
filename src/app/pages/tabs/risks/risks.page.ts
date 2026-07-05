import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { EnvironmentalRiskService, RiskAssessment, RiskLevel } from '../../../services/environmental-risk.service';
import { campDetailsStore } from '../setup/setup.page';

export let lastRiskAssessment: RiskAssessment | null = null;

@Component({
  selector: 'app-risks',
  templateUrl: './risks.page.html',
  styleUrls: ['./risks.page.scss'],
  standalone: false
})
export class RisksPage {
  assessment: RiskAssessment | null = null;
  loading = false;
  error = '';

  constructor(private riskSvc: EnvironmentalRiskService, private toast: ToastController) {}

  get camp() { return campDetailsStore; }

  async analyze() {
    if (!this.camp) {
      const t = await this.toast.create({ message: 'Prima configura il campo nella tab Campo', duration: 3000, color: 'warning' });
      t.present();
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      this.assessment = await this.riskSvc.assess(this.camp.lat, this.camp.lng);
      lastRiskAssessment = this.assessment;
    } catch (e: any) {
      this.error = 'Errore nel recupero dei dati meteo. Controlla la connessione.';
    } finally {
      this.loading = false;
    }
  }

  levelClass(level: RiskLevel): string {
    return `risk-card-${level === 'nessuno' ? 'none' : level}`;
  }

  badgeClass(level: RiskLevel): string {
    return `risk-badge-${level === 'nessuno' ? 'none' : level}`;
  }

  levelLabel(level: RiskLevel): string {
    return { nessuno: 'Nessuno', basso: 'Basso', medio: 'Medio', alto: 'ALTO' }[level];
  }

  get riskItems() {
    if (!this.assessment) return [];
    return [
      this.assessment.flood,
      this.assessment.wind,
      this.assessment.temperature,
      this.assessment.snow,
      this.assessment.seismic
    ];
  }
}
