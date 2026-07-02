// Macchina a stati del cockpit (porting dei metodi di Component del prototipo).
// Tiene lo stato mutabile { clienti, alert }, espone le azioni e produce i "vals".
// In modalità Airtable le scritture passano da patchCliente; i campi TRIGGER (T)
// chiedono conferma esplicita prima di partire (fanno scattare automazioni).
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadCockpitModel, usingAirtable } from '../data/source.js';
import { patchCliente, buildClientePatch } from '../airtable/api.js';
import { renderVals } from '../logic/viewmodels.js';

const INITIAL = {
  ready: false, entered: false, role: 'pm-giulia', screen: 'dashboard',
  selectedClient: 'aryel', alertStatus: {}, toast: '', tab: 'scadenza',
  diarioAdd: {}, matricePm: 'all', confirm: null,
};

const firstScreen = (ruolo) => ({ pm: 'dashboard', carlo: 'carlo', carla: 'carla', exec: 'exec' }[ruolo]);

export function useCockpit() {
  const [st, setSt] = useState(INITIAL);
  const mRef = useRef(null);          // model (data-source agnostic)
  const dataRef = useRef(null);       // { clienti, alert } — copie mutabili
  const toastTimer = useRef(null);
  const [, force] = useState(0);      // per rerender dopo mutazioni su dataRef

  // dataRef è tenuto fuori da setSt per non clonare l'intero dataset a ogni tasto;
  // le azioni lo mutano in modo immutabile e chiamano rerender().
  const rerender = useCallback(() => force((n) => n + 1), []);

  useEffect(() => {
    let alive = true;
    loadCockpitModel().then(({ m, clienti, alert }) => {
      if (!alive) return;
      mRef.current = m;
      dataRef.current = { clienti, alert };
      setSt((s) => ({ ...s, ready: true }));
    });
    return () => { alive = false; clearTimeout(toastTimer.current); };
  }, []);

  const toast = useCallback((msg) => {
    setSt((s) => ({ ...s, toast: msg }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setSt((s) => ({ ...s, toast: '' })), 2600);
  }, []);

  // Persistenza verso Airtable (no-op sui mock). Sui campi TRIGGER chiede conferma.
  const persist = useCallback((recordId, patch, msg) => {
    if (!usingAirtable()) { toast(msg); return; }
    const run = async () => {
      try {
        await patchCliente(recordId, patch);
        toast(msg);
      } catch (e) {
        toast('Errore Airtable: ' + e.message);
      }
    };
    const { triggers } = buildClientePatch(patch);
    if (triggers.length) {
      setSt((s) => ({
        ...s,
        confirm: {
          msg: 'Questa operazione attiva un automatismo su Airtable (invio al cliente). Confermi?',
          onConfirm: () => { setSt((x) => ({ ...x, confirm: null })); run(); },
        },
      }));
      return;
    }
    run();
  }, [toast]);

  const cancelConfirm = useCallback(() => setSt((s) => ({ ...s, confirm: null })), []);

  // muta dataRef.clienti in modo immutabile e rerenderizza
  const patchClientLocal = useCallback((id, patch) => {
    const d = dataRef.current;
    dataRef.current = { ...d, clienti: d.clienti.map((c) => (c.id === id ? { ...c, ...patch } : c)) };
    rerender();
  }, [rerender]);

  // ---------- navigazione ----------
  const setRole = useCallback((id) => {
    const u = mRef.current.userById(id);
    setSt((s) => ({ ...s, role: id, screen: firstScreen(u.ruolo) }));
  }, []);
  const go = useCallback((screen) => setSt((s) => ({ ...s, screen })), []);
  const enter = useCallback((id) => {
    const u = mRef.current.userById(id);
    setSt((s) => ({ ...s, role: id, screen: firstScreen(u.ruolo), entered: true }));
  }, []);
  const exitToEntry = useCallback(() => setSt((s) => ({ ...s, entered: false })), []);
  const openClient = useCallback((id) => setSt((s) => ({ ...s, selectedClient: id, screen: 'scheda' })), []);
  const setTab = useCallback((tab) => setSt((s) => ({ ...s, tab })), []);
  const setMatricePm = useCallback((matricePm) => setSt((s) => ({ ...s, matricePm })), []);

  // ---------- alert ----------
  const resolveAlert = useCallback((id) => {
    setSt((s) => ({ ...s, alertStatus: { ...s.alertStatus, [id]: 'resolved' } }));
    toast('Alert segnato come risolto');
  }, [toast]);
  const snoozeAlert = useCallback((id) => {
    setSt((s) => ({ ...s, alertStatus: { ...s.alertStatus, [id]: 'snoozed' } }));
    toast('Alert in snooze per 3 giorni');
  }, [toast]);

  // ---------- azioni inline (Scheda / Dashboard) ----------
  const markContact = useCallback((id, tipo) => {
    const m = mRef.current;
    const iso = m.TODAY.toISOString().slice(0, 10);
    patchClientLocal(id, { ultimo_contatto: iso, tipo_ultimo_contatto: tipo || 'call' });
    setSt((s) => ({
      ...s,
      diarioAdd: {
        ...s.diarioAdd,
        [id]: [{ data: iso, tipo: tipo || 'call', testo: 'Contatto segnato dal cockpit.' }, ...(s.diarioAdd[id] || [])],
      },
    }));
    persist(id, { ultimo_contatto: iso, tipo_ultimo_contatto: tipo }, 'Contatto registrato · diario aggiornato');
  }, [patchClientLocal, persist]);

  const toggleFreeze = useCallback((id) => {
    const m = mRef.current;
    const c = dataRef.current.clienti.find((x) => x.id === id);
    const now = !c.cliente_bloccato;
    const patch = now
      ? { cliente_bloccato: true, status: 'bloccato', data_riattivazione: m.addMonths(m.TODAY, 1), motivo_freeze: 'Freeze impostato dal PM' }
      : { cliente_bloccato: false, status: 'attivo', data_riattivazione: null };
    patchClientLocal(id, patch);
    persist(id, { cliente_bloccato: now, motivo_freeze: patch.motivo_freeze, data_riattivazione: patch.data_riattivazione },
      now ? 'Cliente messo in freeze · alert di contatto in pausa' : 'Cliente riattivato');
  }, [patchClientLocal, persist]);

  const setQuickCheckpoint = useCallback((id) => {
    const m = mRef.current;
    const d = new Date(m.TODAY);
    d.setDate(d.getDate() + 7);
    const iso = d.toISOString().slice(0, 10);
    patchClientLocal(id, { prossima_checkpoint: iso });
    // prossima_checkpoint è locale (nessun field Airtable dedicato) → solo toast
    toast('Prossima checkpoint fissata · ' + m.fmt(iso));
  }, [patchClientLocal, toast]);

  const openRinnovo = useCallback((id) => {
    patchClientLocal(id, {
      status: 'in-rinnovo', proposto_rinnovo: 'In valutazione',
      referente_rinnovo: 'Carla De Santis', gestione_rinnovi: 'Aperto dal PM',
    });
    persist(id, { proposto_rinnovo: 'In valutazione', referente_rinnovo: 'Carla De Santis' }, 'Rinnovo aperto · assegnato a Carla');
  }, [patchClientLocal, persist]);

  const updateField = useCallback((id, field, value, label) => {
    patchClientLocal(id, { [field]: value });
    persist(id, { [field]: value }, label || 'Salvato · sincronizzato con Airtable');
  }, [patchClientLocal, persist]);

  // ---------- render ----------
  if (!st.ready || !dataRef.current) {
    return { st, vals: { isLoading: true, isEntry: false }, act: {} };
  }

  const act = {
    setRole, go, enter, exitToEntry, openClient, setTab, setMatricePm,
    resolveAlert, snoozeAlert, markContact, toggleFreeze,
    setQuickCheckpoint, openRinnovo, updateField, toast, cancelConfirm,
  };
  const ctx = { st: { ...st, data: dataRef.current }, m: mRef.current, act };
  const vals = renderVals(ctx);
  vals.isLoading = false;
  vals.confirm = st.confirm;

  return { st, vals, act };
}
