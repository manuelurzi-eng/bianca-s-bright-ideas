import { css } from '../lib/css.js';

// Controllo portafoglio (Carlo): da assegnare + cose da attenzionare + andamento + copertura PM.
export default function ControlloCarlo({ vals }) {
  const c = vals.carlo;
  return (
    <>
      <div style={css('margin-bottom:22px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>Controllo portafoglio</div>
        <h1 style={css('margin:0;font-weight:600;font-size:30px;letter-spacing:-.015em')}>Salute del portafoglio</h1>
        <p style={css('margin:6px 0 0;font-size:14px;color:var(--ink-700)')}>Non gestisci i clienti — li controlli. Dove qualcosa sta scivolando, su dati oggettivi.</p>
      </div>

      {c.hasDaAssegnare ? (
        <div style={css('background:var(--lilac-100);border:1px solid var(--lilac-200);border-radius:16px;padding:16px 20px;margin-bottom:20px')}>
          <div style={css('display:flex;align-items:center;gap:9px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:12px')}><i className="fa-solid fa-user-plus" /> Da assegnare · clienti senza referente</div>
          <div style={css('display:flex;flex-wrap:wrap;gap:10px')}>
            {c.daAssegnare.map((x, i) => (
              <button key={i} onClick={x.onOpen} style={css('display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--ink-200);border-radius:12px;padding:11px 15px;cursor:pointer;font-family:var(--font-display);text-align:left')}>
                <span style={css('width:30px;height:30px;border-radius:999px;background:var(--ink-200);color:var(--ink-500);display:flex;align-items:center;justify-content:center;font-size:13px')}><i className="fa-solid fa-question" /></span>
                <span>
                  <span style={css('display:block;font-weight:700;font-size:14px;color:var(--plum-900)')}>{x.nome}</span>
                  <span style={css('display:block;font-size:11px;color:var(--ink-500)')}>{x.settore} · firmato {x.firmaFmt}</span>
                </span>
                <span style={css('font-size:12px;font-weight:600;color:var(--indigo-700);margin-left:4px')}>Assegna <i className="fa-solid fa-arrow-right" style={css('font-size:10px')} /></span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Banda A */}
      <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:16px;padding:20px 22px;box-shadow:var(--shadow-sm);margin-bottom:20px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--burgundy-700);margin-bottom:14px')}><i className="fa-solid fa-circle-exclamation" /> A · Cose da attenzionare adesso</div>
        <div style={css('display:flex;flex-direction:column;gap:8px')}>
          {c.attenzionare.map((a, i) => (
            <button key={i} onClick={a.onOpen} style={css('position:relative;display:flex;align-items:center;gap:13px;width:100%;text-align:left;background:var(--cream);border:1px solid var(--ink-200);border-radius:11px;padding:12px 14px 12px 18px;cursor:pointer;font-family:var(--font-display)')}>
              <span className={a.stripeCls} style={css('position:absolute;left:0;top:0;bottom:0;width:4px')} />
              <span className={a.chipCls} style={css('flex-shrink:0;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px')}><i className={a.icon} /></span>
              <span style={css('flex:1;min-width:0')}>
                <span style={css('display:block;font-weight:700;font-size:14px;color:var(--plum-900)')}>{a.titolo}</span>
                <span style={css('display:block;font-size:12px;color:var(--ink-500)')}>{a.dettaglio}</span>
              </span>
              <span style={css('font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700)')}>{a.clientNome}</span>
              <span style={css('font-size:11px;color:var(--ink-500);font-weight:600;width:52px;text-align:right')}>PM {a.pm}</span>
            </button>
          ))}
          {c.attEmpty ? <div style={css('padding:20px;text-align:center;color:var(--ink-500);font-weight:600')}>Nessun cliente da attenzionare.</div> : null}
        </div>
      </div>

      {/* Banda B */}
      <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:12px')}><i className="fa-solid fa-chart-line" /> B · Andamento</div>
      <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px')}>
        {c.kpi.map((k, i) => (
          <div key={i} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm)')}>
            <div style={css('font-weight:700;font-size:22px;letter-spacing:-.02em')}>{k.n}</div>
            <div style={css('font-size:12px;color:var(--plum-900);font-weight:600;margin-top:3px')}>{k.l}</div>
            <div style={css('font-size:11px;color:var(--ink-500);margin-top:2px')}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={css('display:grid;grid-template-columns:1.4fr 1fr;gap:14px;margin-bottom:22px')}>
        <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm)')}>
          <div style={css('font-size:13px;font-weight:700;color:var(--plum-900);margin-bottom:16px')}>Uscite Tier 1 per mese</div>
          <div style={css('display:flex;align-items:flex-end;gap:14px;height:150px')}>
            {c.tier1Mese.map((b, i) => (
              <div key={i} style={css('flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:8px')}>
                <div style={css('font-size:12px;font-weight:700;color:var(--indigo-700)')}>{b.n}</div>
                <div style={css('width:100%;flex:1;display:flex;align-items:flex-end')}><svg className="bg-indigo" width="100%" height={b.pct + '%'} style={css('display:block;border-radius:6px 6px 0 0;max-height:100%')} /></div>
                <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>{b.mese}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm)')}>
          <div style={css('font-size:13px;font-weight:700;color:var(--plum-900);margin-bottom:16px')}>Clienti a rischio · settimana su settimana</div>
          <div style={css('display:flex;align-items:flex-end;gap:10px;height:150px')}>
            {c.trend.map((b, i) => (
              <div key={i} style={css('flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:8px')}>
                <div style={css('font-size:12px;font-weight:700;color:var(--plum-900)')}>{b.n}</div>
                <div style={css('width:100%;flex:1;display:flex;align-items:flex-end')}><svg className={b.cls} width="100%" height={b.pct + '%'} style={css('display:block;border-radius:6px 6px 0 0;max-height:100%')} /></div>
                <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>{b.sett}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banda C */}
      <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:12px')}><i className="fa-solid fa-table-cells" /> C · Copertura del portafoglio</div>
      <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm)')}>
        <div style={css('display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:0;padding:12px 20px;background:var(--cream);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-500)')}>
          <div>Project Manager</div><div style={css('text-align:center')}>Clienti</div><div style={css('text-align:center')}>Scoperti &gt;30gg</div><div style={css('text-align:center')}>Alert non gestiti</div>
        </div>
        {c.copertura.map((p, i) => (
          <div key={i} style={css('display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:0;padding:14px 20px;border-top:1px solid var(--ink-200);align-items:center')}>
            <div style={css('display:flex;align-items:center;gap:11px')}>
              <span style={css('width:30px;height:30px;border-radius:999px;background:var(--lilac-300);color:var(--plum-900);font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center')}>{p.iniz}</span>
              <span style={css('font-weight:700;font-size:14px')}>{p.nome}</span>
            </div>
            <div style={css('text-align:center;font-weight:700;font-size:15px')}>{p.tot}</div>
            <div className={p.scopertiCls} style={css('text-align:center;font-weight:700;font-size:15px')}>{p.scoperti}</div>
            <div className={p.alertCls} style={css('text-align:center;font-weight:700;font-size:15px')}>{p.alertNonGestiti}</div>
          </div>
        ))}
      </div>
    </>
  );
}
