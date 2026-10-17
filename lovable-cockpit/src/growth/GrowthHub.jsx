import { css } from '../lib/css.js';
import { useGrowth } from './useGrowth.js';
import { buildGrowthActions } from './actions.js';
import { buildOutboundView, buildOrganicoView, buildProspectView, buildRetentionView, buildHomeView } from './viewmodels.js';
import Home from './Home.jsx';
import Outbound from './Outbound.jsx';
import Organico from './Organico.jsx';
import Prospect from './Prospect.jsx';
import Retention from './Retention.jsx';

const TABS = [
  { key: 'home', label: 'Oggi', icon: 'fa-solid fa-list-check' },
  { key: 'outbound', label: 'Outbound', icon: 'fa-solid fa-paper-plane' },
  { key: 'organico', label: 'Organico', icon: 'fa-solid fa-inbox' },
  { key: 'prospect', label: 'Prospect', icon: 'fa-solid fa-diagram-project' },
  { key: 'retention', label: 'Retention & riattivazione', icon: 'fa-solid fa-rotate-left' },
];

// Growth Hub: modulo autonomo (dati locali, nessuna tabella Airtable ancora —
// vedi docs/HANDOFF_PROMPT.md). Non condivide stato con useCockpit.js: i due
// domini restano disaccoppiati finché lo schema dati definitivo non è deciso.
export default function GrowthHub({ readOnly }) {
  const g = useGrowth();
  const actions = readOnly ? {} : buildGrowthActions(g);
  const outboundView = buildOutboundView(g.state, actions);
  const organicoView = buildOrganicoView(g.state, actions);
  const prospectView = buildProspectView(g.state, actions);
  const retentionView = buildRetentionView(g.state, actions);
  const homeView = buildHomeView(g.state, outboundView, organicoView, prospectView, retentionView);

  return (
    <>
      <div style={css('margin-bottom:22px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>Growth Hub</div>
        <h1 style={css('margin:0;font-weight:600;font-size:30px;letter-spacing:-.015em')}>Outbound, organico, prospect e retention in un posto solo</h1>
        <p style={css('margin:6px 0 0;font-size:14px;color:var(--ink-700);max-width:680px')}>
          Dati ancora locali (mock, si perdono al reload) — nessuna tabella Airtable esiste per queste 4 aree.
          Serve a validare il flusso di lavoro prima di disegnare lo schema definitivo.
        </p>
      </div>

      <div style={css('display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap')}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => g.setTab(t.key)}
            className={g.tab === t.key ? 'tab-on' : 'tab-off'}
            style={css('display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 15px;border:0;border-radius:999px;cursor:pointer;font-family:var(--font-display);font-weight:600;font-size:13px')}
          >
            <i className={t.icon} style={css('font-size:12px')} />{t.label}
          </button>
        ))}
      </div>

      {g.tab === 'home' ? <Home view={homeView} /> : null}
      {g.tab === 'outbound' ? <Outbound view={outboundView} readOnly={readOnly} /> : null}
      {g.tab === 'organico' ? <Organico view={organicoView} readOnly={readOnly} /> : null}
      {g.tab === 'prospect' ? <Prospect view={prospectView} readOnly={readOnly} /> : null}
      {g.tab === 'retention' ? <Retention view={retentionView} readOnly={readOnly} /> : null}

      {g.toastMsg ? (
        <div style={css('position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--plum-900);color:#fff;padding:10px 20px;border-radius:999px;font-weight:600;font-size:13px;box-shadow:var(--shadow-sm);z-index:60')}>{g.toastMsg}</div>
      ) : null}
    </>
  );
}
