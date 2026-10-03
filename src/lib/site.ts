// Dati dell'attività letti da src/data/site.json, con i controlli di validità.
// Un valore non valido (vuoto o "[DA INSERIRE]") spegne la funzione collegata:
// niente link segnaposto online.
import data from '../data/site.json';

export const site = data;

const waDigits = String(data.whatsapp ?? '').replace(/[\s+\-()]/g, '');
/** Numero WhatsApp in formato internazionale senza "+", oppure null se non impostato. */
export const whatsappNumber: string | null = /^[1-9]\d{9,14}$/.test(waDigits) ? waDigits : null;

/** Email dell'attività, oppure null se non impostata. */
export const email: string | null = /^[^\s@\[\]]+@[^\s@\[\]]+\.[a-z]{2,}$/i.test(String(data.email ?? ''))
  ? data.email
  : null;

/** Endpoint Formspree, oppure null se non impostato. */
export const formEndpoint: string | null = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(String(data.formEndpoint ?? ''))
  ? data.formEndpoint
  : null;

export const telHref = `tel:${data.phone.tel}`;
export const phoneDisplay = data.phone.display;

/** Link WhatsApp con messaggio precompilato, oppure null se il numero non è impostato. */
export function waLink(message: string): string | null {
  return whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : null;
}

export function waQuoteMessage(serviceLabel?: string): string {
  return serviceLabel
    ? `Ciao, vi scrivo dal sito per un preventivo: ${serviceLabel}.`
    : 'Ciao, vi scrivo dal sito per un preventivo.';
}

/** Nome del fondatore: "il nonno" finché non viene fornito. */
export const founder = data.founderName ? `il nonno ${data.founderName}` : 'il nonno';

export const socialLinks = [
  { label: 'Facebook', href: data.social.facebook },
  { label: 'Instagram', href: data.social.instagram },
].filter((s) => /^https:\/\//.test(s.href));

export const ratingDisplay = data.rating.value.toFixed(1).replace('.', ',');
