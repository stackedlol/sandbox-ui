"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";

/* ─── Config ──────────────────────────────────────────────────── */

// Calm, minimal glyph set — no wild symbols
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789·:—-+=/\\|_";

interface CrypticTextProps {
  /** The final revealed text */
  text: string;
  /** ms before the reveal begins */
  delay?: number;
  /** Total ms for the full reveal */
  duration?: number;
  /** CSS class for the container */
  className?: string;
  /** Trigger re-scramble on hover */
  hover?: boolean;
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function pickGlyph(seed: number) {
  return GLYPHS[Math.abs(seed) % GLYPHS.length];
}

function buildThresholds(len: number) {
  return Array.from({ length: len }, (_, i) => {
    const p = i / Math.max(len - 1, 1);
    return 0.1 + p * 0.7;
  });
}

/* ─── Component ───────────────────────────────────────────────── */

export function CrypticText({
  text,
  delay = 400,
  duration = 2000,
  className,
  hover = false,
}: CrypticTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const runningRef = useRef(false);

  // Stable across renders as long as text doesn't change
  const chars = useMemo(() => text.split(""), [text]);
  const thresholds = useMemo(() => buildThresholds(chars.length), [chars.length]);

  const animate = useCallback(
    (timestamp: number) => {
      if (!containerRef.current) return;
      if (!startRef.current) startRef.current = timestamp;

      const elapsed = timestamp - startRef.current;
      const globalT = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(globalT);

      const spans = containerRef.current.children;

      for (let i = 0; i < chars.length; i++) {
        const span = spans[i] as HTMLSpanElement | undefined;
        if (!span) continue;

        const ch = chars[i];
        if (ch === " ") continue;

        const threshold = thresholds[i];

        if (eased >= threshold + 0.15) {
          // Fully resolved
          if (span.textContent !== ch) span.textContent = ch;
          span.style.opacity = "1";
        } else if (eased >= threshold - 0.05) {
          // In the resolve zone — slow cycling, 3 glyphs per second
          const localT = (eased - (threshold - 0.05)) / 0.2;
          const cycleIndex = Math.floor(elapsed / 120) + i;

          if (localT > 0.7) {
            // Lock in final character
            if (span.textContent !== ch) span.textContent = ch;
            span.style.opacity = String(0.6 + localT * 0.4);
          } else {
            // Gentle cycling
            const glyph = pickGlyph(cycleIndex);
            if (span.textContent !== glyph) span.textContent = glyph;
            span.style.opacity = String(0.2 + localT * 0.5);
          }
        } else {
          // Not yet in the wave — very slow idle cycling (2 changes/sec)
          const idleCycle = Math.floor(elapsed / 500) + i * 7;
          const glyph = pickGlyph(idleCycle);
          if (span.textContent !== glyph) span.textContent = glyph;
          span.style.opacity = "0.12";
        }
      }

      if (globalT < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        runningRef.current = false;
      }
    },
    [chars, thresholds, duration],
  );

  const startAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = 0;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Initial reveal — no hasRun guard so it works with Strict Mode & client nav
  useEffect(() => {
    const timeout = setTimeout(startAnimation, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, [delay, startAnimation]);

  const handleMouseEnter = useCallback(() => {
    if (hover) startAnimation();
  }, [hover, startAnimation]);

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            minWidth: ch === " " ? "0.3em" : undefined,
            opacity: 0,
            transition: "opacity 0.3s ease",
            willChange: "contents, opacity",
          }}
        >
          {ch === " " ? "\u00A0" : "·"}
        </span>
      ))}
    </span>
  );
}
