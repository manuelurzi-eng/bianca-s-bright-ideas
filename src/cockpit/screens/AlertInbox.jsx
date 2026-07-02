import { css } from '../lib/css.js';

// Alert Inbox: coda personale. Gli alert sono calcolati dal backend; qui si gestiscono.
export default function AlertInbox({ vals }) {
  const { myAlerts, alertOpenCount, alertEmpty } = vals;
  return (
    <>
      <div style={css('margin-bottom:22px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>Alert Inbox</div>
        <h1 style={css('margin:0;font-weight:600;font-size:30px;letter-spacing:-.015em')}>La mia coda · {alertOpenCount} da gestire</h1>
        <p style={css('margin:6px 0 0;font-size:14px;color:var(--ink-700);max-width:640px')}>Ogni alert è calcolato in automatico dal motore backend. Qui li gestisci: apri la scheda, segna "risolto" o metti in snooze.</p>
      </div>

      <div style={css('display:flex;flex-direction:column;gap:10px')}>
        {myAlerts.map((al, i) => (
          <div key={i} className={al.dimCls} style={css('position:relative;display:flex;align-items:flex-start;gap:14px;background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:16px 18px 16px 22px;box-shadow:var(--shadow-sm)')}>
            <div className={al.stripeCls} style={css('position:absolute;left:0;top:0;bottom:0;width:5px;border-radius:14px 0 0 14px')} />
            <div className={al.chipCls} style={css('flex-shrink:0;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px')}><i className={al.icon} /></div>
            <div style={css('flex:1;min-width:0')}>
              <div style={css('display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
                <span style={css('font-weight:700;font-size:15px')}>{al.titolo}</span>
                <span style={css('font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700)')}>{al.clientNome}</span>
                {al.resolved ? <span style={css('font-size:11px;font-weight:700;color:var(--green-400)')}><i className="fa-solid fa-check" /> Risolto</span> : null}
                {al.snoozed ? <span style={css('font-size:11px;font-weight:700;color:var(--ink-500)')}><i className="fa-solid fa-clock" /> Snooze</span> : null}
              </div>
              <div style={css('font-size:13px;color:var(--ink-700);margin-top:3px')}>{al.dettaglio}</div>
              <div style={css('font-size:11px;color:var(--ink-400);margin-top:5px;font-weight:600')}>{al.meta}</div>
            </div>
            <div style={css('display:flex;align-items:center;gap:8px;flex-shrink:0')}>
              <button onClick={al.onOpen} style={css('display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 15px;border:0;border-radius:999px;background:var(--indigo-700);color:#fff;font-weight:600;font-size:13px;cursor:pointer')}>Apri scheda <i className="fa-solid fa-arrow-right" style={css('font-size:11px')} /></button>
              <button onClick={al.onResolve} title="Risolto" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-solid fa-check" /></button>
              <button onClick={al.onSnooze} title="Snooze 3gg" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-solid fa-clock" /></button>
            </div>
          </div>
        ))}
        {alertEmpty ? (
          <div style={css('padding:50px;text-align:center;color:var(--ink-500);background:#fff;border:1px solid var(--ink-200);border-radius:14px;font-weight:600')}><i className="fa-solid fa-champagne-glasses" style={css('color:var(--green-400);margin-right:8px')} />Nessun alert aperto. Coda pulita.</div>
        ) : null}
      </div>
    </>
  );
}
