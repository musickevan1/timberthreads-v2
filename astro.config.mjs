// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://timberandthreadsretreat.com',
  output: 'static',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ['res.cloudinary.com'],
  },

  integrations: [preact(), sitemap()],
});
