import type { Metadata } from 'next';

import { CookiePreferences } from '@/components/cookie-consent';
import { LegalPage } from '@/components/legal-page';

const title = 'Privacy Policy';
const description = 'How Victor Chandra’s portfolio handles visitor preferences, analytics and links.';
const url = 'https://victorch.dev/privacy.html';
const images = ['https://victorch.dev/og.png'];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Victor Chandra', type: 'website', images },
  twitter: { card: 'summary_large_image', title, description, images },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 4, 2026">
      <section>
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p className="mt-3">This portfolio does not collect personal data.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Site delivery</h2>
        <p className="mt-3">The site is served from a server run by Victor Chandra. The web server does not keep access logs. The profile photo is loaded from GitHub, which may process request information under its own privacy policy.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Local preferences</h2>
        <p className="mt-3">Your consent choice is saved in your browser&apos;s local storage under <code>cookie-consent-v2</code> so the banner can remember your choice. No advertising cookies are used.</p>
        <p className="mt-3">To change your choice, use <CookiePreferences className="text-primary underline" />; the banner will ask again. If your browser blocks storage, you can still dismiss the banner, but your choice will not be remembered after you reload.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
        <p className="mt-3">Only if you choose Accept, the site loads Google Analytics, which sets cookies (<code>_ga</code> and <code>_ga_*</code>) and sends Google page views, approximate location and device details so Victor Chandra can see how the site is used. Google processes this under its own <a className="text-primary underline" href="https://policies.google.com/privacy" rel="noreferrer" target="_blank">privacy policy</a>. If you choose Decline, Google Analytics is never loaded.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">External links and email</h2>
        <p className="mt-3">Links to external sites, including GitHub and LinkedIn, are governed by those sites&apos; own policies. The <a className="text-primary underline" href="mailto:hello@victorch.dev">mailto contact option</a> opens your email application; an email is only shared when you choose to send it.</p>
      </section>
    </LegalPage>
  );
}
