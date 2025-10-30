"use client";

import { useScoutSafe } from "@/contexts/ScoutSafeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Printer, Shield, Tent, Sparkles, AlertTriangle } from "lucide-react";
import EnvironmentalRisks from "./EnvironmentalRisks";

export default function SafetyReport() {
  const { campDetails, tentSimResult, dynamicRecResult } = useScoutSafe();

  const hasData = campDetails && (tentSimResult || dynamicRecResult);

  const PrintView = () => (
    <div className="print-only space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-headline text-primary">Rapporto sulla Sicurezza di ScoutSafe</h1>
        <p className="text-xl font-semibold">{campDetails.campName}</p>
        <p className="text-sm text-muted-foreground">
          Coordinate: {campDetails.lat.toFixed(4)}, {campDetails.lng.toFixed(4)}
        </p>
        <p className="text-sm text-muted-foreground">
          Generato il: {new Date().toLocaleDateString('it-IT')}
        </p>
      </header>

      <Separator />

      <section className="print-section">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="text-accent" /> Analisi dei Rischi Ambientali</h2>
        <EnvironmentalRisks />
      </section>

      {tentSimResult && (
        <section className="print-section">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Tent className="text-primary"/> Risultati della Simulazione di Stabilità della Tenda</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Valutazione della Stabilità</h3>
              <p className="text-muted-foreground">{tentSimResult.stabilityAssessment}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Rischi Potenziali</h3>
              <p className="text-muted-foreground">{tentSimResult.potentialRisks}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Raccomandazioni</h3>
              <p className="text-muted-foreground">{tentSimResult.recommendations}</p>
            </div>
          </div>
        </section>
      )}

      {dynamicRecResult && (
        <section className="print-section">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-primary"/> Raccomandazioni Dinamiche dell'IA</h2>
          <p className="text-muted-foreground">{dynamicRecResult.recommendations}</p>
        </section>
      )}

       <footer className="pt-8 text-center text-xs text-muted-foreground border-t">
          Rapporto generato da ScoutSafe. Stai al sicuro, sii preparato.
      </footer>
    </div>
  );

  return (
    <>
      <PrintView />
      <Card className="no-print">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-primary" />
            Rapporto sulla Sicurezza
          </CardTitle>
          <CardDescription>
            Un riepilogo di tutte le valutazioni e raccomandazioni.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData && (
            <div className="text-center text-muted-foreground py-8">
              <p>Esegui le simulazioni per generare un rapporto.</p>
            </div>
          )}
          {tentSimResult && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Tent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Stabilità della Tenda</h4>
                  <p className="text-sm text-muted-foreground">
                    {tentSimResult.stabilityAssessment}
                  </p>
                </div>
              </div>
              <Separator />
            </div>
          )}
          {dynamicRecResult && (
            <div className="mt-4 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Raccomandazioni IA</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {dynamicRecResult.recommendations}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.print()} className="w-full" disabled={!hasData}>
            <Printer className="mr-2 h-4 w-4" />
            Genera e Stampa Rapporto
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
