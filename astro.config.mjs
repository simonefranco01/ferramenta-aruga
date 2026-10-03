// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ---------------------------------------------------------------------------
// Passaggio al dominio della ferramenta: cambia solo questi due valori
// (es. SITE = 'https://www.dominio-ferramenta.it', BASE = '/')
// e aggiungi il file public/CNAME. Procedura completa nel README.
// ---------------------------------------------------------------------------
const SITE = 'https://simonefrancomarketing.it';
const BASE = '/ferramenta-aruga';

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
