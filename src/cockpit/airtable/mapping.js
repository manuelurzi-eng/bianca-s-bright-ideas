// Traduzione record Airtable ⇆ modello del cockpit.
// Il modello è quello del prototipo (chiavi come 'proposto_rinnovo', 'ultimo_contatto', …),
// così i viewmodel restano identici a prescindere dalla sorgente.
import { CLIENTI_FIELDS as C, TEAM_FIELDS as T, CS_FIELDS, TRIGGER_FIELD_IDS } from './fields.js';

const val = (rec, id) => (id && rec.fields ? rec.fields[id] : undefined);
const first = (v) => (Array.isArray(v) ? v[0] : v);
const num = (v) => (v === undefined || v === null || v === '' ? null : Number(v));

// Status Airtable → chiave interna del cockpit.
export function normalizeStatus(s) {
  const k = String(s || '').toLowerCase();
  if (k.includes('blocc') || k.includes('freeze')) return 'bloccato';
  if (k.includes('rinnov')) return 'in-rinnovo';
  if (k.includes('scaden')) return 'in-scadenza';
  if (k.includes('scadut') || k.includes('chius')) return 'scaduto';
  return 'attivo';
}

function normalizeTipo(s) {
  return String(s || '').toLowerCase().includes('tantum') ? 'una-tantum' : 'partner';
}

// referente_diffusione può essere: array di collaborator {id,name,email} o array di link record.
// Restituisce la lista di userId Team risolti (per il match "contains").
function resolveReferenti(raw, teamByAirtableId) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((r) => {
      if (typeof r === 'string') return teamByAirtableId[r]?.id || r; // link record id
      if (r && r.id) return teamByAirtableId[r.id]?.id || r.email || r.name; // collaborator
      return null;
    })
    .filter(Boolean);
}

// teamByAirtableId: { [recId|collabId]: { id, nome } } — vedi api.loadTeam
export function mapCliente(rec, teamByAirtableId = {}) {
  const referenti = resolveReferenti(val(rec, C.referente_diffusione), teamByAirtableId);
  return {
    id: rec.id, // record id Airtable (rec…)
    nome: val(rec, C.nome_startup) || val(rec, C.riferimento_cliente) || '(senza nome)',
    startup: val(rec, C.nome_startup) || '',
    settore: val(rec, C.tipo_di_cliente) || '',
    referenti,
    pm: referenti[0] || null,
    tipologia: normalizeTipo(val(rec, C.tipo_di_cliente)),
    status: val(rec, C.cliente_bloccato) ? 'bloccato' : normalizeStatus(val(rec, C.status_cliente)),
    inizio_contratto: val(rec, C.inizio_contratto) || null,
    fine_contratto: val(rec, C.fine_contratto) || null,
    mesi_durata: num(val(rec, C.mesi_durata)) || 12,
    count_pubblicazioni: num(val(rec, C.count_pubblicazioni)) || 0,
    count_tier1: num(val(rec, C.count_pubblicazioni_tier1)) || 0,
    tier1_da_accordo: num(val(rec, C.numero_tier1_da_accordo)) || 0,
    ave_totale: num(val(rec, C.ave_totale)) || 0,
    ave_mensile: num(val(rec, C.ave_media_mensile)) || 0,
    soddisfazione: num(val(rec, C.soddisfazione)),
    score: num(val(rec, C.score)),
    difficolta: val(rec, C.difficolta) || 'media',
    data_intervista: val(rec, C.intervista_data) || null,
    data_invio_strategia: val(rec, C.data_invio_strategia) || null, // campo DA CREARE → spesso null
    ultimo_contatto: val(rec, C.ultimo_contatto) || null,
    tipo_ultimo_contatto: val(rec, C.tipo_ultimo_contatto) || null,
    cliente_bloccato: Boolean(val(rec, C.cliente_bloccato_check) || val(rec, C.cliente_bloccato)),
    data_riattivazione: val(rec, C.data_riattivazione) || null, // DA CREARE
    motivo_freeze: val(rec, C.motivo_freeze) || '',              // DA CREARE
    ultima_checkpoint: val(rec, C.ultima_checkpoint_data) || null,
    prossima_checkpoint: null, // pianificazione locale (nessun campo dedicato su Airtable)
    proposto_rinnovo: val(rec, C.proposto_rinnovo) || '',
    referente_rinnovo: val(rec, C.referente_rinnovo) || '',
    gestione_rinnovi: first(val(rec, C.gestione_rinnovi_link)) || '',
    valore_contratto: num(val(rec, C.valore_rinnovo)) || 0,
    motivazioni_non_rinnovo: val(rec, C.motivazioni_non_rinnovo) || '',
    churn: false,
    note: val(rec, C.update_sul_cliente) || '',
    reminder: null,
    firma: val(rec, C.inizio_contratto) || null,
  };
}

// Mappa chiave-modello → field ID scrivibile su "Clienti PR" (solo campi Input).
// I campi con value null qui NON sono ancora su Airtable (DA CREARE) → nessuna PATCH.
export const CLIENTE_WRITABLE = {
  soddisfazione: C.soddisfazione,
  score: C.score,
  difficolta: C.difficolta,
  note: C.update_sul_cliente,
  ultimo_contatto: C.ultimo_contatto,
  tipo_ultimo_contatto: C.tipo_ultimo_contatto,
  data_intervista: C.intervista_data,
  proposto_rinnovo: C.proposto_rinnovo,
  referente_rinnovo: C.referente_rinnovo,
  cliente_bloccato: C.cliente_bloccato_check,
  data_invio_strategia: C.data_invio_strategia, // null finché non creato
  data_riattivazione: C.data_riattivazione,     // null finché non creato
  motivo_freeze: C.motivo_freeze,               // null finché non creato
  // prossima_checkpoint: nessun field dedicato → resta locale
};

export function mapTeamMember(rec) {
  return {
    airtableId: rec.id,
    nome: val(rec, T.name) || '',
    email: val(rec, T.email) || '',
  };
}

export function mapCS(rec, clientByAirtableId = {}) {
  const link = first(val(rec, CS_FIELDS.riferimento_cliente));
  return {
    cliente: clientByAirtableId[link]?.id || link || null,
    titolo: val(rec, CS_FIELDS.codice_cs) || '(CS)',
    stato: val(rec, CS_FIELDS.status_follow_up_cs) || 'Bozza',
    approvato_carlo: Boolean(val(rec, CS_FIELDS.approvazione_cs)),
    giorni_fermo: num(val(rec, CS_FIELDS.time_to_approve_carlo)) || 0,
  };
}

export { TRIGGER_FIELD_IDS };
