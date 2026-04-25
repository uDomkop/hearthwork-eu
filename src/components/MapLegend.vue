<script setup lang="ts">
import { computed } from 'vue';
import { useAppState } from '../composables/useAppState';
import type { Hestia, Standing } from '../types';
import hestias from '../../data/hestias.yaml';
import standings from '../../data/standings.yaml';

const typedHestias = hestias as Hestia[];
const typedStandings = standings as Record<string, Standing>;

const { state } = useAppState();

const isStandings = computed(() => state.currentView === 'standings');

const title = computed(() => {
  if (isStandings.value) return 'Standings';
  const hestia = typedHestias.find(h => h.key === state.currentView);
  return hestia?.label ?? state.currentView;
});
</script>

<template>
  <div class="legend">
    <div class="legend-title">{{ title }}</div>
    <div class="legend-grid">
      <template v-if="isStandings">
        <div class="legend-item"><div class="legend-swatch" style="background: var(--member);"></div><div class="legend-text">Member</div></div>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--companion);"></div><div class="legend-text">Companion</div></div>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--compact);"></div><div class="legend-text">Accord State</div></div>
        <div class="legend-item"><div class="legend-swatch legend-swatch-aspirant-companion"></div><div class="legend-text">Accord State (aspiring Companion)</div></div>
        <div class="legend-item"><div class="legend-swatch legend-swatch-aspirant-member"></div><div class="legend-text">Companion (aspiring Member)</div></div>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--strategic);"></div><div class="legend-text">Strategic Partner</div></div>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--eu-non);"></div><div class="legend-text">Outside framework</div></div>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--suspended);"></div><div class="legend-text">Suspended</div></div>
      </template>
      <template v-else>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--ember);"></div><div class="legend-text">Full participant</div></div>
        <div class="legend-item"><div class="legend-swatch" style="background: var(--non); opacity: 0.5;"></div><div class="legend-text">Non-participant</div></div>
      </template>
    </div>
  </div>
</template>
