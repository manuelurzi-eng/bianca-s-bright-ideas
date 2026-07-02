// Client REST Airtable — connessione DIRETTA (nessun DB intermedio).
// - Chiave letta SOLO da env (VITE_AIRTABLE_TOKEN); mai hard-coded.
// - Coda a 5 richieste/secondo (rate limit Airtable).
// - Cache breve in memoria per le liste (una chiamata-lista per schermata).
// - Guardia di sicurezza: PATCH vieta i campi read-only.
import { BASE_ID as DEFAULT_BASE, READONLY_FIELD_IDS } from './fields.js';

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || DEFAULT_BASE;
const API = 'https://api.airtable.com/v0';

export function isConfigured() {
  return Boolean(TOKEN && BASE_ID);
}

// ---------- rate limiter: max 5 req/sec ----------
const queue = [];
let tokens = 5;
let draining = false;
setIntervalSafe();
function setIntervalSafe() {
  // ricarica il "budget" ogni secondo
  if (typeof window !== 'undefined') {
    window.setInterval(() => { tokens = 5; drain(); }, 1000);
  }
}
function drain() {
  if (draining) return;
  draining = true;
  while (tokens > 0 && queue.length) {
    tokens--;
    const job = queue.shift();
    job();
  }
  draining = false;
}
function schedule(fn) {
  return new Promise((resolve, reject) => {
    queue.push(() => fn().then(resolve, reject));
    drain();
  });
}

async function request(path, opts = {}) {
  if (!isConfigured()) throw new Error('Airtable non configurato (manca VITE_AIRTABLE_TOKEN).');
  const res = await fetch(`${API}/${BASE_ID}/${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Airtable ${res.status} su ${path}: ${body}`);
  }
  return res.json();
}

// ---------- cache breve (per liste) ----------
const cache = new Map();
const TTL = 30000; // 30s

// Elenco record di una tabella (gestisce paginazione + solo i campi richiesti).
export async function listRecords(tableId, { fields, filterByFormula, pageSize = 100 } = {}) {
  const key = JSON.stringify(['list', tableId, fields, filterByFormula]);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;

  let records = [];
  let offset;
  do {
    const params = new URLSearchParams();
    params.set('pageSize', String(pageSize));
    params.set('returnFieldsByFieldId', 'true'); // chiave: risposta indicizzata per field ID
    if (filterByFormula) params.set('filterByFormula', filterByFormula);
    (fields || []).forEach((f) => params.append('fields[]', f));
    if (offset) params.set('offset', offset);
    // eslint-disable-next-line no-await-in-loop
    const page = await schedule(() => request(`${tableId}?${params.toString()}`));
    records = records.concat(page.records);
    offset = page.offset;
  } while (offset);

  cache.set(key, { t: Date.now(), v: records });
  return records;
}

export function clearCache() { cache.clear(); }

// PATCH di un record: SOLO field ID di input. Blocca i campi read-only.
// fieldsById = { [fieldId]: value }
export async function patchRecord(tableId, recordId, fieldsById) {
  const clean = {};
  for (const [id, value] of Object.entries(fieldsById)) {
    if (!id) continue; // campo non ancora esistente su Airtable (DA CREARE) → skip
    if (READONLY_FIELD_IDS.has(id)) {
      throw new Error(`Tentata scrittura su campo read-only ${id} — operazione bloccata.`);
    }
    clean[id] = value;
  }
  if (!Object.keys(clean).length) return null;
  const out = await schedule(() =>
    request(`${tableId}/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields: clean, typecast: true }),
    })
  );
  clearCache();
  return out;
}
