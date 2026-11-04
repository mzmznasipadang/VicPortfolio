'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

// Digits and code symbols: narrow like Latin letters, so the line barely shifts while they flicker.
const GLYPHS = '0123456789{}[]<>()/\\=+-*;:#$%&|_';
const HOLD_MS = 3000;
const SMOKE_S = 1.6; // old word drifts up and dissolves
const DECODE_MS = 1400; // new word flickers in and locks
const LOCK_EASE = 'color 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms cubic-bezier(0.22, 1, 0.36, 1)';

type Slot = { to: string; start: number; end: number; glyph: string; changedAt: number; el: HTMLSpanElement };

const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

/**
 * Lays a phrase out as one span per letter, grouped into words that never break
 * inside, with real spaces between them so the line still wraps between words.
 * Returns the letter spans (spaces excluded) in reading order.
 */
function layLetters(node: HTMLElement, phrase: string, inlineBlock: boolean) {
  const letters: HTMLSpanElement[] = [];
  const parts: Node[] = [];
  phrase.split(' ').forEach((word, w) => {
    if (w > 0) parts.push(document.createTextNode(' '));
    const group = document.createElement('span');
    group.style.whiteSpace = 'nowrap';
    for (const char of word.split('')) {
      const el = document.createElement('span');
      if (inlineBlock) el.style.display = 'inline-block';
      el.textContent = char;
      group.appendChild(el);
      letters.push(el);
    }
    parts.push(group);
  });
  node.replaceChildren(...parts);
  return letters;
}

/**
 * Cycles through `words`: the current word dissolves like smoke, letter by letter,
 * then the next one decodes Matrix-style. Letters start on an ease-in-out curve,
 * flicker through digits and code symbols that slow down as they near their
 * letter (an ease-in to rest), then lock and fade from sky blue to the heading color.
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
    let smoke: gsap.core.Tween | undefined;

    const decode = (to: string) => {
      // One persistent span per letter, so color and opacity can transition instead of being swapped.
      // Each starts as its invisible final letter, which reserves its width so the word doesn't grow.
      const letters = layLetters(node, to, false);
      const slots: Slot[] = letters.map((el, i) => {
        const start = easeInOutSine(i / Math.max(letters.length - 1, 1)) * 0.45 + Math.random() * 0.08;
        el.style.opacity = '0';
        el.style.transition = LOCK_EASE;
        return { to: el.textContent ?? '', start, end: start + 0.32 + Math.random() * 0.12, glyph: '', changedAt: -Infinity, el };
      });
      slots[slots.length - 1].end = 1; // the last letter locks exactly at DECODE_MS
      const startedAt = performance.now();

      const step = (now: number) => {
        const t = (now - startedAt) / DECODE_MS;
        for (const slot of slots) {
          const { el } = slot;
          if (t >= slot.end) {
            if (el.textContent !== slot.to || el.classList.contains('text-ring')) {
              el.textContent = slot.to;
              el.classList.remove('text-ring'); // the color transition eases it into the heading color
              el.style.opacity = '1';
              el.style.filter = 'none';
            }
          } else if (t >= slot.start) {
            // Flicker fast at first, then slower as the letter approaches lock (ease-in to rest).
            const progress = (t - slot.start) / (slot.end - slot.start);
            const interval = 40 + 160 * progress * progress;
            if (now - slot.changedAt >= interval) {
              slot.changedAt = now;
              slot.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              el.textContent = slot.glyph;
            }
            el.classList.add('text-ring'); // sky blue in both themes, so glyphs stand out from the heading
            el.style.opacity = '1';
            el.style.filter = 'blur(0.4px)';
          }
        }
        if (t >= 1) {
          // Back to plain text once settled, so the heading wraps and selects like normal text.
          window.setTimeout(() => { if (node.querySelector('.text-ring') === null) node.textContent = to; }, 450);
          timer = window.setTimeout(next, HOLD_MS);
          return;
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const next = () => {
      const current = words[index % words.length];
      index++;
      // Split into letters that can each drift and blur away, grouped by word so the line never re-wraps mid-word.
      const letters = layLetters(node, current, true);
      smoke = gsap.to(letters, {
        opacity: 0,
        y: () => -gsap.utils.random(10, 22),
        x: () => gsap.utils.random(-8, 8),
        filter: 'blur(8px)',
        scale: 1.15,
        duration: SMOKE_S * 0.6,
        ease: 'sine.out',
        stagger: { each: (SMOKE_S * 0.4) / Math.max(letters.length - 1, 1) },
        onComplete: () => decode(words[index % words.length]),
      });
    };

    timer = window.setTimeout(next, HOLD_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      smoke?.kill();
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
