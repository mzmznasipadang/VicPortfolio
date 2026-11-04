'use client';
/* oxlint-disable next/no-html-link-for-pages -- Static hosting serves HTML files without an RSC navigation endpoint. */

import { ArrowDown, ArrowUpRight, Code2, Download, Mail } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FilterTabs } from '@/components/filter-tabs';
import { HeroScene } from '@/components/hero-scene';
import { MorphTitle } from '@/components/morph-title';
import { Portrait } from '@/components/portrait';
import { PillNav, type WorkGroup } from '@/components/pill-nav';
import { ThemeToggle } from '@/components/theme-toggle';

const projects = [
  { name: 'Reflax', platforms: ['iOS'], detail: 'Health companion app using HealthKit, adaptive scheduling, accessibility support, and secure on-device health-data handling.', stack: 'SwiftUI · HealthKit', href: 'https://testflight.apple.com/join/J77sp3K5', image: 'projects/reflax.png' },
  { name: 'Coco', platforms: ['iOS'], detail: 'A native iOS travel activity booking app with discovery, search, booking flows, and trip management.', stack: 'UIKit · MVVM', href: 'https://github.com/mzmznasipadang/LinCoCoCooo', image: 'projects/coco.png' },
  { name: 'CountDown', platforms: ['macOS'], detail: 'A lightweight macOS menu bar app that counts down to upcoming calendar events in real time, with meeting links, snooze controls, and calendar-aware alerts.', stack: 'macOS · Swift', href: 'https://github.com/mzmznasipadang/CountDown', image: 'projects/countdown.png' },
  { name: 'ADASayembara', platforms: ['iOS', 'Web'], detail: 'A real-time queue management system for the Shoot & Win event, with live queue status across attendees and admins, QR access, notifications, and protected admin controls.', stack: 'iOS · Web', href: 'https://github.com/mzmznasipadang/ADASayembara', image: 'projects/adasayembara.png' },
  { name: 'AshMap', platforms: ['Web'], detail: 'A live Indonesian volcanic ash advisory map that plots real Darwin VAAC ash polygons, wind vectors, forecast drift, airport impacts, and GIS-ready data.', stack: 'Web · GIS', href: 'https://github.com/mzmznasipadang/ash-map', image: 'projects/ashmap.png' },
];

const projectFilters = ['All', 'iOS', 'macOS', 'Web', 'Self-hosted'];
const selfHosted = [
  { name: 'Portfolio', detail: 'This site: a static export served by Caddy in Docker on my own server.', status: 'Live', href: 'https://victorch.dev' },
  { name: 'Gitea', detail: 'Private Git hosting for my projects, including this portfolio.', status: 'Live' },
  { name: 'Project + Invoice SaaS', detail: 'Project tracking and invoicing in one app.', status: 'Live' },
  { name: 'WeliJayaJaya', detail: 'Currently in development.', status: 'Ongoing' },
  { name: 'JobTracker', detail: 'Keeps track of job applications and where each one stands.', status: 'Live' },
];
// Nav menu: each app under its first platform, then the self-hosted list.
const workMenu: WorkGroup[] = [
  ...['iOS', 'macOS', 'Web'].map((label) => ({ label, items: projects.filter((p) => p.platforms[0] === label).map((p) => ({ name: p.name, caption: p.stack, image: p.image, href: p.href })) })),
  { label: 'Self-hosted', items: selfHosted.map((item) => ({ name: item.name, caption: item.status, href: item.href })) },
];
const heroTitles = ['iOS Engineer', 'SwiftUI Developer', 'AI Software Engineer', 'Product Builder'];
const mobileStack = ['Swift', 'SwiftUI', 'UIKit', 'HealthKit', 'MVVM', 'Xcode Cloud', 'TestFlight'];
const engineeringStack = ['Python', 'AWS Lambda', 'REST APIs', 'PostgreSQL', 'Supabase', 'GitHub Actions', 'Jenkins', 'Docker'];

export default function Home() {
  const page = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');
  const shown = projects.filter((project) => filter === 'All' || project.platforms.includes(filter));
  const showSelfHosted = filter === 'All' || filter === 'Self-hosted';
  const shownCount = shown.length + (showSelfHosted ? selfHosted.length : 0);

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
        <div className="rounded-full border border-border bg-background/70 p-1 backdrop-blur-md [&_button]:rounded-full"><ThemeToggle /></div>
        <Button className="h-11 rounded-full px-4" nativeButton={false} render={<a aria-label="Download Victor's resume" download href="victor-chandra-ios-resume.pdf" />}><Download /><span className="max-sm:sr-only">Download Resume</span></Button>
      </header>

      <section className="relative isolate flex min-h-svh items-center overflow-hidden" id="top">
        <HeroScene />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-[30svh] pt-28 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:px-8 lg:pb-[24svh]">
          <div className="motion-hero">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Victor Chandra · Indonesia</p>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl"><span className="sr-only">Victor Chandra, iOS Engineer</span><MorphTitle words={heroTitles} /></h1>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button className="rounded-full" nativeButton={false} render={<a aria-label="Jump to selected work" href="#work" />} size="lg">Selected work <ArrowDown /></Button>
              <Button className="rounded-full bg-background/60 backdrop-blur" nativeButton={false} render={<a aria-label="Visit Victor's GitHub profile" href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank" />} size="lg" variant="outline"><Code2 /> GitHub</Button>
            </div>
          </div>
          <Portrait className="motion-aside w-52 justify-self-center sm:w-60 lg:w-72" />
          <aside className="motion-aside lg:max-w-sm lg:justify-self-end">
            <p className="font-medium tracking-tight">Hi, I&apos;m Victor</p>
            <p className="mt-3 text-base leading-7 text-black dark:text-white">An iOS engineer trained at Apple Developer Academy. I&apos;ve shipped six Swift and SwiftUI apps, and built delivery automation that cut manual release overhead by 35%.</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">Tangerang Selatan, Indonesia<br />Dotcross AI</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-card" id="work">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mb-10 flex items-end justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Selected work</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Made for the small screen.</h2></div><a className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block" href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank">View GitHub <ArrowUpRight className="ml-1 inline size-3.5" /></a></div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><FilterTabs label="Filter projects by platform" onChange={selectFilter} options={projectFilters} value={filter} /><p aria-live="polite" className="text-sm text-muted-foreground">Showing {shownCount} of {projects.length + selfHosted.length} projects</p></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" ref={grid}>
            {projects.map((project) => <Card className="motion-project border border-border bg-background shadow-none transition-transform duration-200 hover:-translate-y-1" hidden={!shown.includes(project)} key={project.name}>
              <CardHeader><Badge variant="secondary">{project.stack}</Badge><CardTitle className="mt-7 text-2xl tracking-[-0.04em]">{project.name}</CardTitle><CardDescription className="max-w-sm leading-6">{project.detail}</CardDescription></CardHeader>
              <CardContent className="mt-8 p-0"><Image alt={`${project.name} project thumbnail`} className="aspect-[16/10] w-full object-cover" height={640} src={project.image} unoptimized width={1024} /></CardContent>
              <CardFooter><Button nativeButton={false} render={<a aria-label={`View ${project.name} repository`} href={project.href} rel="noreferrer" target="_blank" />} variant="link">View repository <ArrowUpRight /></Button></CardFooter>
            </Card>)}
            {selfHosted.map((item) => <Card className="motion-project border border-primary/40 bg-background shadow-none ring-1 ring-primary/15 transition-transform duration-200 hover:-translate-y-1" hidden={!showSelfHosted} key={item.name}>
              <CardHeader><div className="flex flex-wrap gap-2"><Badge>Self-hosted</Badge><Badge variant={item.status === 'Live' ? 'secondary' : 'outline'}>{item.status}</Badge></div><CardTitle className="mt-7 text-2xl tracking-[-0.04em]">{item.name}</CardTitle><CardDescription className="max-w-sm leading-6">{item.detail}</CardDescription></CardHeader>
              {item.href && <CardFooter className="mt-auto"><Button nativeButton={false} render={<a aria-label={`Visit ${item.name}`} href={item.href} rel="noreferrer" target="_blank" />} variant="link">Visit site <ArrowUpRight /></Button></CardFooter>}
            </Card>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28" id="experience">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Experience</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Mobile craft with production depth.</h2>
        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3">
          <article><p className="text-sm font-medium">Dotcross AI · Present</p><h3 className="mt-2 text-xl font-semibold tracking-tight">Junior AI Software Engineer</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Production Python and AWS services, LLM API integration, and monitoring that reduced per-case processing costs by 78%.</p></article>
          <article><p className="text-sm font-medium">Apple Developer Academy · 2025</p><h3 className="mt-2 text-xl font-semibold tracking-tight">iOS Developer</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Selected from 10,000+ applicants; shipped six apps, worked in two-week release cycles, and progressed to leading 4-person teams.</p></article>
          <article><p className="text-sm font-medium">Sycomora Welfare Center · 2021–2022</p><h3 className="mt-2 text-xl font-semibold tracking-tight">Technical Lead &amp; UI Designer</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Directed a 5-person team launching the company website and mobile app in two-month delivery cycles.</p></article>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-28" id="stack">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Capabilities</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Mobile first.<br />Useful everywhere.</h2></div>
        <div className="space-y-9"><div><p className="mb-4 text-sm font-medium">Mobile development</p><div className="flex flex-wrap gap-2">{mobileStack.map((skill) => <Badge className="h-7 px-3" key={skill} variant="outline">{skill}</Badge>)}</div></div><Separator /><div><p className="mb-4 text-sm font-medium">Software engineering</p><div className="flex flex-wrap gap-2">{engineeringStack.map((skill) => <Badge className="h-7 px-3" key={skill} variant="outline">{skill}</Badge>)}</div></div><Separator /><p className="max-w-xl text-base leading-7 text-muted-foreground">From native mobile experiences to the services and interfaces that support them, I enjoy turning an idea into a polished, practical product.</p><p className="text-sm font-medium">Bina Nusantara University · Information Systems (Applied ERP) · GPA 3.42/4.00</p></div>
      </section>

      <section className="bg-primary text-primary-foreground" id="contact"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-12 px-6 py-20 lg:flex-row lg:items-end lg:px-8 lg:py-28"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Get in touch</p><h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Let&apos;s make the next interaction feel effortless.</h2></div><Button className="w-fit bg-background text-foreground hover:bg-background/85" nativeButton={false} render={<a aria-label="Email Victor at hello@victorch.dev" href="mailto:hello@victorch.dev" />} size="lg"><Mail /> hello@victorch.dev</Button></div></section>
      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© {new Date().getFullYear()} Victor Chandra</span><div className="flex flex-wrap gap-x-5 gap-y-2"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="#work" onClick={() => selectFilter('Self-hosted')}>Self-hosted</a><a href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank">GitHub</a><a href="https://linkedin.com/in/mzmznasipadang" rel="noreferrer" target="_blank">LinkedIn</a></div></footer>
    </main>
  );
}
