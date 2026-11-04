'use client';

import { gsap } from 'gsap';
import { Briefcase, House, Layers, Mail, Milestone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const items = [
  { id: 'top', label: 'Home', Icon: House },
  { id: 'work', label: 'Work', Icon: Briefcase },
  { id: 'experience', label: 'Experience', Icon: Milestone },
  { id: 'stack', label: 'Stack', Icon: Layers },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

/** Icon nav with a pill that slides to the hovered or current section. */
export function PillNav() {
  const [active, setActive] = useState('top');
  const pill = useRef<HTMLSpanElement>(null);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});

  function moveTo(id: string) {
    const link = links.current[id];
    if (!link || !pill.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(pill.current, { x: link.offsetLeft, width: link.offsetWidth, duration: reduce ? 0 : 0.45, ease: 'power3.out', overwrite: true });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    items.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => moveTo(active), [active]);

  return (
    <nav aria-label="Primary" className="relative flex items-center rounded-full border border-border bg-background/70 p-1 shadow-sm backdrop-blur-md">
      <span aria-hidden className="absolute top-1 left-0 h-[calc(100%-0.5rem)] w-0 rounded-full bg-foreground/10" ref={pill} />
      {items.map(({ id, label, Icon }) => (
        <a
          aria-current={active === id ? 'location' : undefined}
          aria-label={label}
          className="relative z-10 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground sm:size-10"
          href={`#${id}`}
          key={id}
          onFocus={() => moveTo(id)}
          onBlur={() => moveTo(active)}
          onMouseEnter={() => moveTo(id)}
          onMouseLeave={() => moveTo(active)}
          ref={(el) => { links.current[id] = el; }}
          title={label}
        >
          <Icon className="size-4" />
        </a>
      ))}
    </nav>
  );
}
