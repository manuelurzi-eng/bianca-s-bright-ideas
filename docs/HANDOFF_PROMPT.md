# Prompt di handoff — LEVER PR Cockpit (per un nuovo progetto Lovable)

> Copia/incolla **tutto** questo documento come primo messaggio al nuovo Lovable.
> È la spec integrale del cockpit gestione clienti dell'agenzia PR **Lever**.
> Serve al nuovo agente per capire flusso, ruoli, schermate e — soprattutto —
> **quale campo Airtable alimenta ogni cosa che si vede a schermo**.

---

## 0) Cosa devi costruire (in sintesi)

Un **cockpit interno** (web app, UI in italiano) che legge/scrive **direttamente
su Airtable** (base `appPn2L1ushwyWlVX`) — **nessun database intermedio**.

- Frontend: **React + Vite + Tailwind**.
- Auth d'accesso: **password unica condivisa** (gate client-side, non è sicurezza reale, solo cortesia) + selettore "Chi sei?".
- Connessione Airtable: **tramite Lovable Connector "Airtable" via gateway**
  (`https://connector-gateway.lovable.dev/airtable/...`). Il PAT Airtable
  **non va mai nel bundle** — sta lato server, iniettato come env var. Chiunque
  sia invitato al progetto Lovable eredita la connessione dell'owner.
- Chiamate: **una server function per tabella** (`createServerFn` di TanStack
  Start) che inoltra al gateway. Nessuna fetch diretta ad `api.airtable.com` dal
  browser.
- Bind per **Field ID** (`fld…`), non per nome colonna: rinominare su Airtable
  non deve rompere l'app.

---

## 1) Flusso utente

1. **PasswordGate** → una sola password condivisa (`VITE_APP_PASSWORD`, default `lever`).
2. **Entry / "Chi sei?"** → elenco profili letti da tabella **Team** + ruoli
   fissi (Carlo, Carla, Exec).
   - Nella lista principale compaiono **solo i PM che risultano `Referente diffusione` di almeno un cliente con `status = attivo`**.
   - I PM senza clienti attivi finiscono in una lista secondaria **"Storico PM passate"** (toggle in alto), da cui si accede in sola lettura allo storico.
3. **TopBar** con: nome/ruolo utente, indicatore ambiente (DEMO / LIVE Airtable), toast e "cambia utente".
4. Schermata in base al ruolo:
   - **PM** → Dashboard PM (i suoi clienti) + Scheda Cliente.
   - **Carlo** (Head of Delivery) → Controllo Carlo + Matrice portafoglio + bucket "da assegnare".
   - **Carla** (Renewals) → Pipeline Rinnovi.
   - **Exec** → Panoramica aggregata sola lettura.
   - **Tutti** → Alert Inbox.

---

## 2) Ruoli e permessi

| Ruolo | Cosa vede | Cosa scrive |
|---|---|---|
| **PM** | Solo clienti dove è `Referente diffusione` | Diario contatti, checkpoint, note, campi (I) del proprio cliente |
| **Carlo** | Tutto il portafoglio + bucket "senza referente" | Assegnazione PM, approvazione CS, tutto quello che vede |
| **Carla** | Pipeline rinnovi (tutti i clienti in scadenza) | Campi rinnovo (`proposto_rinnovo`, `ha_rinnovato`, `valore_rinnovo`, `motivazioni_non_rinnovo`) |
| **Exec** | Panoramica aggregata | **Nessuna scrittura** — read-only |

Il filtro PM su Airtable usa il campo `referente_diffusione` (collaborator/link, field ID `fldn3Dn1YvmANdvsM`).

---

## 3) Connessione Airtable — regole d'oro

1. **Base**: `appPn2L1ushwyWlVX`.
2. **Connector**: quello standard di Lovable chiamato "Airtable". Chiedi all'utente di collegarlo con `standard_connectors--connect` → il gateway riceve `Authorization: Bearer $LOVABLE_API_KEY` e `X-Connection-Api-Key: $AIRTABLE_API_KEY`.
3. **Endpoint**: `https://connector-gateway.lovable.dev/airtable/v0/{baseId}/{tableId}` — sempre con `returnFieldsByFieldId=true` così le response arrivano indicizzate per field ID.
4. **Rate limit Airtable**: max **5 req/sec per base** → coda lato server, cache in memoria 30s per le list.
5. **Paginazione**: gestita server-side (loop su `offset`).
6. **Field ID mapping**: centralizzato in un unico file `fields.js` (vedi §6). **Mai** riferimenti a colonne per nome nei componenti.
7. **Guardia scrittura**: PATCH consentito **solo** su campi Input (I). Un `READONLY_FIELD_IDS: Set<string>` blocca in partenza qualunque PATCH su formula/rollup/lookup/status.
8. **Trigger fields (T)**: sono scrivibili ma fanno partire **automazioni Airtable** (invio mail al cliente, ecc.). Prima di ogni PATCH su un campo del set `TRIGGER_FIELD_IDS` mostra un **ConfirmDialog esplicito** ("Stai per inviare X al cliente. Confermi?").

### Legenda annotazioni campi

- **(I) Input** — scrivibile liberamente.
- **(R) Read-only** — formula / rollup / lookup / count / status → mai scrivere.
- **(T) Trigger** — scrivibile ma fa partire un'automazione → conferma obbligatoria.

---

## 4) Tabelle Airtable in uso

```
CLIENTI       tblCIcYFTgIXFlIbf   "Clienti PR" — la tabella cardine
CS            tbldCTyq6gzKD8D2h   "CS Clienti PR" — comunicati stampa, uno per CS
PUBBLICAZIONI tbldW1gJahhs1Aq2v   pubblicazioni ottenute (link a Testate)
TESTATE       tblNn1ZhbBlsk45nu   anagrafica testate + tier
RINNOVI       tblSTmsCRBdkW2AbJ   "Gestione Rinnovi"
TEAM          tblP2mmYf3lTUDRSw   utenti/PM
FORM          tbls10UqPHCtVWpra   form valutazione PR (join per email, NON linkata)
ALERT         (da definire)       tabella non ancora creata → alert in mock finché non wired
```

---

## 5) Schermate — mappa "cosa vedi ↔ quale campo Airtable"

Per ogni tile / colonna / badge indico la tabella e il **field ID** che la alimenta. I campi calcolati lato client (aggregazioni, semafori) sono contrassegnati con `⚙️ derived`.

### 5.1 Entry — "Chi sei?"

- Elenco PM: da **Team** (`TEAM_FIELDS.name` = `fldGCMPnjYIx7EY7L`, `TEAM_FIELDS.email` = `fldj3ceNXoWE7lnVB`).
- Filtro "attivo": PM presente come `referente_diffusione` (`fldn3Dn1YvmANdvsM`) su almeno un cliente con `status_cliente` (`fld6Ob0jES58EFTUN`) `= attivo`. ⚙️ derived.
- Toggle "Storico PM passate": mostra il complemento del set precedente.

### 5.2 Dashboard PM

Filtro base: `referente_diffusione == pm_corrente`.

| Elemento UI | Sorgente |
|---|---|
| Nome cliente | `nome_startup` `fldN7z5DBZBV5kNYa` (R) |
| Tipo cliente (partner/base/…) | `tipo_di_cliente` `fldAgUJkAjqhD8PYK` (R) |
| Status (attivo / in-scadenza / bloccato / churn) | `status_cliente` `fld6Ob0jES58EFTUN` (R) |
| Data fine contratto | `fine_contratto` `fldyPtT0b0SeuZAQW` (R) |
| Giorni al rinnovo | ⚙️ `daysUntil(data_per_rinnovo)` → `fldmpTOs2ZjcjD9eb` (R) |
| Pubblicazioni totali | `count_pubblicazioni` `fld8tGs80ObuwsI9K` (R) |
| Tier 1 fatti / da accordo | `count_pubblicazioni_tier1` `fldxlixeofrAQ0X0v` (R) / `numero_tier1_da_accordo` `fldxpRMg18hKN66c7` (I) |
| AVE totale / mensile | `ave_totale` `fldFfGnBTTmqs10KM` / `ave_media_mensile` `fldUqoNBFYWwhSmRZ` (R) |
| Ultimo contatto (data + tipo) | `ultimo_contatto` `fld2D3ORb2iepONYO` (I) + `tipo_ultimo_contatto` `fldRm4RAgHy2VM2qM` (I) |
| Badge "bloccato" | `cliente_bloccato` `fldJvsrGNxPMchJ71` (R) — deriva da `cliente_bloccato_check` `fldNq7yinLTgOoXlf` (I) |
| Prossima checkpoint | ⚙️ locale (non esiste campo dedicato — vedi §7 TODO) |

### 5.3 Scheda Cliente

Testata:
- Nome, settore, tipologia, contratto: campi (R) sopra.
- Referenti: `referente_diffusione` (`fldn3Dn1YvmANdvsM`) e `referente_rinnovo` (`fldPeegUIZcXh90zC`).
- Link Drive: `link_drive_cliente` `fldg2fvb0YlKHhjd0` (I).
- Report strategia (allegato): `report_di_strategia` `fldtXwGDfs7txFwOB` (I, attachment).

KPI:
- Score `score` `fldSbEiIjkrvce9Ei` (I).
- Soddisfazione `soddisfazione` `fld0c7YYX4rMHKSPy` (I).
- Difficoltà `difficolta` `fldCeWkC0BTw2lsz0` (I).
- CS approvati `numero_cs_approvati` `fld0efWOUY3dmQJI6` (R).

Diario contatti (long text):
- `update_sul_cliente` `fldEU77k8f9TEclb8` (I) — testo libero, il PM appende nota + data.
- Aggiornati assieme: `ultimo_contatto` (`fld2D3ORb2iepONYO`) e `tipo_ultimo_contatto` (`fldRm4RAgHy2VM2qM`).

Checkpoint plan (11 slot fissi + intervista + "ultima"):

```
intervista:       intervista_data fldUzJnWVmJfXgSr1 / bluedot fldHkXdGJoPLPimwj / transcript fldi9x05VQ9JN3a2z
cp1..cp11:        data / bluedot / transcript — vedi src/cockpit/airtable/fields.js CLIENTI_FIELDS.cp{n}_*
ultima_checkpoint: fldhC4NuFyzJ0JO8l (data — "apre il rinnovo") + fldVI27rcf4ksXuDv (transcript)
```
Tutti (I).

Freeze cliente:
- Checkbox `cliente_bloccato_check` `fldNq7yinLTgOoXlf` (I) → riflesso nel formula `cliente_bloccato` (R).
- `motivo_freeze` e `data_riattivazione` **sono TODO Airtable** (§7).

Trigger action buttons (tutti T con ConfirmDialog):
- **Onboarding PM** → `onboarding_pm` `fldZBVGdnh4desXqA`.
- **Invio ultima checkpoint** → `invio_ultima_checkpoint` `fldSr3q4nLBYymWTE`.
- **Invia strategia semestrale** → `invia_strategia_semestrale` `fldQloRpcpqTrk9rQ`.

Sezione CS del cliente (join `CS.riferimento_cliente` `fldHpR9svTmQaohmQ` == clienteId):
- Codice CS `codice_cs` `fld9mQNQKBwbSMAsw` (R), tipologia `tipologia_cs` `flds7gHUiyYKzdGlz` (R).
- Bozza `link_bozza_cs` `fldlB0ohH2zmNE40d` (I).
- Approvazione Carlo: check `approvazione_cs` `fldvR8VqUQmenBH5M` (I) + `data_approvazione_carlo` `fldgqnJ9Za54MeFHR` (R).
- **T** Invio al cliente: `invia_il_cs_al_cliente` `fldNLLeLv72vH1Hei` ⚠ manda davvero il CS → conferma forte.
- Approvazione cliente: `ha_accettato_il_cs` `fldlBs4HBcCne3Agh` (I) + `data_approvazione_cliente` `fldiwPjdCLmYh3vnq`.
- **T** Follow-up cliente: `follow_up_al_cliente` `fldlibQmMYtwIoAm7`, status `status_follow_up_cs` `fld1pTy2IuQU0npcd` (R).
- **T** Modifiche: `invia_il_cs_modificato` `fldUuNGoQM23HYT0k`.
- Diffusione: `diffusione_finita` `fldgdpoWkD9x1lxgm` (I).
- **T** Rassegna stampa: `invia_rassegna_stampa` `fldLE9Ps98Ru1tJK5` + `link_rassegna_stampa` `fldQCdu8gF2riwvhF` (I).
- KPI CS (R): `totali_pubblicazioni` `fldOr1RQTYGsYk1KT`, `totali_pubblicazioni_tier1` `fldKX9zyih4wYAu7V`, `ave_medio_cs` `fldZS548KUDX98SGq`, `time_to_approve_carlo` `fldSf4oJU8urz6eox`, `time_to_approve_cliente` `fldjn1nmdfwu6LZIt`, `time_to_first_publish_tier1` `fldlqZoBdVgE1vZ6L`, `alert_per_carlo` `fldWesc5U9Xisb30U`.
- Pubblicazioni linkate (lookup): `lookup_nome_testata` `fldLD6GyTjyNhUaDg`, `lookup_link` `fldWzxVa5riFNKar8`, `lookup_data` `fldJ1Ep8nezSNyENw`, `lookup_tipologia` `fldSbadjipq6RqyjD`, `lookup_immagine` `fld66oJNmdQQ73eqU`.

Sezione "Sogni & aspettative" (dal FORM, join per email cliente):
- `titolo_forbes` `fldG4Y3ovn8uh1CHx`, `kpi` `fldTcjLAvlhh5kWTc`, `obiettivi_comunicazione` `fld1SJ50wOi1QrquX`, `aspettative` `fldn17eZwgHGp9oZx`.

### 5.4 Matrice portafoglio (Carlo)

- Assi = ⚙️ derivati da `score` e `difficolta`.
- Bolla = un cliente; colore = `status_cliente`; size = `ave_media_mensile`.
- Bucket laterale "da assegnare" = clienti con `referente_diffusione` vuoto.

### 5.5 Controllo Carlo

- Coda CS da approvare = `CS` con `approvazione_cs` = false → azione PATCH su `approvazione_cs` (I).
- Alert per Carlo = `alert_per_carlo` `fldWesc5U9Xisb30U` (R).
- Time-to-approve medi (R) da CS.

### 5.6 Pipeline Rinnovi (Carla)

Filtro: clienti con `data_per_rinnovo` (R) entro N giorni **o** `status_cliente` `in-scadenza`.

| UI | Campo |
|---|---|
| Stato pipeline | `gestione_rinnovi_link` `fldQD612YasLB9pBz` (R, link a tabella Rinnovi) |
| Proposta rinnovo | `proposto_rinnovo` `fldyobwAYRPFEY8wZ` (I) |
| Referente rinnovo | `referente_rinnovo` `fldPeegUIZcXh90zC` (I) |
| Ha rinnovato | `ha_rinnovato` `fldHKwN209arkkac5` (I) |
| Valore rinnovo | `valore_rinnovo` `fldWoGeBV3H899etm` (I) |
| Motivazioni non rinnovo | `motivazioni_non_rinnovo` `fld8ZMKmwirNAmTyO` (I) |

Tabella **Rinnovi** (`tblSTmsCRBdkW2AbJ`): `clienti_pr` `fld5XFtvIrOkU1kJ9`, `status` `fldHLvsUDf5igyjpt`, `assignee` `fldeO3ppLYg3IoRSK`, `notes` `fldmM0ItyOkE9rmfK`.

### 5.7 Panoramica Exec

Solo lettura. Aggregazioni ⚙️ derived su:
- Totale AVE (`ave_totale`), pubblicazioni (`count_pubblicazioni`), tier1 (`count_pubblicazioni_tier1`), n° clienti attivi (`status_cliente`), churn %, rinnovi in pipeline.
- Trend rischio e Tier1/mese: **serie mock** finché non esiste una sorgente aggregata dedicata su Airtable.

### 5.8 Alert Inbox

- Tabella `ALERT`: **ancora da creare su Airtable**. Struttura attesa:
  `{ id, regola, livello:'rosso'|'warning'|'info', cliente:<clientId>, a:[userId…], titolo, dettaglio, step }`.
- Finché non c'è → coda vuota in LIVE, mock in DEMO.

---

## 6) Struttura codice richiesta

```
src/cockpit/
  airtable/
    fields.js        ← UNICA fonte di verità dei field ID + Set READONLY / TRIGGER
    client.js        ← chiama la server function; cache 30s; rate-limit rispettato
    api.js           ← loadTeam / loadClienti / loadCS / loadPubblicazioni + mapping
    mapping.js       ← record Airtable → oggetti "cliente" del modello UI
  data/
    mock.js          ← fallback demo (nessuna chiave richiesta)
    model.js         ← buildModel({...}) — normalizzazione condivisa
    source.js        ← switch automatico mock vs live (isConfigured())
  logic/
    viewmodels.js    ← buildDashboardPM, buildScheda, buildMatrice, buildPipeline, buildExec, buildAlertInbox
  hooks/useCockpit.js
  components/        TopBar · Toast · Entry · PasswordGate · ConfirmDialog
  screens/           DashboardPM · SchedaCliente · Matrice · ControlloCarlo · PipelineRinnovi · Exec · AlertInbox
  lib/css.js
```

Server-side (TanStack Start):

```
src/lib/airtable.functions.ts   ← createServerFn: listRecords(tableId, opts), patchRecord(tableId, id, fields)
                                   Blocca PATCH su READONLY_FIELD_IDS. Legge LOVABLE_API_KEY e AIRTABLE_API_KEY da process.env dentro l'handler.
                                   Instrada via https://connector-gateway.lovable.dev/airtable/v0/{BASE_ID}/...
```

Non usare **mai** `VITE_AIRTABLE_TOKEN`: il PAT non deve finire nel bundle.

---

## 7) TODO Airtable (campi da creare)

Il cockpit già li gestisce **solo in stato locale**, il layer di scrittura li skippa senza errori finché gli ID sono `null` in `fields.js`.

- `data_invio_strategia` (I, date) — data invio strategia semestrale.
- `data_riattivazione` (I, date) — riattivazione post-freeze.
- `motivo_freeze` (I, text) — motivazione del blocco cliente.
- `prossima_checkpoint` (I, date) — attualmente pianificata solo lato client.
- Tabella **Alert** completa (vedi §5.8).

Quando queste colonne vengono create su Airtable, aggiornare i `null` in `CLIENTI_FIELDS` / `ALERT_FIELDS` con il nuovo field ID: **nessun altro codice va toccato**.

---

## 8) Convenzioni UI

- Lingua **italiana**, tono professionale ma diretto.
- Colori/typography dal file `public/colors_and_type.css` (design system Lever).
- Ogni PATCH su Airtable → toast di conferma ("Salvato ✓") o errore ("Airtable ha risposto: …").
- Ogni PATCH su campo T → `ConfirmDialog` con testo esplicito su cosa succederà lato cliente.
- Fedeltà 1:1 al prototipo Claude Design — nessuna licenza estetica gratuita.

---

## 9) Cosa il nuovo Lovable deve fare per primo

1. Chiedere all'utente di **collegare il connector Airtable** (`standard_connectors--connect airtable`).
2. Creare la struttura di file di §6 con `fields.js` **già compilato** copiando gli ID di questo documento.
3. Creare le server function `listRecords` / `patchRecord` con la guardia read-only.
4. Costruire in ordine: PasswordGate → Entry → Dashboard PM → Scheda Cliente → Controllo Carlo → Pipeline Rinnovi → Matrice → Exec → Alert Inbox.
5. Verificare in preview con dati reali che almeno **Team**, **Clienti PR**, **CS**, **Pubblicazioni** vengano letti (una list per tabella, cache 30s).

---

Fine spec. Se qualcosa non è definito qui, **chiedi prima di inventare** — la fedeltà ai field ID e alla distinzione I/R/T è la cosa più importante di tutto il progetto.
