import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { CampDetails } from '../models/camp.model';
import { KnotResult } from '../models/knot.model';
import { RiskAssessment, RiskItem, RiskLevel } from './environmental-risk.service';

export interface ReportData {
  camp: CampDetails;
  createdAt: Date;
  knotResults?: KnotResult[];
  risks?: RiskAssessment | null;
  notes?: string;
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  nessuno: 'Nessuno', basso: 'Basso', medio: 'Medio', alto: 'ALTO'
};

@Injectable({ providedIn: 'root' })
export class PdfReportService {
  generate(data: ReportData): void {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const marginX = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    // Header
    doc.setFillColor(56, 102, 65);
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text('ScoutSafe — Rapporto di Sicurezza', marginX, 16);
    doc.setFont('helvetica', 'normal');
    y = 35;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.camp.name, marginX, y);
    doc.setFont('helvetica', 'normal');
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Posizione: ${data.camp.lat.toFixed(4)}, ${data.camp.lng.toFixed(4)}`, marginX, y);
    y += 5;
    doc.text(`Data generazione: ${data.createdAt.toLocaleString('it-IT')}`, marginX, y);
    y += 10;
    doc.setTextColor(0, 0, 0);

    if (data.knotResults && data.knotResults.length > 0) {
      ensureSpace(12);
      this.sectionTitle(doc, 'Nodi Consigliati', marginX, y);
      y += 8;
      doc.setFontSize(10);
      data.knotResults.forEach((r, i) => {
        ensureSpace(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. ${r.knot.name} (${r.knot.englishName})`, marginX, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const desc = doc.splitTextToSize(r.knot.description, pageWidth - marginX * 2);
        doc.text(desc, marginX, y);
        y += desc.length * 4.5;
        doc.setTextColor(90, 90, 90);
        doc.text(`Punteggio idoneita: ${r.score} · Difficolta: ${r.knot.difficulty}`, marginX, y);
        doc.setTextColor(0, 0, 0);
        y += 7;
      });
      y += 2;
    }

    if (data.risks) {
      ensureSpace(12);
      this.sectionTitle(doc, 'Valutazione Rischi Ambientali', marginX, y);
      y += 8;
      doc.setFontSize(10);
      const items: RiskItem[] = [data.risks.flood, data.risks.wind, data.risks.temperature, data.risks.snow, data.risks.seismic];
      items.forEach(item => {
        ensureSpace(16);
        doc.setFont('helvetica', 'bold');
        const valueSuffix = item.value ? ` (${item.value})` : '';
        doc.text(`${item.name}: ${LEVEL_LABELS[item.level] ?? item.level}${valueSuffix}`, marginX, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const desc = doc.splitTextToSize(item.description, pageWidth - marginX * 2);
        doc.text(desc, marginX, y);
        y += desc.length * 4.5 + 3;
      });
      y += 2;
    }

    if (data.notes && data.notes.trim().length > 0) {
      ensureSpace(12);
      this.sectionTitle(doc, 'Note', marginX, y);
      y += 8;
      doc.setFontSize(10);
      const notesLines = doc.splitTextToSize(data.notes, pageWidth - marginX * 2);
      doc.text(notesLines, marginX, y);
      y += notesLines.length * 4.5;
    }

    ensureSpace(16);
    y = Math.max(y + 8, pageHeight - 20);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const disclaimer = doc.splitTextToSize(
      'ScoutSafe e uno strumento di supporto alle decisioni, non le sostituisce. Verifica sempre le condizioni reali sul posto e i bollettini ufficiali.',
      pageWidth - marginX * 2
    );
    doc.text(disclaimer, marginX, pageHeight - 12);

    const safeName = data.camp.name.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'campo';
    const dateStr = data.createdAt.toISOString().slice(0, 10);
    doc.save(`ScoutSafe_${safeName}_${dateStr}.pdf`);
  }

  private sectionTitle(doc: jsPDF, title: string, x: number, y: number): void {
    doc.setFontSize(13);
    doc.setTextColor(56, 102, 65);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  }
}
