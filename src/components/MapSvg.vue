<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { geoConicConformal, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { useAppState } from '../composables/useAppState';
import type { CountryData, IsoMappings, MapCountry, Standing, NonFrameworkEntry, Hestia } from '../types';
import countryData from '../../data/countries.yaml';
import isoMappings from '../../data/iso-mappings.yaml';
import nonFramework from '../../data/non-framework.yaml';
import standings from '../../data/standings.yaml';
import hestias from '../../data/hestias.yaml';

const typedCountryData = countryData as Record<string, CountryData>;
const typedIsoMappings = isoMappings as IsoMappings;
const typedNonFramework = nonFramework as Record<string, string | NonFrameworkEntry>;
const typedStandings = standings as Record<string, Standing>;

const { state, selectCountry, selectNonFramework } = useAppState();

const loading = ref(true);
const error = ref(false);
const geoFeatures = ref<any[]>([]);

const WIDTH = 800;
const HEIGHT = 700;

const projection = geoConicConformal()
  .center([15, 52])
  .parallels([35, 65])
  .rotate([-10, 0])
  .scale(900)
  .translate([WIDTH / 2, HEIGHT / 2]);

const pathGen = geoPath().projection(projection);

function lookupAlpha3(feat: any): string | null {
  const numericId = feat.id != null ? Number(feat.id) : null;
  if (numericId != null && typedIsoMappings.numericToAlpha3[numericId]) {
    return typedIsoMappings.numericToAlpha3[numericId];
  }
  const name = feat.properties?.name;
  if (name && typedIsoMappings.nameToAlpha3[name]) {
    return typedIsoMappings.nameToAlpha3[name];
  }
  return null;
}

const countries = computed<MapCountry[]>(() => {
  return geoFeatures.value
    .map((feat): MapCountry | null => {
      const alpha3 = lookupAlpha3(feat);
      const data = alpha3 ? typedCountryData[alpha3] ?? null : null;
      const pathData = pathGen(feat);
      if (!pathData) return null;

      const featureName: string = feat.properties?.name || '';
      const nfEntry = typedNonFramework[featureName];
      const isSuspended = !data && !!nfEntry && typeof nfEntry === 'object' && !!nfEntry.suspended;

      let fill: string;
      let opacity: string | undefined;
      if (!data) {
        fill = isSuspended ? 'var(--suspended)' : 'var(--eu-non)';
        opacity = undefined;
      } else if (state.currentView === 'standings') {
        if (data.aspirant === 'iua') fill = 'url(#pattern-aspirant-iua)';
        else if (data.aspirant === 'member') fill = 'url(#pattern-aspirant-member)';
        else fill = typedStandings[data.standing].color;
        opacity = '1';
      } else {
        if (data.hestias[state.currentView] === 1) {
          fill = 'var(--ember)';
          opacity = '1';
        } else {
          fill = 'var(--non)';
          opacity = '0.5';
        }
      }

      return {
        id: feat.id ?? featureName,
        alpha3,
        data,
        pathData,
        featureName,
        isFramework: !!data,
        isSelected: !!data && alpha3 === state.selectedCountry,
        isHestiaActive: !!data && state.currentView !== 'standings' && data.hestias[state.currentView] === 1,
        isSuspended,
        fill,
        opacity,
      };
    })
    .filter((c): c is MapCountry => c !== null);
});

function handleClick(country: MapCountry) {
  if (country.isFramework && country.alpha3) {
    selectCountry(country.alpha3);
  } else {
    selectNonFramework(country.featureName);
  }
}

const typedHestias = hestias as Hestia[];

const capitalMarker = computed(() => {
  if (state.currentView === 'standings') return null;
  const hestia = typedHestias.find(h => h.key === state.currentView);
  if (!hestia?.capitalCoords || !hestia.capital) return null;
  const [lon, lat] = hestia.capitalCoords;
  const projected = projection([lon, lat]);
  if (!projected) return null;
  return { x: projected[0], y: projected[1], name: hestia.capital };
});

const fallbackHtml = computed(() => {
  const byStanding: Record<string, string[]> = { member: [], 'inner-assoc': [], 'outer-assoc': [], strategic: [] };
  Object.entries(typedCountryData).forEach(([, data]) => {
    if (byStanding[data.standing]) byStanding[data.standing].push(data.name);
  });
  let html = '';
  Object.keys(byStanding).forEach(s => {
    html += `<div style="margin-top:16px;"><strong>${typedStandings[s].label}</strong><br>${byStanding[s].join(', ')}</div>`;
  });
  return 'Could not load map data.<br><br>' + html;
});

onMounted(async () => {
  try {
    const response = await fetch('./countries-50m.json');
    const world = await response.json();
    geoFeatures.value = feature(world as Topology, world.objects.countries as GeometryCollection).features;
    loading.value = false;
  } catch {
    error.value = true;
    loading.value = false;
  }
});
</script>

<template>
  <div class="map-container">
    <div v-if="loading" class="loading">Drawing the map</div>
    <div v-else-if="error" class="loading" v-html="fallbackHtml"></div>
    <svg v-else id="map-svg" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="pattern-aspirant-iua" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#8aa68a" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#7494c4" stroke-width="2.5" />
        </pattern>
        <pattern id="pattern-aspirant-member" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#7494c4" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#2854ab" stroke-width="2.5" />
        </pattern>
      </defs>
      <rect :width="WIDTH" :height="HEIGHT" class="country-water" />
      <path
        v-for="c in countries"
        :key="c.id"
        :d="c.pathData"
        :class="{
          country: true,
          'country-non-eu': !c.isFramework,
          selected: c.isSelected,
          'hestia-active': c.isHestiaActive,
        }"
        :style="{ fill: c.fill, opacity: c.opacity }"
        @click="handleClick(c)"
      />
      <g v-if="capitalMarker" class="capital-marker-group">
        <circle :cx="capitalMarker.x" :cy="capitalMarker.y" r="12" class="capital-glow" />
        <circle :cx="capitalMarker.x" :cy="capitalMarker.y" r="5" class="capital-dot" />
        <text :x="capitalMarker.x" :y="capitalMarker.y - 16" class="capital-label">{{ capitalMarker.name }}</text>
      </g>
    </svg>
  </div>
</template>
