import { useState } from 'react';
import { css } from '../lib/css.js';

// Schermata "Chi sei?" — selezione profilo (vista + filtro clienti).
// Elenco letto dalla tabella Team di Airtable filtrato ai PM con almeno un cliente attivo.
// I PM senza clienti attivi restano accessibili nello "Storico PM passate" per consultare
// i clienti che hanno seguito in passato.
export default function Entry({ entryPeople, entryArchived = [] }) {
  const [showArchived, setShowArchived] = useState(false);
  const list = showArchived ? entryArchived : entryPeople;
  const hasArchived = entryArchived.length > 0;

  return (
    <div style={css('position:fixed;inset:0;z-index:100;background:var(--plum-900);color:var(--on-dark-1);display:flex;align-items:center;justify-content:center;padding:40px;overflow:auto')}>
      <div style={css('width:100%;max-width:560px')}>
        <div style={css('display:flex;align-items:center;gap:11px;margin-bottom:18px')}>
          <img src="/assets/logo-lever-horizontal-light.png" alt="Lever PR" style={css('height:34px;width:auto')} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <h1 style={css('margin:0 0 6px;font-weight:600;font-size:28px;letter-spacing:-.02em')}>
          {showArchived ? 'Storico PM passate' : 'Chi sei?'}
        </h1>
        <p style={css('margin:0 0 8px;font-size:14px;color:var(--on-dark-2);line-height:1.5')}>
          {showArchived
            ? 'Project Manager che oggi non hanno clienti attivi. Selezionando un profilo puoi consultare i clienti che ha seguito in passato.'
            : 'Strumento interno protetto da password unica. Scegli il tuo profilo: imposta la vista e il filtro dei clienti. Non è una barriera di sicurezza — solo una selezione di vista.'}
        </p>
        <div style={css('display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--green-400);background:rgba(99,207,155,.12);border-radius:999px;padding:5px 12px;margin-bottom:22px')}><i className="fa-solid fa-lock-open" /> Accesso sbloccato</div>

        {list.length === 0 ? (
          <div style={css('padding:24px;border:1px dashed var(--line-dark);border-radius:13px;color:var(--on-dark-3);font-size:13px')}>
            {showArchived ? 'Nessuna PM archiviata.' : 'Nessun PM con clienti attivi al momento.'}
          </div>
        ) : (
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
            {list.map((p, i) => (
              <button key={i} onClick={p.onClick} style={css('display:flex;align-items:center;gap:13px;text-align:left;background:var(--plum-700);border:1px solid var(--line-dark);border-radius:13px;padding:14px 16px;cursor:pointer;color:inherit;font-family:var(--font-display)')}>
                <span style={css('width:40px;height:40px;border-radius:999px;background:var(--lilac-400);color:var(--plum-900);font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>{p.iniz}</span>
                <span style={css('min-width:0')}>
                  <span style={css('display:block;font-weight:700;font-size:15px')}>{p.nome}</span>
                  <span style={css('display:block;font-size:12px;color:var(--on-dark-3)')}>{p.ruolo}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {hasArchived && (
          <button
            onClick={() => setShowArchived((v) => !v)}
            style={css('margin-top:18px;background:transparent;border:1px solid var(--line-dark);border-radius:999px;padding:8px 16px;color:var(--on-dark-2);font-family:var(--font-display);font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px')}
          >
            <i className={showArchived ? 'fa-solid fa-arrow-left' : 'fa-solid fa-clock-rotate-left'} />
            {showArchived ? 'Torna ai PM attivi' : `Storico PM passate (${entryArchived.length})`}
          </button>
        )}

        <p style={css('margin:22px 0 0;font-size:12px;color:var(--on-dark-3);line-height:1.5')}>
          L'elenco è letto dalla tabella <b style={css('color:var(--on-dark-2)')}>Team</b> di Airtable e filtrato per <b style={css('color:var(--on-dark-2)')}>Referente diffusione</b> con almeno un cliente attivo. Chi non ha più clienti attivi resta consultabile nello storico.
        </p>
      </div>
    </div>
  );
}
