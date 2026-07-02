import { css } from '../lib/css.js';

// Notifica transitoria in basso al centro (salvataggi / azioni).
export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={css('position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:10px;background:var(--plum-900);color:#fff;padding:13px 20px;border-radius:12px;box-shadow:var(--shadow-lg);animation:ck-toast .3s var(--ease);font-weight:600;font-size:14px')}>
      <i className="fa-solid fa-cloud-arrow-up" style={css('color:var(--lilac-400)')} />{toast}
    </div>
  );
}
