'use client';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export type Branch = { label: string; skills: string[] };

// Map coordinates live in a 1000×700 box; the container keeps that aspect ratio so % positions line up with the SVG.
const W = 1000;
const H = 700;
const CX = W / 2;
const CY = H / 2;

type Point = { x: number; y: number };
const onEllipse = (deg: number, rx: number, ry: number): Point => ({ x: CX + rx * Math.cos((deg * Math.PI) / 180), y: CY + ry * Math.sin((deg * Math.PI) / 180) });

// Bends horizontally for side links and vertically for top/bottom ones.
function curve(a: Point, b: Point) {
  if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) {
    const mx = (a.x + b.x) / 2;
    return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
  }
  const my = (a.y + b.y) / 2;
  return `M${a.x} ${a.y}C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
}

function layout(branches: Branch[]) {
  const step = 360 / branches.length;
  return branches.map((branch, i) => {
    const angle = -90 + i * step;
    const spread = Math.min(step * 0.8, branch.skills.length * 16);
    return {
      ...branch,
      at: onEllipse(angle, 190, 130),
      skills: branch.skills.map((skill, j) => {
        const offset = branch.skills.length === 1 ? 0 : -spread / 2 + (spread * j) / (branch.skills.length - 1);
        return { skill, at: onEllipse(angle + offset, 400, 290) };
      }),
    };
  });
}

const pct = (p: Point) => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` });

/**
 * Radial skill map: hover a branch to highlight it, click a skill to see where it was used,
 * drag a skill and it springs back on release. Below md it collapses to a grouped list.
 */
export function StackMindmap({ branches, usedIn }: { branches: Branch[]; usedIn: Record<string, string[]> }) {
  const [hovered, setHovered] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const map = useRef<HTMLDivElement>(null);
  const links = useRef<Record<string, SVGPathElement | null>>({});
  const nodes = layout(branches);
  const branchOf = (skill?: string) => branches.find((b) => skill && b.skills.includes(skill))?.label;
  const active = hovered ?? branchOf(selected);

  useEffect(() => {
    const el = map.current;
    if (!el) return;
    gsap.registerPlugin(Draggable);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draggables = layout(branches).flatMap((branch) => branch.skills.flatMap(({ skill, at }) => {
      const target = el.querySelector<HTMLElement>(`[data-skill="${CSS.escape(skill)}"]`);
      if (!target) return [] as Draggable[];
      // Redraw this skill's link so it stretches with the node while dragged or springing back.
      const redraw = () => {
        const scale = W / el.clientWidth;
        const dx = Number(gsap.getProperty(target, 'x')) * scale;
        const dy = Number(gsap.getProperty(target, 'y')) * scale;
        links.current[skill]?.setAttribute('d', curve(branch.at, { x: at.x + dx, y: at.y + dy }));
      };
      return Draggable.create(target, {
        bounds: el,
        dragClickables: true,
        zIndexBoost: true,
        onDrag: redraw,
        onRelease() {
          gsap.to(target, { x: 0, y: 0, duration: reduce ? 0 : 0.9, ease: 'elastic.out(1, 0.45)', onUpdate: redraw });
        },
      });
    }));
    return () => draggables.forEach((d) => d.kill());
  }, [branches]);

  const uses = selected ? usedIn[selected] ?? [] : [];

  return (
    <div>
      {/* Map, md and up */}
      <div className="relative hidden aspect-[10/7] w-full select-none md:block" onMouseLeave={() => setHovered(undefined)} ref={map}>
        <svg aria-hidden className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${W} ${H}`}>
          {nodes.map((branch) => {
            const on = active === branch.label;
            const tone = cn('fill-none transition-[stroke,opacity] duration-300', on ? 'stroke-primary' : 'stroke-border', active && !on && 'opacity-40');
            return (
              <g key={branch.label}>
                <path className={tone} d={curve({ x: CX, y: CY }, branch.at)} strokeWidth={on ? 3 : 2} />
                {branch.skills.map(({ skill, at }) => (
                  <path className={tone} d={curve(branch.at, at)} key={skill} ref={(el) => { links.current[skill] = el; }} strokeWidth={on ? 2.5 : 1.5} />
                ))}
              </g>
            );
          })}
        </svg>

        <div className="absolute grid size-24 -translate-1/2 place-items-center rounded-full bg-primary text-lg font-semibold tracking-tight text-primary-foreground shadow-lg" style={pct({ x: CX, y: CY })}>Victor</div>

        {nodes.map((branch) => {
          const dim = active && active !== branch.label;
          return (
            <div key={branch.label}>
              <button
                className={cn('absolute -translate-1/2 rounded-full border-2 border-primary bg-background px-4 py-2 text-sm font-semibold whitespace-nowrap transition-opacity duration-300', dim && 'opacity-70', active === branch.label && 'bg-primary text-primary-foreground')}
                onBlur={() => setHovered(undefined)}
                onFocus={() => setHovered(branch.label)}
                onMouseEnter={() => setHovered(branch.label)}
                style={pct(branch.at)}
                type="button"
              >
                {branch.label}
              </button>
              {branch.skills.map(({ skill, at }) => (
                // Outer div owns the centring transform; GSAP drags the button inside it.
                <div className="absolute -translate-1/2" key={skill} style={pct(at)}>
                  <button
                    aria-pressed={selected === skill}
                    className={cn(
                      'cursor-grab rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow-sm transition-[opacity,background-color,color] duration-300 active:cursor-grabbing',
                      selected === skill ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary',
                      dim && 'opacity-70',
                    )}
                    data-skill={skill}
                    onBlur={() => setHovered(undefined)}
                    onClick={() => setSelected(selected === skill ? undefined : skill)}
                    onFocus={() => setHovered(branch.label)}
                    onMouseEnter={() => setHovered(branch.label)}
                    type="button"
                  >
                    {skill}
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Grouped list, below md */}
      <div className="space-y-6 md:hidden">
        {branches.map((branch) => (
          <div key={branch.label}>
            <p className="mb-3 text-sm font-semibold text-primary">{branch.label}</p>
            <div className="flex flex-wrap gap-2">
              {branch.skills.map((skill) => (
                <button
                  aria-pressed={selected === skill}
                  className={cn('min-h-11 rounded-full border px-4 text-sm font-medium', selected === skill ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card')}
                  key={skill}
                  onClick={() => setSelected(selected === skill ? undefined : skill)}
                  type="button"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div aria-live="polite" className="mt-6 min-h-20 rounded-2xl border border-border bg-card p-5">
        {selected ? (
          <>
            <p className="text-sm text-muted-foreground">{branchOf(selected)} · <span className="font-semibold text-foreground">{selected}</span></p>
            <p className="mt-2 text-base">
              {uses.length ? <>Used in <span className="font-semibold">{uses.join(' · ')}</span></> : 'Part of my day-to-day toolkit.'}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Select a skill to see where I&apos;ve used it. Drag one to stretch its branch.</p>
        )}
      </div>
    </div>
  );
}
