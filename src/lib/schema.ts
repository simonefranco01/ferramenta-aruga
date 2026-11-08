// Dati strutturati (JSON-LD) per Google e i motori di ricerca basati su AI.
// Niente qui è visibile nella pagina. Tutti i valori arrivano da site.json e services.ts:
// aggiungendo un servizio o compilando i campi "seo" in site.json, gli schemi si aggiornano da soli.
import { site, seo, email } from './site';
import { services } from '../data/services';
import { absoluteUrl } from './url';

type Json = Record<string, unknown>;

/** Identificatore stabile del negozio: gli altri schemi lo richiamano con {"@id": …}. */
export function storeId(siteUrl: URL | undefined) {
  return `${absoluteUrl('/', siteUrl)}#negozio`;
}

/** Il negozio (HardwareStore), presente su ogni pagina. */
export function storeJsonLd(siteUrl: URL | undefined, ogImage: string): Json {
  const homeUrl = absoluteUrl('/', siteUrl);
  const sameAs = [...Object.values(site.social), ...seo.sameAs].filter((u) => /^https:\/\//.test(u));
  return {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    '@id': storeId(siteUrl),
    name: site.name,
    alternateName: site.googleName,
    legalName: site.legalName,
    vatID: site.vatId,
    description: site.tagline,
    foundingDate: String(site.foundingYear),
    url: homeUrl,
    logo: absoluteUrl('/logo.png', siteUrl),
    image: ogImage,
    telephone: site.phone.tel,
    ...(email ? { email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      ...(seo.postalCode ? { postalCode: seo.postalCode } : {}),
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    ...(seo.geo ? { geo: { '@type': 'GeoCoordinates', latitude: seo.geo.latitude, longitude: seo.geo.longitude } } : {}),
    areaServed: site.address.city,
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.hours.spec.map((s) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: s.days.map((d) => `https://schema.org/${d}`),
      opens: s.opens,
      closes: s.closes,
    })),
    // Servizi del negozio, uno per ogni pagina servizio (nessun prezzo).
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, url: absoluteUrl(s.path, siteUrl) },
    })),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Il sito web: aiuta Google a mostrare "Ferramenta Aruga" come nome del sito. */
export function websiteJsonLd(siteUrl: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/', siteUrl)}#sito`,
    name: site.name,
    alternateName: site.googleName,
    url: absoluteUrl('/', siteUrl),
    inLanguage: 'it',
    publisher: { '@id': storeId(siteUrl) },
  };
}

/** Briciole di pane: Home > Pagina. */
export function breadcrumbJsonLd(siteUrl: URL | undefined, pageName: string, pagePath: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/', siteUrl) },
      { '@type': 'ListItem', position: 2, name: pageName, item: absoluteUrl(pagePath, siteUrl) },
    ],
  };
}

/** Un servizio offerto dal negozio, collegato al negozio. */
export function serviceJsonLd(
  siteUrl: URL | undefined,
  o: { name: string; path: string; areaServed?: string[] },
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: o.name,
    serviceType: o.name,
    url: absoluteUrl(o.path, siteUrl),
    provider: { '@id': storeId(siteUrl) },
    ...(o.areaServed?.length ? { areaServed: o.areaServed.map((n) => ({ '@type': 'City', name: n })) } : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}
