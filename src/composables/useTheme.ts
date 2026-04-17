import { ref, watchEffect } from 'vue';

const STORAGE_KEY = 'hearthwork-theme';

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const theme = ref<'light' | 'dark'>(getInitialTheme());

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem(STORAGE_KEY, theme.value);
});

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }
  return { theme, toggle };
}
