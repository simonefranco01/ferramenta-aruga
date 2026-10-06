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
    short: 'Sostituiamo serrature e cilindri su porte blindate e tradizionali.',
    icon: 'key',
  },
  {
    slug: 'colori-vernici',
    path: '/colori-vernici/',
    title: 'Colori e vernici personalizzati',
    footerTitle: 'Colori e vernici personalizzati',
    short: 'Il colore che vuoi, preparato al momento grazie al nostro tintometro. Siamo rivenditori ufficiali San Marco.',
    icon: 'roller',
  },
  {
    slug: 'zanzariere-tende',
    path: '/zanzariere-tende/',
    title: 'Zanzariere, binari balcone e sistemi per tende',
    footerTitle: 'Zanzariere, binari balcone e tende',
    short: 'Prendiamo le misure noi e ci affidiamo ai nostri artigiani per il montaggio.',
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
  { value: 'professionisti', label: 'Per professionisti, imprese e strutture' },
  { value: 'altro', label: 'Altra richiesta' },
];

export function serviceLabel(slug?: string): string | undefined {
  return formOptions.find((o) => o.value === slug)?.label;
}
