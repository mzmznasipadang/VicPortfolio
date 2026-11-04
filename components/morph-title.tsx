'use client';

import { useEffect, useRef } from 'react';

// Half-width katakana and digits, as in the Matrix code rain; narrow enough not to reflow the line.
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
const HOLD_MS = 3000;
// One decode step every 45ms (about 22 per second) instead of every frame: slower, calmer flicker.
const TICK_MS = 45;

type Slot = { from: string; to: string; start: number; end: number; glyph: string };

/**
 * Cycles through `words` with a Matrix-style decode: each letter flickers through
 * random glyphs, then locks into the next word, left to right with jitter.
 * Purely visual: pass the readable text to the heading separately.
 */
export function MorphTitle({ words }: { words: string[] }) {
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = text.current;
    if (!node || words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let index = 0;
    let frame = 0;
    let timer = 0;

    const render = (slots: Slot[], tick: number) => {
      let settled = 0;
      node.replaceChildren(...slots.map((slot) => {
        if (tick >= slot.end) { settled++; return document.createTextNode(slot.to); }
        if (tick < slot.start) return document.createTextNode(slot.from);
        if (!slot.glyph || Math.random() < 0.25) slot.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const span = document.createElement('span');
        span.className = 'text-ring'; // sky blue in both themes, so glyphs stand out from the heading
        span.textContent = slot.glyph;
        return span;
      }));
      return settled === slots.length;
    };

    const decode = (from: string, to: string) => {
      const length = Math.max(from.length, to.length);
      const slots: Slot[] = Array.from({ length }, (_, i) => {
        // Later letters start and lock later, so the word resolves left to right.
        const start = Math.floor(i * 1.2 + Math.random() * 6);
        const isSpace = to[i] === ' ';
        return { from: from[i] ?? '', to: to[i] ?? '', start, end: isSpace ? start : start + 8 + Math.floor(Math.random() * 14), glyph: '' };
      });
      const startedAt = performance.now();
      let lastTick = -1;
      const step = (now: number) => {
        const tick = Math.floor((now - startedAt) / TICK_MS);
        if (tick !== lastTick) {
          lastTick = tick;
          if (render(slots, tick)) { timer = window.setTimeout(next, HOLD_MS); return; }
        }
        frame = requestAnimationFrame(step);
      };
      step(startedAt);
    };

    const next = () => {
      const from = words[index % words.length];
      index++;
      decode(from, words[index % words.length]);
    };

    timer = window.setTimeout(next, HOLD_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      node.textContent = words[0];
    };
  }, [words]);

  return (
    <span aria-hidden className="relative block">
      {/* Invisible sizer keeps the line height stable while letters change. */}
      <span className="invisible block">{words.reduce((longest, word) => (word.length > longest.length ? word : longest), '')}</span>
      <span className="absolute inset-0" ref={text}>{words[0]}</span>
    </span>
  );
}
