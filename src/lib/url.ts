// Helper per il base path: tutti i link interni e le immagini in public/ passano da qui.
// Con base "/" (dominio proprio) → url('/serrature/') = '/serrature/'.
// Con una sottocartella, es. base "/sito" → url('/serrature/') = '/sito/serrature/'.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(path = '/'): string {
  if (/^(https?:|tel:|mailto:|#)/.test(path)) return path;
  return base + (path.startsWith('/') ? path : `/${path}`);
}

/** URL assoluto (per canonical, Open Graph, JSON-LD). */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site).href;
}
