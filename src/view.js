const SVG_NS = 'http://www.w3.org/2000/svg';

export function applyView(svgEl, currentView, selectedCountry, countryData, standings, hestias, projection) {
  if (!svgEl) return;

  const paths = svgEl.querySelectorAll('.country');
  paths.forEach(el => {
    const alpha3 = el.getAttribute('data-alpha3');
    const data = countryData[alpha3];

    el.classList.remove('hestia-active');
    el.classList.remove('selected');

    if (!data) {
      if (el.getAttribute('data-suspended') === 'true') {
        el.style.fill = 'var(--suspended)';
      } else {
        el.style.fill = 'var(--eu-non)';
      }
      el.style.opacity = '';
      return;
    }

    if (currentView === 'standings') {
      if (data.aspirant === 'iua') {
        el.style.fill = 'url(#pattern-aspirant-iua)';
      } else if (data.aspirant === 'member') {
        el.style.fill = 'url(#pattern-aspirant-member)';
      } else {
        el.style.fill = standings[data.standing].color;
      }
      el.style.opacity = '1';
    } else {
      const participation = data.hestias[currentView];
      if (participation === 1) {
        el.style.fill = 'var(--ember)';
        el.style.opacity = '1';
        el.classList.add('hestia-active');
      } else {
        el.style.fill = 'var(--non)';
        el.style.opacity = '0.5';
      }
    }

    if (alpha3 === selectedCountry) {
      el.classList.add('selected');
    }
  });

  // Capital marker
  updateCapitalMarker(svgEl, currentView, hestias, projection);
}

function updateCapitalMarker(svgEl, currentView, hestias, projection) {
  // Remove existing marker
  const existing = svgEl.querySelector('.capital-marker-group');
  if (existing) existing.remove();

  if (!projection || currentView === 'standings') return;

  const hestia = hestias.find(h => h.key === currentView);
  if (!hestia || !hestia.capitalCoords) return;

  const [lon, lat] = hestia.capitalCoords;
  const [x, y] = projection([lon, lat]);
  if (x == null || y == null) return;

  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'capital-marker-group');

  // Outer glow
  const glow = document.createElementNS(SVG_NS, 'circle');
  glow.setAttribute('cx', x);
  glow.setAttribute('cy', y);
  glow.setAttribute('r', '12');
  glow.setAttribute('class', 'capital-glow');
  g.appendChild(glow);

  // Inner dot
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
  dot.setAttribute('r', '5');
  dot.setAttribute('class', 'capital-dot');
  g.appendChild(dot);

  // Label
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y - 16);
  text.setAttribute('class', 'capital-label');
  text.textContent = hestia.capital;
  g.appendChild(text);

  svgEl.appendChild(g);
}

export function renderLegend(currentView, hestias, standings) {
  const titleEl = document.getElementById('legend-title');
  const gridEl = document.getElementById('legend-grid');
  const descriptionEl = document.getElementById('hestia-description');
  const descriptionContentEl = document.getElementById('hestia-description-content');

  if (currentView === 'standings') {
    titleEl.textContent = 'Standings';
    gridEl.innerHTML = `
      <div class="legend-item"><div class="legend-swatch" style="background: var(--member);"></div><div class="legend-text">Member</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--inner-assoc);"></div><div class="legend-text">Inner Associate</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--outer-assoc);"></div><div class="legend-text">Outer Associate</div></div>
      <div class="legend-item"><div class="legend-swatch legend-swatch-aspirant-iua"></div><div class="legend-text">Outer (aspiring IUA)</div></div>
      <div class="legend-item"><div class="legend-swatch legend-swatch-aspirant-member"></div><div class="legend-text">Inner (aspiring Member)</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--strategic);"></div><div class="legend-text">Strategic Partner</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--eu-non);"></div><div class="legend-text">Outside framework</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--suspended);"></div><div class="legend-text">Suspended</div></div>
    `;
    descriptionEl.style.display = 'none';
  } else {
    const hestia = hestias.find(h => h.key === currentView);
    const label = hestia ? hestia.label : currentView;
    const desc = hestia ? hestia.description : '';
    const explanation = hestia ? hestia.explanation : '';
    
    titleEl.textContent = label;
    gridEl.innerHTML = `
      <div class="legend-item"><div class="legend-swatch" style="background: var(--ember);"></div><div class="legend-text">Full participant</div></div>
      <div class="legend-item"><div class="legend-swatch" style="background: var(--non); opacity: 0.5;"></div><div class="legend-text">Non-participant</div></div>
    `;
    
    const capital = hestia ? hestia.capital : '';
    if (desc || explanation || capital) {
      descriptionContentEl.innerHTML = `
        ${desc ? `<div class="hestia-description-title">${desc}</div>` : ''}
        ${capital ? `<div class="hestia-capital">Capital: ${capital}</div>` : ''}
        ${explanation ? `<div class="hestia-description-text">${explanation}</div>` : ''}
      `;
      descriptionEl.style.display = 'block';
    } else {
      descriptionEl.style.display = 'none';
    }
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
    btn.innerHTML = `<span class="btn-name">${h.label}</span><span class="btn-sub">${h.sub}</span>${h.capital ? `<span class="btn-capital">${h.capital}</span>` : ''}`;
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
