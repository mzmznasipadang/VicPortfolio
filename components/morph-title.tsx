'use client';

import { gsap } from 'gsap';
import { useEffect, useId, useRef } from 'react';

/**
 * Cycles through `words`, blurring one into the next behind an SVG threshold
 * filter so the letters melt together. Purely visual: pass the readable text to the heading separately.
 */
export function MorphTitle({ words }: { words: string[] }) {
  const filterId = `morph-${useId().replace(/:/g, '')}`;
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const from = a.current;
    const to = b.current;
    if (!from || !to) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let index = 0;
      const state = { f: 0 };
      const paint = () => {
        // Outgoing word blurs out as the incoming one sharpens; the threshold filter fuses them.
        const f = state.f;
        to.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
        to.style.opacity = `${Math.pow(f, 0.4)}`;
        from.style.filter = `blur(${Math.min(8 / (1 - f) - 8, 100)}px)`;
        from.style.opacity = `${Math.pow(1 - f, 0.4)}`;
      };
      const timeline = gsap.timeline({ repeat: -1 });
      const step = () => {
        from.textContent = words[index % words.length];
        to.textContent = words[(index + 1) % words.length];
        state.f = 0.0001;
        paint();
      };
      step();
      timeline
        .to(state, { f: 0.9999, duration: 1, ease: 'none', delay: 2, onUpdate: paint })
        .call(() => { index++; step(); });
      return () => timeline.kill();
    });
    return () => media.revert();
  }, [words]);

  return (
    <span aria-hidden className="relative block">
      <svg className="absolute size-0" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
      <span className="relative block" style={{ filter: `url(#${filterId})` }}>
        {/* Invisible sizer keeps the line height stable while the stacked words swap. */}
        <span className="invisible block">{words.reduce((longest, word) => (word.length > longest.length ? word : longest), '')}</span>
        <span className="absolute inset-0" ref={a}>{words[0]}</span>
        <span className="absolute inset-0 opacity-0" ref={b} />
      </span>
    </span>
  );
}
