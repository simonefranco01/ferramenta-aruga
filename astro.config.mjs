// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ---------------------------------------------------------------------------
// Dominio della ferramenta (CNAME in public/CNAME). Per tornare a una sottocartella
// (es. GitHub Pages di progetto) cambia questi due valori. Procedura nel README.
// ---------------------------------------------------------------------------
const SITE = 'https://ferramentaaruga.it';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(grazie|404)\/?$/.test(page),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
});
