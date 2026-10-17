// Logica di vista del Growth Hub — stesso schema di docs/HANDOFF_PROMPT.md §1:
// segnali (azioni), dati (campi), tendenza (kpi), output (righe/colonne pronte per la UI).
import { TODAY, fmt, daysUntil, daysSince, eur, USERS, CLIENTI } from '../data/mock.js';

const ownerName = (id) => {
  const u = USERS.find((x) => x.id === id);
  return u ? u.nome.split(' ')[0] : '—';
};

const STEP_LABEL = { in_attesa: 'In attesa di risposta', risposta_positiva: 'Risposta positiva', risposta_negativa: 'Risposta negativa', meeting_fissato: 'Meeting fissato', qualificato: 'Qualificato → Prospect', scartato: 'Scartato' };
const STAGE_LABEL = { lead: 'Lead', qualificato: 'Qualificato', proposta: 'Proposta inviata', negoziazione: 'Negoziazione', won: 'Vinto', lost: 'Perso', in_stallo: 'In stallo' };
const ORGANICO_LABEL = { da_contattare: 'Da contattare', contattato: 'Contattato', qualificato: 'Qualificato → Prospect', scartato: 'Scartato' };
const CANALE_LABEL = { email: 'Email', linkedin: 'LinkedIn', telefono: 'Telefono', sito: 'Sito', referral: 'Referral', passaparola: 'Passaparola', evento: 'Evento', dm_carlo: 'DM a Carlo' };
const FONTE_LABEL = { outbound: 'Outbound', organico: 'Organico', referral: 'Referral' };
const WINBACK_LABEL = { da_programmare: 'Da programmare', programmato: 'Rilavoro programmato', in_corso: 'In corso', abbandonato: 'Abbandonato' };

// ---------- OUTBOUND ----------
export function buildOutboundView(data, actions) {
  const rows = data.outbound.map((o) => {
    const chiuso = o.step === 'qualificato' || o.step === 'scartato';
    const scaduto = !chiuso && !!o.prossimoFollowUp && daysUntil(o.prossimoFollowUp) < 0;
    return {
      ...o, stepLabel: STEP_LABEL[o.step], canaleLabel: CANALE_LABEL[o.canale], ownerNome: ownerName(o.owner),
      ultimoFmt: fmt(o.dataUltimoContatto), followUpFmt: o.prossimoFollowUp ? fmt(o.prossimoFollowUp) : '—',
      scaduto, chiuso,
      onPositiva: () => actions.outboundMarkRisposta(o, true),
      onNegativa: () => actions.outboundMarkRisposta(o, false),
      onSnooze: () => actions.outboundSnooze(o, 3),
      onQualifica: () => actions.outboundQualifica(o),
      onScarta: () => actions.outboundScarta(o),
    };
  }).sort((a, b) => (a.chiuso === b.chiuso ? (a.scaduto === b.scaduto ? 0 : a.scaduto ? -1 : 1) : a.chiuso ? 1 : -1));

  const attivi = data.outbound.filter((o) => o.step !== 'qualificato' && o.step !== 'scartato');
  const risposte = data.outbound.filter((o) => ['risposta_positiva', 'risposta_negativa', 'meeting_fissato', 'qualificato'].includes(o.step));
  const tassoRisposta = data.outbound.length ? Math.round((risposte.length / data.outbound.length) * 100) : 0;
  const followUpScaduti = rows.filter((o) => o.scaduto).length;
  const qualificati = data.outbound.filter((o) => o.step === 'qualificato').length;

  return {
    rows, empty: rows.length === 0,
    kpi: [
      { n: attivi.length, l: 'Contatti attivi' },
      { n: tassoRisposta + '%', l: 'Tasso di risposta' },
      { n: followUpScaduti, l: 'Follow-up scaduti', bad: followUpScaduti > 0 },
      { n: qualificati, l: 'Promossi a Prospect' },
    ],
  };
}

// ---------- ORGANICO ----------
export function buildOrganicoView(data, actions) {
  const respDays = (l) => Math.round((new Date(l.dataPrimaRisposta) - new Date(l.dataArrivo)) / 86400000);
  const rows = data.organico.map((l) => {
    const chiuso = l.stato === 'qualificato' || l.stato === 'scartato';
    const attesa = !l.dataPrimaRisposta && !chiuso;
    const giorniAttesa = daysSince(l.dataArrivo);
    return {
      ...l, statoLabel: ORGANICO_LABEL[l.stato], canaleLabel: CANALE_LABEL[l.canale], ricevutoDaNome: ownerName(l.ricevutoDa),
      arrivoFmt: fmt(l.dataArrivo), rispostaFmt: l.dataPrimaRisposta ? fmt(l.dataPrimaRisposta) : '—',
      attesa, giorniAttesa, chiuso,
      onContattato: () => actions.organicoMarkContattato(l),
      onQualifica: () => actions.organicoQualifica(l),
      onScarta: () => actions.organicoScarta(l),
    };
  }).sort((a, b) => (a.chiuso === b.chiuso ? (b.giorniAttesa - a.giorniAttesa) : a.chiuso ? 1 : -1));

  const aperti = data.organico.filter((l) => l.stato !== 'qualificato' && l.stato !== 'scartato');
  const inAttesa = aperti.filter((l) => !l.dataPrimaRisposta).length;
  const risposti = data.organico.filter((l) => l.dataPrimaRisposta);
  const tempoMedioRisposta = risposti.length ? Math.round(risposti.reduce((s, l) => s + respDays(l), 0) / risposti.length) : null;

  return {
    rows, empty: rows.length === 0,
    kpi: [
      { n: aperti.length, l: 'Lead aperti' },
      { n: inAttesa, l: 'In attesa di risposta', bad: inAttesa > 0 },
      { n: tempoMedioRisposta === null ? '—' : tempoMedioRisposta + ' gg', l: 'Tempo medio di risposta' },
      { n: data.organico.filter((l) => l.stato === 'qualificato').length, l: 'Promossi a Prospect' },
    ],
  };
}

// ---------- PROSPECT ----------
const PIPE_STAGES = ['lead', 'qualificato', 'proposta', 'negoziazione'];
const DOT_FOR_STAGE = { lead: 'bg-muted', qualificato: 'bg-lilac', proposta: 'bg-warn', negoziazione: 'bg-indigo' };

function prospectCard(p, actions) {
  const giorniFermo = daysSince(p.dataUltimoContatto);
  return {
    ...p, stageLabel: STAGE_LABEL[p.stage], ownerNome: ownerName(p.owner), fonteLabel: FONTE_LABEL[p.fonte],
    valoreFmt: eur(p.valoreStimato), prossimoStepFmt: p.dataProssimoStep ? fmt(p.dataProssimoStep) : '—',
    fermoDaGiorni: giorniFermo, candidatoStallo: giorniFermo !== null && giorniFermo > 45,
    onAvanza: () => {
      const idx = PIPE_STAGES.indexOf(p.stage);
      const next = PIPE_STAGES[idx + 1];
      if (next) actions.prospectAvanza(p, next, 'Prossimo passo da definire');
      else actions.prospectVinto(p);
    },
    onVinto: () => actions.prospectVinto(p),
    onPerso: () => actions.prospectPerso(p, 'Non specificato'),
    onStallo: () => actions.prospectInStallo(p, 'Fermo da troppo tempo'),
  };
}

export function buildProspectView(data, actions) {
  const attivi = data.prospect.filter((p) => PIPE_STAGES.includes(p.stage));
  const columns = PIPE_STAGES.map((stage) => {
    const cards = attivi.filter((p) => p.stage === stage).map((p) => prospectCard(p, actions));
    return { key: stage, label: STAGE_LABEL[stage], dotCls: DOT_FOR_STAGE[stage], cards, count: cards.length, empty: cards.length === 0 };
  });

  const won = data.prospect.filter((p) => p.stage === 'won');
  const lost = data.prospect.filter((p) => p.stage === 'lost');
  const chiusi = won.length + lost.length;
  const winRate = chiusi ? Math.round((won.length / chiusi) * 100) : null;
  const valorePipeline = attivi.reduce((s, p) => s + p.valoreStimato, 0);
  const inStallo = data.prospect.filter((p) => p.stage === 'in_stallo').length;

  return {
    columns,
    kpi: [
      { n: eur(valorePipeline), l: 'Valore pipeline attiva' },
      { n: winRate === null ? '—' : winRate + '%', l: 'Win rate', sub: chiusi + ' chiusi' },
      { n: attivi.length, l: 'Prospect attivi' },
      { n: inStallo, l: 'In stallo da riattivare', bad: inStallo > 0 },
    ],
  };
}

// ---------- RETENTION & RIATTIVAZIONE ----------
export function buildRetentionView(data, actions) {
  const churnRows = data.winback.map((w) => {
    const c = CLIENTI.find((x) => x.id === w.clienteId);
    const scaduto = !!w.dataProssimoRilavoro && daysUntil(w.dataProssimoRilavoro) < 0;
    return {
      id: w.id, clienteNome: c ? c.nome : w.clienteId, settore: c ? c.settore : '—',
      motivo: c ? c.motivazioni_non_rinnovo : '', valorePerso: c ? eur(c.valore_contratto) : '—',
      dataChurnFmt: c ? fmt(c.fine_contratto) : '—', owner: ownerName(w.owner),
      statoLabel: WINBACK_LABEL[w.stato], tentativi: w.tentativi || 0,
      dataRilavoroFmt: w.dataProssimoRilavoro ? fmt(w.dataProssimoRilavoro) : '—', scaduto,
      onProgramma: () => actions.winbackProgramma(w, 30),
      onAvvia: () => actions.winbackAvvia(w),
      onAbbandona: () => actions.winbackAbbandona(w),
    };
  });

  const stalloRows = data.prospect.filter((p) => p.stage === 'in_stallo').map((p) => {
    const scaduto = !p.dataRilavoro || daysUntil(p.dataRilavoro) < 0;
    return {
      id: p.id, nome: p.nome, azienda: p.azienda, valoreFmt: eur(p.valoreStimato), ownerNome: ownerName(p.owner),
      motivoStallo: p.motivoStallo, ultimoContattoFmt: fmt(p.dataUltimoContatto),
      dataRilavoroFmt: p.dataRilavoro ? fmt(p.dataRilavoro) : '—', scaduto,
      onRiattiva: () => actions.prospectRiattiva(p),
      onRimanda: () => actions.prospectRimandaRilavoro(p, 60),
      onAbbandona: () => actions.prospectAbbandona(p),
    };
  }).sort((a, b) => (a.scaduto === b.scaduto ? 0 : a.scaduto ? -1 : 1));

  const valorePersoTot = data.winback.reduce((s, w) => {
    const c = CLIENTI.find((x) => x.id === w.clienteId);
    return s + (c ? c.valore_contratto : 0);
  }, 0);

  return {
    churnRows, stalloRows,
    churnEmpty: churnRows.length === 0, stalloEmpty: stalloRows.length === 0,
    kpi: [
      { n: churnRows.length, l: 'Clienti non rinnovati da lavorare' },
      { n: eur(valorePersoTot), l: 'Valore perso da recuperare' },
      { n: stalloRows.length, l: 'Prospect in stallo' },
      { n: stalloRows.filter((r) => r.scaduto).length, l: 'Rilavoro scaduto', bad: stalloRows.some((r) => r.scaduto) },
    ],
  };
}

// ---------- HOME (coda unica trasversale, vedi §2) ----------
export function buildHomeView(data, outboundView, organicoView, prospectView, retentionView) {
  const queue = [];
  data.outbound.forEach((o) => {
    if (o.prossimoFollowUp && o.step !== 'qualificato' && o.step !== 'scartato') {
      const d = daysUntil(o.prossimoFollowUp);
      if (d <= 0) queue.push({ area: 'Outbound', titolo: 'Follow-up · ' + o.azienda, urgenza: d < 0 ? 'scaduto' : 'oggi', ord: d });
    }
  });
  data.organico.forEach((l) => {
    if (!l.dataPrimaRisposta && l.stato === 'da_contattare') {
      const giorni = daysSince(l.dataArrivo);
      if (giorni >= 1) queue.push({ area: 'Organico', titolo: l.azienda + ' senza risposta da ' + giorni + ' gg', urgenza: giorni > 2 ? 'scaduto' : 'oggi', ord: -giorni });
    }
  });
  data.prospect.filter((p) => PIPE_STAGES.includes(p.stage)).forEach((p) => {
    if (p.dataProssimoStep) {
      const d = daysUntil(p.dataProssimoStep);
      if (d <= 0) queue.push({ area: 'Prospect', titolo: (p.prossimoStep || 'Prossimo step') + ' · ' + p.azienda, urgenza: d < 0 ? 'scaduto' : 'oggi', ord: d });
    }
  });
  data.winback.forEach((w) => {
    if (w.dataProssimoRilavoro && daysUntil(w.dataProssimoRilavoro) <= 0) {
      const c = CLIENTI.find((x) => x.id === w.clienteId);
      queue.push({ area: 'Retention', titolo: 'Win-back · ' + (c ? c.nome : w.clienteId), urgenza: 'scaduto', ord: -1 });
    }
  });
  data.prospect.filter((p) => p.stage === 'in_stallo').forEach((p) => {
    if (!p.dataRilavoro || daysUntil(p.dataRilavoro) <= 0) {
      queue.push({ area: 'Retention', titolo: 'Rilavoro · ' + p.azienda, urgenza: 'scaduto', ord: -1 });
    }
  });
  queue.sort((a, b) => a.ord - b.ord);

  return {
    queue, queueEmpty: queue.length === 0,
    kpi: [
      { n: outboundView.kpi[0].n, l: 'Outbound attivi' },
      { n: organicoView.kpi[0].n, l: 'Lead organici aperti' },
      { n: prospectView.kpi[2].n, l: 'Prospect in pipeline' },
      { n: retentionView.kpi[0].n + retentionView.kpi[2].n, l: 'Da riattivare (retention)' },
    ],
  };
}
