<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SiteNav from './components/SiteNav.vue';
import { useRoute } from 'vue-router';
import { useTheme } from './composables/useTheme';

const route = useRoute();
const { theme, toggle } = useTheme();

const headerRef = ref<HTMLElement>();
let ro: ResizeObserver | null = null;
let scrollHandler: (() => void) | null = null;

onMounted(() => {
  if (!headerRef.value) return;

  const updateH = () => {
    if (headerRef.value) {
      document.documentElement.style.setProperty('--header-h', `${headerRef.value.offsetHeight}px`);
    }
  };

  updateH();
  ro = new ResizeObserver(updateH);
  ro.observe(headerRef.value);

  scrollHandler = () => {
    headerRef.value?.classList.toggle('compact', window.scrollY > 30);
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
});

onUnmounted(() => {
  ro?.disconnect();
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
});
</script>

<template>
  <header ref="headerRef">
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
