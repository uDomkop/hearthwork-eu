export function selectCountry(alpha3, state, countryData) {
  state.selectedCountry = alpha3;
}

export function renderDetail(alpha3, countryData, hestias, standings) {
  const data = countryData[alpha3];
  const panel = document.getElementById('detail-panel');

  if (!data) {
    panel.innerHTML = '<div class="detail-empty">Tap a country to see its standing and which fires it tends.</div>';
    return;
  }

  const standing = standings[data.standing];
  const reasons = data.reasons || {};
  const aspirantLabel = data.aspirant === 'member' ? 'Aspiring Member'
    : data.aspirant === 'iua' ? 'Aspiring Inner Associate'
    : null;
  const aspirantHtml = aspirantLabel
    ? `<div class="detail-aspirant">${aspirantLabel}</div>`
    : '';
  const hestiaItems = hestias.map(h => {
    const p = data.hestias[h.key];
    let mark, markClass;
    if (p === 1) { mark = '●'; markClass = 'mark-full'; }
    else { mark = '○'; markClass = 'mark-none'; }
    const reason = reasons[h.key];
    const reasonHtml = reason ? `<span class="hestia-reason">${reason}</span>` : '';
    return `
      <div class="hestia-item">
        <span class="hestia-mark ${markClass}">${mark}</span>
        <span class="hestia-name">${h.label}</span>
        ${reasonHtml}
      </div>
    `;
  }).join('');

  panel.innerHTML = `
    <div class="detail-name">${data.name}</div>
    <div class="detail-standing ${standing.className}">${standing.label}</div>
    ${aspirantHtml}
    <div class="detail-note">${data.note}</div>
    <div class="hestia-list">${hestiaItems}</div>
  `;

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

export function renderNonFrameworkDetail(name, nonFramework) {
  const panel = document.getElementById('detail-panel');
  if (!name) {
    panel.innerHTML = '<div class="detail-empty">Tap a country to see its standing and which fires it tends.</div>';
    return;
  }

  const extra = nonFramework[name];
  const noteText = typeof extra === 'object' ? extra.note : extra;
  const isSuspended = typeof extra === 'object' && extra.suspended;
  const note = noteText
    ? `Outside the Charter framework. ${noteText}`
    : 'Outside the Charter framework. No current standing as Member, Associate, or Strategic Partner.';
  const standingLabel = isSuspended ? 'Suspended' : 'Outside framework';
  const standingClass = isSuspended ? 'standing-suspended' : 'standing-non-eu';

  panel.innerHTML = `
    <div class="detail-name">${name}</div>
    <div class="detail-standing ${standingClass}">${standingLabel}</div>
    <div class="detail-note">${note}</div>
  `;

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}
