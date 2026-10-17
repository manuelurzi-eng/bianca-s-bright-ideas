import { css } from '../lib/css.js';
import KpiRow from './KpiRow.jsx';

const URGENZA_CLS = { scaduto: 'bg-bad', oggi: 'bg-warn' };

export default function Home({ view }) {
  return (
    <>
      <KpiRow items={view.kpi} />
      <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:16px;padding:18px 20px;box-shadow:var(--shadow-sm)')}>
        <div style={css('font-size:13px;font-weight:700;color:var(--plum-900);margin-bottom:14px')}>Da fare oggi · tutte le aree</div>
        <div style={css('display:flex;flex-direction:column;gap:2px')}>
          {view.queue.map((q, i) => (
            <div key={i} style={css('display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--ink-200)')}>
              <span className={URGENZA_CLS[q.urgenza]} style={css('width:8px;height:8px;border-radius:999px;flex-shrink:0')} />
              <span style={css('font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700);flex-shrink:0')}>{q.area}</span>
              <span style={css('font-size:14px;font-weight:600;flex:1')}>{q.titolo}</span>
            </div>
          ))}
          {view.queueEmpty ? (
            <div style={css('padding:30px;text-align:center;color:var(--ink-500);font-weight:600')}>
              <i className="fa-solid fa-champagne-glasses" style={css('color:var(--green-400);margin-right:8px')} />Niente di urgente oggi.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
