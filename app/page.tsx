'use client';
/* oxlint-disable next/no-html-link-for-pages -- Static hosting serves HTML files without an RSC navigation endpoint. */

import { ArrowDown, ArrowUpRight, Check, Code2, Copy, Mail } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExperienceTimeline, type Role } from '@/components/experience-timeline';
import { FilterTabs } from '@/components/filter-tabs';
import { HeroScene } from '@/components/hero-scene';
import { MorphTitle } from '@/components/morph-title';
import { Portrait } from '@/components/portrait';
import { SelfHostedShot } from '@/components/self-hosted-shots';
import { ResumeButton } from '@/components/resume-button';
import { PillNav, type WorkGroup } from '@/components/pill-nav';
import { type Branch, StackMindmap } from '@/components/stack-mindmap';
import { ThemeToggle } from '@/components/theme-toggle';

const projects = [
  { name: 'Reflax', platforms: ['iOS'], detail: 'Health companion app using HealthKit, adaptive scheduling, accessibility support, and secure on-device health-data handling.', stack: 'SwiftUI · HealthKit', href: 'https://testflight.apple.com/join/J77sp3K5', image: 'projects/reflax.png' },
  { name: 'Coco', platforms: ['iOS'], detail: 'A native iOS travel activity booking app with discovery, search, booking flows, and trip management.', stack: 'UIKit · MVVM', href: 'https://github.com/mzmznasipadang/LinCoCoCooo', image: 'projects/coco.png' },
  { name: 'CountDown', platforms: ['macOS'], detail: 'A lightweight macOS menu bar app that counts down to upcoming calendar events in real time, with meeting links, snooze controls, and calendar-aware alerts.', stack: 'macOS · Swift', href: 'https://github.com/mzmznasipadang/CountDown', image: 'projects/countdown.png' },
  { name: 'ADASayembara', platforms: ['iOS', 'Web'], detail: 'A real-time queue management system for the Shoot & Win event, with live queue status across attendees and admins, QR access, notifications, and protected admin controls.', stack: 'iOS · Web', href: 'https://github.com/mzmznasipadang/ADASayembara', image: 'projects/adasayembara.png' },
  { name: 'AshMap', platforms: ['Web'], detail: 'A live Indonesian volcanic ash advisory map that plots real Darwin VAAC ash polygons, wind vectors, forecast drift, airport impacts, and GIS-ready data.', stack: 'Web · GIS', href: 'https://github.com/mzmznasipadang/ash-map', image: 'projects/ashmap.png' },
];

const projectFilters = ['All', 'iOS', 'macOS', 'Web'];
const selfHosted = [
  { name: 'Portfolio', detail: 'This site, built by me and hosted on my own server.', status: 'Live', href: 'https://victorch.dev' },
  { name: 'Gitea', detail: 'Private Git hosting for my projects, including this portfolio.', status: 'Live' },
  { name: 'Project + Invoice SaaS', detail: 'Project tracking and invoicing in one app.', status: 'Live' },
  { name: 'WeliJayaJaya', detail: 'Currently in development.', status: 'Ongoing' },
  { name: 'JobTracker', detail: 'Keeps track of job applications and where each one stands.', status: 'Live' },
];
// Nav menu: each app under its first platform, then the self-hosted list.
const workMenu: WorkGroup[] = [
  ...['iOS', 'macOS', 'Web'].map((label) => ({ label, items: projects.filter((p) => p.platforms[0] === label).map((p) => ({ name: p.name, caption: p.stack, image: p.image, href: p.href })) })),
  { label: 'Self-hosted', items: selfHosted.map((item) => ({ name: item.name, caption: item.status, href: item.href ?? '#self-hosted' })) },
];
// Header controls share one look with the nav items: same height, the blue hint on hover, press feedback.
const headerItem = 'flex h-11 min-w-11 items-center justify-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-[color,background-color,scale] duration-200 hover:bg-ring/15 hover:text-foreground active:scale-[0.97] dark:hover:text-ring';
const heroTitles = ['iOS Engineer', 'SwiftUI Developer', 'AI Software Engineer', 'Product Builder'];
const experience: Role[] = [
  { org: 'Dotcross AI', period: 'Dec 2025 – Present', role: 'Junior AI Software Engineer', detail: 'Production Python and AWS services, LLM API integration, and monitoring that reduced per-case processing costs by 78%.' },
  { org: 'Apple Developer Academy', period: 'Mar – Dec 2025', role: 'iOS Developer', detail: 'Selected from 10,000+ applicants; shipped six apps, worked in two-week release cycles, and progressed to leading 4-person teams.' },
  { org: 'Sycomora Welfare Center', period: '2021–2022', role: 'Technical Lead & UI Designer', detail: 'Directed a 5-person team launching the company website and mobile app in two-month delivery cycles.' },
];
const skillBranches: Branch[] = [
  { label: 'Build iOS', skills: ['Swift', 'SwiftUI', 'UIKit', 'HealthKit', 'MVVM'] },
  { label: 'Ship', skills: ['Xcode Cloud', 'TestFlight', 'GitHub Actions', 'Jenkins', 'Docker'] },
  { label: 'Data', skills: ['PostgreSQL', 'Supabase'] },
  { label: 'Backend', skills: ['Python', 'AWS Lambda', 'REST APIs'] },
];
// Where each skill shows up in the projects and roles above. Skills left out show a generic line.
const skillUsedIn: Record<string, string[]> = {
  Swift: ['Reflax', 'Coco', 'CountDown', 'Apple Developer Academy'],
  SwiftUI: ['Reflax', 'Apple Developer Academy'],
  UIKit: ['Coco'],
  HealthKit: ['Reflax'],
  MVVM: ['Coco'],
  TestFlight: ['Reflax', 'Apple Developer Academy'],
  'Xcode Cloud': ['Apple Developer Academy'],
  Docker: ['Self-hosted homelab', 'Portfolio (self-hosted)'],
  Jenkins: ['Self-hosted homelab'],
  Python: ['Dotcross AI'],
  'AWS Lambda': ['Dotcross AI'],
  'REST APIs': ['Dotcross AI'],
};

export default function Home() {
  const page = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');
  const shown = projects.filter((project) => filter === 'All' || project.platforms.includes(filter));
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard?.writeText('hello@victorch.dev').then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }).catch(() => {}); // Clipboard blocked: the mailto button and visible address still work.
  }

  function selectFilter(next: string) {
    setFilter(next);
    // Re-reveal the cards that stay visible after React applies the filter.
    requestAnimationFrame(() => {
      if (!grid.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(grid.current.querySelectorAll('.motion-project:not([hidden])'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', overwrite: true });
    });
  }

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.motion-hero', { duration: 0.7, opacity: 0, y: 24 })
        .from('.motion-aside', { duration: 0.6, opacity: 0, y: 16 }, '<0.18')
        .from('.motion-project', { duration: 0.5, opacity: 0, stagger: 0.08, y: 16 }, '<0.2');
    }, page);
    return () => media.revert();
  }, []);

  return (
    <main ref={page}>
      <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-center gap-2 px-4">
        <PillNav work={workMenu} />
        {/* Same pill as the nav: one outline, one height, one hover fill across the bar. */}
        <div className="rounded-full border border-border bg-background/70 p-1 shadow-sm backdrop-blur-md"><ThemeToggle className={headerItem} /></div>
        <div className="rounded-full border border-border bg-background/70 p-1 shadow-sm backdrop-blur-md">
          <ResumeButton className={cn(headerItem, 'px-3 sm:px-4')} />
        </div>
      </header>

      <section className="relative isolate flex min-h-svh items-center overflow-hidden" id="top">
        <HeroScene />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-[22svh] pt-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:px-8 lg:pb-[24svh]">
          <div className="motion-hero">
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl"><span className="sr-only">Victor Chandra, iOS Engineer</span><MorphTitle words={heroTitles} /></h1>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button className="rounded-full" nativeButton={false} render={<a aria-label="Jump to selected work" href="#work" />} size="lg">Selected work <ArrowDown /></Button>
              <Button className="rounded-full bg-background/60 backdrop-blur" nativeButton={false} render={<a aria-label="Visit Victor's GitHub profile" href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank" />} size="lg" variant="outline"><Code2 /> GitHub</Button>
            </div>
          </div>
          <Portrait className="motion-aside order-first w-40 justify-self-center sm:w-60 lg:order-none lg:w-72" />
          <aside className="motion-aside lg:max-w-sm lg:justify-self-end">
            <p className="font-medium tracking-tight">Hi, I&apos;m Victor Chandra</p>
            <p className="mt-3 text-base leading-7 text-black dark:text-white">An iOS engineer trained at Apple Developer Academy. I&apos;ve shipped six Swift and SwiftUI apps, and built delivery automation that cut manual release overhead by 35%.</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">Tangerang Selatan, Indonesia<br />Dotcross AI</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-card" id="work">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mb-10 flex items-end justify-between gap-6"><div><h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Apps, and the servers behind them.</h2></div><a className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block" href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank">View GitHub <ArrowUpRight className="ml-1 inline size-3.5" /></a></div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><FilterTabs label="Filter projects by platform" onChange={selectFilter} options={projectFilters} value={filter} /><p aria-live="polite" className="text-sm text-muted-foreground">{filter === 'All' ? '' : `Showing ${shown.length} of ${projects.length} projects`}</p></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" ref={grid}>
            {projects.map((project) => <Card className="motion-project border border-border bg-background shadow-none transition-transform duration-200 hover:-translate-y-1" hidden={!shown.includes(project)} key={project.name}>
              <CardHeader><Badge variant="secondary">{project.stack}</Badge><CardTitle className="mt-7 text-2xl tracking-[-0.04em]">{project.name}</CardTitle><CardDescription className="max-w-sm leading-6">{project.detail}</CardDescription></CardHeader>
              <CardContent className="mt-8 p-0"><Image alt={`${project.name} project thumbnail`} className="aspect-[16/10] w-full object-cover" height={640} src={project.image} unoptimized width={1024} /></CardContent>
              <CardFooter><Button nativeButton={false} render={<a aria-label={`View ${project.name} repository`} href={project.href} rel="noreferrer" target="_blank" />} variant="link">View repository <ArrowUpRight /></Button></CardFooter>
            </Card>)}
          </div>

          <div className="mt-20 border-t border-border pt-12" id="self-hosted">
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">Also running on my own server</h3>
            <p className="mt-2 max-w-xl text-base leading-7 text-muted-foreground">A multi-node Raspberry Pi homelab I run as personal production infrastructure, with containerised services, self-hosted Jenkins CI/CD and a Tailscale mesh for secure remote access.</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selfHosted.map((item) => <li className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background" key={item.name}>
                <SelfHostedShot name={item.name} />
                <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-3"><span className="text-lg font-semibold tracking-tight">{item.name}</span><Badge variant={item.status === 'Live' ? 'secondary' : 'outline'}>{item.status}</Badge></div>
                <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                {item.href && <a className="mt-auto inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary" href={item.href} rel="noreferrer" target="_blank">Visit site <ArrowUpRight className="size-3.5" /></a>}
                </div>
              </li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28" id="experience">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Mobile craft with production depth.</h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-y border-border py-6">
          <p className="text-sm text-muted-foreground">Built and learned at</p>
          {['Dotcross AI', 'Apple Developer Academy', 'Sycomora'].map((name) => <span className="text-lg font-semibold tracking-[-0.03em] text-foreground/70" key={name}>{name}</span>)}
        </div>
        <ExperienceTimeline roles={experience} />
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-28" id="stack">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Mobile first.<br />Useful everywhere.</h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-muted-foreground">From native mobile experiences to the services and interfaces that support them, I enjoy turning an idea into a polished, practical product.</p>
          <p className="mt-6 text-sm font-medium">Bina Nusantara University · Information Systems (Applied ERP) · GPA 3.42/4.00</p>
        </div>
        <StackMindmap branches={skillBranches} usedIn={skillUsedIn} />
      </section>

      <section className="bg-primary text-primary-foreground dark:border-t dark:border-border dark:bg-card dark:text-foreground" id="contact">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-28">
          <div>
            <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Let&apos;s make the next interaction feel effortless.</h2>
            <p className="mt-6 text-base text-primary-foreground/80 dark:text-muted-foreground">Based in Tangerang Selatan, Indonesia · GMT+7 · English, Indonesian and Mandarin (HSK 5)</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button className="h-14 rounded-full bg-background px-7 text-base text-foreground hover:bg-background/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90" nativeButton={false} render={<a aria-label="Email Victor at hello@victorch.dev" href="mailto:hello@victorch.dev" />}><Mail /> hello@victorch.dev</Button>
              <Button className="h-14 rounded-full border-primary-foreground/40 bg-transparent px-5 text-base text-primary-foreground hover:bg-primary-foreground/10 dark:border-border dark:text-foreground dark:hover:bg-muted" onClick={copyEmail} variant="outline">{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy address'}</Button>
              <Button className="h-14 rounded-full border-primary-foreground/40 bg-transparent px-5 text-base text-primary-foreground hover:bg-primary-foreground/10 dark:border-border dark:text-foreground dark:hover:bg-muted" nativeButton={false} render={<a aria-label="Victor on LinkedIn" href="https://linkedin.com/in/mzmznasipadang" rel="noreferrer" target="_blank" />} variant="outline">LinkedIn <ArrowUpRight /></Button>
            </div>
            <p aria-live="polite" className="sr-only">{copied ? 'Email address copied' : ''}</p>
          </div>
          {/* Second portrait: it follows the cursor, so it turns toward the buttons as you reach for them. */}
          <Portrait className="hidden w-56 lg:block" />
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© {new Date().getFullYear()} Victor Chandra</span><div className="flex flex-wrap gap-x-5 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:hover:text-foreground"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="#self-hosted">Self-hosted</a><a href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank">GitHub</a><a href="https://linkedin.com/in/mzmznasipadang" rel="noreferrer" target="_blank">LinkedIn</a></div></footer>
    </main>
  );
}
