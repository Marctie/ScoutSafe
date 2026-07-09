# ScoutSafe ⛺

**La sicurezza del tuo campo scout, in una sola app.**

App web (Ionic + Angular) per pianificare campi scout in sicurezza: posizionamento del campo su mappa, consigliere di nodi, valutazione dei rischi ambientali con dati meteo e sismici reali, rapporto di sicurezza e storico delle sessioni.

🌐 **App online:** https://marctie.github.io/ScoutSafe/

📖 **Manuale utente completo:** [docs/MANUALE-UTENTE.md](docs/MANUALE-UTENTE.md)

## Funzionalità

- **Campo** — nome e posizione del campo tramite GPS o coordinate manuali, con mappa OpenStreetMap
- **Nodi** — raccomandazione dei 3 nodi più adatti tra 15 nodi scout classici, in base a 7 parametri
- **Rischi** — valutazione di alluvione, vento, temperatura, neve e sismicità con dati Open-Meteo e USGS
- **Rapporto** — riepilogo stampabile con note, salvabile nello storico
- **Storico** — sessioni salvate sul dispositivo
- **Profilo** — area personale con statistiche e gestione dati

## Sviluppo

```bash
npm install
npm start          # server di sviluppo su http://localhost:4200
npm run build      # build di produzione
```

Il deploy su GitHub Pages avviene automaticamente ad ogni push su `main` tramite GitHub Actions.
