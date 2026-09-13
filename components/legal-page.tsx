import type { ReactNode } from 'react';

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
      <a className="text-sm font-medium text-muted-foreground hover:text-foreground" href="/">← Back to portfolio</a>
      <h1 className="mt-10 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      <article className="mt-12 space-y-8 text-base leading-7 text-muted-foreground">{children}</article>
    </main>
  );
}
