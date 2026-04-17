import { resolve } from 'path';
import { defineConfig } from 'vite';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  base: './',
  plugins: [yaml()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        charter: resolve(__dirname, 'charter.html'),
        manifesto: resolve(__dirname, 'manifesto.html'),
        commentary: resolve(__dirname, 'commentary.html'),
      },
    },
  },
});
