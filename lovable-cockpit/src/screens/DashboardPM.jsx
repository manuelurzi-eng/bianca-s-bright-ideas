import { css } from '../lib/css.js';

// Dashboard PM: "La mia giornata" (3 blocchi azionabili) + portafoglio a tab.
export default function DashboardPM({ vals }) {
  const { me, dash } = vals;
  return (
    <>
      <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:22px')}>
        <div>
          <div style={css('font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}>La mia dashboard</div>
          <h1 style={css('margin:0;font-weight:600;font-size:30px;letter-spacing:-.015em')}>Ciao {me.nome}, ecco dove agire oggi</h1>
        </div>
        <div style={css('display:flex;gap:10px')}>
          {dash.kpi.map((k, i) => (
            <div key={i} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:12px;padding:12px 18px;min-width:96px;box-shadow:var(--shadow-sm)')}>
              <div style={css('font-weight:700;font-size:24px;letter-spacing:-.02em')}>{k.n}</div>
              <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={css('background:var(--plum-900);color:var(--on-dark-1);border-radius:16px;padding:20px 22px;margin-bottom:24px;box-shadow:var(--shadow-md)')}>
        <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:16px')}>
          <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lilac-400)')}><i className="fa-solid fa-bolt" /> La mia giornata</div>
          <button onClick={dash.goAlert} style={css('border:0;background:none;color:var(--on-dark-2);font-weight:600;font-size:12px;cursor:pointer')}>Vedi tutti gli alert <i className="fa-solid fa-arrow-right" style={css('font-size:10px')} /></button>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start')}>

          <div>
            <div style={css('display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#fff;margin-bottom:10px')}><i className="fa-solid fa-phone-volume" style={css('color:#e9a1bf')} /> Da chiamare oggi</div>
            <div style={css('display:flex;flex-direction:column;gap:8px')}>
              {dash.daChiamare.map((g, i) => (
                <button key={i} onClick={g.onOpen} style={css('display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;background:var(--plum-700);border:0;border-radius:11px;padding:11px 13px;cursor:pointer;color:inherit;font-family:var(--font-display)')}>
                  <span style={css('display:flex;align-items:center;gap:9px;width:100%')}>
                    <span className={g.chipCls} style={css('flex-shrink:0;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px')}><i className={g.icon} /></span>
                    <span style={css('flex:1;font-weight:700;font-size:13px')}>{g.clientNome}</span>
                  </span>
                  <span style={css('font-size:12px;color:var(--on-dark-2);line-height:1.35')}>{g.perche}</span>
                </button>
              ))}
              {dash.daChiamareEmpty ? <div style={css('color:var(--on-dark-3);font-size:12px;padding:4px 0')}>Nessuno da chiamare oggi.</div> : null}
            </div>
          </div>

          <div>
            <div style={css('display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#fff;margin-bottom:10px')}><i className="fa-solid fa-hourglass-half" style={css('color:var(--lilac-400)')} /> Scadenze</div>
            <div style={css('display:flex;flex-direction:column;gap:8px')}>
              {dash.scadenze.map((s, i) => (
                <button key={i} onClick={s.onOpen} style={css('display:flex;flex-direction:column;gap:7px;width:100%;text-align:left;background:var(--plum-700);border:0;border-radius:11px;padding:11px 13px;cursor:pointer;color:inherit;font-family:var(--font-display)')}>
                  <span style={css('display:flex;align-items:center;justify-content:space-between;gap:9px;width:100%')}>
                    <span style={css('font-weight:700;font-size:13px')}>{s.nome}</span>
                    <span style={css('font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;background:rgba(180,143,242,.2);color:var(--lilac-400)')}>{s.cd}</span>
                  </span>
                  <span style={css('display:flex;align-items:center;gap:14px;width:100%')}>
                    <span style={css('display:flex;align-items:center;gap:6px;font-size:11px;color:var(--on-dark-2)')}><span className={s.chkCls} style={css('width:8px;height:8px;border-radius:999px;flex-shrink:0')} />{s.chk}</span>
                    <span style={css('display:flex;align-items:center;gap:6px;font-size:11px;color:var(--on-dark-2)')}><span className={s.rinCls} style={css('width:8px;height:8px;border-radius:999px;flex-shrink:0')} />{s.rin}</span>
                  </span>
                </button>
              ))}
              {dash.scadenzeEmpty ? <div style={css('color:var(--on-dark-3);font-size:12px;padding:4px 0')}>Nessuna scadenza entro 90gg.</div> : null}
            </div>
          </div>

          <div>
            <div style={css('display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#fff;margin-bottom:10px')}><i className="fa-solid fa-list-check" style={css('color:var(--accent-yellow)')} /> Dati mancanti / step</div>
            <div style={css('display:flex;flex-direction:column;gap:8px')}>
              {dash.datiMancanti.map((g, i) => (
                <button key={i} onClick={g.onOpen} style={css('display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;background:var(--plum-700);border:0;border-radius:11px;padding:11px 13px;cursor:pointer;color:inherit;font-family:var(--font-display)')}>
                  <span style={css('display:flex;align-items:center;gap:9px;width:100%')}>
                    <span className={g.chipCls} style={css('flex-shrink:0;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px')}><i className={g.icon} /></span>
                    <span style={css('flex:1;font-weight:700;font-size:13px')}>{g.titolo}</span>
                  </span>
                  <span style={css('font-size:12px;color:var(--on-dark-2);line-height:1.35')}>{g.clientNome} · {g.perche}</span>
                </button>
              ))}
              {dash.datiMancantiEmpty ? <div style={css('color:var(--on-dark-3);font-size:12px;padding:4px 0')}>Tutti gli step sono a posto.</div> : null}
            </div>
          </div>

        </div>
        {dash.giornataEmpty ? <div style={css('color:var(--on-dark-3);font-size:13px;padding:6px 0')}>Nessun alert aperto. Giornata libera.</div> : null}
      </div>

      <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:12px')}>Il mio portafoglio</div>
      <div style={css('display:flex;gap:9px;margin-bottom:16px;flex-wrap:wrap')}>
        {dash.tabs.map((t, i) => (
          <button key={i} onClick={t.onClick} className={t.cls} style={css('display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 16px;border:0;border-radius:999px;cursor:pointer;font-family:var(--font-display);font-weight:600;font-size:13px;transition:.15s var(--ease)')}>{t.label} <span className={t.countCls} style={css('min-width:20px;height:20px;padding:0 6px;border-radius:999px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center')}>{t.count}</span></button>
        ))}
      </div>

      <div style={css('display:flex;flex-direction:column;gap:10px')}>
        {dash.rows.map((r) => (
          <div key={r.id} style={css('display:flex;align-items:center;gap:18px;background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:15px 18px;box-shadow:var(--shadow-sm)')}>
            <div style={css('display:flex;align-items:center;gap:11px;width:200px;flex-shrink:0')}>
              <span className={r.statusCls} style={css('width:9px;height:9px;border-radius:999px;flex-shrink:0')} />
              <div style={css('min-width:0')}>
                <button onClick={r.onOpen} style={css('border:0;background:none;padding:0;font-family:var(--font-display);font-weight:700;font-size:15px;color:var(--plum-900);cursor:pointer;display:block')}>{r.nome}</button>
                <div style={css('font-size:11px;color:var(--ink-500)')}>{r.settore}</div>
              </div>
            </div>

            {r.isScadenza ? (
              <div style={css('width:96px;flex-shrink:0')}>
                <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>scade tra</div>
                <div className={r.cdCls} style={css('font-weight:700;font-size:15px')}>{r.cd}</div>
              </div>
            ) : null}

            <div style={css('flex:1;display:flex;gap:22px;min-width:0')}>
              <div style={css('display:flex;align-items:center;gap:8px;min-width:0')}>
                <span className={r.chkCls} style={css('width:8px;height:8px;border-radius:999px;flex-shrink:0')} />
                <div style={css('min-width:0')}>
                  <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>Ultima checkpoint</div>
                  <div style={css('font-size:13px;font-weight:600;color:var(--plum-900);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.chk}</div>
                </div>
              </div>
              <div style={css('display:flex;align-items:center;gap:8px;min-width:0')}>
                <span className={r.rinCls} style={css('width:8px;height:8px;border-radius:999px;flex-shrink:0')} />
                <div style={css('min-width:0')}>
                  <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>Rinnovo</div>
                  <div style={css('font-size:13px;font-weight:600;color:var(--plum-900);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{r.rin}</div>
                </div>
              </div>
            </div>

            <div style={css('display:flex;align-items:center;gap:7px;flex-shrink:0')}>
              <button onClick={r.onContact} title="Segna contatto oggi" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-solid fa-phone" /></button>
              <button onClick={r.onCheckpoint} title="Fissa prossima checkpoint" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-solid fa-calendar-plus" /></button>
              {r.showRinnovoBtn ? (
                <button onClick={r.onRinnovo} title="Apri rinnovo" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-solid fa-arrows-rotate" /></button>
              ) : null}
              <button onClick={r.onOpen} style={css('height:34px;padding:0 14px;border:0;border-radius:999px;background:var(--indigo-700);color:#fff;font-weight:600;font-size:13px;cursor:pointer')}>Scheda</button>
            </div>
          </div>
        ))}
        {dash.empty ? (
          <div style={css('padding:40px;text-align:center;color:var(--ink-500);background:#fff;border:1px solid var(--ink-200);border-radius:14px;font-weight:600')}>Nessun cliente in questo segmento.</div>
        ) : null}
      </div>
    </>
  );
}
