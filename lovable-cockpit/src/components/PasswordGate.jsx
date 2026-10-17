import { useState } from 'react';
import { css } from '../lib/css.js';

// Gate a password unica condivisa. NON è una barriera di sicurezza reale
// (il confronto è client-side): serve solo a evitare accessi casuali.
// La password vive in env VITE_APP_PASSWORD (fallback demo: "lever").
const PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'roadto1.5';

export default function PasswordGate({ onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pwd === PASSWORD) { onUnlock(); return; }
    setErr(true);
  };

  return (
    <div style={css('position:fixed;inset:0;z-index:120;background:var(--plum-900);color:var(--on-dark-1);display:flex;align-items:center;justify-content:center;padding:40px')}>
      <form onSubmit={submit} style={css('width:100%;max-width:380px')}>
        <div style={css('display:flex;align-items:center;gap:11px;margin-bottom:22px')}>
          <img src="/assets/logo-lever-horizontal-light.png" alt="Lever PR" style={css('height:32px;width:auto')} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <h1 style={css('margin:0 0 6px;font-weight:600;font-size:26px;letter-spacing:-.02em')}>Cockpit Gestione Clienti</h1>
        <p style={css('margin:0 0 20px;font-size:14px;color:var(--on-dark-2);line-height:1.5')}>Strumento interno. Inserisci la password condivisa per continuare.</p>
        <input
          type="password" value={pwd} autoFocus placeholder="Password"
          onChange={(e) => { setPwd(e.target.value); setErr(false); }}
          style={css('width:100%;box-sizing:border-box;height:44px;border:1px solid ' + (err ? 'var(--burgundy-700)' : 'var(--line-dark)') + ';border-radius:11px;padding:0 14px;font-size:15px;background:var(--plum-700);color:#fff;font-family:var(--font-display)')}
        />
        {err ? <div style={css('margin-top:8px;font-size:12px;font-weight:600;color:#e9a1bf')}><i className="fa-solid fa-triangle-exclamation" /> Password errata</div> : null}
        <button type="submit" style={css('margin-top:16px;width:100%;height:44px;border:0;border-radius:11px;background:var(--lilac-400);color:var(--plum-900);font-weight:700;font-size:15px;font-family:var(--font-display);cursor:pointer')}>Entra</button>
      </form>
    </div>
  );
}
