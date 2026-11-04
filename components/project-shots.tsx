'use client';

import type { ReactNode } from 'react';

import { Badge, Bar, Button, Divider, Icon, Meter, Phone, Text, Window, type PhoneProps } from '@/components/stageshow/kit';
import { Shot, useSiteTheme } from '@/components/self-hosted-shots';
import './project-shots.css';

// Still product shots for the Selected work cards, one per app, at the 16:10 the
// thumbnails had. Each is the screen the app is about, simplified: real words
// only on what identifies it, bars for the rest, and the device running off the
// card's bottom edge.

/** A silver iPhone whose screen follows the site theme. */
function AppPhone({ children, ...rest }: PhoneProps) {
  const dark = useSiteTheme();
  return <Phone dark={dark} frame="silver" {...rest}><div className="pjs-screen">{children}</div></Phone>;
}

// Reflax times meals and medication from the night's sleep-wake data.
const DOSES = [
  { label: 'Breakfast', time: '7:30' },
  { label: 'Medication', time: '8:00', next: true },
];

function ReflaxShot() {
  return (
    <Shot className="pjs" height={220}>
      <AppPhone className="pjs-phone pjs-phone--right" width={168}>
        <Text className="pjs-large">Today</Text>
        <div className="pjs-wake">
          <div className="pjs-wake__head"><Text className="pjs-label">Woke up</Text><Text className="pjs-figure">6:40</Text></div>
          <div className="pjs-wake__track"><span className="pjs-wake__sleep" /><span className="pjs-wake__now" /></div>
        </div>
        {DOSES.map((d) => (
          <div className="pjs-iosrow" data-next={d.next || undefined} key={d.label}>
            <span className="pjs-iosrow__lead"><span className="pjs-dot" data-tone={d.next ? undefined : '2'} /><Text className="pjs-body">{d.label}</Text></span>
            <Text className="pjs-body pjs-dim">{d.time}</Text>
          </div>
        ))}
        <div className="pjs-iosrow"><Bar h={12} tone={3} w={150} /><Bar h={12} tone={2} w={48} /></div>
      </AppPhone>
      <div className="pjs-sat" style={{ right: 178, top: 118 }}>
        <span className="pjs-sat__icon"><Icon filled name="bell" size={14} /></span>
        <div className="pjs-sat__copy"><Text className="pjs-sat__title">Medication at 8:00</Text><Text className="pjs-sat__meta">Timed from your sleep</Text></div>
      </div>
    </Shot>
  );
}

function CocoShot() {
  return (
    <Shot className="pjs" height={220}>
      <AppPhone className="pjs-phone pjs-phone--left" width={168}>
          <Text className="pjs-large">Discover</Text>
          <div className="pjs-search"><Icon name="search" size={22} /><Text className="pjs-body">Bali</Text></div>
          <div className="pjs-photo">
            <svg preserveAspectRatio="none" viewBox="0 0 354 170">
              <circle className="pjs-photo__sun" cx="262" cy="64" r="26" />
              <path className="pjs-photo__far" d="M0 120 C60 80 110 96 160 70 S260 92 354 60 V170 H0 Z" />
              <path className="pjs-photo__near" d="M0 150 C80 120 150 140 220 112 S320 126 354 110 V170 H0 Z" />
            </svg>
          </div>
          <Text className="pjs-title">Snorkeling in Amed</Text>
          <Bar h={12} tone={2} w={140} />
      </AppPhone>
      <div className="pjs-sat" style={{ right: 20, top: 96 }}>
        <span className="pjs-sat__icon" data-tone="success"><Icon filled name="check" size={14} /></span>
        <div className="pjs-sat__copy"><Text className="pjs-sat__title">Booked</Text><Text className="pjs-sat__meta">Sat, 14 Jun</Text></div>
      </div>
    </Shot>
  );
}

function CountDownShot() {
  return (
    <Shot className="pjs" height={220}>
      <div className="pjs-desktop" />
      <div className="pjs-menubar">
        <Bar h={6} tone={3} w={22} />
        <Bar h={6} tone={2} w={28} />
        <Bar h={6} tone={2} w={20} />
        <span className="pjs-menubar__item" data-on><Icon name="clock" size={12} /><Text>Standup in 12m</Text></span>
        <Icon name="wifi" size={12} />
        <Text className="pjs-menubar__time">9:41</Text>
      </div>
      <div className="pjs-panel">
        <div className="pjs-panel__head"><Text className="pjs-h">Standup</Text><Bar h={6} tone={2} w={40} /></div>
        <Text className="pjs-count">12:04</Text>
        <Meter value={0.62} />
        <div className="pjs-panel__actions"><Button size="small" variant="primary">Join</Button><Button size="small" variant="ghost">Snooze</Button></div>
        <Divider />
        <div className="pjs-event"><span className="pjs-dot" /><Bar h={6} tone={3} w={96} /><Text className="pjs-meta">11:00</Text></div>
        <div className="pjs-event"><span className="pjs-dot" data-tone="2" /><Bar h={6} tone={3} w={74} /><Text className="pjs-meta">13:30</Text></div>
      </div>
    </Shot>
  );
}

const QUEUE = [{ no: 'A-042', on: true }, { no: 'A-043' }, { w: 40 }, { w: 34 }];

function QueueShot() {
  return (
    <Shot className="pjs" height={220}>
      <Window className="pjs-admin" title="Queue">
        <div className="pjs-admin__body">
          <Text className="pjs-label">Now serving</Text>
          <div className="pjs-serving"><Text className="pjs-ticket">A-041</Text><Button size="small" variant="primary">Call next</Button></div>
          <div className="pjs-queue">
            {QUEUE.map((q, i) => (
              <div className="pjs-queue__row" key={i}>
                {q.no ? <Text className="pjs-rowtext">{q.no}</Text> : <Bar h={6} tone={3} w={q.w!} />}
                {q.on ? <Badge tone="accent">Next</Badge> : <Bar h={6} tone={2} w={30} />}
              </div>
            ))}
          </div>
        </div>
      </Window>
      <AppPhone className="pjs-phone pjs-phone--small" width={116}>
          <Text className="pjs-label pjs-center">Your number</Text>
          <Text className="pjs-big">A-042</Text>
          <Text className="pjs-body pjs-dim pjs-center">1 ahead of you</Text>
          <svg className="pjs-qr" viewBox="0 0 7 7">
            <path d="M0 0h3v3H0zM4 0h3v3H4zM0 4h3v3H0zM4 4h1v1H4zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM6 6h1v1H6z" />
          </svg>
      </AppPhone>
    </Shot>
  );
}

function AshMapShot() {
  return (
    <Shot className="pjs" height={220}>
      <Window
        className="pjs-map"
        sidebar={
          <div className="pjs-side">
            <Text className="pjs-h">Krakatau</Text>
            <Badge tone="warning">Level III</Badge>
            <Bar h={5} tone={2} w={70} />
            <Bar h={5} tone={2} w={56} />
            <Divider />
            <div className="pjs-event"><Text className="pjs-rowtext">CGK</Text><span className="pjs-dot" data-tone="danger" /></div>
            <div className="pjs-event"><Text className="pjs-rowtext">HLP</Text><span className="pjs-dot" data-tone="danger" /></div>
            <div className="pjs-event"><Bar h={6} tone={3} w={28} /><span className="pjs-dot" data-tone="2" /></div>
          </div>
        }
        sidebarWidth={104}
      >
        <svg className="pjs-geo" preserveAspectRatio="xMidYMid slice" viewBox="0 0 208 200">
          <path className="pjs-geo__land" d="M-20 6 C10 18 40 50 66 84 C72 94 66 102 56 98 C30 78 0 50 -20 38 Z" />
          <path className="pjs-geo__land" d="M80 116 C110 110 160 116 230 126 L230 142 C170 140 120 136 82 132 C75 128 75 120 80 116 Z" />
          <path className="pjs-geo__ash" d="M70 104 L122 88 L176 114 L156 158 L92 152 Z" />
          {[[24, 150], [40, 176], [120, 40], [170, 60], [186, 176], [20, 110]].map(([x, y]) => <path className="pjs-geo__wind" d={`M${x} ${y} l10 -4`} key={`${x}-${y}`} />)}
          <circle className="pjs-geo__volcano" cx="70" cy="106" r="3" />
          {[['CGK', 106, 116], ['HLP', 134, 132]].map(([code, x, y]) => (
            <g className="pjs-geo__pin" key={code} transform={`translate(${x} ${y})`}>
              <rect height="11" rx="3" width="22" x="-11" y="-5.5" />
              <text dy="0.35em" textAnchor="middle">{code}</text>
            </g>
          ))}
        </svg>
      </Window>
    </Shot>
  );
}

const SHOTS: Record<string, () => ReactNode> = {
  Reflax: ReflaxShot,
  Coco: CocoShot,
  CountDown: CountDownShot,
  ADASayembara: QueueShot,
  AshMap: AshMapShot,
};

/** The product shot for an app in Selected work, or nothing if it has none. */
export function ProjectShot({ name }: { name: string }) {
  const ShotFor = SHOTS[name];
  return ShotFor ? <ShotFor /> : null;
}
