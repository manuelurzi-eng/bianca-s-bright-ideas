// ============================================================
// LEVER PR — Cockpit · Mappa Airtable per FIELD ID
// ------------------------------------------------------------
// I campi sono agganciati tramite ID (fld…) e NON tramite nome:
// rinominare una colonna su Airtable non rompe l'app.
//
// Legenda annotazioni:
//   (I) Input     → scrivibile dal cockpit (PATCH consentito)
//   (R) Read-only → formula / count / lookup / rollup / Status → MAI scrivere
//   (T) Trigger   → scrivibile MA fa partire un'automazione Airtable → conferma OBBLIGATORIA
//
// Base: appPn2L1ushwyWlVX
// ============================================================

export const BASE_ID = 'appPn2L1ushwyWlVX';

export const TABLES = {
  CLIENTI: 'tblCIcYFTgIXFlIbf',
  CS: 'tbldCTyq6gzKD8D2h',
  PUBBLICAZIONI: 'tbldW1gJahhs1Aq2v',
  TESTATE: 'tblNn1ZhbBlsk45nu',
  RINNOVI: 'tblSTmsCRBdkW2AbJ',
  TEAM: 'tblP2mmYf3lTUDRSw',
  FORM: 'tbls10UqPHCtVWpra',
  // TODO: la tabella "Alert" non è documentata nel Build Doc → ID da inserire quando disponibile.
  //       Finché è null, gli alert vengono letti dal fallback mock (vedi src/data/source.js).
  ALERT: null,
};

// ---------- Clienti PR (tblCIcYFTgIXFlIbf) ----------
export const CLIENTI_FIELDS = {
  riferimento_cliente: 'fldXOuabKu7nvU6U0',      // (R)
  nome_startup: 'fldN7z5DBZBV5kNYa',             // (R)
  referente_diffusione: 'fldn3Dn1YvmANdvsM',     // filtro PM (collaborator / link)
  tipo_di_cliente: 'fldAgUJkAjqhD8PYK',          // (R)
  inizio_contratto: 'fldKe4nBKs9oQNvBl',         // (R)
  fine_contratto: 'fldyPtT0b0SeuZAQW',           // (R)
  fine_contratto_originaria: 'fldceux7uvqVeJ3Ps',// (R)
  mesi_durata: 'fldXDcxDLKWvT6qvk',              // (R)
  status_cliente: 'fld6Ob0jES58EFTUN',           // (R)
  data_per_rinnovo: 'fldmpTOs2ZjcjD9eb',         // (R)
  count_pubblicazioni: 'fld8tGs80ObuwsI9K',      // (R)
  count_pubblicazioni_tier1: 'fldxlixeofrAQ0X0v',// (R)
  numero_tier1_da_accordo: 'fldxpRMg18hKN66c7',  // (I) text
  ave_totale: 'fldFfGnBTTmqs10KM',               // (R)
  ave_media_mensile: 'fldUqoNBFYWwhSmRZ',        // (R)
  numero_cs_approvati: 'fld0efWOUY3dmQJI6',      // (R)
  soddisfazione: 'fld0c7YYX4rMHKSPy',            // (I)
  score: 'fldSbEiIjkrvce9Ei',                    // (I)
  difficolta: 'fldCeWkC0BTw2lsz0',               // (I)
  update_sul_cliente: 'fldEU77k8f9TEclb8',       // (I) long text — diario contatti
  ultimo_contatto: 'fld2D3ORb2iepONYO',          // (I) date
  tipo_ultimo_contatto: 'fldRm4RAgHy2VM2qM',     // (I) single select
  cliente_bloccato_check: 'fldNq7yinLTgOoXlf',   // (I) checkbox — freeze
  cliente_bloccato: 'fldJvsrGNxPMchJ71',         // (R)
  link_drive_cliente: 'fldg2fvb0YlKHhjd0',       // (I)
  report_di_strategia: 'fldtXwGDfs7txFwOB',      // (I) attachment
  proposto_rinnovo: 'fldyobwAYRPFEY8wZ',         // (I)
  referente_rinnovo: 'fldPeegUIZcXh90zC',        // (I)
  ha_rinnovato: 'fldHKwN209arkkac5',             // (I)
  valore_rinnovo: 'fldWoGeBV3H899etm',           // (I)
  motivazioni_non_rinnovo: 'fld8ZMKmwirNAmTyO',  // (I)
  gestione_rinnovi_link: 'fldQD612YasLB9pBz',    // (R)
  perche_hai_scelto: 'fldDBruKwT13AXepY',        // (I)
  cosa_ti_ha_spinto: 'fldQ2o7a7DMFBOiFP',        // (I)

  // --- Trigger (T): scrivibili ma fanno partire automazioni → conferma obbligatoria ---
  onboarding_pm: 'fldZBVGdnh4desXqA',            // (T)
  invio_ultima_checkpoint: 'fldSr3q4nLBYymWTE',  // (T)
  invia_strategia_semestrale: 'fldQloRpcpqTrk9rQ', // (T)

  // --- Checkpoint plan (tutti I) ---
  intervista_data: 'fldUzJnWVmJfXgSr1',
  intervista_bluedot: 'fldHkXdGJoPLPimwj',
  intervista_transcript: 'fldi9x05VQ9JN3a2z',
  cp1_data: 'fldAkutFOuVF1y0V8', cp1_bluedot: 'fld6EKFq1UPuFVkpk', cp1_transcript: 'fldKiBzssZmi8tkCt',
  cp2_data: 'fldHBqAd28VKOQ7Wy', cp2_bluedot: 'fldJkK5Jh5y3GVJ1V', cp2_transcript: 'fldJnvfzhxTgIhQOJ',
  cp3_data: 'fldHF3ubnCr6wIPTG', cp3_bluedot: 'fldI14qXw3KmbZ70X', cp3_transcript: 'fldJT7NsPE0zZdkUE',
  cp4_data: 'fld0eBTLiWwwR9GM1', cp4_bluedot: 'fld3JyF8gDLzaT40l', cp4_transcript: 'fldfeebUFeF39oSQF',
  cp5_data: 'fldNCYOreZifUKbQI', cp5_bluedot: 'fldW2MX1oyZmBN5jD', cp5_transcript: 'fldJJwfdBDjUY8DyF',
  cp6_data: 'fldckA0PuR2Kc1i8h', cp6_bluedot: 'fldnIGWcUwSpLcmkp', cp6_transcript: 'fldeKjPGBDSCf8sHf',
  cp7_data: 'fldDmuDUr8fzfek66', cp7_bluedot: 'fld9Vcd6L5OvlSIAd', cp7_transcript: 'fldqmUglybYMyUJml',
  cp8_data: 'fldFaYZym1T5d8ZlE', cp8_bluedot: 'fldQEy0nJeJ6wyZvm', cp8_transcript: 'fldsEdvLACIzdZfg6',
  cp9_data: 'fldqZfagjlmIs04R7', cp9_bluedot: 'fld3zU4PEofQlMD6b', cp9_transcript: 'fldh0Re143nwZK6oa',
  cp10_data: 'fldFSZomC6cWFJ8ZC', cp10_bluedot: 'fldtRk8hPa3VWMn4g', cp10_transcript: 'fldP4RrFtCAognkWp',
  cp11_data: 'fldx3VWfdwfhdKtI9', cp11_bluedot: 'fldkpGyVSqjkPOno5', cp11_transcript: 'fldhI7rSVWBIZnyuQ',
  ultima_checkpoint_data: 'fldhC4NuFyzJ0JO8l',   // (I) — "apre il rinnovo"
  ultima_checkpoint_transcript: 'fldVI27rcf4ksXuDv',

  // --- DA CREARE su Airtable (assenti nella base attuale) ---
  // Finché non esistono, il cockpit li tiene solo in stato locale (nessuna PATCH).
  data_invio_strategia: null,  // TODO(I) date  — "Data invio strategia"
  data_riattivazione: null,    // TODO(I) date  — riattivazione post-freeze
  motivo_freeze: null,         // TODO(I) text  — motivazione del freeze
};

// ---------- CS Clienti PR (tbldCTyq6gzKD8D2h) ----------
export const CS_FIELDS = {
  riferimento_cliente: 'fldHpR9svTmQaohmQ',      // link
  codice_cs: 'fld9mQNQKBwbSMAsw',                // (R)
  tipologia_cs: 'flds7gHUiyYKzdGlz',             // (R)
  link_bozza_cs: 'fldlB0ohH2zmNE40d',            // (I)
  approvazione_cs: 'fldvR8VqUQmenBH5M',          // (I) checkbox — approvazione di Carlo
  data_approvazione_carlo: 'fldgqnJ9Za54MeFHR',  // (R)
  invia_il_cs_al_cliente: 'fldNLLeLv72vH1Hei',   // (T) ⚠ invia davvero il CS → conferma forte
  data_invio_cs: 'fldQ1OZWvkSje5MeH',
  ha_richiesto_modifiche: 'fldN0CKAWCb1lHLIY',
  invia_il_cs_modificato: 'fldUuNGoQM23HYT0k',   // (T)
  data_invio_cs_modificato: 'fldDkQHYJW00W2mr7',
  follow_up_al_cliente: 'fldlibQmMYtwIoAm7',     // (T)
  status_follow_up_cs: 'fld1pTy2IuQU0npcd',      // (R)
  data_approvazione_cliente: 'fldiwPjdCLmYh3vnq',
  ha_accettato_il_cs: 'fldlBs4HBcCne3Agh',
  diffusione_finita: 'fldgdpoWkD9x1lxgm',
  invia_rassegna_stampa: 'fldLE9Ps98Ru1tJK5',    // (T)
  link_rassegna_stampa: 'fldQCdu8gF2riwvhF',     // (I)
  totali_pubblicazioni: 'fldOr1RQTYGsYk1KT',     // (R)
  totali_pubblicazioni_tier1: 'fldKX9zyih4wYAu7V', // (R)
  conta_pubblicazioni: 'fldOdRFwKLTciuJaL',      // (R)
  risultati_ottenuti: 'fldMGEcqsRUgzvUnP',       // (I)
  ave_medio_cs: 'fldZS548KUDX98SGq',             // (R)
  time_to_approve_carlo: 'fldSf4oJU8urz6eox',    // (R)
  time_to_approve_cliente: 'fldjn1nmdfwu6LZIt',  // (R)
  time_to_first_publish_tier1: 'fldlqZoBdVgE1vZ6L', // (R)
  alert_per_carlo: 'fldWesc5U9Xisb30U',          // (R)
  data_creazione_cs: 'fldRdcq9h0HFa7ULR',        // (R)
  lookup_nome_testata: 'fldLD6GyTjyNhUaDg',
  lookup_link: 'fldWzxVa5riFNKar8',
  lookup_data: 'fldJ1Ep8nezSNyENw',
  lookup_tipologia: 'fldSbadjipq6RqyjD',
  lookup_immagine: 'fld66oJNmdQQ73eqU',
};

// ---------- Team (tblP2mmYf3lTUDRSw) ----------
export const TEAM_FIELDS = {
  name: 'fldGCMPnjYIx7EY7L',
  email: 'fldj3ceNXoWE7lnVB',
};

// ---------- Pubblicazioni Clienti PR (tbldW1gJahhs1Aq2v) ----------
export const PUBBLICAZIONI_FIELDS = {
  tipologia: 'fldpxPxCuKI2DzZig',
  importanza_testata: 'fldUW9XWXFTXLfmkC', // lookup (Tier1 = "top")
  data: 'fld47ye068NMgfi3t',
  link: 'fldW2IW1iNmrYEDUY',
  testate: 'fldECuwbM70EzkQFB',            // link → Testate
};

// ---------- Testate (tblNn1ZhbBlsk45nu) ----------
export const TESTATE_FIELDS = {
  nome: 'fldoA3guINBqMpChJ',
  importanza: 'fldhAqV4QLxBmyIEx', // "top" = Tier 1
  ave: 'fldFd6IhjCJMLaXiz',
};

// ---------- GESTIONE RINNOVI (tblSTmsCRBdkW2AbJ) ----------
export const RINNOVI_FIELDS = {
  clienti_pr: 'fld5XFtvIrOkU1kJ9',
  status: 'fldHLvsUDf5igyjpt',
  assignee: 'fldeO3ppLYg3IoRSK',
  notes: 'fldmM0ItyOkE9rmfK',
};

// ---------- Form valutazione PR (tbls10UqPHCtVWpra) — NON linkata: join per email ----------
export const FORM_FIELDS = {
  titolo_forbes: 'fldG4Y3ovn8uh1CHx', // il "sogno"
  kpi: 'fldTcjLAvlhh5kWTc',
  obiettivi_comunicazione: 'fld1SJ50wOi1QrquX',
  aspettative: 'fldn17eZwgHGp9oZx',
};

// ---------- TODO: Alert (tabella non documentata) ----------
// Struttura attesa dal cockpit per ogni alert:
//   { id, regola:number, livello:'rosso'|'warning'|'info', cliente:<clientId>, a:[userId…], titolo, dettaglio, step }
// Inserire qui gli ID reali quando la tabella Alert sarà definita.
export const ALERT_FIELDS = {
  regola: null, livello: null, cliente: null, destinatari: null,
  titolo: null, dettaglio: null, step: null,
};

// ------------------------------------------------------------
// Campi che, se scritti, fanno partire automazioni Airtable.
// L'app DEVE chiedere conferma prima di ogni PATCH su questi ID.
// ------------------------------------------------------------
export const TRIGGER_FIELD_IDS = new Set([
  CLIENTI_FIELDS.onboarding_pm,
  CLIENTI_FIELDS.invio_ultima_checkpoint,
  CLIENTI_FIELDS.invia_strategia_semestrale,
  CS_FIELDS.invia_il_cs_al_cliente,
  CS_FIELDS.invia_il_cs_modificato,
  CS_FIELDS.follow_up_al_cliente,
  CS_FIELDS.invia_rassegna_stampa,
]);

// Campi read-only: PATCH SEMPRE vietata (guardia di sicurezza lato client).
export const READONLY_FIELD_IDS = new Set([
  CLIENTI_FIELDS.riferimento_cliente, CLIENTI_FIELDS.nome_startup, CLIENTI_FIELDS.tipo_di_cliente,
  CLIENTI_FIELDS.inizio_contratto, CLIENTI_FIELDS.fine_contratto, CLIENTI_FIELDS.fine_contratto_originaria,
  CLIENTI_FIELDS.mesi_durata, CLIENTI_FIELDS.status_cliente, CLIENTI_FIELDS.data_per_rinnovo,
  CLIENTI_FIELDS.count_pubblicazioni, CLIENTI_FIELDS.count_pubblicazioni_tier1, CLIENTI_FIELDS.ave_totale,
  CLIENTI_FIELDS.ave_media_mensile, CLIENTI_FIELDS.numero_cs_approvati, CLIENTI_FIELDS.cliente_bloccato,
  CLIENTI_FIELDS.gestione_rinnovi_link,
  CS_FIELDS.codice_cs, CS_FIELDS.tipologia_cs, CS_FIELDS.data_approvazione_carlo, CS_FIELDS.status_follow_up_cs,
  CS_FIELDS.totali_pubblicazioni, CS_FIELDS.totali_pubblicazioni_tier1, CS_FIELDS.conta_pubblicazioni,
  CS_FIELDS.ave_medio_cs, CS_FIELDS.time_to_approve_carlo, CS_FIELDS.time_to_approve_cliente,
  CS_FIELDS.time_to_first_publish_tier1, CS_FIELDS.alert_per_carlo, CS_FIELDS.data_creazione_cs,
]);
