// LEVER PR — Cockpit · dati mock + helper business (nessuno stile qui).
// Portati 1:1 dal prototipo Claude Design (cockpit-data.js). Servono da:
//  - fallback quando le env Airtable non sono configurate (demo su Lovable);
//  - sorgente per le sezioni non ancora mappate su Airtable (checkpoint, AI, form, diario, trend).
// "Oggi" fisso per rendere la vista deterministica in demo.
export const TODAY = new Date('2026-07-01T09:00:00');

// ---------- date helpers ----------
const MS = 86400000;
export function daysUntil(d) { if (!d) return null; return Math.round((new Date(d) - TODAY) / MS); }
export function daysSince(d) { if (!d) return null; return Math.round((TODAY - new Date(d)) / MS); }
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
export function fmt(d) { if (!d) return '—'; const x = new Date(d); return x.getDate() + ' ' + MESI[x.getMonth()] + " '" + String(x.getFullYear()).slice(2); }
export function fmtLong(d) { if (!d) return '—'; const x = new Date(d); return x.getDate() + ' ' + MESI[x.getMonth()] + ' ' + x.getFullYear(); }
export function eur(n) { return '€ ' + Number(n || 0).toLocaleString('it-IT'); }
export function addMonths(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x.toISOString().slice(0, 10); }

// ---------- utenti / ruoli ----------
export const USERS = [
  { id: 'pm-giulia', nome: 'Giulia Ferrari', ruolo: 'pm', iniz: 'GF', sub: 'Project Manager' },
  { id: 'pm-marco', nome: 'Marco Bianchi', ruolo: 'pm', iniz: 'MB', sub: 'Project Manager' },
  { id: 'pm-sara', nome: 'Sara Conti', ruolo: 'pm', iniz: 'SC', sub: 'Project Manager' },
  { id: 'carlo', nome: 'Carlo Marchetti', ruolo: 'carlo', iniz: 'CM', sub: 'Head of Delivery' },
  { id: 'carla', nome: 'Carla De Santis', ruolo: 'carla', iniz: 'CD', sub: 'Renewals & Account' },
  { id: 'exec', nome: 'Alessio Boceda', ruolo: 'exec', iniz: 'AB', sub: 'Founder' },
];

// ---------- clienti ----------
export const CLIENTI = [
  {
    id: 'aryel', nome: 'Aryel', startup: 'Aryel S.r.l.', settore: 'AR / MarTech',
    pm: 'pm-giulia', tipologia: 'partner', status: 'in-scadenza',
    inizio_contratto: '2025-08-12', fine_contratto: '2026-07-11',
    count_pubblicazioni: 34, count_tier1: 6, tier1_da_accordo: 8,
    ave_totale: 184000, ave_mensile: 16700, soddisfazione: 4.6, score: 82, difficolta: 'bassa',
    data_intervista: '2025-08-20', data_invio_strategia: '2025-08-27',
    ultimo_contatto: '2026-06-18', tipo_ultimo_contatto: 'call',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: '2026-07-04',
    proposto_rinnovo: 'In valutazione', referente_rinnovo: 'Carla De Santis', gestione_rinnovi: 'Prima call fissata',
    valore_contratto: 42000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Founder molto reattivo. Interessati a estendere su mercato spagnolo dal Q4.',
    reminder: '2026-07-02', mesi_durata: 11,
  },
  {
    id: 'bonusx', nome: 'BonusX', startup: 'BonusX S.p.A.', settore: 'Welfare / FinTech',
    pm: 'pm-giulia', tipologia: 'partner', status: 'attivo',
    inizio_contratto: '2026-02-02', fine_contratto: '2027-02-01',
    count_pubblicazioni: 21, count_tier1: 5, tier1_da_accordo: 6,
    ave_totale: 132000, ave_mensile: 14800, soddisfazione: 4.8, score: 88, difficolta: 'bassa',
    data_intervista: '2026-02-10', data_invio_strategia: '2026-02-17',
    ultimo_contatto: '2026-06-24', tipo_ultimo_contatto: 'whatsapp',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: '2026-07-15',
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 48000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Campagna dati welfare 2026 in preparazione — forte gancio stampa a settembre.',
    reminder: '2026-07-10', mesi_durata: 12,
  },
  {
    id: 'soplaya', nome: 'Soplaya', startup: 'Soplaya S.r.l.', settore: 'FoodTech B2B',
    pm: 'pm-marco', tipologia: 'partner', status: 'in-scadenza',
    inizio_contratto: '2025-07-28', fine_contratto: '2026-07-27',
    count_pubblicazioni: 12, count_tier1: 2, tier1_da_accordo: 6,
    ave_totale: 58000, ave_mensile: 5200, soddisfazione: 3.4, score: 51, difficolta: 'alta',
    data_intervista: '2025-08-05', data_invio_strategia: '2025-08-14',
    ultimo_contatto: '2026-05-19', tipo_ultimo_contatto: 'mail',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: null,
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 36000, motivazioni_non_rinnovo: '', churn: true,
    note: 'Tier 1 molto sotto accordo. Founder poco disponibile a inizio anno. Da recuperare con urgenza.',
    reminder: '2026-07-01', mesi_durata: 12,
  },
  {
    id: 'yakkyo', nome: 'Yakkyo', startup: 'Yakkyo S.p.A.', settore: 'E-commerce / Logistica',
    pm: 'pm-marco', tipologia: 'partner', status: 'attivo',
    inizio_contratto: '2026-03-16', fine_contratto: '2027-03-15',
    count_pubblicazioni: 15, count_tier1: 4, tier1_da_accordo: 5,
    ave_totale: 96000, ave_mensile: 12100, soddisfazione: 4.2, score: 74, difficolta: 'media',
    data_intervista: '2026-03-24', data_invio_strategia: null,
    ultimo_contatto: '2026-06-29', tipo_ultimo_contatto: 'call',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: '2026-07-08',
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 39000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Round Series A in chiusura: gancio perfetto per un tier 1 economico.',
    reminder: '2026-07-03', mesi_durata: 12,
  },
  {
    id: 'beatcode', nome: 'Beatcode', startup: 'Beatcode S.r.l.', settore: 'DevTools / SaaS',
    pm: 'pm-sara', tipologia: 'una-tantum', status: 'attivo',
    inizio_contratto: '2026-04-01', fine_contratto: '2026-10-01',
    count_pubblicazioni: 8, count_tier1: 3, tier1_da_accordo: 3,
    ave_totale: 61000, ave_mensile: 9800, soddisfazione: 4.5, score: 79, difficolta: 'media',
    data_intervista: '2026-04-09', data_invio_strategia: '2026-04-15',
    ultimo_contatto: '2026-06-11', tipo_ultimo_contatto: 'mail',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: '2026-07-22',
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 21000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Progetto una-tantum di lancio. Ottima resa tier 1: possibile upsell a partner.',
    reminder: '2026-07-09', mesi_durata: 6,
  },
  {
    id: 'cortilia', nome: 'Cortilia', startup: 'Cortilia S.p.A.', settore: 'FoodTech / D2C',
    pm: 'pm-sara', tipologia: 'partner', status: 'in-rinnovo',
    inizio_contratto: '2025-09-05', fine_contratto: '2026-09-04',
    count_pubblicazioni: 28, count_tier1: 7, tier1_da_accordo: 6,
    ave_totale: 210000, ave_mensile: 19100, soddisfazione: 4.9, score: 91, difficolta: 'bassa',
    data_intervista: '2025-09-12', data_invio_strategia: '2025-09-19',
    ultimo_contatto: '2026-06-28', tipo_ultimo_contatto: 'call',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: '2026-06-20', prossima_checkpoint: null,
    proposto_rinnovo: 'Sì', referente_rinnovo: 'Carla De Santis', gestione_rinnovi: 'Proposta inviata',
    valore_contratto: 54000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Cliente top del portafoglio. Rinnovo a valore superiore molto probabile.',
    reminder: '2026-07-05', mesi_durata: 12,
  },
  {
    id: 'moneymour', nome: 'Moneymour', startup: 'Moneymour S.r.l.', settore: 'FinTech / Credit',
    pm: 'pm-giulia', tipologia: 'partner', status: 'bloccato',
    inizio_contratto: '2025-11-10', fine_contratto: '2026-11-09',
    count_pubblicazioni: 9, count_tier1: 2, tier1_da_accordo: 5,
    ave_totale: 47000, ave_mensile: 6900, soddisfazione: 3.9, score: 63, difficolta: 'media',
    data_intervista: '2025-11-18', data_invio_strategia: '2025-11-25',
    ultimo_contatto: '2026-05-30', tipo_ultimo_contatto: 'call',
    cliente_bloccato: true, data_riattivazione: '2026-07-01', motivo_freeze: 'Ristrutturazione interna richiesta dal cliente — comunicazione in pausa concordata.',
    ultima_checkpoint: null, prossima_checkpoint: null,
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 33000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Freeze richiesto dal cliente per ristrutturazione interna. Riattivazione prevista oggi.',
    reminder: '2026-07-01', mesi_durata: 12,
  },
  {
    id: 'nextbrain', nome: 'NextBrain', startup: 'NextBrain AI S.r.l.', settore: 'AI / Analytics',
    pm: 'pm-marco', tipologia: 'partner', status: 'attivo',
    inizio_contratto: '2026-06-18', fine_contratto: '2027-06-17',
    count_pubblicazioni: 1, count_tier1: 0, tier1_da_accordo: 6,
    ave_totale: 4000, ave_mensile: 4000, soddisfazione: null, score: null, difficolta: 'media',
    data_intervista: null, data_invio_strategia: null,
    ultimo_contatto: '2026-06-20', tipo_ultimo_contatto: 'call',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: null,
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 45000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Onboarding appena chiuso. Intervista da fissare — firma dell\'11 giugno.',
    reminder: '2026-07-01', firma: '2026-06-11', mesi_durata: 12,
  },
  {
    id: 'greenpea', nome: 'Green Pea', startup: 'Green Pea S.p.A.', settore: 'Retail sostenibile',
    pm: 'pm-sara', tipologia: 'una-tantum', status: 'scaduto',
    inizio_contratto: '2025-10-01', fine_contratto: '2026-04-01',
    count_pubblicazioni: 11, count_tier1: 3, tier1_da_accordo: 3,
    ave_totale: 72000, ave_mensile: 12000, soddisfazione: 4.1, score: 70, difficolta: 'bassa',
    data_intervista: '2025-10-08', data_invio_strategia: '2025-10-15',
    ultimo_contatto: '2026-04-03', tipo_ultimo_contatto: 'mail',
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: '2026-03-20', prossima_checkpoint: null,
    proposto_rinnovo: 'No', referente_rinnovo: 'Carla De Santis', gestione_rinnovi: 'Chiuso - no rinnovo',
    valore_contratto: 24000, motivazioni_non_rinnovo: 'Budget marketing tagliato per il 2026.', churn: false,
    note: 'Progetto una-tantum concluso con buoni risultati. Restare in contatto per 2027.',
    reminder: null, mesi_durata: 6,
  },
  {
    id: 'visionio', nome: 'Vision.io', startup: 'Vision.io S.r.l.', settore: 'Computer Vision / AI',
    pm: null, tipologia: 'partner', status: 'attivo',
    inizio_contratto: '2026-06-25', fine_contratto: '2027-06-24',
    count_pubblicazioni: 0, count_tier1: 0, tier1_da_accordo: 5,
    ave_totale: 0, ave_mensile: 0, soddisfazione: null, score: null, difficolta: 'media',
    data_intervista: null, data_invio_strategia: null,
    ultimo_contatto: null, tipo_ultimo_contatto: null,
    cliente_bloccato: false, data_riattivazione: null,
    ultima_checkpoint: null, prossima_checkpoint: null,
    proposto_rinnovo: '', referente_rinnovo: '', gestione_rinnovi: '',
    valore_contratto: 40000, motivazioni_non_rinnovo: '', churn: false,
    note: 'Contratto appena firmato. Referente diffusione non ancora assegnato.',
    reminder: null, firma: '2026-06-25', mesi_durata: 12,
  },
];

// ---------- pubblicazioni (per cliente) ----------
export const PUBBLICAZIONI = {
  aryel: [
    { testata: 'Il Sole 24 Ore', tier: 1, data: '2026-06-22', link: '#' },
    { testata: 'StartupItalia', tier: 2, data: '2026-06-10', link: '#' },
    { testata: 'Forbes Italia', tier: 1, data: '2026-05-28', link: '#' },
    { testata: 'Wired', tier: 2, data: '2026-05-05', link: '#' },
    { testata: 'EconomyUp', tier: 3, data: '2026-04-18', link: '#' },
  ],
  soplaya: [
    { testata: 'Gambero Rosso', tier: 2, data: '2026-05-02', link: '#' },
    { testata: 'Italia a Tavola', tier: 3, data: '2026-04-11', link: '#' },
    { testata: 'Corriere della Sera', tier: 1, data: '2026-03-15', link: '#' },
  ],
  cortilia: [
    { testata: 'la Repubblica', tier: 1, data: '2026-06-25', link: '#' },
    { testata: 'Il Sole 24 Ore', tier: 1, data: '2026-06-02', link: '#' },
    { testata: 'Millionaire', tier: 2, data: '2026-05-14', link: '#' },
  ],
};

// ---------- checkpoint storico (per cliente) ----------
export const CHECKPOINT = {
  aryel: [
    { data: '2025-08-20', tipo: 'Intervista', bluedot: '#', transcript: true },
    { data: '2025-11-14', tipo: '1° Checkpoint', bluedot: '#', transcript: true },
    { data: '2026-02-19', tipo: '2° Checkpoint', bluedot: '#', transcript: true },
    { data: '2026-05-16', tipo: '3° Checkpoint', bluedot: '#', transcript: true },
  ],
  cortilia: [
    { data: '2025-09-12', tipo: 'Intervista', bluedot: '#', transcript: true },
    { data: '2025-12-10', tipo: '1° Checkpoint', bluedot: '#', transcript: true },
    { data: '2026-03-18', tipo: '2° Checkpoint', bluedot: '#', transcript: true },
    { data: '2026-06-20', tipo: 'Ultima call di Checkpoint', bluedot: '#', transcript: true },
  ],
};

export const AI_SUMMARY = {
  aryel: 'Aryel ha spostato il posizionamento da "AR per il retail" a "creative automation per grandi brand". I checkpoint mostrano una traction in crescita (nuovi clienti enterprise) e una forte volontà di raccontare i dati di performance. Angoli stampa ricorrenti: AI generativa applicata alla pubblicità, casi cliente misurabili. Da preparare per il rinnovo: sintesi risultati Tier 1 e apertura mercato spagnolo (menzionata in tutti gli ultimi due checkpoint).',
  cortilia: 'Cortilia ha consolidato la narrazione su filiera corta e crescita del D2C food. Ottimo allineamento founder-agenzia: ogni checkpoint ha prodotto un gancio stampa concreto (dati di crescita, sostenibilità, nuovi hub logistici). Il cliente è pronto e favorevole al rinnovo, con interesse a estendere su comunicazione ESG.',
};

// ---------- "Perché ha iniziato" — titolo-sogno + obiettivi (Form valutazione PR) ----------
export const FORM = {
  aryel: { sogno: 'Un ritratto del founder su Forbes Italia come voce dell\'AI generativa nell\'advertising', obiettivi: ['3 Tier 1 economico-finanziarie nel semestre', 'Posizionare il founder come speaker su AI + adv', 'Annuncio apertura mercato spagnolo'] },
  bonusx: { sogno: 'Diventare la fonte citata sul welfare aziendale sul Sole 24 Ore', obiettivi: ['Report welfare 2026 ripreso da 2 testate Tier 1', 'Un\'intervista founder su testata economica', 'Gancio stampa a settembre sui dati'] },
  soplaya: { sogno: 'Un pezzo sul Corriere che racconti la filiera corta del foodservice', obiettivi: ['Recuperare il gap Tier 1 (2 → 6)', 'Accordo 40 ristoranti come case study stampa', 'Riattivare il dialogo col founder'] },
  yakkyo: { sogno: 'Annunciare il round Series A su una testata economica di primo piano', obiettivi: ['Tier 1 sul round Series A', 'Inviare la strategia semestrale', 'Costruire il racconto logistica cross-border'] },
  beatcode: { sogno: 'Far conoscere Beatcode agli sviluppatori con un pezzo su Wired', obiettivi: ['3 Tier 1 di lancio (raggiunto)', 'Valutare upsell a contratto partner', 'Mantenere presenza su testate tech'] },
  cortilia: { sogno: 'Essere il caso-simbolo del D2C food sostenibile su Repubblica e Sole 24 Ore', obiettivi: ['Estendere la narrazione su ESG', 'Rinnovo a valore superiore', 'Nuovi hub logistici come gancio stampa'] },
  moneymour: { sogno: 'Raccontare il credito responsabile su una testata FinTech di riferimento', obiettivi: ['Riprendere dopo il freeze', 'Recuperare il gap Tier 1', 'Nuovo angolo prodotto post-ristrutturazione'] },
  nextbrain: { sogno: 'Presentare NextBrain come startup AI italiana da tenere d\'occhio', obiettivi: ['Fissare l\'intervista di onboarding', 'Prima strategia semestrale', 'Prime 2 uscite di posizionamento'] },
  greenpea: { sogno: 'Un racconto del retail sostenibile su testata mainstream', obiettivi: ['3 Tier 1 di progetto (raggiunto)', 'Chiudere bene il una-tantum', 'Restare in contatto per il 2027'] },
  visionio: { sogno: 'Lanciare Vision.io sulla stampa tech come nuova realtà di computer vision', obiettivi: ['Assegnare il referente', 'Onboarding e prima intervista', 'Impostare la strategia semestrale'] },
};

// ---------- diario contatti (Update sul cliente, righe datate) ----------
export const DIARIO = {
  aryel: [
    { data: '2026-06-18', tipo: 'call', testo: 'Call di aggiornamento: confermato interesse mercato spagnolo, materiali per il checkpoint del 4 lug.' },
    { data: '2026-05-30', tipo: 'mail', testo: 'Inviata rassegna del mese + bozza pitch per Forbes.' },
  ],
  soplaya: [
    { data: '2026-05-19', tipo: 'mail', testo: 'Sollecito per fissare call di recupero. Nessuna risposta.' },
  ],
  cortilia: [
    { data: '2026-06-28', tipo: 'call', testo: 'Call rinnovo: cliente favorevole, interesse a estendere su comunicazione ESG.' },
  ],
};

export const CS = [
  { cliente: 'aryel', titolo: 'Aryel lancia il modulo AI per la creatività', stato: 'In approvazione', giorni_fermo: 3, referente: 'pm-giulia' },
  { cliente: 'soplaya', titolo: 'Soplaya chiude accordo con 40 ristoranti stellati', stato: 'In approvazione', giorni_fermo: 9, referente: 'pm-marco' },
  { cliente: 'yakkyo', titolo: 'Yakkyo annuncia il round Series A', stato: 'Bozza', giorni_fermo: 1, referente: 'pm-marco' },
  { cliente: 'cortilia', titolo: 'Cortilia inaugura il nuovo hub di Milano', stato: 'Diffuso', giorni_fermo: 0, referente: 'pm-sara' },
  { cliente: 'bonusx', titolo: 'BonusX: report welfare aziendale 2026', stato: 'Approvato', giorni_fermo: 0, referente: 'pm-giulia' },
];

// ---------- alert (già calcolati dal motore backend Airtable) ----------
export const ALERT = [
  { id: 'a1', regola: 5, livello: 'rosso', cliente: 'aryel', a: ['pm-giulia'], titolo: 'Tier 1 ottenuta → chiama il cliente', dettaglio: 'Il Sole 24 Ore (Tier 1) del 22 giu, nessun contatto registrato dopo la pubblicazione.', step: 8 },
  { id: 'a2', regola: 13, livello: 'rosso', cliente: 'aryel', a: ['pm-giulia', 'carlo'], titolo: 'Ultima checkpoint mancante sotto scadenza', dettaglio: 'Contratto scade tra 10 gg e "Ultima call di Checkpoint" non è fissata.', step: 13 },
  { id: 'a3', regola: 4, livello: 'rosso', cliente: 'soplaya', a: ['pm-marco'], titolo: 'Cliente non sentito da >30gg', dettaglio: 'Ultimo contatto 43 gg fa e Tier 1 sotto accordo (2/6).', step: 8 },
  { id: 'a4', regola: 9, livello: 'rosso', cliente: 'soplaya', a: ['carlo'], titolo: 'Tier 1 sotto accordo', dettaglio: '2 Tier 1 su 6 previsti dall\'accordo, oltre la finestra dei 60 gg.', step: 'risultati' },
  { id: 'a5', regola: 8, livello: 'warning', cliente: 'soplaya', a: ['pm-marco'], titolo: 'Prossima checkpoint non fissata', dettaglio: 'Nessuna checkpoint a calendario per il cliente.', step: 10.1 },
  { id: 'a6', regola: 2, livello: 'warning', cliente: 'yakkyo', a: ['pm-marco'], titolo: 'Strategia non inviata', dettaglio: 'Intervista fatta il 24 mar, "Data invio strategia" ancora vuota.', step: 5 },
  { id: 'a7', regola: 1, livello: 'warning', cliente: 'nextbrain', a: ['pm-marco', 'carlo'], titolo: 'Intervista non fissata', dettaglio: 'Onboarding chiuso (firma 11 giu), "Data Intervista" vuota da >5gg.', step: 3 },
  { id: 'a8', regola: 10, livello: 'rosso', cliente: 'soplaya', a: ['carla'], titolo: 'Contratto in scadenza senza rinnovo', dettaglio: 'Fine contratto tra 26 gg e nessun processo di rinnovo aperto.', step: 13 },
  { id: 'a9', regola: 12, livello: 'rosso', cliente: 'soplaya', a: ['carla', 'carlo'], titolo: 'Rischio churn composito', dettaglio: 'Soddisfazione bassa (3.4) + difficoltà alta + Tier 1 sotto accordo.', step: '—' },
  { id: 'a10', regola: 11, livello: 'info', cliente: 'moneymour', a: ['pm-giulia'], titolo: 'Freeze da riprendere', dettaglio: 'Cliente bloccato con "Data riattivazione" = oggi.', step: '—' },
  { id: 'a11', regola: 6, livello: 'info', cliente: 'aryel', a: ['pm-giulia'], titolo: 'Checkpoint imminente', dettaglio: 'Prossima checkpoint il 4 lug (tra 3 gg) — prepara materiali.', step: 9 },
  { id: 'a12', regola: 10, livello: 'rosso', cliente: 'aryel', a: ['carla'], titolo: 'Contratto in scadenza senza rinnovo confermato', dettaglio: 'Fine contratto tra 10 gg, proposto rinnovo "In valutazione".', step: 13 },
];

// ---------- alert trend (banda Andamento di Carlo) ----------
export const TREND_RISCHIO = [
  { sett: 'S-5', n: 1 }, { sett: 'S-4', n: 2 }, { sett: 'S-3', n: 2 },
  { sett: 'S-2', n: 3 }, { sett: 'S-1', n: 2 }, { sett: 'Ora', n: 3 },
];
export const TIER1_MESE = [
  { mese: 'Feb', n: 4 }, { mese: 'Mar', n: 6 }, { mese: 'Apr', n: 5 },
  { mese: 'Mag', n: 8 }, { mese: 'Giu', n: 9 }, { mese: 'Lug', n: 2 },
];
