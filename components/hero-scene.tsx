'use client';

import { useEffect, useRef } from 'react';

/** Three.js starfield + ridge background. Loaded lazily so three stays out of SSR and the first paint. */
export function HeroScene() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import('./hero-scene-impl').then(({ mountHeroScene }) => {
      const el = canvas.current;
      if (cancelled || !el?.parentElement) return;
      try {
        cleanup = mountHeroScene(el, el.parentElement);
      } catch {
        // No WebGL: the section's CSS background stays.
      }
    }).catch(() => {}); // Chunk failed to load: same fallback.
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <canvas aria-hidden className="pointer-events-none absolute inset-0 block size-full" ref={canvas} />;
}
