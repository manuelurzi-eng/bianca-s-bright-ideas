import { css } from '../lib/css.js';

// Matrice portafoglio: una riga per cliente, tutte le variabili. Le righe con più
// rossi salgono in cima. Carlo vede tutte le PM + filtro chip.
export default function Matrice({ vals }) {
  const mx = vals.matrice;
  return (
    <div data-screen-label="Matrice portafoglio">
      <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:18px')}>
        <div>
          <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>Matrice portafoglio</div>
          <h1 style={css('font-family:var(--font-display);font-size:30px;font-weight:800;margin:0;color:var(--plum-900)')}>Tutti i clienti, tutte le variabili</h1>
          <div style={css('font-size:13px;color:var(--ink-500);margin-top:4px')}>Una riga per cliente · le righe con rossi salgono in cima · clic sulla riga per aprire la scheda</div>
        </div>
        <div style={css('display:flex;gap:10px;flex-wrap:wrap')}>
          {mx.kpi.map((k, i) => (
            <div key={i} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:12px;padding:10px 16px;min-width:110px')}>
              <div className={k.cls} style={css('font-family:var(--font-display);font-weight:800;font-size:22px')}>{k.n}</div>
              <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {mx.showChips ? (
        <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px')}>
          {mx.pmChips.map((ch, i) => (
            <button key={i} onClick={ch.onClick} className={ch.cls} style={css('border:0;border-radius:999px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer')}>{ch.label}</button>
          ))}
        </div>
      ) : null}

      <div style={css('overflow-x:auto;background:#fff;border:1px solid var(--ink-200);border-radius:14px;box-shadow:var(--shadow-sm)')}>
        <div style={css('min-width:1160px')}>
          <div className={mx.gridCls} style={css('display:grid;gap:12px;align-items:center;padding:12px 18px;border-bottom:2px solid var(--ink-200);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-500)')}>
            <div>Cliente</div>{mx.showPm ? <div>PM</div> : null}<div>Fase del percorso</div><div>Tier 1</div><div>CS in corso</div><div>Contatto</div><div>Scadenza</div><div>Sodd.</div><div>Prossima azione</div>
          </div>
          {mx.rows.map((r) => (
            <button key={r.id} onClick={r.onOpen} className={mx.gridCls} style={css('display:grid;gap:12px;align-items:center;width:100%;box-sizing:border-box;border:0;border-bottom:1px solid var(--ink-200);background:none;padding:12px 18px;text-align:left;cursor:pointer;font-family:var(--font-display)')}>
              <div style={css('display:flex;align-items:center;gap:8px;min-width:0')}>
                <span className={r.statusDotCls} style={css('flex-shrink:0;width:9px;height:9px;border-radius:999px')} />
                <span style={css('min-width:0')}>
                  <span style={css('display:block;font-weight:700;font-size:13.5px;color:var(--plum-900);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.nome} {r.bloccato ? <i className="fa-solid fa-snowflake" style={css('color:var(--indigo-600);font-size:11px')} /> : null}</span>
                  <span style={css('display:block;font-size:11px;color:var(--ink-500);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.settore}</span>
                </span>
              </div>
              {mx.showPm ? <div style={css('font-size:12px;font-weight:600;color:var(--ink-700)')}>{r.pmNome}</div> : null}
              <div style={css('min-width:0')}>
                <div style={css('display:flex;gap:3px;align-items:center')}>
                  {r.fasi.map((f, i) => (
                    <span key={i} className={f.cls} title={f.title} style={css('flex:1;height:7px;border-radius:999px')} />
                  ))}
                </div>
                <div className={r.faseCls} style={css('font-size:11px;font-weight:600;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.faseLabel}</div>
              </div>
              <div className={r.tierCls} style={css('font-size:13px;font-weight:800')}>{r.tier}</div>
              <div style={css('display:flex;align-items:center;gap:7px;min-width:0')}>
                <span className={r.csCls} style={css('flex-shrink:0;width:11px;height:11px;border-radius:999px')} />
                <span style={css('font-size:12px;font-weight:600;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.csLabel}</span>
              </div>
              <div className={r.contCls} style={css('font-size:13px;font-weight:700')}>{r.cont}</div>
              <div className={r.scadCls} style={css('font-size:13px;font-weight:700')}>{r.scad}</div>
              <div className={r.soddCls} style={css('font-size:13px;font-weight:700')}>{r.sodd}</div>
              <div style={css('display:flex;align-items:center;gap:7px;min-width:0')}>
                <span className={r.azCls} style={css('flex-shrink:0;width:11px;height:11px;border-radius:999px')} />
                <span className={r.azTextCls} style={css('font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.azione}</span>
              </div>
            </button>
          ))}
          {mx.empty ? (
            <div style={css('padding:40px;text-align:center;color:var(--ink-500);font-weight:600')}>Nessun cliente in questa vista.</div>
          ) : null}
        </div>
      </div>

      <div style={css('display:flex;gap:18px;flex-wrap:wrap;margin-top:12px;font-size:12px;color:var(--ink-500);font-weight:600')}>
        <span style={css('display:inline-flex;align-items:center;gap:6px')}><span className="bg-ok" style={css('width:10px;height:10px;border-radius:999px;display:inline-block')} /> fatto / in linea</span>
        <span style={css('display:inline-flex;align-items:center;gap:6px')}><span className="bg-indigo" style={css('width:10px;height:10px;border-radius:999px;display:inline-block')} /> in corso</span>
        <span style={css('display:inline-flex;align-items:center;gap:6px')}><span className="bg-warn" style={css('width:10px;height:10px;border-radius:999px;display:inline-block')} /> da tenere d'occhio</span>
        <span style={css('display:inline-flex;align-items:center;gap:6px')}><span className="bg-bad" style={css('width:10px;height:10px;border-radius:999px;display:inline-block')} /> intervenire</span>
        <span style={css('display:inline-flex;align-items:center;gap:6px')}><span className="bg-muted" style={css('width:10px;height:10px;border-radius:999px;display:inline-block')} /> da fare / n.a.</span>
      </div>
    </div>
  );
}
