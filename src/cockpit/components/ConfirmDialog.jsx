import { css } from '../lib/css.js';

// Conferma per le scritture su campi TRIGGER (T) di Airtable: quei campi fanno
// scattare automazioni (es. "Invia il CS al cliente"). Mai persistere senza ok.
export default function ConfirmDialog({ confirm, onCancel }) {
  if (!confirm) return null;
  return (
    <div style={css('position:fixed;inset:0;z-index:130;background:rgba(43,26,46,.55);display:flex;align-items:center;justify-content:center;padding:40px')}>
      <div style={css('width:100%;max-width:420px;background:#fff;border-radius:16px;padding:24px;box-shadow:var(--shadow-lg)')}>
        <div style={css('display:flex;align-items:center;gap:11px;margin-bottom:12px')}>
          <span style={css('width:38px;height:38px;border-radius:10px;background:rgba(229,190,26,.14);color:#9a7d0a;display:flex;align-items:center;justify-content:center;font-size:17px')}><i className="fa-solid fa-bolt" /></span>
          <h2 style={css('margin:0;font-weight:700;font-size:18px;color:var(--plum-900)')}>Conferma automazione</h2>
        </div>
        <p style={css('margin:0 0 20px;font-size:14px;line-height:1.5;color:var(--ink-700)')}>{confirm.msg}</p>
        <div style={css('display:flex;justify-content:flex-end;gap:10px')}>
          <button onClick={onCancel} style={css('height:38px;padding:0 16px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);font-weight:600;font-size:14px;font-family:var(--font-display);cursor:pointer')}>Annulla</button>
          <button onClick={confirm.onConfirm} style={css('height:38px;padding:0 18px;border:0;border-radius:999px;background:var(--indigo-700);color:#fff;font-weight:700;font-size:14px;font-family:var(--font-display);cursor:pointer')}>Conferma e invia</button>
        </div>
      </div>
    </div>
  );
}
