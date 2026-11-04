'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

/** Toggle-button group with a pill that slides under the selected option. */
export function FilterTabs({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const pill = useRef<HTMLSpanElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const button = buttons.current[value];
    if (!button || !pill.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(pill.current, { x: button.offsetLeft, width: button.offsetWidth, duration: reduce ? 0 : 0.4, ease: 'power3.out', overwrite: true });
  }, [value]);

  return (
    <fieldset aria-label={label} className="relative inline-flex min-w-0 max-w-full flex-wrap gap-1 rounded-full border border-border bg-background p-1">
      <span aria-hidden className="absolute top-1 left-0 h-[calc(100%-0.5rem)] w-0 rounded-full bg-primary max-sm:hidden" ref={pill} />
      {options.map((option) => (
        <button
          aria-pressed={value === option}
          className="relative z-10 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors not-aria-pressed:hover:text-foreground aria-pressed:text-primary-foreground max-sm:aria-pressed:bg-primary"
          key={option}
          onClick={() => onChange(option)}
          ref={(el) => { buttons.current[option] = el; }}
          type="button"
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}
