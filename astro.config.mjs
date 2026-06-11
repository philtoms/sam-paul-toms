import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import tailwindCss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: process.env.SITE_URL || 'https://sampaultoms.com',
  srcDir: './src',
  vite: {
    plugins: [tailwindCss()],
    build: {
      rollupOptions: {
        external: ['resend'],
      },
    },
  },
  integrations: [preact(), sitemap()],
});
