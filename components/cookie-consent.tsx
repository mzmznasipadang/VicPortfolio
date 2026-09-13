/// <reference types="vite/client" />
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(!localStorage.getItem('cookie-consent')));
    return () => cancelAnimationFrame(frame);
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    localStorage.setItem('cookie-consent', value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside aria-label="Cookie preference" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6">
      <p className="text-sm leading-6 text-muted-foreground">This site stores your cookie preference. See the <Link href={`${import.meta.env.BASE_URL}privacy/`}>Privacy Policy</Link>.</p>
      <div className="cookie-consent-actions mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button onClick={() => choose('declined')} variant="outline">Decline</Button>
        <Button onClick={() => choose('accepted')}>Accept</Button>
      </div>
    </aside>
  );
}
