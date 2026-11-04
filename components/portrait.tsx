'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

// Each layer slides by `--look` (-1 left … 1 right) times its depth in px.
// Ears move against the head and the features move most, which fakes a head turn.
const shift = (px: number) => ({ transform: `translateX(calc(var(--look) * ${px}px))` });
const eye = { transformBox: 'fill-box', transformOrigin: 'center', transform: 'translateX(calc(var(--look) * 4px)) scaleY(var(--blink))' } as const;

/** Illustrated portrait that turns toward the cursor and blinks at random intervals. */
export function Portrait({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const state = { look: 0, blink: 1 };
      const paint = () => {
        el.style.setProperty('--look', state.look.toFixed(4));
        el.style.setProperty('--blink', state.blink.toFixed(3));
      };
      const lookTo = gsap.quickTo(state, 'look', { duration: 0.7, ease: 'power3.out', onUpdate: paint });

      const onPointer = (e: PointerEvent) => {
        const box = el.getBoundingClientRect();
        const center = box.left + box.width / 2;
        // Full turn when the cursor is half a viewport away from the face.
        lookTo(gsap.utils.clamp(-1, 1, (e.clientX - center) / (window.innerWidth / 2)));
      };
      window.addEventListener('pointermove', onPointer, { passive: true });

      // Blink every 2–6 s, sometimes twice in a row, like a person does.
      let next: gsap.core.Tween;
      const blink = () => {
        const times = Math.random() < 0.2 ? 2 : 1;
        gsap.timeline({ onUpdate: paint, onComplete: schedule })
          .to(state, { blink: 0.08, duration: 0.07, ease: 'power2.in', repeat: times * 2 - 1, yoyo: true, repeatDelay: 0.05 })
          .set(state, { blink: 1 });
      };
      const schedule = () => { next = gsap.delayedCall(gsap.utils.random(2, 6), blink); };
      schedule();

      return () => {
        window.removeEventListener('pointermove', onPointer);
        next?.kill();
        gsap.killTweensOf(state);
        el.style.setProperty('--look', '0');
        el.style.setProperty('--blink', '1');
      };
    });
    return () => media.revert();
  }, []);

  return (
    <svg
      className={cn('block h-auto', className)}
      ref={svg}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ '--look': 0, '--blink': 1 } as React.CSSProperties}
      viewBox="0 0 450 510"
    >
      <title>Illustrated portrait of Victor Chandra that looks toward your cursor</title>
      <g transform="translate(0 35) scale(1 .95)">
        <path fill="#fff" stroke="#fff" strokeWidth="11" d="M4 510C10 424 16 367 27 350C39 336 62 326 85 319C114 311 138 302 159 289L170 284C156 271 146 252 142 231C129 228 117 205 118 182C119 170 126 164 136 166C131 157 129 151 128 146C123 125 126 104 138 89C147 77 161 67 175 61C188 47 207 40 225 41C245 40 267 51 280 63C294 70 308 80 317 94C326 108 324 127 321 145C320 152 318 158 316 164C324 163 329 169 329 179C330 195 323 218 310 225C308 226 305 228 304 228C301 251 292 270 280 281L291 286C307 301 335 310 363 319C386 326 411 336 422 352C434 372 440 425 446 510Z" />
        <g stroke="#000" strokeWidth="4.4">
          {/* Body: static */}
          <path fill="#303033" d="M159 289C138 302 114 311 85 319C62 326 39 336 27 350C16 367 10 424 4 510H446C440 425 434 372 422 352C411 336 386 326 363 319C335 310 307 301 291 286Z" />
          <path fill="none" strokeWidth="3.5" d="M29 353C40 378 49 441 51 510M420 354C408 382 401 442 398 510" />
          <path fill="#252527" strokeWidth="3.2" d="M320 460C340 459 366 454 384 446L382 461C364 470 338 474 320 474Z" />
          <path fill="#fff" d="M159 285H292L299 344L284 510H175L151 345Z" />
          <g fill="#c72c35">
            <path d="M213 372L240 371C250 390 252 415 255 442L263 510H197L202 437C204 414 207 390 213 372Z" />
            <path d="M209 340L242 339L254 359L241 382C232 379 222 381 212 384L198 360Z" />
          </g>
          <path fill="#f7f7f7" d="M165 255L286 251L288 292C281 314 250 336 227 344C201 332 179 317 162 294Z" />
          <g fill="#fff">
            <path d="M163 279C170 301 191 324 225 343C213 350 203 366 191 385C172 365 157 341 154 319C153 302 156 288 163 279Z" />
            <path d="M286 276C286 301 258 326 229 343C245 353 256 368 268 384C282 365 296 337 297 314C298 298 294 287 286 276Z" />
          </g>
          <g fill="#39393c">
            <path d="M163 280C146 298 131 325 116 352L144 356L119 383C134 433 153 477 173 510H205C190 455 174 399 165 353C158 323 155 298 163 280Z" />
            <path d="M286 279C302 296 319 325 333 352L304 356L329 382C316 433 297 477 278 510H248C262 456 278 401 287 355C293 326 295 298 286 279Z" />
          </g>

          {/* Head layers, back to front */}
          <g fill="#f7f7f7" style={shift(-4)}>
            <path d="M146 174C135 161 119 164 118 182C117 198 124 221 137 229C142 232 147 232 152 230Z" />
            <path d="M302 171C313 158 328 162 329 179C330 195 323 218 310 225C305 228 301 229 297 227Z" />
            <path fill="none" strokeWidth="3" d="M127 183C134 185 138 192 140 199M320 181C313 184 310 192 308 198" />
          </g>
          <path fill="#f7f7f7" style={shift(2)} d="M141 143C140 101 173 77 219 75C269 72 304 99 307 144L307 204C306 244 293 271 270 289C256 300 241 306 225 306C206 306 192 301 177 291C154 274 142 245 141 211Z" />
          <path fill="#27272a" style={shift(3)} d="M141 178C135 171 130 159 128 146C123 125 126 104 138 89C147 77 161 67 175 61C188 47 207 40 225 41C245 40 267 51 280 63C294 70 308 80 317 94C326 108 324 127 321 145C319 158 314 170 307 177L305 151C305 137 300 125 290 115C271 97 248 86 226 85C199 84 173 97 155 116C144 130 143 152 141 178Z" />
          <g fill="#111" stroke="none" style={shift(12)}>
            {/* Features traced from the photo: straight thick brows, narrow almond eyes, broad rounded nose, closed-lip smile. */}
            <path d="M151 156C156 147 170 143 186 143C198 143 207 147 211 153C200 151 189 151 178 152C168 153 159 155 151 156Z" />
            <path d="M294 156C289 147 275 143 259 143C247 143 238 147 234 153C245 151 256 151 267 152C277 153 286 155 294 156Z" />
            <path fill="none" stroke="#111" strokeWidth="3.4" d="M166 174C172 167 189 165 198 171M247 171C256 165 273 167 279 174" />
            <ellipse cx="182" cy="177" rx="7.5" ry="6.5" style={eye} />
            <ellipse cx="263" cy="177" rx="7.5" ry="6.5" style={eye} />
            <path fill="none" stroke="#111" strokeWidth="3" d="M214 222C218 227 227 227 231 222M211 212C205 215 205 222 212 223M234 212C240 215 240 222 233 223" />
            <path fill="none" stroke="#000" strokeWidth="3.6" d="M201 248C212 254 233 254 244 247" />
            <path fill="none" stroke="#111" strokeWidth="2.6" d="M213 258C219 261 227 261 233 258" />
          </g>
        </g>
      </g>
    </svg>
  );
}
