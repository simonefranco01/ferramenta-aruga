// Genera favicon, apple-touch-icon, logo per JSON-LD e immagine Open Graph dai loghi in src/assets.
// Uso: npm run icons (da rilanciare quando arriva il logo vettoriale).
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const YELLOW = { r: 246, g: 200, b: 1, alpha: 1 };
const src = (f) => new URL(`../src/assets/${f}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const out = (f) => new URL(`../public/${f}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// Icona quadrata: la T col martello centrata su fondo giallo.
async function squareIcon(size) {
  const inner = Math.round(size * 0.78);
  // Il ritaglio a destra toglie il filo della "E" rimasto nel PNG.
  const cropped = await sharp(src('logo-T.png')).extract({ left: 0, top: 0, width: 178, height: 365 }).toBuffer();
  const trimmed = await sharp(cropped).trim().toBuffer();
  const t = await sharp(trimmed).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: YELLOW } })
    .composite([{ input: t, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// favicon.ico con un'immagine PNG 32x32 (formato ICO con payload PNG).
function pngToIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); entry.writeUInt8(32, 1); entry.writeUInt8(0, 2); entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8); entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

await writeFile(out('favicon.ico'), pngToIco(await squareIcon(32)));
await writeFile(out('favicon.png'), await squareIcon(192));
await writeFile(out('apple-touch-icon.png'), await squareIcon(180));

// Logo per i dati strutturati.
await sharp(src('logo-giallo.png')).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(out('logo.png'));

// Immagine Open Graph 1200x630: logo su fondo giallo.
const logo = await sharp(src('logo-trasparente.png')).resize({ width: 1040 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: YELLOW } })
  .composite([{ input: logo, gravity: 'center' }])
  .flatten({ background: YELLOW })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out('og-image.jpg'));

console.log('Icone e immagine Open Graph generate in public/');
