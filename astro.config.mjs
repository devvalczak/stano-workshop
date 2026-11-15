// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// astro.config runs before Vite, so .env has to be loaded explicitly here.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: env.SITE_URL,
  base: env.BASE_PATH || '/',
  outDir: './build',
  // Every page becomes <path>/index.html, so URLs have no .html extension on any static host.
  build: {
    format: 'directory',
    // The whole stylesheet is small; inlining it removes the only render-blocking request.
    inlineStylesheets: 'always',
  },
  trailingSlash: 'always',
  // Cast: @tailwindcss/vite and Astro resolve different copies of Vite's type definitions.
  vite: { plugins: [/** @type {any} */ (tailwindcss())] },
});
