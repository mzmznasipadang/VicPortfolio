'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const tile = 'about-tile relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6';
const kicker = 'text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground';

/** Jakarta time, ticking each minute, so visitors can see whether it's a sensible hour to write. */
function LocalTime() {
  const [now, setNow] = useState<string>();
  useEffect(() => {
    const format = () => setNow(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date()));
    format();
    const timer = window.setInterval(format, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="tabular-nums">{now ?? '--:--'}</span>;
}

/** A photo tile: fills its cell, cropped around `focus`, with a slow zoom on hover. */
function Photo({ src, alt, focus, className }: { src: string; alt: string; focus: string; className?: string }) {
  return (
    <figure className={cn('about-tile group relative overflow-hidden rounded-3xl bg-muted', className)}>
      <Image alt={alt} className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none" height={1400} loading="lazy" src={src} style={{ objectPosition: focus }} unoptimized width={1400} />
    </figure>
  );
}

type Monitor = { id: number; name: string; up?: boolean; uptime?: number };
type KumaGroups = { publicGroupList: { monitorList: { id: number; name: string }[] }[] };
type KumaBeats = { heartbeatList: Record<string, { status: number }[]>; uptimeList: Record<string, number> };

/**
 * Live monitors from the Uptime Kuma status page, read through the site's own Caddy
 * (/uptime/*), since Kuma sends no CORS headers. Refreshes every 5 minutes while the page is open.
 * Returns undefined while loading and null when the status page can't be reached.
 */
function useUptime() {
  const [monitors, setMonitors] = useState<Monitor[] | null>();
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [groups, beats] = await Promise.all([
          fetch('uptime/monitors').then((r) => (r.ok ? (r.json() as Promise<KumaGroups>) : Promise.reject(new Error(String(r.status))))),
          fetch('uptime/heartbeat').then((r) => (r.ok ? (r.json() as Promise<KumaBeats>) : Promise.reject(new Error(String(r.status))))),
        ]);
        const list = groups.publicGroupList.flatMap((g) => g.monitorList).map(({ id, name }) => {
          const last = beats.heartbeatList[id]?.at(-1);
          return { id, name, up: last ? last.status === 1 : undefined, uptime: beats.uptimeList[`${id}_24`] };
        });
        if (alive) setMonitors(list);
      } catch {
        if (alive) setMonitors(null); // Status page unreachable (or local dev without the proxy).
      }
    };
    void load();
    const timer = window.setInterval(() => void load(), 5 * 60_000);
    return () => { alive = false; window.clearInterval(timer); };
  }, []);
  return monitors;
}

function HomelabStatus() {
  const monitors = useUptime();
  if (monitors === undefined) return <p className="font-mono text-sm text-white/50">Checking services…</p>;
  if (monitors === null) return <p className="text-sm leading-6 text-white/70">Live status is unavailable right now.</p>;
  const down = monitors.filter((m) => m.up === false).length;
  return (
    <div className="space-y-4">
      <output className="block text-sm font-medium">{down === 0 ? 'All systems up' : `${down} of ${monitors.length} down`}</output>
      <ul className="space-y-2.5 font-mono text-sm">
        {monitors.map((m) => (
          <li className="flex items-center justify-between gap-3" key={m.id}>
            <span className="truncate">{m.name}</span>
            <span className={cn('flex shrink-0 items-center gap-2 text-xs', m.up === false ? 'text-red-300' : 'text-emerald-300')}>
              <span aria-hidden className={cn('size-1.5 rounded-full', m.up === false ? 'bg-red-400' : 'animate-pulse bg-emerald-400 motion-reduce:animate-none')} />
              {m.up === false ? 'down' : m.uptime === undefined ? 'up' : `${(m.uptime * 100).toFixed(m.uptime === 1 ? 0 : 1)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bento grid of small facts about Victor; tiles rise in one after another as the grid scrolls into view. */
export function AboutBento() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(el.querySelectorAll('.about-tile'), { opacity: 0, y: 28, duration: 0.7, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 80%' } });
    }, el);
    return () => media.revert();
  }, []);

  // lg: a 4 × 4 grid. Photos take the tall and wide cells; the facts fill around them.
  return (
    <div className="mt-12 grid grid-flow-dense auto-rows-[minmax(10rem,auto)] grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-[repeat(4,10rem)]" ref={grid}>
      <div className={cn(tile, 'justify-between lg:col-start-1 lg:row-start-1')}>
        <span className={kicker}>Local time</span>
        <div>
          <span className="flex flex-wrap items-baseline gap-x-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"><LocalTime /><span className="text-sm font-medium text-muted-foreground">GMT+7</span></span>
          <span className="mt-1 block text-sm text-muted-foreground">Tangerang Selatan</span>
        </div>
      </div>

      <Photo alt="Victor on a mountain summit with a Nikon film camera around his neck" className="row-span-2 lg:col-start-4 lg:row-start-1" focus="50% 35%" src="about/mountain.webp" />

      <div className={cn(tile, 'col-span-2 justify-between bg-primary text-primary-foreground lg:col-start-2 lg:row-start-1 dark:bg-card dark:text-foreground')}>
        <span className={cn(kicker, 'text-primary-foreground/70 dark:text-muted-foreground')}>Languages</span>
        <div>
          <span className="block text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Hello · Halo · 你好</span>
          <span className="mt-2 block text-sm text-primary-foreground/75 dark:text-muted-foreground">English, Indonesian and Mandarin (HSK 5)</span>
        </div>
      </div>

      <Photo alt="Victor smiling in front of an ATR aircraft mural" className="col-span-2 row-span-2 lg:col-start-2 lg:row-start-2" focus="70% 40%" src="about/atr.webp" />

      <Photo alt="Victor on the apron at night beside an Emirates Airbus A380" className="row-span-2 lg:col-start-1 lg:row-start-2 lg:row-span-3" focus="40% 70%" src="about/a380.webp" />

      <div className={cn(tile, 'row-span-2 justify-between bg-[#0c1222] text-white lg:col-start-4 lg:row-start-3 dark:bg-black')}>
        <span className={cn(kicker, 'text-white/60')}>Homelab · live</span>
        <HomelabStatus />
        <a className="inline-flex min-h-11 items-center gap-1 text-sm text-white/60 transition-colors hover:text-white" href="https://uptime.naspadstudio.id" rel="noreferrer" target="_blank">uptime.naspadstudio.id <span aria-hidden>↗</span></a>
      </div>

      <div className={cn(tile, 'col-span-2 justify-between lg:col-start-2 lg:row-start-4')}>
        <span className={kicker}>Studied</span>
        <div>
          <span className="block text-xl font-semibold tracking-[-0.02em]">Information Systems (Applied ERP)</span>
          <span className="mt-1 block text-sm text-muted-foreground">Bina Nusantara University · GPA 3.42 / 4.00 · Sep 2022 – Apr 2026</span>
        </div>
      </div>
    </div>
  );
}
