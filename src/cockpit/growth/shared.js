import { css } from '../lib/css.js';

export const btnPrimary = css('display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px;border:0;border-radius:999px;background:var(--indigo-700);color:#fff;font-weight:600;font-size:12px;cursor:pointer');
export const btnGhost = css('display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px;border:1px solid var(--ink-300);border-radius:999px;background:#fff;color:var(--ink-700);font-weight:600;font-size:12px;cursor:pointer');
export const btnDanger = css('display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px;border:1px solid rgba(130,15,70,.3);border-radius:999px;background:#fff;color:var(--burgundy-700);font-weight:600;font-size:12px;cursor:pointer');
export const emptyStyle = css('padding:40px;text-align:center;color:var(--ink-500);background:#fff;border:1px solid var(--ink-200);border-radius:14px;font-weight:600');
