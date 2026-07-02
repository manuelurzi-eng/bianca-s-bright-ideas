// API di alto livello: carica le liste (una per schermata) e traduce le scritture.
import { isConfigured, listRecords, patchRecord } from './client.js';
import {
  TABLES, CLIENTI_FIELDS, TEAM_FIELDS, CS_FIELDS, PUBBLICAZIONI_FIELDS,
} from './fields.js';
import {
  mapCliente, mapTeamMember, mapCS, CLIENTE_WRITABLE, TRIGGER_FIELD_IDS,
} from './mapping.js';

export { isConfigured };

function initials(nome) {
  return String(nome || '')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '').join('') || '??';
}

// USERS del cockpit = membri Team (come PM) + ruoli fissi Carlo / Carla / Exec.
export async function loadTeam() {
  const recs = await listRecords(TABLES.TEAM, { fields: [TEAM_FIELDS.name, TEAM_FIELDS.email] });
  const members = recs.map(mapTeamMember);
  const teamByAirtableId = {};
  const pmUsers = members.map((mbr) => {
    const id = 'pm-' + mbr.airtableId;
    const u = { id, nome: mbr.nome, ruolo: 'pm', iniz: initials(mbr.nome), sub: 'Project Manager', email: mbr.email };
    teamByAirtableId[mbr.airtableId] = u; // per risolvere referente_diffusione (link record)
    if (mbr.email) teamByAirtableId[mbr.email] = u; // per collaborator match via email
    return u;
  });
  const fixed = [
    { id: 'carlo', nome: 'Carlo', ruolo: 'carlo', iniz: 'CM', sub: 'Head of Delivery' },
    { id: 'carla', nome: 'Carla', ruolo: 'carla', iniz: 'CD', sub: 'Renewals & Account' },
    { id: 'exec', nome: 'Exec', ruolo: 'exec', iniz: 'EX', sub: 'Founder / Exec' },
  ];
  return { users: [...pmUsers, ...fixed], teamByAirtableId };
}

export async function loadClienti(teamByAirtableId = {}) {
  const recs = await listRecords(TABLES.CLIENTI, {
    fields: Object.values(CLIENTI_FIELDS).filter(Boolean),
  });
  const clienti = recs.map((r) => mapCliente(r, teamByAirtableId));
  const clientByAirtableId = {};
  clienti.forEach((c) => { clientByAirtableId[c.id] = c; });
  return { clienti, clientByAirtableId };
}

export async function loadCS(clientByAirtableId = {}) {
  const recs = await listRecords(TABLES.CS, {
    fields: [
      CS_FIELDS.riferimento_cliente, CS_FIELDS.codice_cs, CS_FIELDS.status_follow_up_cs,
      CS_FIELDS.approvazione_cs, CS_FIELDS.time_to_approve_carlo,
    ],
  });
  return recs.map((r) => mapCS(r, clientByAirtableId));
}

// Pubblicazioni raggruppate per cliente (dizionario id → righe), stile CHECKPOINT/PUBBLICAZIONI mock.
export async function loadPubblicazioni(clientByAirtableId = {}) {
  const recs = await listRecords(TABLES.PUBBLICAZIONI, {
    fields: Object.values(PUBBLICAZIONI_FIELDS).filter(Boolean),
  });
  const out = {};
  recs.forEach((r) => {
    const f = r.fields || {};
    const link = Array.isArray(f[PUBBLICAZIONI_FIELDS.testate]) ? f[PUBBLICAZIONI_FIELDS.testate][0] : null;
    const cliId = clientByAirtableId[link]?.id;
    if (!cliId) return;
    const imp = String(f[PUBBLICAZIONI_FIELDS.importanza_testata] || '').toLowerCase();
    const tier = imp.includes('top') ? 1 : imp.includes('mid') ? 2 : 3;
    (out[cliId] = out[cliId] || []).push({
      testata: f[PUBBLICAZIONI_FIELDS.tipologia] || 'Testata',
      tier, data: f[PUBBLICAZIONI_FIELDS.data] || null, link: f[PUBBLICAZIONI_FIELDS.link] || '#',
    });
  });
  return out;
}

// Scrittura cliente: traduce chiavi-modello → field ID input, salta i campi non ancora creati.
// Ritorna { fieldsById, triggers:[fieldId…] } così l'app può chiedere conferma sui trigger.
export function buildClientePatch(patch) {
  const fieldsById = {};
  const triggers = [];
  for (const [key, value] of Object.entries(patch)) {
    const fid = CLIENTE_WRITABLE[key];
    if (!fid) continue; // chiave locale o campo DA CREARE → non persistere
    fieldsById[fid] = value;
    if (TRIGGER_FIELD_IDS.has(fid)) triggers.push(fid);
  }
  return { fieldsById, triggers };
}

export async function patchCliente(recordId, patch) {
  const { fieldsById } = buildClientePatch(patch);
  if (!Object.keys(fieldsById).length) return null;
  return patchRecord(TABLES.CLIENTI, recordId, fieldsById);
}

// Scrittura diretta per field ID (usata per i trigger, dopo conferma esplicita).
export async function patchFieldById(tableId, recordId, fieldId, value) {
  return patchRecord(tableId, recordId, { [fieldId]: value });
}
