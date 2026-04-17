const NON_EU_NOTES = {
  "Russia": "Outside the Charter framework. Cooperation suspended following the invasion of Ukraine.",
  "Belarus": "Outside the Charter framework. Cooperation suspended due to authoritarian governance and complicity in the invasion of Ukraine.",
  "Azerbaijan": "Outside the Charter framework. Energy cooperation exists bilaterally but no formal standing.",
  "Egypt": "Outside the Charter framework. Could be mapped as Outer Union Associate or Strategic Partner in future.",
  "Libya": "Outside the Charter framework. Stabilisation remains a precondition for any structured relationship.",
  "Syria": "Outside the Charter framework.",
  "Lebanon": "Outside the Charter framework. Mediterranean partnership possible once domestic stability allows.",
  "Jordan": "Outside the Charter framework. Could be mapped as Strategic Partner.",
  "Iraq": "Outside the Charter framework.",
  "Iran": "Outside the Charter framework.",
  "Saudi Arabia": "Outside the Charter framework.",
  "Andorra": "Outside the Charter framework. Micro-state with deep EU integration — natural candidate for Inner Union Associate.",
  "Monaco": "Outside the Charter framework. Micro-state with deep French integration — natural candidate for Inner Union Associate.",
  "San Marino": "Outside the Charter framework. Micro-state with deep Italian integration — natural candidate for Inner Union Associate.",
  "Vatican City": "Outside the Charter framework.",
};

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
  const hestiaItems = hestias.map(h => {
    const p = data.hestias[h.key];
    let mark, markClass;
    if (p === 1) { mark = '●'; markClass = 'mark-full'; }
    else if (p === 0.5) { mark = '◐'; markClass = 'mark-partial'; }
    else { mark = '○'; markClass = 'mark-none'; }
    const reason = reasons[h.key];
    const reasonHtml = reason ? `<span class="hestia-reason">${reason}</span>` : '';
    return `
      <div class="hestia-item${reason ? ' has-reason' : ''}">
        <span class="hestia-mark ${markClass}">${mark}</span>
        <span class="hestia-name">${h.label}</span>
        ${reasonHtml}
      </div>
    `;
  }).join('');

  panel.innerHTML = `
    <div class="detail-name">${data.name}</div>
    <div class="detail-standing ${standing.className}">${standing.label}</div>
    <div class="detail-note">${data.note}</div>
    <div class="hestia-list">${hestiaItems}</div>
  `;

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

export function renderNonFrameworkDetail(name) {
  const panel = document.getElementById('detail-panel');
  if (!name) {
    panel.innerHTML = '<div class="detail-empty">Tap a country to see its standing and which fires it tends.</div>';
    return;
  }

  const note = NON_EU_NOTES[name] || 'Outside the Charter framework. No current standing as Member, Associate, or Strategic Partner.';

  panel.innerHTML = `
    <div class="detail-name">${name}</div>
    <div class="detail-standing standing-non-eu">Outside framework</div>
    <div class="detail-note">${note}</div>
  `;

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}
