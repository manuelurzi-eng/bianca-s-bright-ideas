import { css } from '../lib/css.js';
import KpiRow from './KpiRow.jsx';
import { btnPrimary, btnGhost, btnDanger } from './shared.js';

export default function Prospect({ view, readOnly }) {
  return (
    <>
      <KpiRow items={view.kpi} />
      <div style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:start')}>
        {view.columns.map((col) => (
          <div key={col.key} style={css('background:rgba(43,26,46,.04);border:1px solid var(--ink-200);border-radius:16px;padding:14px')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;padding:4px 6px 12px')}>
              <div style={css('display:flex;align-items:center;gap:9px')}>
                <span className={col.dotCls} style={css('width:9px;height:9px;border-radius:999px')} />
                <span style={css('font-weight:700;font-size:14px')}>{col.label}</span>
              </div>
              <span style={css('min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:var(--plum-900);color:#fff;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center')}>{col.count}</span>
            </div>
            <div style={css('display:flex;flex-direction:column;gap:12px')}>
              {col.cards.map((p) => (
                <div key={p.id} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:13px;padding:14px;box-shadow:var(--shadow-sm)')}>
                  <div style={css('font-weight:700;font-size:14px')}>{p.nome}</div>
                  <div style={css('font-size:11px;color:var(--ink-500);margin:2px 0 8px')}>{p.azienda} · {p.fonteLabel}</div>
                  <div style={css('display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px')}>
                    <span>Valore</span><b style={css('color:var(--indigo-700)')}>{p.valoreFmt}</b>
                  </div>
                  <div style={css('font-size:11px;color:var(--ink-700);margin-bottom:4px')}>{p.prossimoStep || '—'} · {p.prossimoStepFmt}</div>
                  <div style={css('font-size:11px;color:var(--ink-500);margin-bottom:8px')}>Owner {p.ownerNome} · fermo da {p.fermoDaGiorni} gg{p.candidatoStallo ? ' ⚠' : ''}</div>
                  {!readOnly ? (
                    <div style={css('display:flex;gap:6px;flex-wrap:wrap')}>
                      <button onClick={p.onAvanza} style={btnPrimary}>Avanza</button>
                      <button onClick={p.onVinto} style={btnGhost}>Vinto</button>
                      <button onClick={p.onPerso} style={btnGhost}>Perso</button>
                      <button onClick={p.onStallo} style={btnDanger}>In stallo</button>
                    </div>
                  ) : null}
                </div>
              ))}
              {col.empty ? <div style={css('padding:20px;text-align:center;color:var(--ink-400);font-size:12px;font-weight:600')}>Nessun prospect</div> : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
