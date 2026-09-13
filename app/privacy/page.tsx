import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Victor Chandra’s portfolio handles visitor preferences and links.',
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
        <p className="mt-3">Theme and consent preferences are stored locally in your browser so the site can remember your choices. They are not sent to Victor Chandra.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">External links and email</h2>
        <p className="mt-3">Links to external sites, including GitHub and LinkedIn, are governed by those sites&apos; own policies. The <a className="text-primary underline" href="mailto:vichndrlie@outlook.com">mailto contact option</a> opens your email application; an email is only shared when you choose to send it.</p>
      </section>
    </LegalPage>
  );
}
