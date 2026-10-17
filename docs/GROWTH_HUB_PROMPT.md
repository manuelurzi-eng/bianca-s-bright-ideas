# Prompt — LEVER Growth & Retention Hub (ricostruzione cockpit)

> Copia/incolla questo documento come brief per Claude (o per un nuovo Lovable)
> quando si parte con la costruzione. È una **spec di lavoro**, non ancora
> definitiva: le sezioni marcate `🟡 DA DECIDERE` vanno chiuse con l'utente
> prima di creare tabelle/campi reali — non inventare la struttura dati.

---

## 0) Perché questo documento

Il cockpit attuale (`lovable-cockpit/`, spec in `docs/HANDOFF_PROMPT.md`) gestisce
solo i **clienti attivi** (PM, CS, checkpoint, rinnovi) ed è di fatto inutilizzato.
Si ricostruisce da zero per farlo diventare l'**hub di crescita e retention** di
Lever, organizzato in 4 aree:

1. **Outbound** — attività di prospecting proattivo (cold email, LinkedIn, call).
2. **Organico** — lead inbound spontanei (chi scrive a Lever/Carlo senza essere
   stato contattato prima: sito, passaparola, referral, DM).
3. **Prospect** — la pipeline commerciale vera e propria: dove finiscono i lead
   (sia outbound sia organici) una volta qualificati, fino a won/lost.
4. **Retention & riattivazione** — un binario separato di "rework nel tempo",
   con due casi distinti ma simili: i **clienti non rinnovati** (motivo,
   valore perso, tentativi di win-back) e i **prospect da riattivare**
   (persone arrivate fino alla call ma mai chiuse, su cui va programmato un
   rilavoro periodico, non un semplice "lost" da dimenticare).

Ogni area va costruita secondo lo stesso schema: **segnali → dati → tendenza →
output**, più un livello trasversale di **tracciamento del lavoro** (task, owner,
scadenze, alert) così che nulla sfugga senza bisogno di rincorrerlo a memoria.

🟡 **DA DECIDERE**: le 4 aree sostituiscono interamente il cockpit clienti-attivi,
o convivono con esso (Dashboard PM / CS / Checkpoint restano e si aggiunge
il growth hub accanto)? Questo prompt assume che il growth hub sia il focus
primario e che i dati clienti esistenti (status, rinnovo, motivazioni non
rinnovo) vengano **riusati come fonte** per l'area 4, non riscritti.

---

## 1) Framework per area

Per ciascuna delle 4 aree, lo stesso schema a 4 livelli + tracciamento lavoro:

- **Segnali** — gli eventi che fanno muovere un record (cosa succede e quando
  va registrato: un messaggio ricevuto, una risposta, uno stage che cambia).
- **Dati** — i campi minimi per descrivere lo stato attuale di un record.
- **Tendenza** — le metriche aggregate nel tempo (serie storiche, tassi,
  medie) che servono a vedere se si sta andando meglio o peggio.
- **Output** — le viste/schermate che espongono segnali+dati+tendenza a chi
  deve agire o decidere.
- **Tracciamento lavoro** — task/next-step con owner e scadenza, così ogni
  record ha sempre un "chi fa cosa entro quando" visibile.

### 1.1 Outbound

| Livello | Contenuto |
|---|---|
| Segnali | contatto aggiunto a una sequenza, email/messaggio inviato, risposta ricevuta (positiva/negativa/silenzio), meeting fissato, lead qualificato o scartato, opt-out/bounce |
| Dati | nome, azienda, ruolo, settore, canale (email/LinkedIn/telefono), owner Lever, sequenza/step corrente, data ultimo contatto, esito |
| Tendenza | volume contatti/settimana, tasso di risposta, tasso di conversione lead→prospect, tempo medio di risposta, per owner e per canale |
| Output | dashboard funnel per step, lista contatti "in attesa di risposta" ordinata per scadenza follow-up |
| Tracciamento lavoro | task "prossimo follow-up" (data + owner + stato: da fare/fatto/saltato) |

🟡 **DA DECIDERE**: le attività outbound vengono generate/arricchite con
**Apollo** (disponibile in sessione: prospecting ICP, arricchimento lead,
sequenze) e poi sincronizzate su Airtable, oppure tutto a mano su Airtable
senza integrazioni esterne per ora?

### 1.2 Organico

| Livello | Contenuto |
|---|---|
| Segnali | nuovo messaggio/richiesta ricevuta, prima risposta inviata, qualificazione (sì/no), passaggio a Prospect |
| Dati | nome, azienda, canale di arrivo (sito/referral/passaparola/evento/DM diretto a Carlo), chi l'ha ricevuto, data arrivo, data prima risposta, note |
| Tendenza | volume lead organici/mese, fonte più frequente, tempo medio di prima risposta, tasso di conversione in prospect |
| Output | inbox stile "nuovi arrivi" ordinata per anzianità senza risposta (riuso del pattern **Alert Inbox** già previsto nel cockpit attuale) |
| Tracciamento lavoro | assegnazione owner + stato (da contattare / contattato / qualificato / scartato) |

### 1.3 Prospect (pipeline commerciale)

| Livello | Contenuto |
|---|---|
| Segnali | cambio stage, proposta inviata, contratto firmato o perso, motivo di perdita |
| Dati | azienda, referente, fonte (outbound / organico / referral), stage (lead → qualificato → proposta → negoziazione → won/lost), valore stimato, owner, data prossimo step |
| Tendenza | valore di pipeline per stage, win rate, tempo medio di chiusura, conversion rate per fonte (outbound vs organico) |
| Output | board a stage (kanban) o matrice, dashboard valore pipeline/forecast |
| Tracciamento lavoro | next step per ogni prospect con data e owner, reminder sulle scadenze |

### 1.4 Retention & riattivazione

Due sotto-binari con la stessa logica (non chiudere e dimenticare: programmare
un rilavoro periodico), popolati da provenienze diverse.

#### 1.4a Clienti non rinnovati

| Livello | Contenuto |
|---|---|
| Segnali | passaggio a status "non rinnovato"/churn, avvio tentativo di win-back, esito win-back |
| Dati | storico cliente (riuso da tabella Clienti/Rinnovi esistente: `status_cliente`, `ha_rinnovato`, `motivazioni_non_rinnovo`, `valore_rinnovo`), data churn, owner win-back, stato tentativo recupero |
| Tendenza | churn rate mensile, motivi di churn più ricorrenti, win-back rate, valore perso cumulato |
| Output | lista clienti persi con motivo e stato win-back, trend churn nel tempo |
| Tracciamento lavoro | task di follow-up win-back periodico (es. ogni trimestre) |

#### 1.4b Prospect da riattivare

Prospect che sono arrivati almeno alla call ma non si sono chiusi (né won né
formalmente lost) — non vanno abbandonati, vanno ripresi nel tempo.

| Livello | Contenuto |
|---|---|
| Segnali | prospect marcato "in stallo" dopo N giorni senza movimento dalla call, programmazione di un rilavoro futuro, esito del rilavoro (torna in pipeline attiva / di nuovo in stallo / abbandono definitivo) |
| Dati | riferimento al prospect originale (stesso record o link a `PROSPECT`), data dell'ultima call/contatto, motivo dello stallo, data prevista per il prossimo rilavoro, owner |
| Tendenza | volume prospect in stallo, tasso di riattivazione, tempo medio in stallo prima del rilavoro |
| Output | lista "da riattivare" ordinata per data prevista di rilavoro (stesso pattern inbox dell'Organico) |
| Tracciamento lavoro | task periodico di richiamo/rilavoro con data e owner, non un singolo follow-up ma un ciclo che si ripete finché non si chiude davvero |

🟡 **DA DECIDERE**: "prospect da riattivare" è uno **status** dentro la stessa
tabella `PROSPECT` (es. `stage = in_stallo`) o una tabella/vista separata che
pesca dai prospect fermi da troppo tempo? La prima opzione evita duplicazione
dati, la seconda rende più esplicito il binario di rilavoro periodico.

---

## 2) Alert trasversale

Un'unica coda di alert che pesca dalle 4 aree, non quattro code separate:

- nuovo lead organico senza risposta da > N ore
- follow-up outbound scaduto
- prospect fermo in uno stage da > N giorni (candidato a passare in stallo)
- cliente non rinnovato senza tentativo di win-back programmato
- prospect in stallo senza data di rilavoro programmata, o con data di
  rilavoro scaduta

Riusa il pattern **Alert Inbox** già disegnato nel cockpit attuale (tabella
`ALERT` mai creata — vedi `docs/HANDOFF_PROMPT.md` §5.8/§7): è lo stesso
bisogno, va solo alimentato dalle 4 nuove aree invece che solo dai clienti attivi.

---

## 3) Modello dati — da costruire, non da inventare

Nessuna di queste tabelle esiste oggi. 🟡 **DA DECIDERE con l'utente prima di
creare qualunque campo**, seguendo le convenzioni già in uso nel progetto:

- Bind per **Field ID**, mai per nome colonna (vedi §3 di `HANDOFF_PROMPT.md`).
- Annotazione di ogni campo come **(I)** input, **(R)** read-only/calcolato,
  **(T)** trigger-automazione.
- Una tabella per area è il punto di partenza naturale:
  `OUTBOUND_ATTIVITA`, `LEAD_ORGANICO`, `PROSPECT` (con lo status di stallo/
  riattivazione dentro, salvo diversa decisione — vedi §1.4b), e riuso di
  `CLIENTI` + `RINNOVI` per i clienti non rinnovati (i campi utili esistono già).
- Tutte le tabelle devono poter alimentare la stessa coda `ALERT`, incluso il
  binario di retention & riattivazione.

Prima di procedere, chiarire con l'utente:
1. Dove vivono questi dati — stessa base Airtable `appPn2L1ushwyWlVX` o base
   separata?
2. Outbound/Organico hanno bisogno di un campo "proviene da" per collegarsi
   a un record Prospect quando vengono qualificati (relazione 1:1)?
3. Serve un ruolo "owner" dedicato (growth/BD) distinto da PM/Carlo/Carla, o
   le stesse persone coprono anche queste aree?

---

## 4) Ruoli e permessi

Il cockpit attuale ha PM / Carlo / Carla / Exec. 🟡 **DA DECIDERE**: chi è
owner di ciascuna delle 4 aree?

Ipotesi di default (da confermare, non da assumere definitiva):
- **Outbound** e **Organico** → chi fa BD/new business (Carlo stesso? un
  ruolo nuovo?).
- **Prospect** → stesso owner di Outbound/Organico, con Carlo in supervisione.
- **Retention & riattivazione** → Carla per i clienti non rinnovati (già owner
  dei rinnovi); i prospect da riattivare restano con lo stesso owner che li
  seguiva in pipeline, con Carlo in visione su entrambi i sotto-binari.
- **Exec** → vista aggregata read-only su tutte e 4, come già oggi sui clienti attivi.

---

## 5) Stack e convenzioni da riusare

Dal progetto esistente (vedi `docs/HANDOFF_PROMPT.md` per i dettagli):

- React + Vite + Tailwind, TanStack Start (`createServerFn`), connessione
  Airtable via Lovable Connector Gateway — **mai** il PAT nel bundle.
- Una server function per tabella, cache 30s, rispetto rate limit 5 req/s.
- Guardia di scrittura: PATCH solo su campi (I); conferma esplicita
  (`ConfirmDialog`) su ogni campo (T).
- Lingua italiana, stesso design system (`public/colors_and_type.css`).

---

## 6) Come usare questo prompt

1. Chiudere le sezioni 🟡 **DA DECIDERE** con l'utente (architettura dati,
   fonti, ownership) — non partire a creare tabelle/campi senza risposta.
2. Una volta chiuse, produrre per ciascuna delle 4 tabelle un elenco campi
   con nome, tipo, annotazione (I)/(R)/(T), analogo alle tabelle di
   `HANDOFF_PROMPT.md` §5.
3. Costruire in quest'ordine: modello dati → Alert trasversale → Outbound →
   Organico → Prospect → Retention & riattivazione (non rinnovati + prospect
   da riattivare) → dashboard Exec aggregata.
4. Se qualcosa non è definito qui, chiedere prima di inventare — stessa
   regola del documento precedente.
