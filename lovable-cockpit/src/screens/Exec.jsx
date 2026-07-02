import { css } from '../lib/css.js';

// Panoramica exec: KPI aggregati (sola lettura) + grafico Tier 1 per mese.
export default function Exec({ vals }) {
  const e = vals.exec;
  return (
    <>
      <div style={css('margin-bottom:22px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>Panoramica exec</div>
        <h1 style={css('margin:0;font-weight:600;font-size:30px;letter-spacing:-.015em')}>Il portafoglio a colpo d'occhio</h1>
        <p style={css('margin:6px 0 0;font-size:14px;color:var(--ink-700)')}>Vista aggregata in sola lettura. I numeri arrivano dai campi calcolati di Airtable.</p>
      </div>

      <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px')}>
        {e.kpi.map((k, i) => (
          <div key={i} className={k.toneCls} style={css('border-radius:16px;padding:22px;box-shadow:var(--shadow-sm)')}>
            <div style={css('font-weight:700;font-size:30px;letter-spacing:-.02em')}>{k.n}</div>
            <div className="kpi-label" style={css('font-size:13px;font-weight:600;margin-top:5px')}>{k.l}</div>
          </div>
        ))}
      </div>

      <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:16px;padding:20px 22px;box-shadow:var(--shadow-sm);max-width:640px')}>
        <div style={css('font-size:13px;font-weight:700;color:var(--plum-900);margin-bottom:16px')}>Uscite Tier 1 per mese</div>
        <div style={css('display:flex;align-items:flex-end;gap:16px;height:160px')}>
          {e.tier1Mese.map((b, i) => (
            <div key={i} style={css('flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:8px')}>
              <div style={css('font-size:12px;font-weight:700;color:var(--indigo-700)')}>{b.n}</div>
              <div style={css('width:100%;flex:1;display:flex;align-items:flex-end')}><svg className="bg-indigo" width="100%" height={b.pct + '%'} style={css('display:block;border-radius:6px 6px 0 0;max-height:100%')} /></div>
              <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>{b.mese}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
