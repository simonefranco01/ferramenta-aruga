# Handoff: Sito Ferramenta Aruga — direzione "Insegna"

## Overview
Sito vetrina per Ferramenta Aruga (ferramenta e colorificio, Via Barletta 55/B, Torino, quartiere Santa Rita, dal 1986). Obiettivo: portare l'utente a **chiedere un preventivo** (form) o **chiamare** (011 324 1363). Pubblico ampio, anche anziano: testo grande, target touch ≥48px, contrasto alto.

Pagine disegnate: **Home** e una pagina servizio modello, **Serrature e cilindri**. Le altre 3 pagine servizio (Colori e vernici su misura, Zanzariere e tende su misura, Hai un problema? Troviamo la soluzione) vanno create sullo stesso modello della pagina Serrature.

## About the Design Files
I file in `design/` sono **riferimenti di design in HTML**: prototipi che mostrano aspetto e comportamento, **non codice di produzione da copiare**. Il compito è **ricreare questi design** nello stack del progetto (se non esiste ancora: consigliato un sito statico, per esempio Astro o Next.js static export, con CSS normale o Tailwind). Gli stili nei prototipi sono inline per esigenze dello strumento di design: in produzione vanno estratti in classi e componenti.

- `design/*.dc.html` sono i sorgenti. Per aprirli serve `support.js` nella stessa cartella, servita da un server locale (`npx serve design`).
- `anteprima/*.html` sono le stesse pagine in un solo file ciascuna: si aprono con doppio clic, per vedere il risultato atteso.

Nei sorgenti, `<sc-if value="{{ d }}">` = mostra solo su desktop (≥760px), `{{ m }}` = solo su mobile (<760px). `style-hover` / `style-active` = stati :hover / :active.

## Fidelity
**High-fidelity.** Colori, tipografia, spaziature, bordi, ombre, testi e animazioni sono definitivi. Da ricreare fedelmente. I testi sono approvati: non riscriverli.

Placeholder da sostituire: foto (riquadri a righe con etichetta "FOTO: …"), mappa ("MAPPA: …"), link `#` (Indicazioni, Facebook, Instagram, Privacy, le 3 pagine servizio mancanti).

## Design Tokens
**Colori**
- Giallo brand `#F6C801` (sfondi hero/sezioni, header, pulsanti secondari)
- Blu brand `#274695` (titoli, CTA primarie, sezione recensioni)
- Nero inchiostro `#141414` (testo, tutti i bordi, ombre piene)
- Crema `#FFFBEA` (sfondo pagina, sezioni alternate)
- Bianco `#FFFFFF` (card, sezioni alternate)
- Giallo chiaro placeholder `#FFF3B8`, mappa `#E8EEF8` / griglia `#CFD9EC`
- Footer: sfondo `#141414`, testo `#DDDDDD`, meta `#AAAAAA`, divisore `#333333`

**Tipografia**: Bricolage Grotesque (Google Fonts, pesi 400/600/800, asse opsz 12..96), fallback system-ui.
- Base body: 19px / 1.5
- H1 home: `clamp(46px, 7.6vw, 108px)`, lh .95, ls -.035em, 800, blu, max-width 14ch, text-wrap balance
- H1 servizio: `clamp(44px, 6.2vw, 88px)`, lh .96
- H2 sezione: `clamp(34px, 4.2vw, 56px)`, lh 1, ls -.03em, 800
- Titolo card: 25px/1.1, 800 · testo card 18px/1.45
- Eyebrow: 15px, 800, uppercase, ls .08em, blu
- Minimo assoluto: 15px (solo meta/footer)

**Forme**
- Bordo standard: `3px solid #141414` (chip/pill: 2.5px)
- Radius: card 18px, form 20px, input 12px, icon-box 14px, righello 10px, pulsanti/chip 999px
- Ombra piena (senza sfocatura): card `7px 7px 0 #141414` (hover `9px 9px 0` + translate(-2px,-2px)), pulsanti `4–5px 4–5px 0 #141414`, foto `8px 8px 0`
- Pulsanti: min-height 48px (header), 56–60px (CTA principali). Stato active del submit: translate(3px,3px) e ombra 2px.

**Layout**: contenitore max-width 1240px (FAQ e form 880px), padding orizzontale `clamp(16px, 4vw, 40px)`, padding verticale sezioni `clamp(48px, 6vw, 88px)`. Le sezioni sono separate da `border-bottom: 3px solid #141414`. Griglie con `repeat(auto-fit, minmax(…, 1fr))`: si adattano senza breakpoint.

## Screens

### Header (comune, sticky)
Sfondo giallo, bordo inferiore nero 3px. A sinistra il logo, largo `clamp(170px, 22vw, 250px)`, diviso in due immagini: `logo-T.png` (la T col martello, 10.81% della larghezza) + `logo-resto.png` (89.19%). A destra il pulsante telefono (pill bianca; su mobile solo icona 48×48) e, solo desktop, "Chiedi preventivo" (pill blu, ombra 4px).

### Home
1. **Hero** (giallo): H1 "Arrivi con un problema, esci con la soluzione.", sottotitolo, 3 chip bianche (★ 4,8 su Google · 208 recensioni / Aperti anche il sabato / Nessun costo di uscita).
2. **Di cosa hai bisogno?** (`id="servizi"`, sempre nella sezione gialla): 4 card cliccabili (min-width 250px, min-height 230px) con icon-box 60px blu/giallo, titolo, descrizione e freccia tonda gialla 48px. La 4ª card è invertita: sfondo blu, titolo giallo, testo bianco.
3. **Banda professionisti** (crema): eyebrow "Per professionisti e strutture", testo, pill "Parliamone".
4. **Come funziona** (bianco): **righello a 3 segmenti**, uno per passo, in una griglia a 3 colonne con gap orizzontale 0. Ogni segmento: altezza 76px, bordo nero 3px, `margin-right: -3px` (i bordi si sovrappongono), sfondo giallo con tacche nere (maggiori ogni 80px, alte 22px e spesse 3px; minori ogni 16px, alte 11px e spesse 2px), ombra `4px 4px 0`, numero 38px/800 in basso a sinistra (padding 0 0 6px 14px); il "3" è blu. Radius: desktop solo sulle estremità (1° `10px 0 0 10px`, 2° `0`, 3° `0 10px 10px 0`) così i 3 pezzi formano un unico righello; mobile (colonne impilate) ogni segmento ha `10px` su tutti gli angoli. Sotto ogni segmento il testo 21px/600 con padding-right 24px. Poi la CTA "Chiedi il preventivo gratuito".
5. **Cosa dicono i clienti** (blu): H2 bianco, badge giallo con "4,8" 56px e "★★★★★ 208 recensioni Google", 6 recensioni in griglia (minmax 280px). La 2ª è gialla con testo più grande.
6. **La nostra storia: 40 anni a Santa Rita** (giallo, 2 colonne): testo, poi **linea del tempo verticale a viti**: ol con padding-left 48px; binario 4px a left 12px (`rgba(20,20,20,.2)`) più riempimento blu `#274695` sovrapposto; 4 viti SVG 28px (cerchio r 9.5, bordo nero 2px, croce nera 2.2px) a left -48px. Tappe: 1986 · Il nonno apre in Via Barletta / Poi · Arriva Giorgio / Oggi · C'è Vittorio / 2026 · 40 anni. L'ultima vite è blu con la croce gialla. Titoli tappa 26px/800 blu, testo 18px/600. Colonna destra: foto 4:3 con il badge `logo-40-anni.png` circolare sovrapposto in basso a destra.
7. **Dove siamo e orari** (crema): card con Indirizzo / Orari / Telefono separati da tratteggio, pulsanti "Indicazioni" (giallo) e "Chiama" (blu), mappa a destra (min-height 340px).
8. **Footer** (nero): logo su riquadro giallo, orari, link servizi, social, privacy, copyright.

### Pagina servizio: Serrature e cilindri
1. Link "← Tutti i servizi" (verso `home#servizi`). Hero giallo a 2 colonne: tag blu "Serrature e cilindri", H1 "Una porta più sicura, senza complicazioni.", testo, CTA verso `#preventivo`; foto 5:4 a destra.
2. **Ti riconosci in una di queste situazioni?** 5 card: citazione in alto (22px/800) e fascia gialla in basso con la soluzione.
3. **Cosa facciamo** (lista di 8 voci con check su quadrato giallo) + **Perché noi** (4 box, "40" con contatore animato) + recensione di Concetta D.
4. **Come funziona** (sfondo blu): stesso righello a 3 segmenti della home; testo bianco.
5. **Domande frequenti**: 5 `<details>`, il primo aperto; summary min-height 60px con "+" su cerchio giallo 36px.
6. **Form preventivo** (`id="preventivo"`, sezione gialla, card bianca con ombra 8px): Servizio (select precompilata sul servizio della pagina), Nome, Telefono, Descrivi il problema (textarea), Aggiungi una foto (facoltativa, file image/*), Preferenza di contatto (radio a pill: WhatsApp predefinito / Email / Telefono), checkbox privacy, "Invia la richiesta", link per chiamare.

### Mobile (<760px)
Barra fissa in basso (sfondo giallo, bordo superiore 3px): "Chiedi preventivo" (pill blu, flex 1, 52px) + pulsante telefono tondo bianco 56px; rispetta `env(safe-area-inset-bottom)`. Il footer riceve 84px di spazio extra. Nell'header resta solo l'icona telefono.

## Interactions & Behavior
- **CTA "Chiedi preventivo"**: in home porta a `#servizi` (prima si sceglie il servizio); nelle pagine servizio porta a `#preventivo`. Scroll fluido.
- **Animazioni all'ingresso in viewport** (IntersectionObserver, soglia 0.12, una sola volta), con Web Animations API e `fill: backwards`:
  - `up`: opacità 0→1, translateY 26px→0, 600ms
  - `pop`: opacità 0→1, translateY 30px + scale .95 → none, 600ms
  - `hammer` (T del logo, al caricamento, delay 300ms, 1000ms): rotate 0 → -32° (35%) → 5° (55%) → -4° (72%) → 0, origine 45% 96%
  - `ruler` (segmenti righello): scaleX 0→1, origine a sinistra, 700ms, delay 0/180/360ms
  - `screw` (viti): rotate(-300°) scale(.4), opacità 0 → none, delay 200/900/1600/2300ms
  - `fill` (binario blu della timeline): scaleY 0→1, origine in alto, 2600ms, **linear**, in sincrono con le viti
  - `count`: contatori da 0 al valore (4,8 · 208 · 40) in 1400ms, ease-out cubico, virgola decimale italiana
  - Easing standard `cubic-bezier(.2,.8,.2,1)`. Ritardi a cascata indicati con `data-d` nei sorgenti.
- **`prefers-reduced-motion: reduce`**: nessuna animazione, scroll non fluido.
- **Form**: nel prototipo l'invio non fa nulla. Da implementare: campi obbligatori Nome, Telefono, Descrizione e privacy; invio verso email o backend; messaggio di conferma; errori in linea sotto i campi, stesso stile dei bordi.
- **FAQ**: `<details>` nativi.

## State Management
Solo stato UI: breakpoint mobile (<760px) per barra fissa, header e radius del righello; stato aperto/chiuso delle FAQ (nativo). Lato form: valori dei campi, stato invio (inviando / inviato / errore).

## Assets
- `assets/logo-trasparente.png`: logo completo su trasparente (header nel footer su riquadro giallo)
- `assets/logo-T.png` + `assets/logo-resto.png`: logo diviso per animare il martello
- `assets/logo-giallo.png`: logo su fondo giallo
- `assets/logo-40-anni.png`: badge 40 anni
- I loghi sono ritagliati da un JPEG: **chiedere al cliente il vettoriale originale** (SVG/AI) e rifare la divisione T/resto in SVG.
- Icone: SVG inline con tratto 2.2–2.6 (telefono, frecce, check, fotocamera, icone servizi). Si possono sostituire con una libreria a tratto spesso, per esempio Lucide con stroke-width 2.5.
- Foto e mappa: da fornire (vetrina, serratura montata, quattro generazioni, prodotti). Mappa: embed Google Maps o OpenStreetMap su Via Barletta 55/B, Torino.

## Files
- `design/A-Insegna-Home.dc.html`: Home
- `design/A-Insegna-Serrature.dc.html`: pagina servizio modello
- `design/support.js`: runtime per aprire i sorgenti
- `design/assets/`: loghi
- `anteprima/Home.html`, `anteprima/Serrature-e-cilindri.html`: anteprime in file singolo
