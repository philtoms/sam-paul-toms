import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindCss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  srcDir: './src',
  vite: {
    plugins: [tailwindCss()],
  },
});
