'use client';

import { gsap } from 'gsap';
import { useRef, type PointerEvent, type ReactNode } from 'react';

/**
 * A link whose icon "sends" on hover or focus, the same treatment as the resume
 * button: the icon flies off along `toward`, a fresh one settles back in from the
 * opposite side, and an underline draws in under the label. Every tween starts
 * from the live value, so leaving mid-way eases everything home.
 */
export function FlyLink({ href, label, icon, iconAfter, toward, className, external, 'aria-label': ariaLabel }: {
  href: string;
  label: ReactNode;
  icon: ReactNode;
  iconAfter?: boolean;
  toward: { x: number; y: number };
  className?: string;
  external?: boolean;
  'aria-label'?: string;
}) {
  const glyph = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const run = useRef<gsap.core.Timeline>(undefined);
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play() {
    if (!line.current) return;
    // The underline is plain feedback, so it draws even under reduced motion, just without the icon's flight.
    gsap.to(line.current, { scaleX: 1, duration: reduce() ? 0 : 0.45, ease: 'expo.out', overwrite: true });
    if (reduce() || !glyph.current) return;
    run.current?.kill();
    run.current = gsap.timeline()
      .to(glyph.current, { x: toward.x, y: toward.y, opacity: 0, duration: 0.2, ease: 'power2.in' })
      // immediateRender off: otherwise the icon would jump to its re-entry spot before it has left
      .fromTo(glyph.current, { x: -toward.x, y: -toward.y, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', immediateRender: false });
  }

  function settle() {
    if (!glyph.current || !line.current) return;
    run.current?.kill();
    gsap.to(line.current, { scaleX: 0, duration: reduce() ? 0 : 0.3, ease: 'power3.out', overwrite: true });
    gsap.to(glyph.current, { x: 0, y: 0, opacity: 1, duration: 0.25, ease: 'power3.out' });
  }

  // Mouse only: on touch, iOS treats a hover-driven change as the first tap and swallows the click.
  const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') play(); };
  const onLeave = (e: PointerEvent) => { if (e.pointerType === 'mouse') settle(); };
  const icn = <span aria-hidden className="inline-flex [&_svg]:size-4" ref={glyph}>{icon}</span>;

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={href}
      onBlur={settle}
      onFocus={play}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
    >
      {!iconAfter && icn}
      <span className="relative">
        {label}
        <span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 rounded-full bg-ring" ref={line} />
      </span>
      {iconAfter && icn}
    </a>
  );
}
