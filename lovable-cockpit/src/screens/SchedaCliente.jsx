import { Fragment } from 'react';
import { css } from '../lib/css.js';

// Scheda Cliente: header + timeline 5 fasi + "perché ha iniziato" + alert +
// colonna operativa (intervista/strategia/contatto/checkpoint/rinnovo/note) + risultati.
export default function SchedaCliente({ vals }) {
  const s = vals.scheda;
  if (!s) return null;
  return (
    <>
      <button onClick={s.backToDash} style={css('display:inline-flex;align-items:center;gap:7px;border:0;background:none;color:var(--ink-500);font-weight:600;font-size:13px;cursor:pointer;margin-bottom:14px;padding:0')}><i className="fa-solid fa-arrow-left" /> Torna alla dashboard</button>

      {/* HEADER */}
      <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:16px;padding:22px 26px;box-shadow:var(--shadow-sm);margin-bottom:18px')}>
        <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap')}>
          <div>
            <div style={css('display:flex;align-items:center;gap:12px;flex-wrap:wrap')}>
              <h1 style={css('margin:0;font-weight:700;font-size:30px;letter-spacing:-.02em')}>{s.nome}</h1>
              <span className={s.tipoCls} style={css('font-size:12px;font-weight:700;padding:3px 11px;border-radius:999px')}>{s.tipoLabel}</span>
              <span className={s.statusCls} style={css('display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;padding:5px 13px;border-radius:999px')}><span className={s.statusDotCls} style={css('width:8px;height:8px;border-radius:999px')} />{s.statusLabel}</span>
            </div>
            <div style={css('display:flex;align-items:center;gap:16px;margin-top:8px;font-size:13px;color:var(--ink-700);font-weight:600')}>
              <span><i className="fa-solid fa-rocket" style={css('color:var(--ink-400);margin-right:6px')} />{s.startup}</span>
              <span><i className="fa-solid fa-layer-group" style={css('color:var(--ink-400);margin-right:6px')} />{s.settore}</span>
              <span><i className="fa-solid fa-user" style={css('color:var(--ink-400);margin-right:6px')} />PM {s.pmNome}</span>
            </div>
          </div>
          <div style={css('text-align:right')}>
            <div className={s.fineCls} style={css('font-weight:700;font-size:15px')}>{s.fineLabel}</div>
            <div style={css('font-size:12px;color:var(--ink-500);margin-top:3px')}>contratto {s.inizioFmt} → {s.fineFmt}</div>
            <button onClick={s.onFreeze} style={css('margin-top:11px;display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 13px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);font-weight:600;font-size:12px;font-family:var(--font-display);cursor:pointer')}><i className={s.freezeIcon} /> {s.freezeLabel}</button>
          </div>
        </div>
        {s.bloccato ? (
          <div style={css('margin-top:14px;display:flex;align-items:flex-start;gap:10px;background:rgba(130,15,70,.07);border:1px solid rgba(130,15,70,.25);border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;color:var(--burgundy-700)')}><i className="fa-solid fa-snowflake" style={css('margin-top:2px')} /><span>Cliente in freeze · gli alert di contatto sono in pausa. Riattivazione prevista {s.riattivazioneFmt}.{s.motivoFreeze ? <span style={css('display:block;font-weight:600;color:var(--ink-700);margin-top:2px')}>Motivo: {s.motivoFreeze}</span> : null}</span></div>
        ) : null}
      </div>

      {/* TIMELINE */}
      <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:16px;padding:22px 26px 20px;box-shadow:var(--shadow-sm);margin-bottom:18px')}>
        <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:18px')}>Il percorso del cliente</div>
        <div style={css('display:flex;align-items:flex-start')}>
          {s.timeline.map((step, i) => (
            <Fragment key={i}>
              <div style={css('display:flex;flex-direction:column;align-items:center;text-align:center;width:19%;flex-shrink:0')}>
                <div className={step.dotCls} style={css('flex-shrink:0;width:32px;height:32px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff')}><i className={step.icon} /></div>
                <div style={css('font-weight:700;font-size:13px;margin-top:9px;line-height:1.2')}>{step.label}</div>
                <div style={css('font-size:11px;color:var(--ink-500);margin-top:2px')}>{step.txt}</div>
              </div>
              {step.connShow ? <div className={step.connCls} style={css('flex:1;height:3px;border-radius:2px;margin-top:15px')} /> : null}
            </Fragment>
          ))}
        </div>
      </div>

      {/* PERCHÉ HA INIZIATO */}
      {s.hasForm ? (
        <div style={css('background:var(--plum-900);color:var(--on-dark-1);border-radius:16px;padding:22px 26px;box-shadow:var(--shadow-md);margin-bottom:18px')}>
          <div style={css('display:grid;grid-template-columns:1.5fr 1fr;gap:26px;align-items:center')}>
            <div>
              <div style={css('font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lilac-400);margin-bottom:10px')}><i className="fa-solid fa-star" /> Perché ha iniziato</div>
              <div style={css('font-family:var(--font-text);font-size:19px;font-weight:600;line-height:1.35;letter-spacing:-.01em')}>“{s.sogno}”</div>
              <div style={css('display:flex;flex-wrap:wrap;gap:8px;margin-top:14px')}>
                {s.obiettivi.map((o, i) => (
                  <span key={i} style={css('display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;background:var(--plum-700);color:var(--on-dark-1)')}><i className="fa-solid fa-bullseye" style={css('color:var(--lilac-400);font-size:10px')} />{o.txt}</span>
                ))}
              </div>
            </div>
            <div style={css('border-left:1px solid var(--line-dark);padding-left:24px')}>
              <div style={css('font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--on-dark-3);margin-bottom:12px')}>Sei in linea?</div>
              <div style={css('display:flex;gap:22px;margin-bottom:14px')}>
                <div><div style={css('font-weight:700;font-size:22px;letter-spacing:-.02em')}>{s.tier1Label}</div><div style={css('font-size:11px;color:var(--on-dark-3)')}>Tier 1 / accordo</div></div>
                <div><div style={css('font-weight:700;font-size:22px;letter-spacing:-.02em')}>{s.pubTot}</div><div style={css('font-size:11px;color:var(--on-dark-3)')}>pubblicazioni</div></div>
                <div><div style={css('font-weight:700;font-size:22px;letter-spacing:-.02em')}>{s.aveTot}</div><div style={css('font-size:11px;color:var(--on-dark-3)')}>AVE</div></div>
              </div>
              <span className={s.verdCls} style={css('display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;padding:7px 15px;border-radius:999px')}><i className={s.verdIcon} />{s.verdetto}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* DA FARE ADESSO */}
      {s.hasClientAlerts ? (
        <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:16px;padding:20px 22px;box-shadow:var(--shadow-sm);margin-bottom:18px')}>
          <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--burgundy-700);margin-bottom:14px')}><i className="fa-solid fa-circle-exclamation" /> Da fare adesso</div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            {s.clientAlerts.map((a, i) => (
              <div key={i} style={css('position:relative;display:flex;align-items:center;gap:13px;background:var(--cream);border:1px solid var(--ink-200);border-radius:11px;padding:12px 14px 12px 18px')}>
                <span className={a.stripeCls} style={css('position:absolute;left:0;top:0;bottom:0;width:4px')} />
                <span className={a.chipCls} style={css('flex-shrink:0;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px')}><i className={a.icon} /></span>
                <span style={css('flex:1;min-width:0')}>
                  <span style={css('display:block;font-weight:700;font-size:14px;color:var(--plum-900)')}>{a.titolo}</span>
                  <span style={css('display:block;font-size:12px;color:var(--ink-500)')}>{a.dettaglio}</span>
                </span>
                <button onClick={a.onResolve} title="Segna risolto" style={css('width:32px;height:32px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer;flex-shrink:0')}><i className="fa-solid fa-check" /></button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* GRID main + risultati */}
      <div style={css('display:grid;grid-template-columns:1.55fr 1fr;gap:18px;align-items:start')}>

        {/* LEFT */}
        <div style={css('display:flex;flex-direction:column;gap:18px')}>

          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
            <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm)')}>
              <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:14px')}>Intervista</div>
              <label style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}>Data intervista</label>
              <input type="date" value={s.dataIntervistaVal} onChange={s.onIntervista} style={css('display:block;width:100%;box-sizing:border-box;margin:5px 0 14px;height:38px;border:1px solid var(--ink-300);border-radius:10px;padding:0 12px;font-size:14px;color:var(--plum-900);background:var(--cream)')} />
              <div style={css('display:flex;align-items:center;gap:14px')}>
                <a href="#" style={css('display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--indigo-700);text-decoration:none')}><i className="fa-solid fa-circle-play" /> Bluedot</a>
                <span style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}>·</span>
                <span style={css('font-size:12px;font-weight:600;color:var(--green-400)')}><i className="fa-solid fa-envelope-circle-check" /> {s.recapLabel}</span>
              </div>
            </div>
            <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm)')}>
              <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:14px')}>Strategia</div>
              <label style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}>Data invio strategia</label>
              <input type="date" value={s.dataStrategiaVal} onChange={s.onStrategia} style={css('display:block;width:100%;box-sizing:border-box;margin:5px 0 14px;height:38px;border:1px solid var(--ink-300);border-radius:10px;padding:0 12px;font-size:14px;color:var(--plum-900);background:var(--cream)')} />
              <a href="#" style={css('display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--indigo-700);text-decoration:none')}><i className="fa-solid fa-paperclip" /> Strategia semestrale.pdf</a>
            </div>
          </div>

          {/* Contatto */}
          <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:20px;box-shadow:var(--shadow-sm)')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:14px')}>
              <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700)')}>Contatto continuo</div>
              <span style={css('font-size:12px;color:var(--ink-500);font-weight:600')}>prossimo reminder {s.reminderFmt}</span>
            </div>
            <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap')}>
              <div>
                <div style={css('font-size:12px;color:var(--ink-500);font-weight:600;margin-bottom:2px')}>Ultimo contatto</div>
                <div className={s.contattoCls} style={css('font-weight:700;font-size:22px')}>{s.ultimoLabel}</div>
              </div>
              <div style={css('display:flex;align-items:center;gap:8px')}>
                <span style={css('font-size:12px;color:var(--ink-500);font-weight:600')}>Segna contatto oggi:</span>
                <button onClick={s.onMarkCall} title="Call" style={css('display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 13px;border:0;border-radius:999px;background:var(--indigo-700);color:#fff;font-weight:600;font-size:13px;cursor:pointer')}><i className="fa-solid fa-phone" /> Call</button>
                <button onClick={s.onMarkMail} title="Mail" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-solid fa-envelope" /></button>
                <button onClick={s.onMarkWa} title="WhatsApp" style={css('width:34px;height:34px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);cursor:pointer')}><i className="fa-brands fa-whatsapp" /></button>
              </div>
            </div>
            {s.hasChiama ? (
              <div style={css('margin-top:14px;background:rgba(130,15,70,.06);border:1px solid rgba(130,15,70,.28);border-radius:10px;padding:12px 14px')}>
                <div style={css('font-size:12px;font-weight:700;color:var(--burgundy-700);letter-spacing:.04em')}><i className="fa-solid fa-phone-volume" /> CHIAMA · Tier 1 ottenute dopo l'ultimo contatto</div>
                {s.tier1flags.map((t, i) => (
                  <div key={i} style={css('font-size:13px;color:var(--plum-900);font-weight:600;margin-top:5px')}>{t.testata} <span style={css('color:var(--ink-500);font-weight:600')}>· {t.dataFmt}</span></div>
                ))}
              </div>
            ) : null}
            {s.hasDiario ? (
              <div style={css('margin-top:16px;border-top:1px solid var(--ink-200);padding-top:14px')}>
                <div style={css('font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-500);margin-bottom:10px')}>Diario contatti</div>
                <div style={css('display:flex;flex-direction:column;gap:10px')}>
                  {s.diario.map((d, i) => (
                    <div key={i} style={css('display:flex;align-items:flex-start;gap:11px')}>
                      <span style={css('flex-shrink:0;width:26px;height:26px;border-radius:8px;background:var(--lilac-100);color:var(--indigo-700);display:flex;align-items:center;justify-content:center;font-size:12px')}><i className={d.icon} /></span>
                      <div style={css('min-width:0')}>
                        <div style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>{d.dataFmt} · {d.tipo}</div>
                        <div style={css('font-size:13px;color:var(--plum-900);line-height:1.4')}>{d.testo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Checkpoint */}
          <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:20px;box-shadow:var(--shadow-sm)')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:14px')}>
              <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700)')}>Cosa ci siamo detti</div>
              <span style={css('font-size:11px;color:var(--ink-500);font-weight:600')}>cadenza derivata dalla durata</span>
            </div>
            <label style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}>Prossima checkpoint</label>
            <input type="date" value={s.prossimaCheckVal} onChange={s.onProssimaCheck} style={css('display:block;width:220px;max-width:100%;box-sizing:border-box;margin:5px 0 16px;height:38px;border:1px solid var(--ink-300);border-radius:10px;padding:0 12px;font-size:14px;color:var(--plum-900);background:var(--cream)')} />
            {s.hasCadenza ? (
              <div style={css('display:flex;flex-direction:column;border-top:1px solid var(--ink-200);padding-top:6px')}>
                {s.cpDone.map((k, i) => (
                  <div key={'d' + i} style={css('display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--ink-200)')}>
                    <div style={css('display:flex;align-items:center;gap:10px;min-width:0')}>
                      <span style={css('flex-shrink:0;width:9px;height:9px;border-radius:999px;background:var(--green-400)')} />
                      <span style={css('font-size:13px;font-weight:700;color:var(--plum-900)')}>{k.tipo}</span>
                      <span style={css('font-size:12px;color:var(--ink-500)')}>{k.dataFmt}</span>
                      {k.apreRinnovo ? <span style={css('font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700)')}>apre il rinnovo</span> : null}
                    </div>
                    <div style={css('display:flex;align-items:center;gap:12px')}>
                      <a href="#" style={css('font-size:12px;font-weight:600;color:var(--indigo-700);text-decoration:none')}><i className="fa-solid fa-circle-play" /> Bluedot</a>
                      {k.hasTranscript ? <span style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}><i className="fa-solid fa-file-lines" /> transcript</span> : null}
                    </div>
                  </div>
                ))}
                {s.cpFuturi.map((k, i) => (
                  <div key={'f' + i} style={css('display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--ink-200)')}>
                    <div style={css('display:flex;align-items:center;gap:10px;min-width:0')}>
                      <span style={css('flex-shrink:0;width:9px;height:9px;border-radius:999px;border:2px solid var(--ink-300);box-sizing:border-box')} />
                      <span style={css('font-size:13px;font-weight:700;color:var(--ink-500)')}>{k.tipo}</span>
                      {k.apreRinnovo ? <span style={css('font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700)')}>apre il rinnovo</span> : null}
                    </div>
                    <span style={css('font-size:12px;font-weight:600;color:var(--ink-400)')}>da fissare · suggerita {k.dataFmt}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {s.hasAi ? (
              <div style={css('margin-top:14px;background:var(--lilac-100);border:1px solid var(--lilac-200);border-radius:10px;padding:14px 16px')}>
                <div style={css('font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:6px')}><i className="fa-solid fa-wand-magic-sparkles" /> Sintesi AI dei transcript</div>
                <div style={css('font-family:var(--font-text);font-size:13px;line-height:1.5;color:var(--plum-900)')}>{s.aiSummary}</div>
              </div>
            ) : null}
          </div>

          {/* Verso il rinnovo */}
          <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:20px;box-shadow:var(--shadow-sm)')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:14px')}>
              <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700)')}>Verso il rinnovo</div>
              <span style={css('font-size:12px;color:var(--ink-500);font-weight:600')}>data per rinnovo · {s.dataPerRinnovoFmt}</span>
            </div>
            <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
              <div>
                <label style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}>Proposto rinnovo</label>
                <select value={s.propostoVal} onChange={s.onProposto} style={css('display:block;width:100%;box-sizing:border-box;margin-top:5px;height:38px;border:1px solid var(--ink-300);border-radius:10px;padding:0 10px;font-size:14px;font-weight:600;font-family:var(--font-display);background:var(--cream);color:var(--plum-900);cursor:pointer')}>
                  {s.rinnovoOpts.map((o, i) => <option key={i} value={o.v}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label style={css('font-size:12px;font-weight:600;color:var(--ink-500)')}>Referente rinnovo</label>
                <select value={s.referenteVal} onChange={s.onReferente} style={css('display:block;width:100%;box-sizing:border-box;margin-top:5px;height:38px;border:1px solid var(--ink-300);border-radius:10px;padding:0 10px;font-size:14px;font-weight:600;font-family:var(--font-display);background:var(--cream);color:var(--plum-900);cursor:pointer')}>
                  {s.refOpts.map((o, i) => <option key={i} value={o.v}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div style={css('display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px')}>
              <i className="fa-solid fa-diagram-project" style={css('color:var(--ink-400)')} />
              <span style={css('color:var(--ink-700);font-weight:600')}>Gestione rinnovi: {s.gestioneRinnovi}</span>
            </div>
          </div>

          {/* Note */}
          <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:20px;box-shadow:var(--shadow-sm)')}>
            <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:12px')}>Note & update</div>
            <textarea defaultValue={s.noteVal} onBlur={s.onNoteBlur} rows={3} style={css('width:100%;box-sizing:border-box;border:1px solid var(--ink-300);border-radius:10px;padding:12px;font-size:14px;line-height:1.5;color:var(--plum-900);background:var(--cream);resize:vertical;font-family:var(--font-text)')} />
          </div>
        </div>

        {/* RIGHT · Risultati */}
        <div style={css('display:flex;flex-direction:column;gap:18px')}>
          <div style={css('background:var(--plum-900);color:var(--on-dark-1);border-radius:16px;padding:20px;box-shadow:var(--shadow-md)')}>
            <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lilac-400);margin-bottom:16px')}>Risultati <span style={css('color:var(--on-dark-3);font-weight:600;text-transform:none;letter-spacing:0')}>· sola lettura</span></div>
            <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px')}>
              <div><div style={css('font-weight:700;font-size:26px;letter-spacing:-.02em')}>{s.pubTot}</div><div style={css('font-size:12px;color:var(--on-dark-3)')}>pubblicazioni</div></div>
              <div><div style={css('font-weight:700;font-size:26px;letter-spacing:-.02em')}>{s.aveTot}</div><div style={css('font-size:12px;color:var(--on-dark-3)')}>AVE totale</div></div>
            </div>
            <div style={css('margin-bottom:6px;display:flex;align-items:center;justify-content:space-between')}>
              <span style={css('font-size:12px;color:var(--on-dark-2);font-weight:600')}>Tier 1 vs accordo</span>
              <span style={css('font-size:13px;font-weight:700')}>{s.tier1Label}</span>
            </div>
            <div style={css('height:8px;border-radius:999px;background:var(--plum-700);overflow:hidden')}><svg className={s.tierBarCls} width={s.tierPct + '%'} height="100%" style={css('display:block;border-radius:999px;max-width:100%')} /></div>
            {s.tierUnder ? <div style={css('font-size:12px;font-weight:600;color:#e9a1bf;margin-top:8px')}><i className="fa-solid fa-triangle-exclamation" /> Sotto l'accordo</div> : null}
            <div style={css('font-size:12px;color:var(--on-dark-3);margin-top:14px')}>AVE media mensile · <b style={css('color:var(--on-dark-1)')}>{s.aveMens}</b></div>
          </div>

          <div style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm)')}>
            <div style={css('font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--indigo-700);margin-bottom:12px')}>Pubblicazioni</div>
            {s.pubb.map((p, i) => (
              <div key={i} style={css('display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--ink-200)')}>
                <div style={css('display:flex;align-items:center;gap:9px;min-width:0')}>
                  <span className={p.tierCls} style={css('font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px')}>{p.tier}</span>
                  <span style={css('font-size:13px;font-weight:600;color:var(--plum-900);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{p.testata}</span>
                </div>
                <div style={css('display:flex;align-items:center;gap:12px;flex-shrink:0')}>
                  <span style={css('font-size:12px;color:var(--ink-500)')}>{p.dataFmt}</span>
                  <a href="#" style={css('font-size:12px;color:var(--indigo-700)')}><i className="fa-solid fa-arrow-up-right-from-square" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
