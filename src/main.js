import './styles.css';
import countryData from '../data/countries.yaml';
import hestias from '../data/hestias.yaml';
import standings from '../data/standings.yaml';
import isoMappings from '../data/iso-mappings.yaml';
import nonFramework from '../data/non-framework.yaml';

import { drawMap } from './map.js';
import { applyView, renderLegend, setupHestiaButtons } from './view.js';
import { selectCountry, renderDetail, renderNonFrameworkDetail } from './detail.js';
import { buildListFallback } from './fallback.js';

// State
const state = {
  currentView: 'standings',
  selectedCountry: null,
  svgEl: null,
  projection: null,
};

function refresh() {
  applyView(state.svgEl, state.currentView, state.selectedCountry, countryData, standings, hestias, state.projection);
  renderLegend(state.currentView, hestias, standings);
}

function handleCountrySelect(alpha3) {
  selectCountry(alpha3, state, countryData);
  refresh();
  renderDetail(alpha3, countryData, hestias, standings);
}

function handleNonFrameworkSelect(name) {
  state.selectedCountry = null;
  refresh();
  renderNonFrameworkDetail(name, nonFramework);
}

function handleViewChange(view) {
  state.currentView = view;
  refresh();
}

async function init() {
  try {
    const response = await fetch('./countries-110m.json');
    const world = await response.json();

    const { svg, projection } = drawMap(world, countryData, isoMappings, nonFramework, handleCountrySelect, handleNonFrameworkSelect);
    state.svgEl = svg;
    state.projection = projection;

    setupHestiaButtons(hestias, handleViewChange);
    refresh();

    document.getElementById('map-loading').style.display = 'none';
    document.getElementById('map-svg').style.display = 'block';
  } catch (err) {
    document.getElementById('map-loading').innerHTML =
      'Could not load map data.<br><br>' + buildListFallback(countryData, standings);
  }
}

init();
