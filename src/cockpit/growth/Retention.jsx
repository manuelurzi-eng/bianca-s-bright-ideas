import { css } from '../lib/css.js';
import KpiRow from './KpiRow.jsx';
import { btnPrimary, btnGhost, btnDanger, emptyStyle } from './shared.js';

export default function Retention({ view, readOnly }) {
  return (
    <>
      <KpiRow items={view.kpi} />

      <div style={css('font-size:13px;font-weight:700;color:var(--plum-900);margin:4px 0 10px')}>Clienti non rinnovati</div>
      <div style={css('display:flex;flex-direction:column;gap:10px;margin-bottom:26px')}>
        {view.churnRows.map((w) => (
          <div key={w.id} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm)')}>
            <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap')}>
              <div>
                <div style={css('font-weight:700;font-size:15px')}>{w.clienteNome} <span style={css('font-weight:500;color:var(--ink-500)')}>· {w.settore}</span></div>
                <div style={css('font-size:12px;color:var(--ink-500);margin-top:2px')}>Churn il {w.dataChurnFmt} · valore perso {w.valorePerso}</div>
              </div>
              <span style={css('font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700);white-space:nowrap')}>{w.statoLabel}</span>
            </div>
            {w.motivo ? <div style={css('font-size:12px;color:var(--ink-700);font-style:italic;margin:8px 0')}>"{w.motivo}"</div> : null}
            <div style={css('font-size:12px;color:var(--ink-700);margin-bottom:8px')}>
              Owner {w.owner} · tentativi {w.tentativi} · prossimo rilavoro <b className={w.scaduto ? 't-bad' : ''}>{w.dataRilavoroFmt}{w.scaduto ? ' · scaduto' : ''}</b>
            </div>
            {!readOnly ? (
              <div style={css('display:flex;gap:8px;flex-wrap:wrap')}>
                <button onClick={w.onProgramma} style={btnPrimary}>Programma rilavoro</button>
                <button onClick={w.onAvvia} style={btnGhost}>Avvia tentativo</button>
                <button onClick={w.onAbbandona} style={btnDanger}>Abbandona</button>
              </div>
            ) : null}
          </div>
        ))}
        {view.churnEmpty ? <div style={emptyStyle}>Nessun cliente non rinnovato in lavorazione.</div> : null}
      </div>

      <div style={css('font-size:13px;font-weight:700;color:var(--plum-900);margin:4px 0 10px')}>Prospect da riattivare</div>
      <div style={css('display:flex;flex-direction:column;gap:10px')}>
        {view.stalloRows.map((p) => (
          <div key={p.id} style={css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm)')}>
            <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap')}>
              <div>
                <div style={css('font-weight:700;font-size:15px')}>{p.nome} <span style={css('font-weight:500;color:var(--ink-500)')}>· {p.azienda}</span></div>
                <div style={css('font-size:12px;color:var(--ink-500);margin-top:2px')}>{p.valoreFmt} · owner {p.ownerNome} · ultimo contatto {p.ultimoContattoFmt}</div>
              </div>
              {p.scaduto ? <span style={css('font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(130,15,70,.1);color:var(--burgundy-700);white-space:nowrap')}>Rilavoro da fare</span> : null}
            </div>
            <div style={css('font-size:12px;color:var(--ink-700);font-style:italic;margin:8px 0')}>"{p.motivoStallo}"</div>
            <div style={css('font-size:12px;color:var(--ink-700);margin-bottom:8px')}>Prossimo rilavoro: <b className={p.scaduto ? 't-bad' : ''}>{p.dataRilavoroFmt}</b></div>
            {!readOnly ? (
              <div style={css('display:flex;gap:8px;flex-wrap:wrap')}>
                <button onClick={p.onRiattiva} style={btnPrimary}>Torna in pipeline</button>
                <button onClick={p.onRimanda} style={btnGhost}>Rimanda 60gg</button>
                <button onClick={p.onAbbandona} style={btnDanger}>Abbandona definitivamente</button>
              </div>
            ) : null}
          </div>
        ))}
        {view.stalloEmpty ? <div style={emptyStyle}>Nessun prospect in stallo.</div> : null}
      </div>
    </>
  );
}
