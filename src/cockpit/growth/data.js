// Growth Hub — dati mock locali, solo di sessione (si perdono al reload).
// Nessuna tabella Airtable esiste ancora per queste 4 aree — vedi docs/HANDOFF_PROMPT.md §3.
// Serve a validare il flusso di lavoro prima di disegnare lo schema definitivo.
import { TODAY } from '../data/mock.js';

function iso(offsetDays) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const OUTBOUND_SEED = [
  { id: 'ob-1', nome: 'Elena Russo', azienda: 'Nimbus Robotics', ruolo: 'Head of Comms', settore: 'Robotics', canale: 'email', owner: 'carlo', step: 'in_attesa', dataUltimoContatto: iso(-3), prossimoFollowUp: iso(-1), esito: '' },
  { id: 'ob-2', nome: 'Davide Conti', azienda: 'Fluxo Energy', ruolo: 'CEO', settore: 'Energy / ClimaTech', canale: 'linkedin', owner: 'carlo', step: 'risposta_positiva', dataUltimoContatto: iso(-1), prossimoFollowUp: iso(2), esito: 'Disponibile per una call la prossima settimana.' },
  { id: 'ob-3', nome: 'Marta Villa', azienda: 'Kelp Foods', ruolo: 'Co-founder', settore: 'FoodTech', canale: 'email', owner: 'carlo', step: 'in_attesa', dataUltimoContatto: iso(-6), prossimoFollowUp: iso(-4), esito: '' },
  { id: 'ob-4', nome: 'Luca Ferraro', azienda: 'Sigillo Legal', ruolo: 'Partner', settore: 'LegalTech', canale: 'telefono', owner: 'carlo', step: 'risposta_negativa', dataUltimoContatto: iso(-10), prossimoFollowUp: null, esito: 'Non interessati per ora, richiamare a gennaio.' },
  { id: 'ob-5', nome: 'Giorgia Neri', azienda: 'Paper Plane Travel', ruolo: 'Marketing Lead', settore: 'Travel', canale: 'email', owner: 'carlo', step: 'meeting_fissato', dataUltimoContatto: iso(0), prossimoFollowUp: iso(3), esito: 'Call fissata.' },
  { id: 'ob-6', nome: 'Simone Greco', azienda: 'Orbita Space', ruolo: 'CMO', settore: 'Aerospace', canale: 'linkedin', owner: 'carlo', step: 'qualificato', dataUltimoContatto: iso(-2), prossimoFollowUp: null, esito: 'Passato a Prospect.' },
];

const ORGANICO_SEED = [
  { id: 'or-1', nome: 'Allegra Moretti', azienda: 'Verve Beauty', canale: 'dm_carlo', ricevutoDa: 'carlo', dataArrivo: iso(-6), dataPrimaRisposta: iso(-5), stato: 'qualificato', note: 'Scritto in DM a Carlo dopo un evento. Già in pipeline.' },
  { id: 'or-2', nome: 'Beatrice Sala', azienda: 'Nordik Design', canale: 'sito', ricevutoDa: 'carlo', dataArrivo: iso(-2), dataPrimaRisposta: null, stato: 'da_contattare', note: 'Form sito, richiesta generica di preventivo.' },
  { id: 'or-3', nome: 'Riccardo Testa', azienda: 'Fermata Coffee', canale: 'passaparola', ricevutoDa: 'carlo', dataArrivo: iso(-1), dataPrimaRisposta: iso(0), stato: 'contattato', note: 'Consigliato da un cliente attuale.' },
  { id: 'or-4', nome: 'Chiara Bruno', azienda: 'Altura Wear', canale: 'referral', ricevutoDa: 'carlo', dataArrivo: iso(-9), dataPrimaRisposta: iso(-9), stato: 'scartato', note: 'Budget troppo basso per ora.' },
  { id: 'or-5', nome: 'Nicola Parisi', azienda: 'Lumen Studio', canale: 'evento', ricevutoDa: 'carlo', dataArrivo: iso(0), dataPrimaRisposta: null, stato: 'da_contattare', note: 'Biglietto da visita preso a un evento ieri sera.' },
];

const PROSPECT_SEED = [
  { id: 'pr-1', nome: 'Simone Greco', azienda: 'Orbita Space', referente: 'Simone Greco', fonte: 'outbound', fonteId: 'ob-6', stage: 'qualificato', valoreStimato: 36000, owner: 'carlo', prossimoStep: 'Invio proposta', dataProssimoStep: iso(4), dataUltimoContatto: iso(-2) },
  { id: 'pr-2', nome: 'Allegra Moretti', azienda: 'Verve Beauty', referente: 'Allegra Moretti', fonte: 'organico', fonteId: 'or-1', stage: 'proposta', valoreStimato: 28000, owner: 'carla', prossimoStep: 'Follow-up proposta', dataProssimoStep: iso(2), dataUltimoContatto: iso(-5) },
  { id: 'pr-3', nome: 'Tommaso Bellini', azienda: 'Plexa Robotics', referente: 'Tommaso Bellini', fonte: 'outbound', fonteId: null, stage: 'negoziazione', valoreStimato: 54000, owner: 'carlo', prossimoStep: 'Call su termini contrattuali', dataProssimoStep: iso(1), dataUltimoContatto: iso(-1) },
  { id: 'pr-4', nome: 'Irene Fabbri', azienda: 'Solarix', referente: 'Irene Fabbri', fonte: 'organico', fonteId: null, stage: 'won', valoreStimato: 42000, owner: 'carlo', prossimoStep: '', dataProssimoStep: null, dataUltimoContatto: iso(-20), dataChiusura: iso(-18) },
  { id: 'pr-5', nome: 'Paolo Russo', azienda: 'Mentha Labs', referente: 'Paolo Russo', fonte: 'referral', fonteId: null, stage: 'lost', valoreStimato: 18000, owner: 'carla', prossimoStep: '', dataProssimoStep: null, dataUltimoContatto: iso(-40), dataChiusura: iso(-35), motivoLost: 'Budget assegnato a un’altra agenzia.' },
  { id: 'pr-6', nome: 'Federica Monti', azienda: 'Vectis Mobility', referente: 'Federica Monti', fonte: 'outbound', fonteId: null, stage: 'lead', valoreStimato: 22000, owner: 'carlo', prossimoStep: 'Prima call conoscitiva', dataProssimoStep: iso(5), dataUltimoContatto: iso(0) },
  { id: 'pr-7', nome: 'Anna Longo', azienda: 'Driftwood Studio', referente: 'Anna Longo', fonte: 'organico', fonteId: null, stage: 'in_stallo', valoreStimato: 15000, owner: 'carla', prossimoStep: '', dataProssimoStep: null, dataUltimoContatto: iso(-75), dataRilavoro: iso(-5), motivoStallo: 'Hanno rimandato la decisione a dopo l’estate.' },
  { id: 'pr-8', nome: 'Matteo Riva', azienda: 'Hydra Biotech', referente: 'Matteo Riva', fonte: 'outbound', fonteId: null, stage: 'in_stallo', valoreStimato: 60000, owner: 'carlo', prossimoStep: '', dataProssimoStep: null, dataUltimoContatto: iso(-50), dataRilavoro: iso(10), motivoStallo: 'Call fatta, aspettano il budget del nuovo Q1.' },
];

const WINBACK_SEED = [
  { id: 'wb-1', clienteId: 'greenpea', owner: 'carla', stato: 'programmato', dataProssimoRilavoro: iso(14), tentativi: 1, note: 'Richiamare a inizio 2027 per una nuova campagna una-tantum.' },
];

export function seedGrowth() {
  return {
    outbound: JSON.parse(JSON.stringify(OUTBOUND_SEED)),
    organico: JSON.parse(JSON.stringify(ORGANICO_SEED)),
    prospect: JSON.parse(JSON.stringify(PROSPECT_SEED)),
    winback: JSON.parse(JSON.stringify(WINBACK_SEED)),
  };
}
