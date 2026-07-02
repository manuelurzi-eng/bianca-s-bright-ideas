# LEVER PR — Cockpit Gestione Clienti

Strumento interno dell'agenzia PR Lever per gestire il portafoglio clienti: viste per
ruolo (Dashboard PM, Scheda Cliente, Matrice portafoglio, Controllo Carlo, Pipeline
Rinnovi Carla, Panoramica Exec, Alert Inbox) collegate **direttamente ad Airtable via
API REST** — nessun database intermedio.

Stack: **React + Vite + Tailwind CSS**. UI in italiano, fedele al prototipo Claude Design.

---

## Come parte l'app

- **Senza chiavi Airtable** → modalità **DEMO** con dataset mock (pixel-perfect, ideale su
  Lovable per la review). Nessun segreto richiesto.
- **Con chiavi Airtable configurate** → connessione **diretta** ai dati reali.

Lo switch è automatico (`src/data/source.js`): se `VITE_AIRTABLE_TOKEN` è presente usa
Airtable, altrimenti i mock.

---

## Installazione e avvio

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build di produzione in dist/
npm run preview  # anteprima della build
```

---

## Variabili d'ambiente

Copia `.env.example` in `.env` e compila i valori. **Le chiavi NON vanno mai nel repo.**

| Variabile               | Descrizione                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| `VITE_AIRTABLE_TOKEN`   | Personal Access Token Airtable (`data.records:read` + `:write` sulla base). |
| `VITE_AIRTABLE_BASE_ID` | ID base Airtable. Default: `appPn2L1ushwyWlVX`.                              |
| `VITE_APP_PASSWORD`     | Password unica condivisa per il gate di accesso. Default demo: `lever`.     |

- **In locale:** valori nel file `.env` (git-ignorato).
- **Su Lovable / Vercel:** inserire come **Environment Secrets** nel pannello del progetto,
  **non** nel codice né nel repository.

---

## Accesso e ruoli

1. **Password unica** (gate condiviso). *Non è una barriera di sicurezza reale*: il confronto
   è client-side, serve solo a evitare accessi casuali.
2. **"Chi sei?"** — selezione del profilo. L'elenco è letto dalla tabella **Team** di Airtable
   (più i ruoli fissi Carlo / Carla / Exec). Ogni profilo imposta vista e filtro clienti:
   - **PM** → dashboard operativa; vede i clienti dove è "Referente diffusione".
   - **Carlo** (Head of Delivery) → controllo di tutto il portafoglio + bucket "da assegnare".
   - **Carla** (Renewals) → pipeline rinnovi.
   - **Exec** → panoramica aggregata in sola lettura.

---

## Regole di scrittura su Airtable

Il binding dei campi è per **Field ID** (`fld…`), non per nome: rinominare una colonna su
Airtable non rompe l'app (`src/airtable/fields.js`).

- **Campi "I" (Input)** → scrivibili liberamente (PATCH).
- **Campi "R" (Formula / Rollup / Lookup / Status / AVE / count…)** → **mai scritti**. Una
  guardia in `src/airtable/client.js` blocca ogni PATCH su campo read-only.
- **Campi "T" (Trigger)** → scrivibili, ma **fanno scattare automazioni** su Airtable (es.
  *"Invia il CS al cliente"*). Prima di ogni scrittura di questo tipo l'app mostra una
  **conferma esplicita** (`ConfirmDialog`).

Rate limit rispettato: coda a **5 richieste/secondo**, una chiamata-lista per schermata,
solo i campi necessari, cache breve in memoria (30s).

---

## Note e limiti noti

- **Tabella Alert** non ancora definita su Airtable → in modalità reale la coda alert è
  vuota (in demo usa i mock). Vedi i `TODO` in `src/airtable/fields.js`.
- **Campi DA CREARE** su Airtable (`data_invio_strategia`, `data_riattivazione`,
  `motivo_freeze`) → gestiti come locali finché non esistono; il layer di scrittura li salta
  senza errori.
- **`prossima_checkpoint`** non ha un campo dedicato su Airtable → pianificazione locale.
- Il filtro PM usa oggi l'uguaglianza sul referente principale (fedeltà al prototipo);
  `mapCliente` espone già l'array `referenti` per passare a un match "contains" quando serve.

---

## Struttura

```
src/
  airtable/    client.js · fields.js · mapping.js · api.js   (connessione diretta REST)
  data/        mock.js · model.js · source.js                (dati + switch mock/Airtable)
  logic/       viewmodels.js                                  (build* — porting del prototipo)
  hooks/       useCockpit.js                                  (stato + azioni)
  components/  TopBar · Toast · Entry · PasswordGate · ConfirmDialog
  screens/     DashboardPM · SchedaCliente · Matrice · ControlloCarlo · PipelineRinnovi · Exec · AlertInbox
  lib/         css.js                                         (helper style-string → oggetto React)
```
