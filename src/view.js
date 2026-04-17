export function applyView(svgEl, currentView, selectedCountry, countryData, standings) {
  if (!svgEl) return;

  const paths = svgEl.querySelectorAll('.country');
  paths.forEach(el => {
    const alpha3 = el.getAttribute('data-alpha3');
    const data = countryData[alpha3];

    el.classList.remove('hestia-active');
    el.classList.remove('selected');

    if (!data) {
      el.style.fill = 'var(--eu-non)';
      el.style.opacity = '';
      return;
    }

    if (currentView === 'standings') {
      el.style.fill = standings[data.standing].color;
      el.style.opacity = '1';
    } else {
      const participation = data.hestias[currentView];
      if (participation === 1) {
        el.style.fill = 'var(--ember)';
        el.style.opacity = '1';
        el.classList.add('hestia-active');
      } else if (participation === 0.5) {
        el.style.fill = 'var(--ember-glow)';
        el.style.opacity = '0.7';
      } else {
        el.style.fill = 'var(--non)';
        el.style.opacity = '0.5';
      }
    }

    if (alpha3 === selectedCountry) {
      el.classList.add('selected');
    }
  });
}

export function renderLegend(currentView, hestias, standings) {
  const titleEl = document.getElementById('legend-title');
  const gridEl = document.getElementById('legend-grid');

  if (currentView === 'standings') {
    titleEl.textContent = 'Standings';
    gridEl.innerHTML = `
      <div class="legend-item"><div class="legend-swatch" style="background: var(--member);"></div><div class="legend-text">Member</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--inner-assoc);"></div><div class="legend-text">Inner Associate</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--outer-assoc);"></div><div class="legend-text">Outer Associate</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--strategic);"></div><div class="legend-text">Strategic Partner</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--eu-non);"></div><div class="legend-text">Outside framework</div></div>
    `;
  } else {
    const hestia = hestias.find(h => h.key === currentView);
    const label = hestia ? hestia.label : currentView;
    const desc = hestia ? hestia.description : '';
    const explanation = hestia ? hestia.explanation : '';
    titleEl.textContent = label + ' — ' + desc;
    gridEl.innerHTML = `
      <div class="legend-item"><div class="legend-swatch" style="background: var(--ember);"></div><div class="legend-text">Full participant</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--ember-glow); opacity: 0.7;"></div><div class="legend-text">Partial / transitioning</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--non); opacity: 0.5;"></div><div class="legend-text">Non-participant</div></div>
      ${explanation ? `<div class="legend-explanation">${explanation}</div>` : ''}
    `;
  }
}

export function setupHestiaButtons(hestias, onChange) {
  const container = document.getElementById('hestia-buttons');

  // Standings button
  const standingsBtn = document.createElement('button');
  standingsBtn.className = 'hestia-btn standings active';
  standingsBtn.dataset.view = 'standings';
  standingsBtn.textContent = 'Show Standings';
  container.appendChild(standingsBtn);

  // One button per Hestia
  hestias.forEach(h => {
    const btn = document.createElement('button');
    btn.className = 'hestia-btn';
    btn.dataset.view = h.key;
    btn.innerHTML = `<span class="btn-name">${h.label}</span><span class="btn-sub">${h.sub}</span>`;
    container.appendChild(btn);
  });

  // Wire click handlers
  container.querySelectorAll('.hestia-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.hestia-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onChange(btn.dataset.view);
    });
  });
}
