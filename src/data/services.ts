// Le 4 pagine servizio: usate da card della home, footer, 404 e select del form.
export type IconName = 'key' | 'roller' | 'window' | 'bulb';

export interface Service {
  slug: string;
  path: string;
  title: string;
  footerTitle: string;
  short: string;
  icon: IconName;
  inverted?: boolean;
}

export const services: Service[] = [
  {
    slug: 'serrature',
    path: '/serrature/',
    title: 'Serrature e cilindri',
    footerTitle: 'Serrature e cilindri',
    short: 'Cambio cilindri e serrature, dalla doppia mappa alla porta blindata.',
    icon: 'key',
  },
  {
    slug: 'colori-vernici',
    path: '/colori-vernici/',
    title: 'Colori e vernici su misura',
    footerTitle: 'Colori e vernici su misura',
    short: 'Il colore che vuoi, preparato al tintometro. Rivenditori ufficiali San Marco.',
    icon: 'roller',
  },
  {
    slug: 'zanzariere-tende',
    path: '/zanzariere-tende/',
    title: 'Zanzariere e tende su misura',
    footerTitle: 'Zanzariere e tende su misura',
    short: 'Prendiamo le misure a casa e montiamo noi.',
    icon: 'window',
  },
  {
    slug: 'troviamo-la-soluzione',
    path: '/troviamo-la-soluzione/',
    title: 'Hai un problema? Troviamo la soluzione',
    footerTitle: 'Troviamo la soluzione',
    short: "Non trovi il pezzo giusto? Portaci il problema, cerchiamo insieme l'alternativa.",
    icon: 'bulb',
    inverted: true,
  },
];

/** Opzioni della select "Servizio" nel form. */
export const formOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: 'professionisti', label: 'Per professionisti e strutture' },
  { value: 'altro', label: 'Altra richiesta' },
];

export function serviceLabel(slug?: string): string | undefined {
  return formOptions.find((o) => o.value === slug)?.label;
}
