// Controllo SEO sul sito generato (cartella dist/). Uso: npm run build && npm run seo:check
// Esce con codice 1 se trova errori; gli avvisi non bloccano.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dist = join(root, 'dist');
if (!existsSync(dist)) {
  console.error('Manca dist/: lancia prima "npm run build".');
  process.exit(1);
}
const site = JSON.parse(readFileSync(join(root, 'src/data/site.json'), 'utf8'));
const siteUrl = String(site.url || '').replace(/\/+$/, '');

const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const all = walk(dist);
const htmlFiles = all.filter((f) => f.endsWith('.html'));
const pathOf = (f) => '/' + relative(dist, f).split(sep).join('/').replace(/index\.html$/, '');

const errors = [], warns = [];
const err = (page, msg) => errors.push(`${page}  ${msg}`);
const warn = (page, msg) => warns.push(`${page}  ${msg}`);
const attr = (html, re) => (html.match(re) || [])[1];

// pagine che non devono essere indicizzate
const NOINDEX_PAGES = new Set(['/grazie/', '/404.html']);
const pages = [];
const titles = new Map(), descs = new Map();

for (const f of htmlFiles) {
  const p = pathOf(f);
  const html = readFileSync(f, 'utf8');
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const isNoindexPage = NOINDEX_PAGES.has(p);
  pages.push({ p, html, title, desc, canonical, robots });

  if (!/<html lang="it"/.test(html)) err(p, 'manca lang="it"');
  if (!title) err(p, 'manca <title>');
  else {
    if (title.length > 60) warn(p, `title di ${title.length} caratteri (consigliati ≤ 60): "${title}"`);
    if (titles.has(title)) err(p, `title uguale a ${titles.get(title)}`);
    titles.set(title, p);
  }
  if (!desc) err(p, 'manca la meta description');
  else {
    if (desc.length > 160) warn(p, `description di ${desc.length} caratteri (consigliati ≤ 160)`);
    if (desc.length < 70) warn(p, `description di ${desc.length} caratteri (consigliati ≥ 70)`);
    if (descs.has(desc)) err(p, `description uguale a ${descs.get(desc)}`);
    descs.set(desc, p);
  }
  if (h1s !== 1) err(p, `${h1s} tag H1 (ne serve esattamente 1)`);
  if (p !== '/404.html') {
    if (!canonical) err(p, 'manca il canonical');
    else if (!/^https:\/\//.test(canonical)) err(p, `canonical non assoluto: ${canonical}`);
    else if (siteUrl && !canonical.startsWith(siteUrl + '/')) err(p, `canonical fuori dominio (${canonical})`);
  }
  // robots coerente con "staging"
  const expectNoindex = site.staging || isNoindexPage;
  if (expectNoindex && !/noindex/.test(robots || '')) err(p, 'dovrebbe essere noindex');
  if (!expectNoindex && /noindex/.test(robots || '')) err(p, 'è noindex ma dovrebbe essere indicizzabile');
  // open graph
  for (const k of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!new RegExp(`property="${k}" content="[^"]+"`).test(html)) err(p, `manca ${k}`);
  }
  // immagini senza alt
  // alt="" (immagine decorativa) viene scritto da Astro come "alt" senza valore: va bene.
  const noAlt = (html.match(/<img\b[^>]*>/g) || []).filter((t) => !/\salt(=|\s|>)/.test(t)).length;
  if (noAlt) err(p, `${noAlt} immagini senza attributo alt`);

  // dati strutturati
  const types = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { types.push(JSON.parse(m[1])['@type']); } catch { err(p, 'JSON-LD non valido'); }
  }
  if (p !== '/404.html' && !types.includes('HardwareStore')) err(p, 'manca lo schema HardwareStore');
  if (p === '/' && !types.includes('WebSite')) err(p, 'manca lo schema WebSite');
  if (!['/', '/404.html', '/grazie/'].includes(p) && !types.includes('BreadcrumbList')) warn(p, 'manca BreadcrumbList');
  pages[pages.length - 1].types = types;
}

// link interni e risorse
const exists = (u) => {
  let x = u.split('#')[0].split('?')[0];
  if (!x) return true;
  const f = join(dist, x);
  return existsSync(x.endsWith('/') ? join(f, 'index.html') : f);
};
for (const { p, html } of pages) {
  const bad = new Set();
  for (const m of html.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) if (!exists(m[1])) bad.add(m[1]);
  if (bad.size) err(p, `riferimenti interni che non esistono: ${[...bad].slice(0, 5).join(', ')}`);
}

// robots.txt e sitemap
const robotsTxt = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : '';
if (site.staging && !/Disallow:\s*\/\s*$/m.test(robotsTxt)) err('/robots.txt', 'in staging dovrebbe bloccare tutto');
if (!site.staging) {
  if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) err('/robots.txt', 'blocca tutto ma staging è false');
  if (!/Sitemap:\s*https:\/\//.test(robotsTxt)) err('/robots.txt', 'manca la riga Sitemap');
}
const smFile = join(dist, 'sitemap-0.xml');
if (!existsSync(smFile)) err('/sitemap', 'sitemap-0.xml non trovata');
else {
  const urls = [...readFileSync(smFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const { p } of pages) {
    if (NOINDEX_PAGES.has(p)) {
      if (urls.includes(siteUrl + p)) err(p, 'è noindex ma è nella sitemap');
    } else if (!urls.includes(siteUrl + p)) err(p, 'non è nella sitemap');
  }
}

// riepilogo
console.log(`\nPagine controllate: ${pages.length}   (staging: ${site.staging ? 'ATTIVO' : 'spento'})\n`);
console.log('pagina'.padEnd(26) + 'title  desc  schemi');
for (const { p, title, desc, types } of pages) {
  console.log(p.padEnd(26) + String(title?.length ?? 0).padEnd(7) + String(desc?.length ?? 0).padEnd(6) + [...new Set(types || [])].join(', '));
}
if (site.staging) console.log('\nATTENZIONE: "staging": true → ogni pagina è noindex e robots.txt blocca tutto. Google non indicizza finché non è false.');
if (warns.length) console.log('\nAvvisi:\n  ' + warns.join('\n  '));
if (errors.length) { console.log('\nERRORI:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('\nNessun errore.');
