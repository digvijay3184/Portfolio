'use client';

import { useId, useMemo } from 'react';

export interface HeroMorphHeadingProps {
  words: string[];
  color?: string;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
}

function mapEaseToCSS(ease: string): string {
  switch (ease) {
    case "linear": return "linear";
    case "easeIn": return "ease-in";
    case "easeOut": return "ease-out";
    case "easeInOut": return "ease-in-out";
    default: return "ease-in-out";
  }
}

export default function HeroMorphHeading({
  words,
  color = '#FFFFFF',
  transition = { duration: 1.5, delay: 1.5, ease: 'easeInOut' }
}: HeroMorphHeadingProps) {
  const morph = Math.max(0.1, transition.duration ?? 1.5);
  const hold = Math.max(0, transition.delay ?? 1.5);
  const easeCSS = mapEaseToCSS(transition.ease ?? "easeInOut");

  const wordList = useMemo<string[]>(
    () => words.map((w) => w.trim()).filter(Boolean),
    [words]
  );

  const rawId = useId();
  const safeId = rawId.replace(/[:]/g, "");
  const filterId = `tm-thr-${safeId}`;
  const animName = `tm-rot-${safeId}`;

  const count = Math.max(1, wordList.length);
  const slot = morph + hold;
  const cycle = slot * count;
  const pct = (s: number) => Math.min(100, (s / cycle) * 100).toFixed(4);
  const mIn = pct(morph);
  const mHold = pct(morph + hold);
  const mOut = pct(2 * morph + hold);

  const keyframes = `
@keyframes ${animName} {
  0% { opacity: 0; filter: blur(20px); transform: translate(0, -50%) scale(0.95); }
  ${mIn}% { opacity: 1; filter: blur(0px); transform: translate(0, -50%) scale(1); }
  ${mHold}% { opacity: 1; filter: blur(0px); transform: translate(0, -50%) scale(1); }
  ${mOut}%, 100% { opacity: 0; filter: blur(20px); transform: translate(0, -50%) scale(1.05); }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes ${animName} {
    0% { opacity: 0; filter: none; transform: translate(0, -50%) scale(1); }
    ${mIn}% { opacity: 1; filter: none; transform: translate(0, -50%) scale(1); }
    ${mHold}% { opacity: 1; filter: none; transform: translate(0, -50%) scale(1); }
    ${mOut}%, 100% { opacity: 0; filter: none; transform: translate(0, -50%) scale(1); }
  }
}
  `;

  const longest = wordList.reduce((acc, w) => (w.length > acc.length ? w : acc), "");

  return (
    <div className="relative w-full flex justify-start items-center overflow-visible select-none text-5xl md:text-7xl font-bold tracking-tight">
      <style>{keyframes}</style>
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden>
        <defs>
          <filter id={filterId}>
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div 
        className="w-full relative flex justify-start items-center motion-reduce:filter-none"
        style={{ filter: `url(#${filterId})` }}
      >
        <div className="relative inline-flex justify-start items-center leading-tight min-h-[1.2em] w-full">
          <span className="invisible whitespace-nowrap inline-block pointer-events-none">{longest || " "}</span>
          {wordList.map((word, i) => (
            <span 
              key={`${word}-${i}`} 
              className="absolute top-1/2 left-0 whitespace-nowrap"
              style={{ 
                transform: "translate(0, -50%)", 
                transformOrigin: "left center",
                opacity: 0, 
                color, 
                animation: `${animName} ${cycle}s ${(slot * i).toFixed(3)}s infinite ${easeCSS}`, 
                willChange: "opacity, filter, transform" 
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
