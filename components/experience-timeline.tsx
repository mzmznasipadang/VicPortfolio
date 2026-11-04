'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export type Role = { org: string; period: string; role: string; detail: string };

/** Vertical timeline whose rail fills in as you scroll, with entries fading in as they arrive. */
export function ExperienceTimeline({ roles }: { roles: Role[] }) {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(el.querySelector('.timeline-progress'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } });
      el.querySelectorAll('.timeline-item').forEach((item) => {
        gsap.from(item, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
      });
    }, el);
    return () => media.revert();
  }, []);

  return (
    <ol className="relative mt-12 space-y-12 pl-8 sm:pl-10" ref={list}>
      <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border sm:left-[11px]" />
      <span aria-hidden className="timeline-progress absolute top-2 bottom-2 left-[7px] w-px origin-top bg-primary sm:left-[11px]" />
      {roles.map((item) => (
        <li className="timeline-item relative grid gap-2 md:grid-cols-[12rem_1fr] md:gap-10" key={item.org}>
          <span aria-hidden className="absolute top-1.5 -left-8 size-[15px] rounded-full border-2 border-primary bg-background sm:-left-10 sm:size-[23px] sm:border-[3px]" />
          <div>
            <p className="text-sm font-semibold text-primary">{item.period}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.org}</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.role}</h3>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
