import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms for using Victor Chandra’s portfolio.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="September 13, 2026">
      <section>
        <h2 className="text-xl font-semibold text-foreground">Use of this site</h2>
        <p className="mt-3">This portfolio is provided to share Victor Chandra&apos;s work and experience. Please use its content for personal and professional reference.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">External links</h2>
        <p className="mt-3">External links are provided for convenience. Their content, availability, and privacy practices are controlled by their respective providers.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p className="mt-3">For questions about this site, use the <a className="text-primary underline" href="mailto:vichndrlie@outlook.com">mailto contact option</a>.</p>
      </section>
    </LegalPage>
  );
}
