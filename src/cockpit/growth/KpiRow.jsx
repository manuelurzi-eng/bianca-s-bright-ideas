import { css } from '../lib/css.js';

export default function KpiRow({ items }) {
  return (
    <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px')}>
      {items.map((k, i) => (
        <div key={i} className={k.bad ? 'kpi-plum' : 'kpi-cream'} style={css('border-radius:16px;padding:18px;box-shadow:var(--shadow-sm)')}>
          <div style={css('font-weight:700;font-size:26px;letter-spacing:-.02em')}>{k.n}</div>
          <div className={k.bad ? 'kpi-label' : ''} style={css('font-size:12px;font-weight:600;margin-top:4px')}>{k.l}</div>
          {k.sub ? <div style={css('font-size:11px;margin-top:2px;opacity:.7')}>{k.sub}</div> : null}
        </div>
      ))}
    </div>
  );
}
