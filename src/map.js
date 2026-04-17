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

export function drawMap(world, countryData, isoMappings, onSelect, onNonFrameworkSelect) {
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
  ocean.setAttribute('width', width);
  ocean.setAttribute('height', height);
  ocean.setAttribute('class', 'country-water');
  svg.appendChild(ocean);

  // Stripe pattern for aspirant countries
  const defs = document.createElementNS(SVG_NS, 'defs');
  const pattern = document.createElementNS(SVG_NS, 'pattern');
  pattern.setAttribute('id', 'pattern-aspirant');
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  pattern.setAttribute('width', '6');
  pattern.setAttribute('height', '6');
  pattern.setAttribute('patternTransform', 'rotate(45)');
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('width', '6');
  rect.setAttribute('height', '6');
  rect.setAttribute('fill', '#8aa68a');
  pattern.appendChild(rect);
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', '0');
  line.setAttribute('y1', '0');
  line.setAttribute('x2', '0');
  line.setAttribute('y2', '6');
  line.setAttribute('stroke', '#2854ab');
  line.setAttribute('stroke-width', '2.5');
  pattern.appendChild(line);
  defs.appendChild(pattern);
  svg.appendChild(defs);

  // Draw countries
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
      path.setAttribute('data-aspirant', 'true');
    }
    const featureName = (feat.properties && feat.properties.name) || '';
    path.setAttribute('data-name', featureName);

    path.addEventListener('click', () => {
      if (data) {
        onSelect(alpha3);
      } else {
        onNonFrameworkSelect(featureName);
      }
    });

    svg.appendChild(path);
  });

  return { svg, projection, pathGen };
}
