'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const iconBase = 'absolute size-4 transition-[opacity,rotate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';

/** Without `className` it is the shadcn outline button (legal pages); with one it is a plain button styled by the caller (header pill). */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const next = !dark;
    const apply = () => {
      // Sync so the snapshot taken after this callback already has the new icon and every themed component.
      flushSync(() => setDark(next));
      document.documentElement.classList.toggle('dark', next);
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !document.startViewTransition) return apply();

    // The new theme grows as a circle from the button that was pressed, so the change has a visible source.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.documentElement.dataset.themeSwitch = '';
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        // Ease in-out over 700ms: the edge visibly travels the whole way instead of covering the screen in the first third.
        { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
    transition.finished.finally(() => { delete document.documentElement.dataset.themeSwitch; }).catch(() => {});
  }

  const icons = (
    <>
      {/* Both icons stay mounted; the outgoing one turns away as the incoming one turns in. */}
      <Sun aria-hidden className={cn(iconBase, dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0')} />
      <Moon aria-hidden className={cn(iconBase, dark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100')} />
    </>
  );

  if (className) {
    return <button aria-label="Toggle night mode" aria-pressed={dark} className={cn('relative', className)} onClick={toggleTheme} type="button">{icons}</button>;
  }
  return (
    <Button aria-label="Toggle night mode" aria-pressed={dark} className="relative" onClick={toggleTheme} size="icon" variant="outline">
      {icons}
    </Button>
  );
}
