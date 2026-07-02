// Sorgente dati del cockpit.
// - Se le env Airtable sono configurate → connessione DIRETTA (dati reali).
// - Altrimenti → dataset mock (demo pixel-perfect su Lovable, senza chiavi).
import * as mock from './mock.js';
import { buildModel } from './model.js';
import { isConfigured, loadTeam, loadClienti, loadCS, loadPubblicazioni } from '../airtable/api.js';

export function usingAirtable() {
  return isConfigured();
}

// Ritorna { m, clienti, alert } — dove `m` è il model per i viewmodel,
// e clienti/alert sono le copie mutabili tenute nello state (come nel prototipo).
export async function loadCockpitModel() {
  if (!isConfigured()) {
    const m = buildModel({
      USERS: mock.USERS, CLIENTI: mock.CLIENTI, ALERT: mock.ALERT,
      PUBBLICAZIONI: mock.PUBBLICAZIONI, CHECKPOINT: mock.CHECKPOINT,
      AI_SUMMARY: mock.AI_SUMMARY, FORM: mock.FORM, DIARIO: mock.DIARIO,
      CS: mock.CS, TREND_RISCHIO: mock.TREND_RISCHIO, TIER1_MESE: mock.TIER1_MESE,
    });
    return {
      m,
      clienti: m.CLIENTI.map((c) => ({ ...c })),
      alert: m.ALERT.map((a) => ({ ...a })),
    };
  }

  // --- Airtable: una chiamata-lista per tabella ---
  const { users, teamByAirtableId } = await loadTeam();
  const { clienti, clientByAirtableId } = await loadClienti(teamByAirtableId);
  const [cs, pubblicazioni] = await Promise.all([
    loadCS(clientByAirtableId),
    loadPubblicazioni(clientByAirtableId),
  ]);

  const m = buildModel({
    USERS: users,
    CLIENTI: clienti,
    // TODO: tabella Alert non ancora definita (vedi fields.js) → coda vuota finché non wired.
    ALERT: [],
    PUBBLICAZIONI: pubblicazioni,
    // Sezioni non ancora mappate su Airtable → dizionari vuoti (la UI degrada senza errori).
    CHECKPOINT: {}, AI_SUMMARY: {}, FORM: {}, DIARIO: {},
    CS: cs,
    // Serie aggregate dei grafici: placeholder demo finché non c'è una sorgente dedicata.
    TREND_RISCHIO: mock.TREND_RISCHIO, TIER1_MESE: mock.TIER1_MESE,
  });

  return {
    m,
    clienti: clienti.map((c) => ({ ...c })),
    alert: [],
  };
}

export { mock };
