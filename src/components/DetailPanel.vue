<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue';
import { useAppState } from '../composables/useAppState';
import type { CountryData, Hestia, Standing, NonFrameworkEntry } from '../types';
import countryData from '../../data/countries.yaml';
import hestias from '../../data/hestias.yaml';
import standings from '../../data/standings.yaml';
import nonFramework from '../../data/non-framework.yaml';

const typedCountryData = countryData as Record<string, CountryData>;
const typedHestias = hestias as Hestia[];
const typedStandings = standings as Record<string, Standing>;
const typedNonFramework = nonFramework as Record<string, string | NonFrameworkEntry>;

const { state } = useAppState();

const panelRef = ref<HTMLElement>();

const country = computed<CountryData | null>(() => {
  if (!state.selectedCountry) return null;
  return typedCountryData[state.selectedCountry] ?? null;
});

const standing = computed<Standing | null>(() => {
  if (!country.value) return null;
  return typedStandings[country.value.standing] ?? null;
});

const aspirantLabel = computed(() => {
  if (!country.value?.aspirant) return null;
  return country.value.aspirant === 'member' ? 'Aspiring Member' : 'Aspiring Companion';
});

const populationLabel = computed(() => {
  if (!country.value?.population) return null;
  const p = country.value.population;
  if (p >= 1) return `${p.toFixed(1)}m`;
  return `${Math.round(p * 1000).toLocaleString()}k`;
});

const hestiaItems = computed(() => {
  if (!country.value) return [];
  const reasons = country.value.reasons ?? {};
  return typedHestias.map(h => ({
    key: h.key,
    label: h.label,
    capital: h.capital ?? null,
    active: country.value!.hestias[h.key] === 1,
    reason: reasons[h.key] ?? null,
  }));
});

const nonFrameworkData = computed(() => {
  if (!state.selectedNonFramework) return null;
  const name = state.selectedNonFramework;
  const extra = typedNonFramework[name];
  const noteText = typeof extra === 'object' ? extra.note : extra;
  const isSuspended = typeof extra === 'object' && !!extra.suspended;
  const note = noteText
    ? `Outside the Charter framework. ${noteText}`
    : 'Outside the Charter framework. No current standing as Member, Companion, Accord State, or Strategic Partner.';
  return {
    name,
    standingLabel: isSuspended ? 'Suspended' : 'Outside framework',
    standingClass: isSuspended ? 'standing-suspended' : 'standing-non-eu',
    note,
  };
});

watch([() => state.selectedCountry, () => state.selectedNonFramework], () => {
  nextTick(() => {
    panelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
</script>

<template>
  <div ref="panelRef" class="detail-panel">
    <!-- Framework country -->
    <template v-if="country && standing">
      <div class="detail-name">{{ country.name }}</div>
      <div class="detail-standing" :class="standing.className">{{ standing.label }}</div>
      <div v-if="aspirantLabel" class="detail-aspirant">{{ aspirantLabel }}</div>
      <div v-if="populationLabel" class="detail-population">Pop. {{ populationLabel }}</div>
      <div class="detail-note">{{ country.note }}</div>
      <div class="hestia-list">
        <div v-for="h in hestiaItems" :key="h.key" class="hestia-item">
          <span class="hestia-mark" :class="h.active ? 'mark-full' : 'mark-none'">{{ h.active ? '●' : '○' }}</span>
          <span class="hestia-name">{{ h.label }}</span>
          <span v-if="h.capital" class="hestia-capital-tag">{{ h.capital }}</span>
          <span v-if="h.reason" class="hestia-reason">{{ h.reason }}</span>
        </div>
      </div>
    </template>

    <!-- Non-framework country -->
    <template v-else-if="nonFrameworkData">
      <div class="detail-name">{{ nonFrameworkData.name }}</div>
      <div class="detail-standing" :class="nonFrameworkData.standingClass">{{ nonFrameworkData.standingLabel }}</div>
      <div class="detail-note">{{ nonFrameworkData.note }}</div>
    </template>

    <!-- Empty state -->
    <div v-else class="detail-empty">Tap a country to see its standing and which fires it tends.</div>
  </div>
</template>
