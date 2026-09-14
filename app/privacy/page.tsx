import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

const title = 'Privacy Policy';
const description = 'How Victor Chandra’s portfolio handles visitor preferences and links.';
const url = 'https://mzmznasipadang.github.io/VicPortfolio/privacy.html';
const images = ['https://mzmznasipadang.github.io/VicPortfolio/og.png'];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Victor Chandra', type: 'website', images },
  twitter: { card: 'summary_large_image', title, description, images },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 13, 2026">
      <section>
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p className="mt-3">This portfolio does not collect personal data.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Site delivery</h2>
        <p className="mt-3">The site is delivered through GitHub Pages. GitHub may process request information under its own privacy policy when serving the site.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Local preferences</h2>
        <p className="mt-3">Your consent choice is saved in your browser&apos;s local storage under <code>cookie-consent</code> so the banner can remember your choice. It is not sent to Victor Chandra. No analytics, advertising, or non-essential cookies are used.</p>
        <p className="mt-3">To reset your choice, clear this site&apos;s stored data in your browser settings, then reload the page. If your browser blocks storage, you can still dismiss the banner, but your choice will not be remembered after you reload.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">External links and email</h2>
        <p className="mt-3">Links to external sites, including GitHub and LinkedIn, are governed by those sites&apos; own policies. The <a className="text-primary underline" href="mailto:vichndrlie@outlook.com">mailto contact option</a> opens your email application; an email is only shared when you choose to send it.</p>
      </section>
    </LegalPage>
  );
}
