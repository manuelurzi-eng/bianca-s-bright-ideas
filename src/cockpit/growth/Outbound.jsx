import { css } from '../lib/css.js';
import KpiRow from './KpiRow.jsx';
import { btnPrimary, btnGhost, emptyStyle } from './shared.js';

export default function Outbound({ view, readOnly }) {
  return (
    <>
      <KpiRow items={view.kpi} />
      <div style={css('display:flex;flex-direction:column;gap:10px')}>
        {view.rows.map((o) => (
          <div key={o.id} style={{ ...css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm)'), opacity: o.chiuso ? 0.6 : 1 }}>
            <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap')}>
              <div>
                <div style={css('font-weight:700;font-size:15px')}>{o.nome} <span style={css('font-weight:500;color:var(--ink-500)')}>· {o.azienda}</span></div>
                <div style={css('font-size:12px;color:var(--ink-500);margin-top:2px')}>{o.ruolo} · {o.settore} · {o.canaleLabel}</div>
              </div>
              <span style={css('font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700);white-space:nowrap')}>{o.stepLabel}</span>
            </div>
            <div style={css('display:flex;align-items:center;gap:18px;margin:10px 0;font-size:12px;color:var(--ink-700);flex-wrap:wrap')}>
              <span>Ultimo contatto: <b>{o.ultimoFmt}</b></span>
              <span className={o.scaduto ? 't-bad' : ''}>Prossimo follow-up: <b>{o.followUpFmt}</b>{o.scaduto ? ' · scaduto' : ''}</span>
              <span>Owner: <b>{o.ownerNome}</b></span>
            </div>
            {o.esito ? <div style={css('font-size:12px;color:var(--ink-700);font-style:italic;margin-bottom:8px')}>"{o.esito}"</div> : null}
            {!readOnly && !o.chiuso ? (
              <div style={css('display:flex;gap:8px;flex-wrap:wrap')}>
                <button onClick={o.onPositiva} style={btnPrimary}>Risposta positiva</button>
                <button onClick={o.onNegativa} style={btnGhost}>Risposta negativa</button>
                <button onClick={o.onSnooze} style={btnGhost}>Rimanda 3gg</button>
                <button onClick={o.onQualifica} style={btnPrimary}>Promuovi a Prospect</button>
                <button onClick={o.onScarta} style={btnGhost}>Scarta</button>
              </div>
            ) : null}
          </div>
        ))}
        {view.empty ? <div style={emptyStyle}>Nessun contatto outbound.</div> : null}
      </div>
    </>
  );
}
