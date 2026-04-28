<script setup lang="ts">
import SiteNav from './components/SiteNav.vue';
import { useRoute } from 'vue-router';
import { useTheme } from './composables/useTheme';

const route = useRoute();
const { theme, toggle } = useTheme();
</script>

<template>
  <header>
    <button class="theme-toggle" @click="toggle" :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'">
      {{ theme === 'light' ? '☽' : '☀' }}
    </button>
    <h1>Hearthwork EU</h1>
    <p class="epigraph">From many, one. From one, many.</p>
    <SiteNav />
  </header>

  <router-view />

  <footer>
    <template v-if="route.path === '/'">
      <div>Hearthwork EU Charter — Thirteenth Draft</div>
      <div style="margin-top: 6px;">Indicative mapping. Real assignments would be made by the Independent Review Commission.</div>
    </template>
    <template v-else>
      <div class="quote">From many nations, one Union.<br>From one Union, many fires.</div>
      <div>Hearthwork EU Charter — Thirteenth Draft</div>
    </template>
  </footer>
</template>
