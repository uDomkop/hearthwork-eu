import { defineConfig } from 'vite';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  base: './',
  plugins: [yaml()],
});
