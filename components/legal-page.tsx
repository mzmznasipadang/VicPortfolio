/* oxlint-disable next/no-html-link-for-pages -- GitHub Pages serves static HTML files without an RSC navigation endpoint. */
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
      <header className="flex items-center justify-between gap-3">
        <Button nativeButton={false} render={<a aria-label="Back to portfolio" href="./" />} variant="link">← Back to portfolio</Button>
        <ThemeToggle />
      </header>
      <h1 className="mt-10 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      <article className="mt-12 space-y-8 text-base leading-7 text-muted-foreground">{children}</article>
      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        <nav aria-label="Legal" className="flex gap-5">
          <a className="underline" href="privacy.html">Privacy</a>
          <a className="underline" href="terms.html">Terms</a>
        </nav>
      </footer>
    </main>
  );
}
