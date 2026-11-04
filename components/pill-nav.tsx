'use client';

import { gsap } from 'gsap';
import { ArrowUpRight, Briefcase, House, Layers, Mail, Milestone } from 'lucide-react';
import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export type WorkItem = { name: string; caption: string; image?: string; href?: string };
export type WorkGroup = { label: string; items: WorkItem[] };

const items = [
  { id: 'top', label: 'Home', Icon: House },
  { id: 'work', label: 'Work', Icon: Briefcase },
  { id: 'experience', label: 'Experience', Icon: Milestone },
  { id: 'stack', label: 'Stack', Icon: Layers },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

/** Icon nav with a pill that slides to the hovered or current section. Hovering Work opens a project menu with a preview. */
export function PillNav({ work = [] }: { work?: WorkGroup[] }) {
  const [active, setActive] = useState('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState<WorkItem | undefined>(work[0]?.items[0]);
  const pill = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const previewBox = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>(undefined);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function moveTo(id: string) {
    const link = links.current[id];
    if (!link || !pill.current) return;
    gsap.to(pill.current, { x: link.offsetLeft, width: link.offsetWidth, duration: reduceMotion() ? 0 : 0.45, ease: 'power3.out', overwrite: true });
  }

  function openMenu() {
    window.clearTimeout(closeTimer.current);
    if (work.length) setMenuOpen(true);
  }

  // Short delay so the pointer can cross the gap between the icon and the panel.
  function closeMenuSoon() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 150);
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

  useEffect(() => {
    if (!menuOpen || !panel.current || reduceMotion()) return;
    gsap.fromTo(panel.current, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' });
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !previewBox.current || reduceMotion()) return;
    gsap.fromTo(previewBox.current, { opacity: 0.4, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
  }, [preview, menuOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); links.current.work?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close once focus leaves both the Work link and the menu.
  function closeIfFocusLeaves(next: EventTarget | null) {
    const inside = next instanceof Node && (panel.current?.contains(next) || next === links.current.work);
    if (!inside) setMenuOpen(false);
  }

  const menuGroup = work.find((group) => group.items.includes(preview!));

  return (
    <nav
      aria-label="Primary"
      className="relative flex items-center rounded-full border border-border bg-background/70 p-1 shadow-sm backdrop-blur-md"
    >
      <span aria-hidden className="absolute top-1 left-0 h-[calc(100%-0.5rem)] w-0 rounded-full bg-foreground/10" ref={pill} />
      {items.map(({ id, label, Icon }) => {
        const isWork = id === 'work' && work.length > 0;
        return (
          <Fragment key={id}>
            <a
              aria-controls={isWork ? 'work-menu' : undefined}
              aria-current={active === id ? 'location' : undefined}
              aria-expanded={isWork ? menuOpen : undefined}
              aria-label={label}
              className="relative z-10 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground sm:size-10"
              href={`#${id}`}
              onBlur={(e) => { moveTo(active); if (isWork) closeIfFocusLeaves(e.relatedTarget); }}
              onFocus={() => { moveTo(id); if (isWork) openMenu(); }}
              onMouseEnter={() => { moveTo(id); if (isWork) openMenu(); }}
              onMouseLeave={() => { moveTo(active); if (isWork) closeMenuSoon(); }}
              ref={(el) => { links.current[id] = el; }}
              title={label}
            >
              <Icon className="size-4" />
            </a>
            {/* Rendered right after the Work link so Tab moves straight into the menu. */}
            {isWork && menuOpen && (
              <div
                className="absolute top-full left-1/2 z-20 hidden w-[min(52rem,calc(100vw-16rem))] -translate-x-1/2 pt-3 md:block"
                id="work-menu"
                onBlur={(e) => closeIfFocusLeaves(e.relatedTarget)}
                onMouseEnter={openMenu}
                onMouseLeave={closeMenuSoon}
                ref={panel}
              >
                <div className="grid grid-cols-[minmax(11rem,15rem)_1fr] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
                  <div className="max-h-[75vh] space-y-4 overflow-y-auto border-r border-border p-6">
                    {work.map((group) => (
                      <div key={group.label}>
                        <p className="text-xs font-medium text-muted-foreground">{group.label}</p>
                        <ul className="mt-1.5 space-y-0.5">
                          {group.items.map((item) => (
                            <li key={item.name}>
                              <a
                                className={cn('block py-0.5 text-base font-semibold tracking-tight transition-colors', preview === item ? 'text-foreground' : 'text-muted-foreground/70 hover:text-foreground')}
                                href={item.href ?? '#work'}
                                onClick={() => setMenuOpen(false)}
                                onFocus={() => setPreview(item)}
                                onMouseEnter={() => setPreview(item)}
                                {...(item.href ? { rel: 'noreferrer', target: '_blank' } : {})}
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col p-6">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted" ref={previewBox}>
                      {preview?.image
                        ? <Image alt="" className="size-full object-cover" height={640} src={preview.image} unoptimized width={1024} />
                        : <div className="grid size-full place-items-center bg-gradient-to-br from-secondary to-muted p-8 text-center"><p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{preview?.name}</p></div>}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm text-muted-foreground">
                      <span>{preview?.caption}</span>
                      <span className="flex items-center gap-1">{menuGroup?.label}{preview?.href && <ArrowUpRight className="size-3.5" />}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
