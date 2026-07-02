import { css } from '../lib/css.js';

// Pipeline rinnovi (Carla): clienti per finestra di scadenza (30/60/90 gg).
export default function PipelineRinnovi({ vals }) {
  const columns = vals.carla.columns;
  return (
    <>
      <div style={css('margin-bottom:22px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>Pipeline rinnovi</div>
        <h1 style={css('margin:0;font-weight:600;font-size:30px;letter-spacing:-.015em')}>Nessun contratto scade senza gestione</h1>
        <p style={css('margin:6px 0 0;font-size:14px;color:var(--ink-700)')}>Clienti raggruppati per finestra di scadenza. Aggiorna "proposto rinnovo" direttamente dalla card.</p>
      </div>

      <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start')}>
        {columns.map((col) => (
          <div key={col.key} style={css('background:rgba(43,26,46,.04);border:1px solid var(--ink-200);border-radius:16px;padding:14px')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;padding:4px 6px 12px')}>
              <div style={css('display:flex;align-items:center;gap:9px')}>
                <span className={col.dotCls} style={css('width:9px;height:9px;border-radius:999px')} />
                <span style={css('font-weight:700;font-size:15px')}>{col.label}</span>
              </div>
              <span style={css('min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:var(--plum-900);color:#fff;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center')}>{col.count}</span>
            </div>
            <div style={css('display:flex;flex-direction:column;gap:12px')}>
              {col.cards.map((c) => (
                <div key={c.id} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:13px;padding:15px;box-shadow:var(--shadow-sm)')}>
                  <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:8px')}>
                    <button onClick={c.onOpen} style={css('border:0;background:none;padding:0;font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--plum-900);cursor:pointer;text-align:left')}>{c.nome}</button>
                    {c.churn ? <span style={css('font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(130,15,70,.1);color:var(--burgundy-700);white-space:nowrap')}><i className="fa-solid fa-triangle-exclamation" /> churn</span> : null}
                  </div>
                  <div style={css('font-size:11px;color:var(--ink-500);margin-top:2px')}>{c.settore} · PM {c.pmNome}</div>

                  <div style={css('display:flex;align-items:center;justify-content:space-between;margin:12px 0;padding:10px 0;border-top:1px solid var(--ink-200);border-bottom:1px solid var(--ink-200)')}>
                    <div><div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>Fine contratto</div><div style={css('font-weight:700;font-size:14px')}>{c.fineFmt}</div></div>
                    <div style={css('text-align:right')}><div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>Valore</div><div style={css('font-weight:700;font-size:14px;color:var(--indigo-700)')}>{c.valore}</div></div>
                  </div>

                  <label style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>Proposto rinnovo</label>
                  <select value={c.proposto} onChange={c.onProposto} style={css('height:32px;border:1px solid var(--ink-300);border-radius:8px;padding:0 8px;font-size:12px;font-weight:600;font-family:var(--font-display);background:var(--cream);color:var(--plum-900);cursor:pointer;width:100%;margin-top:4px')}>
                    {c.opts.map((o, i) => <option key={i} value={o.v}>{o.label}</option>)}
                  </select>

                  <div style={css('display:flex;align-items:center;gap:8px;margin-top:11px;font-size:12px')}>
                    <i className="fa-solid fa-user-tie" style={css('color:var(--ink-400)')} />
                    <span style={css('color:var(--ink-700);font-weight:600')}>{c.referente}</span>
                  </div>
                  <div style={css('display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12px')}>
                    <i className="fa-solid fa-diagram-project" style={css('color:var(--ink-400)')} />
                    <span style={css('color:var(--ink-700);font-weight:600')}>{c.gestione}</span>
                  </div>
                </div>
              ))}
              {col.empty ? <div style={css('padding:24px;text-align:center;color:var(--ink-400);font-size:13px;font-weight:600')}>Nessun cliente</div> : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
