import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

const title = 'Terms and Conditions';
const description = 'Terms for using Victor Chandra’s portfolio.';
const url = 'https://victorch.dev/terms.html';
const images = ['https://victorch.dev/og.png'];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Victor Chandra', type: 'website', images },
  twitter: { card: 'summary_large_image', title, description, images },
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
        <h2 className="text-xl font-semibold text-foreground">Intellectual property</h2>
        <p className="mt-3">Unless otherwise stated, the original content on this portfolio belongs to Victor Chandra. Project materials, trademarks, and third-party content belong to their respective owners. Viewing this site does not grant permission to reproduce or distribute those materials; obtain permission from the relevant owner where required.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">No warranty</h2>
        <p className="mt-3">This site is provided as is and as available, without warranties to the extent permitted by law. Its content may contain errors or become outdated, and uninterrupted availability is not guaranteed. These terms do not limit rights that cannot lawfully be excluded.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p className="mt-3">For questions about this site, use the <a className="text-primary underline" href="mailto:hello@victorch.dev">mailto contact option</a>.</p>
      </section>
    </LegalPage>
  );
}
