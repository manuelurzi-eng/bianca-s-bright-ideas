import { css } from '../lib/css.js';

// Barra superiore: logo, nav per ruolo, role-switcher "Vedi come", uscita a "Chi sei?".
export default function TopBar({ vals }) {
  const { nav, people, me, onExit } = vals;
  return (
    <header style={css('position:sticky;top:0;z-index:50;background:var(--plum-900);color:var(--on-dark-1);display:flex;align-items:center;gap:28px;padding:0 26px;height:62px;box-shadow:0 1px 0 var(--line-dark)')}>
      <div style={css('display:flex;align-items:center;gap:12px;flex-shrink:0')}>
        <img src="/assets/logo-lever-horizontal-light.png" alt="Lever PR" style={css('height:24px;width:auto')} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <span style={css('font-weight:600;font-size:13px;color:var(--on-dark-2);letter-spacing:.01em;border-left:1px solid var(--line-dark);padding-left:12px')}>Gestione Clienti</span>
      </div>

      <nav style={css('display:flex;align-items:center;gap:4px;margin-left:6px')}>
        {nav.map((item, i) => (
          <button key={i} onClick={item.onClick} className={item.cls} style={css('display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 15px;border:0;border-radius:999px;cursor:pointer;font-family:var(--font-display);font-weight:600;font-size:13px;transition:background .15s var(--ease)')}>
            <i className={item.icon} style={css('font-size:13px')} />
            <span>{item.label}</span>
            {item.badge ? (
              <span style={css('margin-left:2px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--burgundy-700);color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center')}>{item.badge}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div style={css('flex:1')} />

      <div style={css('display:flex;align-items:center;gap:14px')}>
        <span style={css('font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--on-dark-3)')}>Vedi come</span>
        <div style={css('display:flex;align-items:center;gap:5px')}>
          {people.map((p, i) => (
            <button key={i} onClick={p.onClick} title={p.title} className={p.cls} style={css('width:32px;height:32px;border-radius:999px;border:0;cursor:pointer;font-weight:700;font-size:12px;font-family:var(--font-display);transition:transform .15s var(--ease)')}>{p.iniz}</button>
          ))}
        </div>
        <div style={css('text-align:right;margin-left:6px')}>
          <div style={css('font-weight:700;font-size:13px;line-height:1.1')}>{me.nome}</div>
          <div style={css('font-size:11px;color:var(--on-dark-3);line-height:1.1')}>{me.sub}</div>
        </div>
        <button onClick={onExit} title="Cambia vista · Chi sei?" style={css('width:34px;height:34px;border:1px solid var(--line-dark);border-radius:999px;background:transparent;color:var(--on-dark-2);cursor:pointer;margin-left:4px')}><i className="fa-solid fa-right-from-bracket" /></button>
      </div>
    </header>
  );
}
