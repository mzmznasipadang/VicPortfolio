'use client';

import { gsap } from 'gsap';
import { useRef } from 'react';

/**
 * Download Resume link whose icon "downloads" on hover or focus: the arrow drops
 * into the tray, the tray gives a little under the impact, and a fresh arrow
 * settles back in from above, while an underline draws in under the label.
 * Every tween starts from the live value, so leaving mid-way just eases
 * everything home.
 */
export function ResumeButton({ className }: { className?: string }) {
  const arrow = useRef<SVGGElement>(null);
  const tray = useRef<SVGPathElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const run = useRef<gsap.core.Timeline>(undefined);
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play() {
    if (!line.current) return;
    // The underline is plain feedback, so it draws even under reduced motion, just without the icon's drop.
    gsap.to(line.current, { scaleX: 1, duration: reduce() ? 0 : 0.45, ease: 'expo.out', overwrite: true });
    if (reduce() || !arrow.current || !tray.current) return;
    run.current?.kill();
    run.current = gsap.timeline()
      .to(arrow.current, { y: 7, opacity: 0, duration: 0.22, ease: 'power2.in' }, 0)
      .to(tray.current, { scaleY: 0.82, duration: 0.08, ease: 'power1.out', transformOrigin: '50% 100%' }, '>-0.04')
      .to(tray.current, { scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' })
      // immediateRender off: otherwise the arrow would jump above the tray before it has dropped
      .fromTo(arrow.current, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', immediateRender: false }, '<0.05');
  }

  function settle() {
    if (!arrow.current || !tray.current || !line.current) return;
    run.current?.kill();
    // Retract along the same path it drew, from wherever it got to.
    gsap.to(line.current, { scaleX: 0, duration: reduce() ? 0 : 0.3, ease: 'power3.out', overwrite: true });
    gsap.to(arrow.current, { y: 0, opacity: 1, duration: 0.25, ease: 'power3.out' });
    gsap.to(tray.current, { scaleY: 1, duration: 0.25, ease: 'power3.out', transformOrigin: '50% 100%' });
  }

  return (
    <a
      aria-label="Download Victor's resume (PDF)"
      className={className}
      download
      href="victor-chandra-ios-resume.pdf"
      onBlur={settle}
      onFocus={play}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') play(); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') settle(); }}
    >
      {/* Lucide's download glyph, split so the arrow and tray can move separately */}
      <svg aria-hidden className="size-4 shrink-0 overflow-visible" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <g ref={arrow}>
          <path d="M12 15V3" />
          <path d="m7 10 5 5 5-5" />
        </g>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" ref={tray} />
      </svg>
      <span aria-hidden className="relative max-sm:sr-only">
        Download Resume
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 rounded-full bg-ring" ref={line} />
      </span>
    </a>
  );
}
