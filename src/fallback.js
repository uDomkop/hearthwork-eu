export function buildListFallback(countryData, standings) {
  const byStanding = { member: [], 'inner-assoc': [], 'outer-assoc': [], strategic: [] };
  Object.entries(countryData).forEach(([code, data]) => {
    if (byStanding[data.standing]) byStanding[data.standing].push(data.name);
  });
  let html = '';
  Object.keys(byStanding).forEach(s => {
    html += `<div style="margin-top:16px;"><strong>${standings[s].label}</strong><br>${byStanding[s].join(', ')}</div>`;
  });
  return html;
}
