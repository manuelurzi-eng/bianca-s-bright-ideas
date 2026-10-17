// Stato del Growth Hub — locale (useState), indipendente dalla macchina a stati
// dei clienti attivi (useCockpit.js) per non accoppiare due domini ancora instabili.
// Quando lo schema Airtable sarà deciso, solo questo file e data.js cambieranno.
import { useCallback, useRef, useState } from 'react';
import { seedGrowth } from './data.js';

export function useGrowth() {
  const [state, setState] = useState(() => seedGrowth());
  const [tab, setTab] = useState('home');
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);

  const patchOutbound = useCallback((id, patch) => {
    setState((s) => ({ ...s, outbound: s.outbound.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));
  }, []);
  const patchOrganico = useCallback((id, patch) => {
    setState((s) => ({ ...s, organico: s.organico.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));
  }, []);
  const patchProspect = useCallback((id, patch) => {
    setState((s) => ({ ...s, prospect: s.prospect.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);
  const patchWinback = useCallback((id, patch) => {
    setState((s) => ({ ...s, winback: s.winback.map((w) => (w.id === id ? { ...w, ...patch } : w)) }));
  }, []);
  const addProspect = useCallback((p) => {
    setState((s) => (s.prospect.some((x) => x.id === p.id) ? s : { ...s, prospect: [p, ...s.prospect] }));
  }, []);

  return { state, tab, setTab, toast, toastMsg, patchOutbound, patchOrganico, patchProspect, patchWinback, addProspect };
}
