import { css } from '../lib/css.js';
import KpiRow from './KpiRow.jsx';
import { btnPrimary, btnGhost, emptyStyle } from './shared.js';

export default function Organico({ view, readOnly }) {
  return (
    <>
      <KpiRow items={view.kpi} />
      <div style={css('display:flex;flex-direction:column;gap:10px')}>
        {view.rows.map((l) => (
          <div key={l.id} style={{ ...css('background:#fff;border:1px solid var(--ink-200);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm)'), opacity: l.chiuso ? 0.6 : 1 }}>
            <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap')}>
              <div>
                <div style={css('font-weight:700;font-size:15px')}>{l.nome} <span style={css('font-weight:500;color:var(--ink-500)')}>· {l.azienda}</span></div>
                <div style={css('font-size:12px;color:var(--ink-500);margin-top:2px')}>{l.canaleLabel} · ricevuto da {l.ricevutoDaNome}</div>
              </div>
              <span style={css('font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--lilac-200);color:var(--indigo-700);white-space:nowrap')}>{l.statoLabel}</span>
            </div>
            <div style={css('display:flex;align-items:center;gap:18px;margin:10px 0;font-size:12px;color:var(--ink-700);flex-wrap:wrap')}>
              <span>Arrivato: <b>{l.arrivoFmt}</b></span>
              <span className={l.attesa && l.giorniAttesa > 1 ? 't-bad' : ''}>Prima risposta: <b>{l.rispostaFmt}</b>{l.attesa ? ' · in attesa da ' + l.giorniAttesa + ' gg' : ''}</span>
            </div>
            {l.note ? <div style={css('font-size:12px;color:var(--ink-700);font-style:italic;margin-bottom:8px')}>{l.note}</div> : null}
            {!readOnly && !l.chiuso ? (
              <div style={css('display:flex;gap:8px;flex-wrap:wrap')}>
                <button onClick={l.onContattato} style={btnGhost}>Segna contattato</button>
                <button onClick={l.onQualifica} style={btnPrimary}>Promuovi a Prospect</button>
                <button onClick={l.onScarta} style={btnGhost}>Scarta</button>
              </div>
            ) : null}
          </div>
        ))}
        {view.empty ? <div style={emptyStyle}>Nessun lead organico.</div> : null}
      </div>
    </>
  );
}
