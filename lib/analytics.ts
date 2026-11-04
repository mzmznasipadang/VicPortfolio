/** Google Analytics 4 measurement ID (public, from GA → Admin → Data streams). Empty = analytics off. */
export const GA_ID: string = 'G-YMV07C5BRF';

export const CONSENT_KEY = 'cookie-consent-v2'; // v2: re-asks visitors who accepted before analytics existed

/** Loads gtag.js. Called only once the visitor has accepted analytics; never before. */
export function loadAnalytics() {
  if (!GA_ID || document.getElementById('ga-script')) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  // gtag only reads real `arguments` objects, not arrays, so no rest args here.
  // oxlint-disable-next-line prefer-rest-params
  w.gtag = function gtag() { w.dataLayer.push(arguments); }; // eslint-disable-line prefer-rest-params
  w.gtag('js', new Date());
  w.gtag('config', GA_ID);
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/** Forgets the choice and reloads, so the banner asks again (and gtag, if loaded, is gone). */
export function resetConsent() {
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* storage blocked: nothing saved to clear */ }
  location.reload();
}
