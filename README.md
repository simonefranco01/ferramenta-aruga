# Sito Ferramenta Aruga

Sito statico (Astro) per Ferramenta Aruga, ferramenta e colorificio a Torino Santa Rita, dal 1986.
Il design è la direzione "A – Insegna" (specifiche in `HANDOFF-DESIGN.md`, sorgenti in `design/`, anteprime in `anteprima/`).

## Comandi

```bash
npm install
npm run dev       # sviluppo su http://localhost:4321/ferramenta-aruga/
npm run build     # sito in dist/
npm run preview   # prova della build
npm run icons     # rigenera favicon, logo JSON-LD e immagine Open Graph dai loghi
```

## Dove si modificano le cose

| Cosa | Dove |
|---|---|
| Nome, indirizzo, telefono, WhatsApp, email, orari, voto e recensioni, endpoint del form, social, **flag `staging`** | `src/data/site.json` |
| Le 4 card servizio e le opzioni del form | `src/data/services.ts` |
| Colori e stili (token del design) | `src/styles/global.css` |
| Animazioni | `src/scripts/motion.ts` |
| Tracciamento dei clic | `src/scripts/track.ts` |
| `site` e `base` (per il cambio dominio) | `astro.config.mjs` |

Nessun link interno è scritto a mano: si usa sempre `url()` da `src/lib/url.ts`, che tiene conto del base path.

## Valori segnaposto ancora da compilare (`src/data/site.json`)

Finché un valore non è valido, la funzione collegata resta spenta e **nessun link segnaposto va online**.

| Campo | Cosa succede finché manca |
|---|---|
| `whatsapp` (numero con prefisso, es. `393331234567`) | Spariscono i pulsanti WhatsApp (header, form, `/grazie/`, `/troviamo-la-soluzione/`) e l'opzione di ricontatto WhatsApp. La CTA di `/troviamo-la-soluzione/` porta al form. |
| `formEndpoint` (`https://formspree.io/f/xxxx`) | Il form non si invia: al posto del pulsante c'è "Per ora chiamaci allo 011 324 1363" con link `tel:`. |
| `email` | Nessuna email mostrata, nessuna opzione di ricontatto via email, niente `email` nei dati strutturati. |
| `founderName` | Si scrive "il nonno". |
| `social.facebook`, `social.instagram` | La colonna "Seguici" non compare nel footer. |

Il form manda i dati a Formspree, che li inoltra all'email dell'attività: crea il form su formspree.io con quell'email e incolla l'endpoint.

## Modalità staging

`"staging": true` in `src/data/site.json`: ogni pagina ha `<meta name="robots" content="noindex, nofollow">` e `robots.txt` blocca tutto.
Nota: sul sito in sottocartella (`/ferramenta-aruga/`) il file `robots.txt` non è alla radice del dominio e i crawler non lo leggono; la protezione effettiva in staging è il meta `noindex`.

## Foto da sostituire

I riquadri "FOTO: …" vanno sostituiti con foto reali (WebP o JPEG, lato lungo almeno il doppio della larghezza mostrata).

| Pagina | Etichetta | Dimensioni consigliate |
|---|---|---|
| Home | FOTO: quattro generazioni | 1600×1200 (4:3) |
| Serrature | FOTO: serratura montata su una porta | 1600×1280 (5:4) |
| Colori e vernici | FOTO: tintometro e barattoli di vernice | 1600×1280 (5:4) |
| Zanzariere e tende | FOTO: zanzariera montata su una finestra | 1600×1280 (5:4) |
| Troviamo la soluzione | FOTO: il banco con un pezzo da sistemare | 1600×1280 (5:4) |
| Professionisti | FOTO: il negozio, scaffali e vernici | 1600×1280 (5:4) |

Il riquadro è il componente `src/components/PhotoPlaceholder.astro`: per mettere la foto, inserisci un `<Image>` dentro lo slot e togli l'etichetta. Va usato un testo alternativo descrittivo.

## Loghi

I loghi in `src/assets/` sono ritagliati da un JPEG. **Serve il vettoriale originale (SVG/AI)** per sostituirli e rifare la divisione T/resto per l'animazione del martello. Favicon e immagine Open Graph si rigenerano con `npm run icons`.

## Privacy

`/privacy/` contiene un'informativa base per il form. **Il testo va verificato dal titolare** (in particolare tempi di conservazione e servizio usato per l'invio).

## Pubblicazione

Ogni push su `main` fa il deploy su GitHub Pages con il workflow `.github/workflows/deploy.yml`.
All'inizio il sito è in sottocartella (`/ferramenta-aruga/`).

## Passaggio al dominio della ferramenta

1. In `astro.config.mjs` imposta `SITE` con il nuovo dominio (es. `https://www.dominio.it`) e `BASE` a `'/'`.
2. Crea `public/CNAME` con una sola riga: il dominio (es. `www.dominio.it`).
3. Presso il registrar crea i record DNS:
   - 4 record **A** per il dominio principale verso `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   - un record **CNAME** `www` verso `simonefranco01.github.io`.
4. In GitHub: repository → Settings → Pages → inserisci il dominio e, quando il certificato è pronto, attiva **Enforce HTTPS**.
5. **Imposta `"staging": false`** in `src/data/site.json` (toglie il `noindex` e riapre `robots.txt`).
6. Fai push e aspetta il deploy.
7. Verifica con il nuovo dominio: URL canonici, `sitemap-index.xml` e `robots.txt`.
8. **Invia la sitemap a Google Search Console** (`https://dominio/sitemap-index.xml`).

## Tracciamento

I pulsanti hanno un attributo `data-track` (`preventivo`, `chiama`, `whatsapp`, `form_invio`). `src/scripts/track.ts` emette un evento `aruga:track`: nessuno strumento di analytics è attivo. Se in futuro se ne aggiunge uno che usa cookie di profilazione, servirà anche il banner cookie.
