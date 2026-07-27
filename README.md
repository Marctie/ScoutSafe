# ScoutSafe ⛺

**La sicurezza del tuo campo scout, in una sola app.**

App web (Ionic + Angular) per pianificare campi scout in sicurezza: posizionamento del campo su mappa, consigliere di nodi, valutazione dei rischi ambientali con dati meteo e sismici reali, rapporto di sicurezza e storico delle sessioni.

🌐 **App online:** https://marctie.github.io/ScoutSafe/

📖 **Manuale utente completo:** [docs/MANUALE-UTENTE.md](docs/MANUALE-UTENTE.md)

## Funzionalità

- **Campo** — nome e posizione del campo tramite GPS o coordinate manuali, con mappa OpenStreetMap
- **Nodi** — raccomandazione dei 3 nodi più adatti tra 15 nodi scout classici, in base a 7 parametri
- **Rischi** — valutazione di alluvione, vento, temperatura, neve e sismicità con dati Open-Meteo e USGS
- **Rapporto** — riepilogo con note, esportabile in **PDF** e salvabile nello storico
- **Storico** — sessioni salvate sul dispositivo, esportabili singolarmente in PDF
- **Profilo** — area personale con statistiche, **backup/ripristino dati (JSON)** e gestione dati
- **Installabile e offline** — PWA installabile su Android/iOS/desktop, con cache per l'uso senza connessione

## Sviluppo

```bash
npm install
npm start          # server di sviluppo su http://localhost:4200
npm run build      # build di produzione
```

Il deploy su GitHub Pages avviene automaticamente ad ogni push su `main` tramite GitHub Actions.

## App nativa (Android / iOS)

Il progetto include già la piattaforma **Android** (cartella `android/`, basata su Capacitor) pronta per essere aperta in Android Studio e compilata in APK. Per **iOS** serve un Mac con Xcode (requisito Apple, non aggirabile). La guida completa passo-passo per entrambe le piattaforme, incluso come installare l'app su un telefono, è nel [manuale utente, capitolo 14](docs/MANUALE-UTENTE.md#14-per-sviluppatori-build-android-e-ios).
