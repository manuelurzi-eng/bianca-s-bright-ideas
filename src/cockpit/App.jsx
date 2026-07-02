import { useState } from 'react';
import { css } from './lib/css.js';
import { useCockpit } from './hooks/useCockpit.js';
import TopBar from './components/TopBar.jsx';
import Toast from './components/Toast.jsx';
import Entry from './components/Entry.jsx';
import PasswordGate from './components/PasswordGate.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import DashboardPM from './screens/DashboardPM.jsx';
import SchedaCliente from './screens/SchedaCliente.jsx';
import Matrice from './screens/Matrice.jsx';
import ControlloCarlo from './screens/ControlloCarlo.jsx';
import PipelineRinnovi from './screens/PipelineRinnovi.jsx';
import Exec from './screens/Exec.jsx';
import AlertInbox from './screens/AlertInbox.jsx';

const wrap = css('min-height:100vh;background:var(--cream);font-family:var(--font-display);color:var(--plum-900);-webkit-font-smoothing:antialiased');
const main = css('max-width:1320px;margin:0 auto;padding:30px 26px 80px');
const loading = css('padding:120px;text-align:center;color:var(--ink-500);font-weight:600');

export default function App() {
  // Password unica condivisa (gate client-side, non è sicurezza reale).
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('lever_unlocked') === '1');
  const { vals, act } = useCockpit();

  const unlock = () => { sessionStorage.setItem('lever_unlocked', '1'); setUnlocked(true); };
  if (!unlocked) return <PasswordGate onUnlock={unlock} />;

  if (vals.isLoading) {
    return (
      <div style={wrap}>
        <div style={main}><div style={loading}>Carico il cockpit…</div></div>
      </div>
    );
  }

  if (vals.isEntry) return <Entry entryPeople={vals.entryPeople} />;

  return (
    <div style={wrap}>
      <TopBar vals={vals} />
      <main style={main}>
        {vals.isDashboardPM ? <DashboardPM vals={vals} /> : null}
        {vals.isScheda ? <SchedaCliente vals={vals} /> : null}
        {vals.isMatrice ? <Matrice vals={vals} /> : null}
        {vals.isCarlo ? <ControlloCarlo vals={vals} /> : null}
        {vals.isCarla ? <PipelineRinnovi vals={vals} /> : null}
        {vals.isExec ? <Exec vals={vals} /> : null}
        {vals.isAlert ? <AlertInbox vals={vals} /> : null}
      </main>
      <Toast toast={vals.toast} />
      <ConfirmDialog confirm={vals.confirm} onCancel={act.cancelConfirm} />
    </div>
  );
}
