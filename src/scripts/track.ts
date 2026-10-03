// Tracciamento dei clic, predisposto ma senza strumenti di analytics attivi.
// Ogni elemento con data-track="nome-evento" viene registrato al clic.
// Per collegare uno strumento (es. Plausible, GA4) basta modificare send():
// se usa cookie di profilazione, va aggiunto anche il banner cookie.

export type TrackEvent = 'preventivo' | 'chiama' | 'whatsapp' | 'form_invio' | (string & {});

function send(event: TrackEvent, detail: Record<string, string> = {}) {
  // Evento DOM a cui agganciare in futuro lo strumento di analytics.
  window.dispatchEvent(new CustomEvent('aruga:track', { detail: { event, ...detail } }));
  if (import.meta.env.DEV) console.debug('[track]', event, detail);
}

export function track(event: TrackEvent, detail?: Record<string, string>) {
  try {
    send(event, detail);
  } catch {
    /* il tracciamento non deve mai bloccare la pagina */
  }
}

document.addEventListener(
  'click',
  (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track as TrackEvent, { page: location.pathname, where: el.dataset.trackWhere || '' });
  },
  { capture: true },
);
