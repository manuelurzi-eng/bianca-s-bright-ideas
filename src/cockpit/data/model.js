// Costruisce l'oggetto "model" (m) consumato dai viewmodel.
// Combina gli helper data-indipendenti con il dataset caricato (mock o Airtable),
// così la logica di vista resta identica al prototipo a prescindere dalla sorgente.
import { TODAY, daysUntil, daysSince, fmt, fmtLong, eur, addMonths } from './mock.js';

export function buildModel(parts) {
  const m = {
    TODAY, daysUntil, daysSince, fmt, fmtLong, eur, addMonths,
    ...parts, // USERS, CLIENTI, ALERT, PUBBLICAZIONI, CHECKPOINT, AI_SUMMARY, FORM, DIARIO, CS, TREND_RISCHIO, TIER1_MESE
  };

  m.userById = (id) => m.USERS.find((u) => u.id === id);
  m.clientById = (id) => m.CLIENTI.find((c) => c.id === id);
  m.pmName = (id) => {
    if (!id) return 'Da assegnare';
    const u = m.userById(id);
    return u ? u.nome : id;
  };

  // Piano checkpoint ADATTIVO alla durata: fatti (da CHECKPOINT) + slot futuri "da fissare",
  // con l'ultimo marcato "apre il rinnovo".
  m.checkpointPlan = (c) => {
    const done = (m.CHECKPOINT[c.id] || []).map((k) => ({ ...k, stato: 'fatto' }));
    const mesi = c.mesi_durata || 12;
    const nSlot = Math.max(2, Math.round(mesi / 3));
    const plan = [];
    const futuriAttesi = nSlot - done.length;
    let base = done.length ? done[done.length - 1].data : (c.data_intervista || c.inizio_contratto);
    for (let i = 0; i < futuriAttesi; i++) {
      base = m.addMonths(base, 3);
      const isUltima = i === futuriAttesi - 1;
      const data = (i === 0 && c.prossima_checkpoint) ? c.prossima_checkpoint : base;
      plan.push({
        data,
        tipo: isUltima ? 'Ultima call di Checkpoint' : (done.length + i + 1) + '° Checkpoint',
        stato: 'da-fissare', apreRinnovo: isUltima, transcript: false,
      });
    }
    return { done, futuri: plan };
  };

  m.scadenzaWindow = (c) => {
    const d = m.daysUntil(c.fine_contratto);
    if (d === null) return null;
    if (d < 0) return 'scaduto';
    if (d <= 14) return 14;
    if (d <= 30) return 30;
    if (d <= 60) return 60;
    if (d <= 90) return 90;
    return null;
  };

  return m;
}
