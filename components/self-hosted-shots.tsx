'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { Avatar, Badge, Bar, Prompt, Row, Stage, Text, Window } from '@/components/stageshow/kit';
import './self-hosted-shots.css';

// Still product shots for the self-hosted cards (stageshow "pinned, bottom bleed"):
// one window inset 20px on top and sides, running off the card's bottom.
// Real words only on what identifies each product; bars for the rest.

export function useSiteTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.classList.contains('dark'));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

/** A still stage in the site's theme; `className` scopes each set's CSS. */
export function Shot({ children, height = 190, className = 'shs' }: { children: ReactNode; height?: number; className?: string }) {
  const dark = useSiteTheme();
  return (
    <div aria-hidden className={className}>
      <Stage accent={dark ? '#49bce9' : '#272660'} height={height} theme={dark ? 'dark' : 'light'} width={352}>
        {() => children}
      </Stage>
    </div>
  );
}

function PortfolioShot({ height }: { height?: number }) {
  return (
    <Shot height={height}>
      <Window className="shs-window" url="victorch.dev" urlShape="pill">
        <div className="shs-page shs-hero">
          <div className="shs-hero__copy">
            <Text className="shs-hero__title">iOS Engineer</Text>
            <div className="shs-hero__actions"><span className="shs-pill" /><span className="shs-pill shs-pill--ghost" /></div>
          </div>
          <Avatar name="Victor Chandra" size={56} tone="accent" />
          <div className="shs-hero__bio"><Bar w={88} tone={3} /><Bar w={72} tone={2} /><Bar w={80} tone={2} /></div>
          <svg className="shs-ridge" preserveAspectRatio="none" viewBox="0 0 300 40"><path d="M0 28 C40 14 70 30 110 18 S190 8 230 22 S280 26 300 16 V40 H0 Z" /></svg>
        </div>
      </Window>
    </Shot>
  );
}

const COMMITS = [
  { title: 'Apply UI/UX critique fixes', time: '2h' },
  { title: 'Redesign Experience and Stack', time: '1d' },
  { w: 132 },
  { w: 108 },
];

function GiteaShot({ height }: { height?: number }) {
  return (
    <Shot height={height}>
      <Window className="shs-window" title="victor / VicPortfolio">
        <div className="shs-page">
          <div className="shs-tabs"><Text className="shs-tab" data-on>Code</Text><Text className="shs-tab">Commits</Text><Text className="shs-tab">Releases</Text></div>
          <div className="shs-list">
            {COMMITS.map((c, i) => (
              <Row
                className="shs-row"
                key={i}
                lead={<Avatar name="Victor Chandra" size={18} tone={i < 2 ? 'accent' : 'ink'} />}
                meta={c.time ? <Text className="shs-meta">{c.time}</Text> : <Bar w={18} tone={2} />}
                pad={8}
                title={c.title ? <Text className="shs-rowtext">{c.title}</Text> : <Bar w={c.w!} tone={3} />}
              />
            ))}
          </div>
        </div>
      </Window>
    </Shot>
  );
}

function InvoiceShot({ height }: { height?: number }) {
  return (
    <Shot height={height}>
      <Window className="shs-window" title="Invoices">
        <div className="shs-page">
          <div className="shs-head"><Text className="shs-h">Invoices</Text><span className="shs-pill" /></div>
          <div className="shs-list">
            <Row className="shs-row" meta={<Badge tone="success">Paid</Badge>} pad={8} selected title={<Text className="shs-rowtext">INV-0042</Text>} />
            <Row className="shs-row" meta={<Badge tone="warning">Due</Badge>} pad={8} title={<Text className="shs-rowtext">INV-0041</Text>} />
            <Row className="shs-row" meta={<Bar w={30} tone={2} />} pad={8} title={<Bar w={64} tone={3} />} />
            <Row className="shs-row" meta={<Bar w={26} tone={2} />} pad={8} title={<Bar w={52} tone={3} />} />
          </div>
        </div>
      </Window>
    </Shot>
  );
}

function DeployShot({ height }: { height?: number }) {
  return (
    <Shot height={height}>
      <Window chrome="terminal" className="shs-window" title="welijayajaya — zsh">
        <div className="shs-term">
          <Prompt path="~/welijayajaya">git pull</Prompt>
          <div className="dim">Already up to date.</div>
          <Prompt path="~/welijayajaya">docker compose up -d</Prompt>
          <div className="ok">✔ Container welijayajaya-web  Started</div>
        </div>
      </Window>
    </Shot>
  );
}

// Column names are the product; the cards stay bars so the mock never reads as a real application.
const BOARD = [
  { label: 'Applied', cards: [{ w: 62 }, { w: 48 }, { w: 56 }] },
  { label: 'Interview', cards: [{ w: 54, focus: true }, { w: 44 }] },
  { label: 'Offer', cards: [{ w: 40 }] },
];

function JobTrackerShot({ height }: { height?: number }) {
  return (
    <Shot height={height}>
      <Window className="shs-window" title="JobTracker">
        <div className="shs-page shs-board">
          {BOARD.map((col) => (
            <div className="shs-col" key={col.label}>
              <Text className="shs-col__label">{col.label}</Text>
              {col.cards.map((card, i) => (
                <div className="shs-card" data-focus={card.focus || undefined} key={i}>
                  <Bar w={card.w} tone={card.focus ? 4 : 3} />
                  <Bar w={34} h={5} tone={2} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Window>
    </Shot>
  );
}

const SHOTS: Record<string, (p: { height?: number }) => ReactNode> = {
  Portfolio: PortfolioShot,
  Gitea: GiteaShot,
  'Project + Invoice SaaS': InvoiceShot,
  WeliJayaJaya: DeployShot,
  JobTracker: JobTrackerShot,
};

/** The product shot for a self-hosted project, or nothing if it has none. `height` crops taller (the Work menu uses 220, its 16:10 box). */
export function SelfHostedShot({ name, height }: { name: string; height?: number }) {
  const ShotFor = SHOTS[name];
  return ShotFor ? <ShotFor height={height} /> : null;
}
