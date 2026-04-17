import { geoConicConformal, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function lookupAlpha3(feat, isoMappings) {
  const numericId = feat.id != null ? Number(feat.id) : null;
  if (numericId != null && isoMappings.numericToAlpha3[numericId]) {
    return isoMappings.numericToAlpha3[numericId];
  }
  const name = feat.properties && feat.properties.name;
  if (name && isoMappings.nameToAlpha3[name]) {
    return isoMappings.nameToAlpha3[name];
  }
  return null;
}

export function drawMap(world, countryData, isoMappings, nonFramework, onSelect, onNonFrameworkSelect) {
  const svg = document.getElementById('map-svg');
  const width = 800;
  const height = 700;

  const projection = geoConicConformal()
    .center([15, 52])
    .parallels([35, 65])
    .rotate([-10, 0])
    .scale(900)
    .translate([width / 2, height / 2]);

  const pathGen = geoPath().projection(projection);

  const countries = feature(world, world.objects.countries).features;

  // Background ocean
  const ocean = document.createElementNS(SVG_NS, 'rect');
  ocean.setAttribute('width', width * 4);
  ocean.setAttribute('height', height * 4);
  ocean.setAttribute('x', -width * 2);
  ocean.setAttribute('y', -height * 2);
  ocean.setAttribute('class', 'country-water');
  svg.appendChild(ocean);

  // Content group for pan/zoom transforms
  const contentGroup = document.createElementNS(SVG_NS, 'g');
  contentGroup.setAttribute('id', 'map-content');

  // Stripe patterns for aspirant countries
  const defs = document.createElementNS(SVG_NS, 'defs');

  // OUA aspiring to IUA: outer-assoc green + inner-assoc blue stripes
  const patIua = document.createElementNS(SVG_NS, 'pattern');
  patIua.setAttribute('id', 'pattern-aspirant-iua');
  patIua.setAttribute('patternUnits', 'userSpaceOnUse');
  patIua.setAttribute('width', '6');
  patIua.setAttribute('height', '6');
  patIua.setAttribute('patternTransform', 'rotate(45)');
  const rectIua = document.createElementNS(SVG_NS, 'rect');
  rectIua.setAttribute('width', '6');
  rectIua.setAttribute('height', '6');
  rectIua.setAttribute('fill', '#8aa68a');
  patIua.appendChild(rectIua);
  const lineIua = document.createElementNS(SVG_NS, 'line');
  lineIua.setAttribute('x1', '0');
  lineIua.setAttribute('y1', '0');
  lineIua.setAttribute('x2', '0');
  lineIua.setAttribute('y2', '6');
  lineIua.setAttribute('stroke', '#7494c4');
  lineIua.setAttribute('stroke-width', '2.5');
  patIua.appendChild(lineIua);
  defs.appendChild(patIua);

  // IUA aspiring to Member: inner-assoc blue + member blue stripes
  const patMem = document.createElementNS(SVG_NS, 'pattern');
  patMem.setAttribute('id', 'pattern-aspirant-member');
  patMem.setAttribute('patternUnits', 'userSpaceOnUse');
  patMem.setAttribute('width', '6');
  patMem.setAttribute('height', '6');
  patMem.setAttribute('patternTransform', 'rotate(45)');
  const rectMem = document.createElementNS(SVG_NS, 'rect');
  rectMem.setAttribute('width', '6');
  rectMem.setAttribute('height', '6');
  rectMem.setAttribute('fill', '#7494c4');
  patMem.appendChild(rectMem);
  const lineMem = document.createElementNS(SVG_NS, 'line');
  lineMem.setAttribute('x1', '0');
  lineMem.setAttribute('y1', '0');
  lineMem.setAttribute('x2', '0');
  lineMem.setAttribute('y2', '6');
  lineMem.setAttribute('stroke', '#2854ab');
  lineMem.setAttribute('stroke-width', '2.5');
  patMem.appendChild(lineMem);
  defs.appendChild(patMem);

  svg.appendChild(defs);

  // Draw countries into content group
  countries.forEach(feat => {
    const alpha3 = lookupAlpha3(feat, isoMappings);
    const data = alpha3 && countryData[alpha3];
    const pathData = pathGen(feat);
    if (!pathData) return;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', data ? 'country' : 'country country-non-eu');
    path.setAttribute('data-alpha3', alpha3 || '');
    if (data && data.aspirant) {
      path.setAttribute('data-aspirant', data.aspirant);
    }
    const featureName = (feat.properties && feat.properties.name) || '';
    path.setAttribute('data-name', featureName);
    const nfEntry = nonFramework[featureName];
    if (!data && nfEntry && typeof nfEntry === 'object' && nfEntry.suspended) {
      path.setAttribute('data-suspended', 'true');
    }

    path.addEventListener('click', () => {
      if (data) {
        onSelect(alpha3);
      } else {
        onNonFrameworkSelect(featureName);
      }
    });

    contentGroup.appendChild(path);
  });

  svg.appendChild(contentGroup);

  // Pan & zoom
  setupPanZoom(svg, contentGroup, width, height, projection);

  return { svg, projection, pathGen };
}

function setupPanZoom(svg, contentGroup, width, height, projection) {
  let isPanning = false;
  let startX = 0, startY = 0;
  let currentTranslateX = 0, currentTranslateY = 0;
  let scale = 1;

  applyTransform();

  function applyTransform() {
    contentGroup.setAttribute('transform',
      `translate(${currentTranslateX},${currentTranslateY}) scale(${scale})`);
  }

  function getSVGPoint(e) {
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width * width,
      y: (clientY - rect.top) / rect.height * height,
    };
  }

  // Mouse drag
  svg.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isPanning = true;
    startX = e.clientX - currentTranslateX;
    startY = e.clientY - currentTranslateY;
    svg.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!isPanning) return;
    currentTranslateX = e.clientX - startX;
    currentTranslateY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    isPanning = false;
    svg.style.cursor = 'grab';
  });

  // Touch drag
  svg.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isPanning = true;
      startX = e.touches[0].clientX - currentTranslateX;
      startY = e.touches[0].clientY - currentTranslateY;
    }
  }, { passive: true });

  svg.addEventListener('touchmove', e => {
    if (!isPanning || e.touches.length !== 1) return;
    currentTranslateX = e.touches[0].clientX - startX;
    currentTranslateY = e.touches[0].clientY - startY;
    applyTransform();
    e.preventDefault();
  }, { passive: false });

  svg.addEventListener('touchend', () => { isPanning = false; });

  // Scroll zoom
  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const pt = getSVGPoint(e);
    const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const newScale = Math.max(0.8, Math.min(20, scale * zoomFactor));

    // Zoom toward cursor
    currentTranslateX = pt.x - (pt.x - currentTranslateX) * (newScale / scale);
    currentTranslateY = pt.y - (pt.y - currentTranslateY) * (newScale / scale);
    scale = newScale;
    applyTransform();
  }, { passive: false });

  svg.style.cursor = 'grab';
}
