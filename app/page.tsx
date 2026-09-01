import { ArrowDown, ArrowUpRight, Code2, Mail } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const projects = [
  { name: 'Binus Xplore', detail: 'Apple Developer Academy BINUS@Alam Sutera project.', stack: 'Swift', href: 'https://github.com/mzmznasipadang/Binus-Xplore' },
  { name: 'BLink', detail: "BLink, with Vic's mixes.", stack: 'Swift', href: 'https://github.com/mzmznasipadang/BLink-Vic' },
];

const mobileStack = ['Swift', 'iOS', 'React Native', 'Flutter'];
const engineeringStack = ['TypeScript', 'React', 'Next.js', 'Laravel', 'AWS', 'Docker', 'Firebase', 'Supabase'];

export default function Home() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <a className="text-sm font-semibold tracking-tight" href="#top">VC<span className="text-primary">.</span></a>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a className="transition-colors hover:text-foreground" href="#work">Work</a><a className="transition-colors hover:text-foreground" href="#stack">Stack</a><a className="transition-colors hover:text-foreground" href="#contact">Contact</a>
        </nav>
        <Button nativeButton={false} render={<a aria-label="Email Victor" href="mailto:info@naspadstudio.id" />} size="sm">Let&apos;s talk <ArrowUpRight /></Button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-28 pt-16 lg:grid-cols-[1.4fr_0.6fr] lg:px-8 lg:pb-40 lg:pt-28" id="top">
        <div className="max-w-3xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">iOS Engineer · Indonesia</p>
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Thoughtful mobile products, built with care.</h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">I&apos;m Victor Chandra, an iOS engineer at Apple Developer Academy with software-engineering range across web, SaaS, and cloud.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button nativeButton={false} render={<a aria-label="Jump to selected work" href="#work" />} size="lg">Selected work <ArrowDown /></Button>
            <Button nativeButton={false} render={<a aria-label="Visit Victor's GitHub profile" href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank" />} size="lg" variant="outline"><Code2 /> GitHub</Button>
          </div>
        </div>
        <aside className="self-end border-l border-border pl-6 lg:pl-8">
          <span aria-hidden="true" className="mb-5 flex size-20 items-center justify-center rounded-full border border-border bg-muted text-xl font-semibold tracking-[-0.08em] text-primary">VC</span>
          <p className="font-medium tracking-tight">Victor Chandra</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Tangerang Selatan, Indonesia<br />Apple Developer Academy</p>
        </aside>
      </section>

      <section className="border-y border-border bg-card" id="work">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mb-10 flex items-end justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Selected work</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Made for the small screen.</h2></div><a className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block" href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank">View GitHub <ArrowUpRight className="ml-1 inline size-3.5" /></a></div>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => <Card className="border border-border bg-background shadow-none transition-transform duration-200 hover:-translate-y-1" key={project.name}>
              <CardHeader><Badge variant="secondary">{project.stack}</Badge><CardTitle className="mt-7 text-2xl tracking-[-0.04em]">{project.name}</CardTitle><CardDescription className="max-w-sm leading-6">{project.detail}</CardDescription></CardHeader>
              <CardContent className="mt-8 flex min-h-36 items-end bg-muted/45 py-6"><span className="text-5xl font-semibold tracking-[-0.08em] text-primary/20">{project.name.slice(0, 2)}</span></CardContent>
              <CardFooter><Button nativeButton={false} render={<a aria-label={`View ${project.name} repository`} href={project.href} rel="noreferrer" target="_blank" />} variant="link">View repository <ArrowUpRight /></Button></CardFooter>
            </Card>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-28" id="stack">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Capabilities</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Mobile first.<br />Useful everywhere.</h2></div>
        <div className="space-y-9"><div><p className="mb-4 text-sm font-medium">Mobile development</p><div className="flex flex-wrap gap-2">{mobileStack.map((skill) => <Badge className="h-7 px-3" key={skill} variant="outline">{skill}</Badge>)}</div></div><Separator /><div><p className="mb-4 text-sm font-medium">Software engineering</p><div className="flex flex-wrap gap-2">{engineeringStack.map((skill) => <Badge className="h-7 px-3" key={skill} variant="outline">{skill}</Badge>)}</div></div><Separator /><p className="max-w-xl text-base leading-7 text-muted-foreground">From native mobile experiences to the services and interfaces that support them, I enjoy turning an idea into a polished, practical product.</p></div>
      </section>

      <section className="bg-primary text-primary-foreground" id="contact"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-12 px-6 py-20 lg:flex-row lg:items-end lg:px-8 lg:py-28"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Get in touch</p><h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Let&apos;s make the next interaction feel effortless.</h2></div><Button className="w-fit bg-background text-foreground hover:bg-background/85" nativeButton={false} render={<a aria-label="Email Victor at info@naspadstudio.id" href="mailto:info@naspadstudio.id" />} size="lg"><Mail /> info@naspadstudio.id</Button></div></section>
      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© {new Date().getFullYear()} Victor Chandra</span><div className="flex gap-5"><a href="https://naspadstudio.id" rel="noreferrer" target="_blank">Studio</a><a href="https://github.com/mzmznasipadang" rel="noreferrer" target="_blank">GitHub</a><a href="https://dribbble.com/MzMzNasiPadang" rel="noreferrer" target="_blank">Dribbble</a></div></footer>
    </main>
  );
}
