/// <reference types="vite/client" />
'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CONSENT_KEY, loadAnalytics, resetConsent } from '@/lib/analytics';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(CONSENT_KEY);
        if (saved === 'accepted') loadAnalytics();
        setVisible(!saved);
      } catch {
        setVisible(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Storage may be disabled; the choice still dismisses this page's banner.
    }
    if (value === 'accepted') loadAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside aria-label="Cookie preference" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6">
      <p className="text-sm leading-6 text-muted-foreground">Accept to allow Google Analytics cookies, which show me how visitors use this site. Decline keeps it to a stored preference. See the <a className="underline" href={`${import.meta.env.BASE_URL}privacy.html`}>Privacy Policy</a>.</p>
      <div className="cookie-consent-actions mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button onClick={() => choose('declined')} variant="outline">Decline</Button>
        <Button onClick={() => choose('accepted')}>Accept</Button>
      </div>
    </aside>
  );
}

/** Lets a visitor withdraw or change their choice: clears it and reloads so the banner asks again. */
export function CookiePreferences({ className }: { className?: string }) {
  return <button className={className} onClick={resetConsent} type="button">Cookie preferences</button>;
}
