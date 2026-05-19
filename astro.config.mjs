import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import tailwindCss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: process.env.SITE_URL || 'https://sam.music',
  srcDir: './src',
  vite: {
    plugins: [tailwindCss()],
  },
  integrations: [preact(), sitemap()],
});
