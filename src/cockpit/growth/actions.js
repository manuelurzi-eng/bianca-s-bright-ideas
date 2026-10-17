// Azioni del Growth Hub — ogni transizione corrisponde a un "segnale" del
// framework in docs/HANDOFF_PROMPT.md §1 (contatto → risposta → qualifica →
// stage → stallo → rilavoro). Per ora mutano solo lo stato locale (vedi data.js).
import { TODAY } from '../data/mock.js';

function plusDays(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function buildGrowthActions(g) {
  const { patchOutbound, patchOrganico, patchProspect, patchWinback, addProspect, toast } = g;

  const promuoviAProspect = (sourceId, fonte, nome, azienda, owner) => {
    addProspect({
      id: 'pr-' + sourceId, nome, azienda, referente: nome, fonte, fonteId: sourceId,
      stage: 'lead', valoreStimato: 20000, owner, prossimoStep: 'Prima call conoscitiva',
      dataProssimoStep: plusDays(5), dataUltimoContatto: plusDays(0),
    });
  };

  return {
    // ---------- Outbound ----------
    outboundMarkRisposta: (o, positiva) => {
      patchOutbound(o.id, { step: positiva ? 'risposta_positiva' : 'risposta_negativa', prossimoFollowUp: positiva ? plusDays(3) : null });
      toast(positiva ? 'Risposta positiva registrata' : 'Risposta negativa registrata');
    },
    outboundSnooze: (o, giorni = 3) => {
      patchOutbound(o.id, { prossimoFollowUp: plusDays(giorni) });
      toast('Follow-up riprogrammato tra ' + giorni + ' giorni');
    },
    outboundQualifica: (o) => {
      patchOutbound(o.id, { step: 'qualificato', prossimoFollowUp: null, esito: 'Passato a Prospect.' });
      promuoviAProspect(o.id, 'outbound', o.nome, o.azienda, o.owner);
      toast('Promosso a Prospect · ' + o.azienda);
    },
    outboundScarta: (o) => {
      patchOutbound(o.id, { step: 'scartato', prossimoFollowUp: null });
      toast('Contatto scartato');
    },

    // ---------- Organico ----------
    organicoMarkContattato: (l) => {
      patchOrganico(l.id, { stato: 'contattato', dataPrimaRisposta: l.dataPrimaRisposta || plusDays(0) });
      toast('Segnato come contattato');
    },
    organicoQualifica: (l) => {
      patchOrganico(l.id, { stato: 'qualificato' });
      promuoviAProspect(l.id, 'organico', l.nome, l.azienda, l.ricevutoDa);
      toast('Promosso a Prospect · ' + l.azienda);
    },
    organicoScarta: (l) => {
      patchOrganico(l.id, { stato: 'scartato' });
      toast('Lead scartato');
    },

    // ---------- Prospect ----------
    prospectAvanza: (p, nextStage, nextStepLabel, daysAhead = 5) => {
      patchProspect(p.id, { stage: nextStage, prossimoStep: nextStepLabel, dataProssimoStep: plusDays(daysAhead), dataUltimoContatto: plusDays(0) });
      toast('Prospect avanzato: ' + nextStage);
    },
    prospectVinto: (p) => {
      patchProspect(p.id, { stage: 'won', dataChiusura: plusDays(0), prossimoStep: '', dataProssimoStep: null });
      toast('Prospect chiuso: won');
    },
    prospectPerso: (p, motivo) => {
      patchProspect(p.id, { stage: 'lost', dataChiusura: plusDays(0), motivoLost: motivo || 'Non specificato', prossimoStep: '', dataProssimoStep: null });
      toast('Prospect segnato come perso');
    },
    prospectInStallo: (p, motivo) => {
      patchProspect(p.id, { stage: 'in_stallo', motivoStallo: motivo || 'Da definire', dataRilavoro: plusDays(90), prossimoStep: '', dataProssimoStep: null });
      toast('Prospect messo in stallo · rilavoro tra 90 giorni');
    },
    prospectRiattiva: (p) => {
      patchProspect(p.id, { stage: 'negoziazione', motivoStallo: '', dataRilavoro: null, prossimoStep: 'Ripresa contatto', dataProssimoStep: plusDays(3), dataUltimoContatto: plusDays(0) });
      toast('Prospect riattivato · torna in pipeline');
    },
    prospectRimandaRilavoro: (p, giorni = 60) => {
      patchProspect(p.id, { dataRilavoro: plusDays(giorni) });
      toast('Rilavoro riprogrammato tra ' + giorni + ' giorni');
    },
    prospectAbbandona: (p) => {
      patchProspect(p.id, { stage: 'lost', motivoLost: 'Abbandonato dopo rilavoro', dataChiusura: plusDays(0) });
      toast('Prospect abbandonato definitivamente');
    },

    // ---------- Retention: clienti non rinnovati ----------
    winbackProgramma: (w, giorni = 30) => {
      patchWinback(w.id, { stato: 'programmato', dataProssimoRilavoro: plusDays(giorni) });
      toast('Rilavoro win-back programmato');
    },
    winbackAvvia: (w) => {
      patchWinback(w.id, { stato: 'in_corso', tentativi: (w.tentativi || 0) + 1 });
      toast('Tentativo di win-back avviato');
    },
    winbackAbbandona: (w) => {
      patchWinback(w.id, { stato: 'abbandonato' });
      toast('Win-back abbandonato');
    },
  };
}
