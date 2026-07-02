// Logica di vista — porting 1:1 dei metodi build* del prototipo Claude Design.
// Funzioni pure: ricevono ctx = { st (state), m (model), act (azioni) } e ritornano i "vals"
// consumati dai componenti. Nessuno stile qui: solo dati + classi-tono.

// ---------- theming (data-driven) ----------
export function statusTheme(s) {
  return {
    'attivo': { label: 'Attivo', cls: 'st-attivo', dotCls: 'bg-ok' },
    'in-scadenza': { label: 'In scadenza', cls: 'st-in-scadenza', dotCls: 'bg-warn' },
    'in-rinnovo': { label: 'In rinnovo', cls: 'st-in-rinnovo', dotCls: 'bg-indigo' },
    'scaduto': { label: 'Scaduto', cls: 'st-scaduto', dotCls: 'bg-off' },
    'bloccato': { label: 'Bloccato', cls: 'st-bloccato', dotCls: 'bg-bad' },
  }[s] || { label: s, cls: 'st-scaduto', dotCls: 'bg-off' };
}

export function stepTheme(state) {
  return {
    done: { cls: 'bg-ok', icon: 'fa-solid fa-check', txt: 'Completato' },
    corso: { cls: 'bg-indigo', icon: 'fa-solid fa-circle-dot', txt: 'In corso' },
    manca: { cls: 'bg-muted', icon: 'fa-regular fa-circle', txt: 'Da fare' },
    alert: { cls: 'bg-bad', icon: 'fa-solid fa-circle-exclamation', txt: 'Attenzione' },
  }[state];
}

export function levelTheme(lvl) {
  if (lvl === 'rosso') return { bgCls: 'lvl-rosso-bg', chipCls: 'lvl-rosso-chip', icon: 'fa-solid fa-circle-exclamation' };
  if (lvl === 'warning') return { bgCls: 'lvl-warning-bg', chipCls: 'lvl-warning-chip', icon: 'fa-solid fa-triangle-exclamation' };
  return { bgCls: 'lvl-info-bg', chipCls: 'lvl-info-chip', icon: 'fa-solid fa-circle-info' };
}

function alertsFor(st, userId, ruolo) {
  return st.data.alert.filter((a) => a.a.includes(userId) || a.a.includes(ruolo));
}

// ---------- SCHEDA CLIENTE ----------
export function buildScheda(ctx) {
  const { st, m, act } = ctx;
  const c = st.data.clienti.find((x) => x.id === st.selectedClient) || st.data.clienti[0];
  if (!c) return null;
  const dFine = m.daysUntil(c.fine_contratto);
  const dContatto = m.daysSince(c.ultimo_contatto);
  const stt = statusTheme(c.status);

  let fineLabel, fineRed = false;
  if (dFine === null) fineLabel = '—';
  else if (dFine < 0) { fineLabel = 'scaduto ' + Math.abs(dFine) + ' gg fa'; fineRed = true; }
  else { fineLabel = 'scade tra ' + dFine + ' gg'; fineRed = dFine <= 14; }

  const steps = [];
  steps.push({ label: 'Onboarding', state: 'done' });
  if (!c.data_intervista) steps.push({ label: 'Intervista & Strategia', state: 'alert' });
  else if (!c.data_invio_strategia) steps.push({ label: 'Intervista & Strategia', state: 'corso' });
  else steps.push({ label: 'Intervista & Strategia', state: 'done' });
  if (c.cliente_bloccato) steps.push({ label: 'Contatto continuo', state: 'corso' });
  else if (dContatto !== null && dContatto > 30) steps.push({ label: 'Contatto continuo', state: 'alert' });
  else steps.push({ label: 'Contatto continuo', state: 'done' });
  if (c.ultima_checkpoint) steps.push({ label: 'Checkpoint', state: 'done' });
  else if (c.prossima_checkpoint) steps.push({ label: 'Checkpoint', state: 'corso' });
  else steps.push({ label: 'Checkpoint', state: (dFine !== null && dFine <= 14) ? 'alert' : 'manca' });
  if (c.proposto_rinnovo === 'Sì') steps.push({ label: 'Verso il rinnovo', state: 'done' });
  else if (c.gestione_rinnovi || c.status === 'in-rinnovo') steps.push({ label: 'Verso il rinnovo', state: 'corso' });
  else steps.push({ label: 'Verso il rinnovo', state: (dFine !== null && dFine <= 60) ? 'alert' : 'manca' });
  const timeline = steps.map((s, i) => {
    const t = stepTheme(s.state);
    return {
      label: s.label, txt: t.txt, icon: t.icon, connShow: i !== steps.length - 1,
      dotCls: t.cls, connCls: s.state === 'done' ? 'bg-ok' : 'bg-ink',
    };
  });

  const pubb = (m.PUBBLICAZIONI[c.id] || []).map((p) => ({
    testata: p.testata, dataFmt: m.fmt(p.data), tier: 'T' + p.tier, link: p.link, tierCls: 'tier-' + p.tier,
  }));
  const tier1flags = (m.PUBBLICAZIONI[c.id] || [])
    .filter((p) => p.tier === 1 && c.ultimo_contatto && new Date(p.data) > new Date(c.ultimo_contatto))
    .map((p) => ({ testata: p.testata, dataFmt: m.fmt(p.data) }));

  const tierPct = c.tier1_da_accordo ? Math.min(100, Math.round((c.count_tier1 / c.tier1_da_accordo) * 100)) : 0;
  const tierUnder = c.count_tier1 < c.tier1_da_accordo;

  const form = m.FORM[c.id] || { sogno: '', obiettivi: [] };
  const obiettivi = form.obiettivi.map((o) => ({ txt: o }));

  const tierRatio = c.tier1_da_accordo ? c.count_tier1 / c.tier1_da_accordo : 1;
  let verdetto, verdCls, verdIcon;
  if (tierRatio >= 1) { verdetto = 'In linea con gli obiettivi'; verdCls = 'verd-ok'; verdIcon = 'fa-solid fa-circle-check'; }
  else if (tierRatio >= 0.6) { verdetto = 'Da spingere sui Tier 1'; verdCls = 'verd-mid'; verdIcon = 'fa-solid fa-circle-half-stroke'; }
  else { verdetto = 'Sotto obiettivo'; verdCls = 'verd-bad'; verdIcon = 'fa-solid fa-circle-exclamation'; }

  const clientAlerts = st.data.alert.filter((a) => a.cliente === c.id && !st.alertStatus[a.id]).map((a) => {
    const t = levelTheme(a.livello);
    return {
      titolo: a.titolo, dettaglio: a.dettaglio, icon: t.icon,
      chipCls: t.chipCls, stripeCls: t.bgCls,
      onResolve: () => act.resolveAlert(a.id),
    };
  });

  const plan = m.checkpointPlan(c);
  const cpDone = plan.done.map((k) => ({
    tipo: k.tipo, dataFmt: m.fmt(k.data), hasTranscript: k.transcript, apreRinnovo: /Ultima/.test(k.tipo),
  }));
  const cpFuturi = plan.futuri.map((k) => ({ tipo: k.tipo, dataFmt: m.fmt(k.data), apreRinnovo: k.apreRinnovo }));
  const hasCadenza = cpDone.length > 0 || cpFuturi.length > 0;

  const dataPerRinnovo = c.fine_contratto ? m.addMonths(c.fine_contratto, -2) : null;
  const rinnovoOpts = ['', 'In valutazione', 'Sì', 'No'].map((o) => ({ v: o, label: o || '— da decidere' }));
  const refOpts = ['', 'Carla De Santis', 'Carlo Marchetti', m.pmName(c.pm)]
    .filter((v, i, a) => a.indexOf(v) === i).map((o) => ({ v: o, label: o || '— da assegnare' }));

  const diario = [...(st.diarioAdd[c.id] || []), ...(m.DIARIO[c.id] || [])].map((d) => ({
    dataFmt: m.fmt(d.data), tipo: d.tipo, testo: d.testo,
    icon: d.tipo === 'call' ? 'fa-solid fa-phone' : d.tipo === 'mail' ? 'fa-solid fa-envelope' : 'fa-brands fa-whatsapp',
  }));

  return {
    id: c.id, nome: c.nome, startup: c.startup, settore: c.settore, pmNome: m.pmName(c.pm),
    tipoLabel: c.tipologia === 'partner' ? 'Partner' : 'Una-tantum',
    tipoCls: c.tipologia === 'partner' ? 'tipo-partner' : 'tipo-una-tantum',
    statusLabel: stt.label, statusCls: stt.cls, statusDotCls: stt.dotCls,
    fineLabel, fineCls: fineRed ? 't-bad' : 't-plum',
    inizioFmt: m.fmt(c.inizio_contratto), fineFmt: m.fmt(c.fine_contratto),
    bloccato: c.cliente_bloccato, riattivazioneFmt: m.fmt(c.data_riattivazione), motivoFreeze: c.motivo_freeze || '',
    freezeLabel: c.cliente_bloccato ? 'Riprendi cliente' : 'Metti in freeze',
    freezeIcon: c.cliente_bloccato ? 'fa-solid fa-play' : 'fa-solid fa-snowflake',
    onFreeze: () => act.toggleFreeze(c.id),
    sogno: form.sogno, obiettivi, hasForm: !!form.sogno,
    verdetto, verdIcon, verdCls,
    clientAlerts, hasClientAlerts: clientAlerts.length > 0,
    timeline,
    dataIntervistaVal: c.data_intervista || '',
    onIntervista: (e) => act.updateField(c.id, 'data_intervista', e.target.value, 'Data intervista aggiornata'),
    recapLabel: c.data_intervista ? 'Mail recap inviata' : 'In attesa intervista',
    dataStrategiaVal: c.data_invio_strategia || '',
    onStrategia: (e) => act.updateField(c.id, 'data_invio_strategia', e.target.value, 'Data invio strategia aggiornata'),
    prossimaCheckVal: c.prossima_checkpoint || '',
    onProssimaCheck: (e) => act.updateField(c.id, 'prossima_checkpoint', e.target.value, 'Prossima checkpoint fissata'),
    cpDone, cpFuturi, hasCadenza,
    aiSummary: m.AI_SUMMARY[c.id] || null, hasAi: !!m.AI_SUMMARY[c.id],
    dataPerRinnovoFmt: m.fmt(dataPerRinnovo),
    propostoVal: c.proposto_rinnovo || '', rinnovoOpts,
    onProposto: (e) => act.updateField(c.id, 'proposto_rinnovo', e.target.value, 'Proposto rinnovo aggiornato'),
    referenteVal: c.referente_rinnovo || '', refOpts,
    onReferente: (e) => act.updateField(c.id, 'referente_rinnovo', e.target.value, 'Referente rinnovo aggiornato'),
    gestioneRinnovi: c.gestione_rinnovi || 'Non avviato',
    diario, hasDiario: diario.length > 0,
    ultimoLabel: dContatto === null ? 'mai' : (dContatto === 0 ? 'oggi' : dContatto + ' giorni fa') + ' · ' + (c.tipo_ultimo_contatto || ''),
    contattoCls: dContatto !== null && dContatto > 30 ? 't-bad' : 't-plum',
    reminderFmt: m.fmt(c.reminder),
    tier1flags, hasChiama: tier1flags.length > 0,
    onMarkMail: () => act.markContact(c.id, 'mail'),
    onMarkWa: () => act.markContact(c.id, 'whatsapp'),
    onMarkCall: () => act.markContact(c.id, 'call'),
    noteVal: c.note || '',
    onNoteBlur: (e) => act.updateField(c.id, 'note', e.target.value, 'Note salvate'),
    pubb, pubTot: c.count_pubblicazioni,
    tier1Label: c.count_tier1 + ' / ' + c.tier1_da_accordo, tierPct, tierUnder,
    tierBarCls: tierUnder ? 'bg-bad' : 'bg-ok',
    aveTot: m.eur(c.ave_totale), aveMens: m.eur(c.ave_mensile),
    backToDash: () => act.go('dashboard'),
  };
}

// ---------- DASHBOARD PM ----------
export function buildDashboard(ctx) {
  const { st, m, act } = ctx;
  const mine = st.data.clienti.filter((c) => c.pm === st.role);
  const bucket = (c) => ({ 'attivo': 'attivi', 'bloccato': 'attivi', 'in-scadenza': 'scadenza', 'in-rinnovo': 'rinnovo', 'scaduto': 'chiusi' }[c.status]);
  const counts = { attivi: 0, scadenza: 0, rinnovo: 0, chiusi: 0 };
  mine.forEach((c) => { counts[bucket(c)]++; });
  const tabDef = [
    { key: 'attivi', label: 'Attivi' }, { key: 'scadenza', label: 'In scadenza' },
    { key: 'rinnovo', label: 'In rinnovo' }, { key: 'chiusi', label: 'Scaduti / chiusi' },
  ];
  const tabs = tabDef.map((t) => {
    const active = st.tab === t.key;
    return {
      label: t.label, count: counts[t.key], onClick: () => act.setTab(t.key),
      cls: active ? 'tab-on' : 'tab-off', countCls: active ? 'tabn-on' : 'tabn-off',
    };
  });

  const rows = mine.filter((c) => bucket(c) === st.tab).map((c) => {
    const dFine = m.daysUntil(c.fine_contratto);
    const dContatto = m.daysSince(c.ultimo_contatto);
    const stt = statusTheme(c.status);
    let cd = '—';
    if (dFine !== null) cd = dFine < 0 ? Math.abs(dFine) + ' gg fa' : dFine + ' gg';
    let chk, chkC;
    if (c.ultima_checkpoint) { chk = 'Ultima checkpoint OK'; chkC = 'bg-ok'; }
    else if (dFine !== null && dFine <= 14) { chk = 'Manca ultima checkpoint'; chkC = 'bg-bad'; }
    else if (dFine !== null && dFine <= 30) { chk = 'Ultima da fissare'; chkC = 'bg-warn'; }
    else if (c.prossima_checkpoint) { chk = 'Prossima ' + m.fmt(c.prossima_checkpoint); chkC = 'bg-ok'; }
    else { chk = 'Da fissare'; chkC = 'bg-warn'; }
    let rin, rinC;
    if (c.proposto_rinnovo === 'Sì') { rin = 'Rinnovo confermato'; rinC = 'bg-ok'; }
    else if (c.gestione_rinnovi || c.status === 'in-rinnovo') { rin = c.gestione_rinnovi || 'In corso'; rinC = 'bg-warn'; }
    else { rin = 'Non avviato'; rinC = 'bg-off'; }
    return {
      id: c.id, nome: c.nome, settore: c.settore, statusCls: stt.dotCls,
      cd, cdCls: dFine !== null && dFine <= 14 ? 't-bad' : 't-plum',
      chk, chkCls: chkC, rin, rinCls: rinC,
      isScadenza: st.tab === 'scadenza',
      showRinnovoBtn: !(c.gestione_rinnovi || c.status === 'in-rinnovo' || c.status === 'scaduto'),
      onOpen: () => act.openClient(c.id),
      onContact: () => act.markContact(c.id, 'call'),
      onCheckpoint: () => act.setQuickCheckpoint(c.id),
      onRinnovo: () => act.openRinnovo(c.id),
    };
  });

  const ord = { rosso: 0, warning: 1, info: 2 };
  const myAlertsOpen = alertsFor(st, st.role, 'pm').filter((a) => !st.alertStatus[a.id]);
  const alertRow = (a) => {
    const t = levelTheme(a.livello);
    const cli = m.clientById(a.cliente);
    return {
      titolo: a.titolo, perche: a.dettaglio, clientNome: cli ? cli.nome : a.cliente,
      icon: t.icon, chipCls: t.chipCls, onOpen: () => act.openClient(a.cliente),
    };
  };
  const bySev = (a, b) => ord[a.livello] - ord[b.livello];
  const daChiamare = myAlertsOpen.filter((a) => a.regola === 4 || a.regola === 5).sort(bySev).map(alertRow);
  const scadenze = mine.filter((c) => { const d = m.daysUntil(c.fine_contratto); return d !== null && d >= 0 && d <= 90 && !c.cliente_bloccato; })
    .sort((a, b) => m.daysUntil(a.fine_contratto) - m.daysUntil(b.fine_contratto))
    .map((c) => {
      const d = m.daysUntil(c.fine_contratto);
      let chk, chkC;
      if (c.ultima_checkpoint) { chk = 'Ultima OK'; chkC = 'bg-ok'; }
      else if (d <= 14) { chk = 'Ultima manca'; chkC = 'bg-bad'; }
      else if (d <= 30) { chk = 'Ultima da fissare'; chkC = 'bg-warn'; }
      else { chk = 'In tempo'; chkC = 'bg-ok'; }
      let rin, rinC;
      if (c.proposto_rinnovo === 'Sì') { rin = 'Confermato'; rinC = 'bg-ok'; }
      else if (c.gestione_rinnovi || c.status === 'in-rinnovo') { rin = 'In corso'; rinC = 'bg-warn'; }
      else { rin = 'Non avviato'; rinC = 'bg-off'; }
      return { nome: c.nome, cd: d + ' gg', chk, chkCls: chkC, rin, rinCls: rinC, onOpen: () => act.openClient(c.id) };
    });
  const datiMancanti = myAlertsOpen.filter((a) => [1, 2, 3, 7, 8].includes(a.regola)).sort(bySev).map(alertRow);

  return {
    tabs, rows, empty: rows.length === 0,
    daChiamare, scadenze, datiMancanti,
    daChiamareEmpty: daChiamare.length === 0,
    scadenzeEmpty: scadenze.length === 0,
    datiMancantiEmpty: datiMancanti.length === 0,
    giornataEmpty: (daChiamare.length + scadenze.length + datiMancanti.length) === 0,
    goAlert: () => act.go('alert'),
    kpi: [
      { n: mine.length, l: 'Clienti seguiti' },
      { n: counts.scadenza, l: 'In scadenza' },
      { n: counts.rinnovo, l: 'In rinnovo' },
    ],
  };
}

// ---------- MATRICE PORTAFOGLIO ----------
export function buildMatrice(ctx) {
  const { st, m, act } = ctx;
  const me = m.userById(st.role);
  const isCarlo = me.ruolo !== 'pm';
  let scope = isCarlo ? st.data.clienti : st.data.clienti.filter((c) => c.pm === st.role);
  const pmChips = [{ id: 'all', label: 'Tutte le PM' }]
    .concat(m.USERS.filter((u) => u.ruolo === 'pm').map((u) => ({ id: u.id, label: u.nome.split(' ')[0] })))
    .map((ch) => ({
      label: ch.label, onClick: () => act.setMatricePm(ch.id),
      cls: st.matricePm === ch.id ? 'tab-on' : 'tab-off',
    }));
  if (isCarlo && st.matricePm !== 'all') scope = scope.filter((c) => c.pm === st.matricePm);

  const phaseTone = { done: 'bg-ok', corso: 'bg-indigo', alert: 'bg-bad', manca: 'bg-muted', pausa: 'bg-off' };
  const rows = scope.map((c) => {
    const dFine = m.daysUntil(c.fine_contratto);
    const dCont = m.daysSince(c.ultimo_contatto);
    let red = 0, yellow = 0;
    const bump = (state) => { if (state === 'alert') red++; else if (state === 'warn') yellow++; };

    const ph = [];
    ph.push({ label: 'Onboarding', state: 'done' });
    if (!c.data_intervista) ph.push({ label: 'Intervista & Strategia', state: 'alert' });
    else if (!c.data_invio_strategia) ph.push({ label: 'Intervista & Strategia', state: 'corso' });
    else ph.push({ label: 'Intervista & Strategia', state: 'done' });
    if (c.cliente_bloccato) ph.push({ label: 'Contatto (in pausa)', state: 'pausa' });
    else if (dCont !== null && dCont > 30) ph.push({ label: 'Contatto continuo', state: 'alert' });
    else ph.push({ label: 'Contatto continuo', state: 'done' });
    if (c.ultima_checkpoint) ph.push({ label: 'Checkpoint', state: 'done' });
    else if (dFine !== null && dFine >= 0 && dFine <= 14) ph.push({ label: 'Checkpoint', state: 'alert' });
    else if (c.prossima_checkpoint) ph.push({ label: 'Checkpoint', state: 'corso' });
    else if (dFine !== null && dFine >= 0 && dFine <= 30) ph.push({ label: 'Checkpoint', state: 'alert' });
    else ph.push({ label: 'Checkpoint', state: 'manca' });
    if (c.proposto_rinnovo === 'Sì') ph.push({ label: 'Verso il rinnovo', state: 'done' });
    else if (c.gestione_rinnovi || c.status === 'in-rinnovo') ph.push({ label: 'Verso il rinnovo', state: 'corso' });
    else if (dFine !== null && dFine >= 0 && dFine <= 60) ph.push({ label: 'Verso il rinnovo', state: 'alert' });
    else ph.push({ label: 'Verso il rinnovo', state: 'manca' });
    ph.forEach((p) => bump(p.state));
    const fasi = ph.map((p) => ({ cls: phaseTone[p.state], title: p.label }));
    const critical = ph.find((p) => p.state === 'alert');
    const active = ph.find((p) => p.state === 'corso');
    const faseNode = critical || active || ph.filter((p) => p.state === 'done').pop() || ph[0];
    const faseLabel = faseNode.label;
    const faseCls = faseNode.state === 'alert' ? 't-bad' : faseNode.state === 'corso' ? 't-plum' : 't-ok';

    let scad, scadCls = 't-plum';
    if (dFine === null) scad = '—';
    else if (dFine < 0) { scad = Math.abs(dFine) + ' gg fa'; scadCls = 't-bad'; }
    else { scad = dFine + ' gg'; if (dFine <= 14) scadCls = 't-bad'; }
    let cont, contCls = 't-plum';
    if (c.cliente_bloccato) cont = 'in pausa';
    else if (dCont === null) { cont = 'mai'; contCls = 't-bad'; }
    else { cont = dCont === 0 ? 'oggi' : dCont + ' gg fa'; if (dCont > 30) contCls = 't-bad'; }
    const under = c.count_tier1 < c.tier1_da_accordo;
    const cs = m.CS.find((x) => x.cliente === c.id);
    let csLabel = '—', csCls = 'bg-muted';
    if (cs) { csLabel = cs.stato + ' · ' + cs.giorni_fermo + ' gg'; csCls = cs.giorni_fermo > 5 ? 'bg-bad' : 'bg-warn'; if (cs.giorni_fermo > 5) red++; else yellow++; }
    const sodd = c.soddisfazione != null ? String(c.soddisfazione).replace('.', ',') : '—';
    let soddCls = 't-plum';
    if (c.soddisfazione != null && c.soddisfazione < 3.8) { soddCls = 't-bad'; red++; }

    const order = { rosso: 0, warning: 1, info: 2 };
    const clientAlerts = st.data.alert
      .filter((a) => a.cliente === c.id && !st.alertStatus[a.id])
      .sort((a, b) => order[a.livello] - order[b.livello]);
    let azione, azCls, azTextCls;
    if (clientAlerts.length) {
      const top = clientAlerts[0];
      azione = top.titolo + (clientAlerts.length > 1 ? '  +' + (clientAlerts.length - 1) : '');
      azCls = top.livello === 'rosso' ? 'bg-bad' : top.livello === 'warning' ? 'bg-warn' : 'bg-lilac';
      azTextCls = top.livello === 'rosso' ? 'az-red' : 'az-ink';
      if (top.livello === 'rosso') red++; else if (top.livello === 'warning') yellow++;
    } else {
      azione = 'In linea'; azCls = 'bg-ok'; azTextCls = 'az-mut';
    }

    const stt = statusTheme(c.status);
    return {
      id: c.id, nome: c.nome, settore: c.settore,
      pmNome: c.pm ? m.pmName(c.pm).split(' ')[0] : '—',
      statusDotCls: stt.dotCls, bloccato: c.cliente_bloccato,
      fasi, faseLabel, faseCls,
      tier: c.count_tier1 + ' / ' + c.tier1_da_accordo, tierCls: under ? 't-bad' : 't-ok',
      csLabel, csCls, cont, contCls, scad, scadCls, sodd, soddCls,
      azione, azCls, azTextCls, red, yellow,
      onOpen: () => act.openClient(c.id),
    };
  }).sort((a, b) => (b.red - a.red) || (b.yellow - a.yellow));

  const nRed = rows.filter((r) => r.red > 0).length;
  const nYellow = rows.filter((r) => r.red === 0 && r.yellow > 0).length;
  const kpi = [
    { n: nRed, l: 'Da intervenire', cls: 't-bad' },
    { n: nYellow, l: "Da tenere d'occhio", cls: 't-warn' },
    { n: rows.length - nRed - nYellow, l: 'In linea', cls: 't-ok' },
  ];
  return { rows, empty: rows.length === 0, pmChips, showChips: isCarlo, showPm: isCarlo, gridCls: isCarlo ? 'mxg-carlo' : 'mxg-pm', kpi };
}

// ---------- CONTROLLO (CARLO) ----------
export function buildCarlo(ctx) {
  const { st, m, act } = ctx;
  const cl = st.data.clienti;
  const openAlerts = st.data.alert.filter((a) => !st.alertStatus[a.id]);
  const ord = { rosso: 0, warning: 1, info: 2 };

  const daAssegnare = cl.filter((c) => !c.pm).map((c) => ({
    nome: c.nome, settore: c.settore, firmaFmt: m.fmt(c.firma || c.inizio_contratto),
    onOpen: () => act.openClient(c.id),
  }));
  const attenzionare = openAlerts.filter((a) => a.livello !== 'info')
    .sort((a, b) => ord[a.livello] - ord[b.livello]).map((a) => {
      const t = levelTheme(a.livello);
      const cli = m.clientById(a.cliente);
      return {
        titolo: a.titolo, dettaglio: a.dettaglio, clientNome: cli ? cli.nome : a.cliente,
        pm: cli ? m.pmName(cli.pm).split(' ')[0] : '—', icon: t.icon,
        stripeCls: t.bgCls, chipCls: t.chipCls, onOpen: () => act.openClient(a.cliente),
      };
    });

  const maxT = Math.max.apply(null, m.TIER1_MESE.map((x) => x.n));
  const tier1Mese = m.TIER1_MESE.map((x) => ({ mese: x.mese, n: x.n, pct: Math.round((x.n / maxT) * 100) }));
  const maxR = Math.max.apply(null, m.TREND_RISCHIO.map((x) => x.n));
  const trend = m.TREND_RISCHIO.map((x, i) => ({ sett: x.sett, n: x.n, pct: Math.round((x.n / maxR) * 100), cls: i === m.TREND_RISCHIO.length - 1 ? 'bg-bad' : 'bg-lilac' }));

  const csAppr = m.CS.filter((x) => x.stato === 'In approvazione');
  const avgCs = csAppr.length ? Math.round(csAppr.reduce((s, x) => s + x.giorni_fermo, 0) / csAppr.length) : 0;
  const sat = cl.filter((c) => c.soddisfazione != null);
  const avgSat = sat.length ? (sat.reduce((s, c) => s + c.soddisfazione, 0) / sat.length).toFixed(1).replace('.', ',') : '—';
  const valScad = cl.filter((c) => ['in-scadenza', 'in-rinnovo'].includes(c.status)).reduce((s, c) => s + c.valore_contratto, 0);
  const kpi = [
    { n: avgCs + ' gg', l: 'Tempo medio approvazione CS', sub: csAppr.length + ' CS in coda' },
    { n: '24 gg', l: 'Time-to-first-publish Tier 1', sub: 'media portafoglio' },
    { n: avgSat + ' / 5', l: 'Soddisfazione media', sub: sat.length + ' clienti valutati' },
    { n: m.eur(valScad), l: 'Valore in scadenza', sub: 'contratti ≤ 90 gg' },
  ];

  const copertura = m.USERS.filter((u) => u.ruolo === 'pm').map((u) => {
    const suoi = cl.filter((c) => c.pm === u.id);
    const scoperti = suoi.filter((c) => { const d = m.daysSince(c.ultimo_contatto); return !c.cliente_bloccato && d !== null && d > 30; });
    const alertNonGestiti = openAlerts.filter((a) => a.a.includes(u.id)).length;
    return {
      nome: u.nome, iniz: u.iniz, tot: suoi.length,
      scoperti: scoperti.length, alertNonGestiti,
      scopertiCls: scoperti.length ? 't-bad' : 't-ok',
      alertCls: alertNonGestiti ? 't-warn' : 't-ok',
    };
  });

  return { attenzionare, attEmpty: attenzionare.length === 0, tier1Mese, trend, kpi, copertura, daAssegnare, hasDaAssegnare: daAssegnare.length > 0 };
}

// ---------- PIPELINE RINNOVI (CARLA) ----------
export function buildCarla(ctx) {
  const { st, m, act } = ctx;
  const cols = [
    { key: '30', label: '≤ 30 giorni', hint: 'urgente', dot: 'bg-bad' },
    { key: '60', label: '≤ 60 giorni', hint: 'da avviare', dot: 'bg-warn' },
    { key: '90', label: '≤ 90 giorni', hint: 'in arrivo', dot: 'bg-lilac' },
  ];
  const colFor = (d) => (d <= 30 ? '30' : d <= 60 ? '60' : d <= 93 ? '90' : null);
  const rinnovoOpts = ['', 'In valutazione', 'Sì', 'No'];
  const columns = cols.map((col) => {
    const cards = st.data.clienti.filter((c) => {
      const d = m.daysUntil(c.fine_contratto);
      return d !== null && d >= 0 && colFor(d) === col.key;
    }).map((c) => {
      const d = m.daysUntil(c.fine_contratto);
      return {
        id: c.id, nome: c.nome, settore: c.settore, fineFmt: m.fmt(c.fine_contratto),
        cd: d + ' gg', pmNome: m.pmName(c.pm).split(' ')[0], valore: m.eur(c.valore_contratto),
        proposto: c.proposto_rinnovo || '', referente: c.referente_rinnovo || 'Da assegnare',
        gestione: c.gestione_rinnovi || 'Non avviato', churn: c.churn,
        onProposto: (e) => act.updateField(c.id, 'proposto_rinnovo', e.target.value, 'Proposto rinnovo aggiornato'),
        onOpen: () => act.openClient(c.id),
        opts: rinnovoOpts.map((o) => ({ v: o, label: o || '—' })),
      };
    });
    return { key: col.key, label: col.label, hint: col.hint, count: cards.length, cards, empty: cards.length === 0, dotCls: col.dot };
  });
  return { columns };
}

// ---------- PANORAMICA (EXEC) ----------
export function buildExec(ctx) {
  const { st, m } = ctx;
  const cl = st.data.clienti;
  const attivi = cl.filter((c) => !['scaduto'].includes(c.status));
  const sat = cl.filter((c) => c.soddisfazione != null);
  const kpi = [
    { n: attivi.length, l: 'Clienti attivi', tone: 'plum' },
    { n: m.eur(cl.reduce((s, c) => s + c.ave_totale, 0)), l: 'AVE totale portafoglio', tone: 'indigo' },
    { n: cl.reduce((s, c) => s + c.count_tier1, 0), l: 'Pubblicazioni Tier 1', tone: 'cream' },
    { n: cl.reduce((s, c) => s + c.count_pubblicazioni, 0), l: 'Pubblicazioni totali', tone: 'cream' },
    { n: (sat.length ? (sat.reduce((s, c) => s + c.soddisfazione, 0) / sat.length).toFixed(1).replace('.', ',') : '—') + ' / 5', l: 'Soddisfazione media', tone: 'cream' },
    { n: m.eur(cl.filter((c) => ['in-scadenza', 'in-rinnovo'].includes(c.status)).reduce((s, c) => s + c.valore_contratto, 0)), l: 'Valore in scadenza', tone: 'cream' },
  ].map((k) => ({ n: k.n, l: k.l, toneCls: 'kpi-' + k.tone }));
  const maxT = Math.max.apply(null, m.TIER1_MESE.map((x) => x.n));
  const tier1Mese = m.TIER1_MESE.map((x) => ({ mese: x.mese, n: x.n, pct: Math.round((x.n / maxT) * 100) }));
  return { kpi, tier1Mese };
}

// ---------- shell (nav / people / alert inbox) ----------
export function renderVals(ctx) {
  const { st, m, act } = ctx;
  // Fallback: in modalità Airtable il ruolo di default ('pm-giulia') non esiste
  // finché non si sceglie un profilo nell'Entry → evita il crash del primo render.
  const me = m.userById(st.role) || m.USERS[0];
  const screen = st.screen;

  const roleLabel = { pm: 'Project Manager', carlo: 'Head of Delivery', carla: 'Renewals & Account', exec: 'Founder / Exec' };

  // Un PM è "attivo" se compare come referente_diffusione su almeno un cliente con status "attivo".
  // I ruoli fissi (carlo/carla/exec) restano sempre nella lista attiva.
  const activePmIds = new Set();
  (st.data?.clienti || m.CLIENTI).forEach((c) => {
    if (c.status !== 'attivo') return;
    (c.referenti || []).forEach((rid) => activePmIds.add(rid));
  });
  const toEntry = (u) => ({
    nome: u.nome, sub: u.sub, iniz: u.iniz, ruolo: roleLabel[u.ruolo] || u.sub,
    onClick: () => act.enter(u.id),
  });
  const entryPeople = m.USERS.filter((u) => u.ruolo !== 'pm' || activePmIds.has(u.id)).map(toEntry);
  const entryArchived = m.USERS.filter((u) => u.ruolo === 'pm' && !activePmIds.has(u.id)).map(toEntry);

  const people = m.USERS.map((u) => ({
    iniz: u.iniz, title: u.nome + ' · ' + u.sub, onClick: () => act.setRole(u.id),
    cls: u.id === st.role ? 'chip-on' : 'chip-off',
  }));

  const myOpenAlerts = alertsFor(st, st.role, me.ruolo).filter((a) => !st.alertStatus[a.id]);
  const navDef = {
    pm: [{ key: 'dashboard', label: 'La mia dashboard', icon: 'fa-solid fa-gauge-high' }, { key: 'matrice', label: 'Matrice clienti', icon: 'fa-solid fa-table-cells' }, { key: 'alert', label: 'Alert', icon: 'fa-solid fa-bell' }],
    carlo: [{ key: 'carlo', label: 'Controllo portafoglio', icon: 'fa-solid fa-chart-line' }, { key: 'matrice', label: 'Matrice clienti', icon: 'fa-solid fa-table-cells' }, { key: 'alert', label: 'Alert', icon: 'fa-solid fa-bell' }],
    carla: [{ key: 'carla', label: 'Pipeline rinnovi', icon: 'fa-solid fa-arrows-rotate' }, { key: 'alert', label: 'Alert', icon: 'fa-solid fa-bell' }],
    exec: [{ key: 'exec', label: 'Panoramica', icon: 'fa-solid fa-chart-pie' }],
  }[me.ruolo];
  const activeKey = screen === 'scheda' ? 'dashboard' : screen;
  const nav = navDef.map((n) => ({
    label: n.label, icon: n.icon, onClick: () => act.go(n.key),
    badge: n.key === 'alert' && myOpenAlerts.length ? myOpenAlerts.length : null,
    cls: n.key === activeKey ? 'nav-on' : 'nav-off',
  }));

  const order = { rosso: 0, warning: 1, info: 2 };
  const myAlerts = alertsFor(st, st.role, me.ruolo).slice()
    .sort((a, b) => order[a.livello] - order[b.livello])
    .map((a) => {
      const t = levelTheme(a.livello);
      const status = st.alertStatus[a.id];
      const cli = m.clientById(a.cliente);
      return {
        titolo: a.titolo, dettaglio: a.dettaglio, clientNome: cli ? cli.nome : a.cliente,
        icon: t.icon, resolved: status === 'resolved', snoozed: status === 'snoozed',
        meta: 'Regola ' + a.regola + ' · Step ' + a.step + (a.a.length > 1 ? ' · anche a ' + a.a.filter((x) => x !== st.role).map((x) => m.pmName(x).split(' ')[0]).join(', ') : ''),
        dimCls: status ? 'ck-dim' : '',
        stripeCls: t.bgCls, chipCls: t.chipCls,
        onOpen: () => act.openClient(a.cliente),
        onResolve: () => act.resolveAlert(a.id),
        onSnooze: () => act.snoozeAlert(a.id),
      };
    });

  return {
    isEntry: !st.entered,
    isDashboardPM: screen === 'dashboard', isScheda: screen === 'scheda',
    isCarlo: screen === 'carlo', isCarla: screen === 'carla', isExec: screen === 'exec',
    isAlert: screen === 'alert', isMatrice: screen === 'matrice',
    me, nav, people, entryPeople, entryArchived, toast: st.toast,
    onExit: () => act.exitToEntry(),
    myAlerts, alertOpenCount: myOpenAlerts.length, alertEmpty: myAlerts.length === 0,
    scheda: buildScheda(ctx),
    dash: me.ruolo === 'pm' ? buildDashboard(ctx) : {},
    matrice: screen === 'matrice' ? buildMatrice(ctx) : {},
    carlo: screen === 'carlo' ? buildCarlo(ctx) : {},
    carla: screen === 'carla' ? buildCarla(ctx) : {},
    exec: screen === 'exec' ? buildExec(ctx) : {},
  };
}
