// Scelta sui cookie / contenuti esterni (per ora solo la mappa di Google Maps).
// Il sito non usa cookie di profilazione: la scelta si salva in localStorage (tecnico, non tracciante).
export type Consent = 'all' | 'necessary';

const KEY = 'aruga-cookie-consent';

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'all' || v === 'necessary' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* localStorage non disponibile: la scelta vale solo per questa pagina */
  }
  window.dispatchEvent(new CustomEvent('aruga:consent', { detail: value }));
}

/** Riapre il pop-up (dal link "Preferenze cookie" nel footer). */
export function openConsentBanner() {
  window.dispatchEvent(new CustomEvent('aruga:open-consent'));
}
