"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "./button";

/* ─── Page icons ──────────────────────────────────────────────── */

function TagIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1.5 1.5h4.2l6.3 6.3-4.2 4.2-6.3-6.3z" /><circle cx="4.25" cy="4.25" r=".75" fill="currentColor" stroke="none" /></svg>);
}
function BtnIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1.5" y="3.5" width="11" height="7" rx="1.5" /><line x1="4.5" y1="7" x2="9.5" y2="7" /></svg>);
}
function CrdIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1.5" y="2" width="11" height="10" rx="1.5" /><line x1="1.5" y1="5.5" x2="12.5" y2="5.5" /></svg>);
}
function NavIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><line x1="2" y1="4" x2="12" y2="4" /><line x1="2" y1="7" x2="12" y2="7" /><line x1="2" y1="10" x2="12" y2="10" /></svg>);
}
function CalIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" /><path d="M1.5 5.5h11" /><path d="M4.5 .5v3M9.5 .5v3" /></svg>);
}
function TblIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1.5" y="1.5" width="11" height="11" rx="1.5" /><path d="M1.5 5h11M1.5 8h11M5.5 1.5v11M9 1.5v11" /></svg>);
}
function ChtIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1.5 12.5V1.5" /><path d="M1.5 12.5h11" /><path d="M4 9.5l2.5-3 2.5 1.5L12 4" /></svg>);
}
function DevIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="0.5" width="8" height="13" rx="1.5" /><path d="M6 11.5h2" /></svg>);
}
function NodIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7" cy="3" r="1.5" /><circle cx="3" cy="11" r="1.5" /><circle cx="11" cy="11" r="1.5" /><path d="M7 4.5v2.5M5.8 8.2L4.2 9.8M8.2 8.2l1.6 1.6" /></svg>);
}

function FloIco(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="0.5" y="2" width="4" height="3.5" rx="1" /><rect x="9.5" y="1" width="4" height="3.5" rx="1" /><rect x="9.5" y="9.5" width="4" height="3.5" rx="1" /><path d="M4.5 3.75h2c1.5 0 2.5.75 2.5 2.25v3" /><path d="M4.5 3.75h1.5c1.5 0 2.5-1 3.5-1" /></svg>);
}

/* ─── Chevron icons ────────────────────────────────────────────── */

function ChevronLeft(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3L5 7l4 4" /></svg>);
}
function ChevronRight(p: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 3l4 4-4 4" /></svg>);
}

/* ─── Component page data ─────────────────────────────────────── */

const PAGES = [
  { name: "Pricing", href: "/pricing", pastel: "var(--pastel-green)", icon: TagIco },
  { name: "Buttons", href: "/buttons", pastel: "var(--pastel-pink)", icon: BtnIco },
  { name: "Cards", href: "/cards", pastel: "var(--pastel-purple)", icon: CrdIco },
  { name: "Navbar", href: "/navbar", pastel: "var(--pastel-orange)", icon: NavIco },
  { name: "Calendar", href: "/calendar", pastel: "var(--pastel-yellow)", icon: CalIco },
  { name: "Table", href: "/table", pastel: "var(--pastel-green)", icon: TblIco },
  { name: "Charts", href: "/charts", pastel: "var(--pastel-blue)", icon: ChtIco },
  { name: "Devices", href: "/devices", pastel: "var(--pastel-pink)", icon: DevIco },
  { name: "Nodes", href: "/nodes", pastel: "var(--pastel-blue)", icon: NodIco },
  { name: "Flow", href: "/flow", pastel: "var(--pastel-green)", icon: FloIco },
];

/* ─── Brand Logo ──────────────────────────────────────────────── */

function BrandLogo() {
  return (
    <div className="relative w-7 h-7" style={{ perspective: "200px" }}>
      <div className="absolute -inset-2 rounded-full bg-fg/[0.06] blur-lg" />
      <svg
        viewBox="0 0 18 18"
        className="relative w-full h-full text-fg/70"
        style={{ animation: "logo-float 8s ease-in-out infinite" }}
        fill="none"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 2L15 9L9 16L3 9Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" />
        <path d="M9 2L3 9H9L15 9Z" fill="currentColor" fillOpacity="0.04" stroke="none" />
        <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeOpacity="0.25" />
        <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeOpacity="0.12" />
      </svg>
    </div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */

/* ─── Carousel slot config ─────────────────────────────────── */

interface SlotStyle {
  x: number;       // translateX in px
  z: number;       // translateZ in px (depth)
  rotateY: number; // degrees
  scale: number;
  opacity: number;
  blur: number;    // px
}

const SLOTS: SlotStyle[] = [
  { x: -220, z: -80, rotateY: 35, scale: 0.72, opacity: 0.15, blur: 2 },
  { x: -108, z: -30, rotateY: 18, scale: 0.88, opacity: 0.45, blur: 0.5 },
  { x: 0,    z: 10,  rotateY: 0,  scale: 1.05, opacity: 1,    blur: 0 },
  { x: 108,  z: -30, rotateY: -18, scale: 0.88, opacity: 0.45, blur: 0.5 },
  { x: 220,  z: -80, rotateY: -35, scale: 0.72, opacity: 0.15, blur: 2 },
];

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SMOOTH = "cubic-bezier(0.4, 0, 0.2, 1)";

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const N = PAGES.length;

  const routeIndex = useMemo(() => {
    return PAGES.findIndex(
      (p) => pathname === p.href || pathname.startsWith(p.href + "/"),
    );
  }, [pathname]);

  const [center, setCenter] = useState(Math.max(0, routeIndex));
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (routeIndex >= 0) setCenter(routeIndex);
  }, [routeIndex]);

  const animateTo = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCenter(idx);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsAnimating(false), 420);
  }, [isAnimating]);

  const prev = useCallback(() => {
    animateTo((center - 1 + N) % N);
  }, [center, N, animateTo]);

  const next = useCallback(() => {
    animateTo((center + 1) % N);
  }, [center, N, animateTo]);

  /* 5-item window: -2, -1, center, +1, +2 */
  const visible = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((offset) => {
      const idx = (center + offset + N) % N;
      return { idx, slot: offset + 2 }; // slot 0-4
    });
  }, [center, N]);

  return (
    <nav className={cn("glass rounded-2xl select-none px-5 py-3 relative", className)}>
      <div className="flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo />
          <span className="text-base font-semibold tracking-tight text-fg">sandbox</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">Get started</Button>
        </div>
      </div>

      {/* ── 3D Carousel ── */}
      <div className="hidden md:flex items-center absolute inset-0 z-20 justify-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Left chevron */}
          <button
            onClick={prev}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-fg/25 hover:text-fg/60 hover:bg-fg/[0.06] active:scale-90 transition-all duration-200 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* 3D stage */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 440, height: 36, perspective: "600px" }}
          >
            {visible.map(({ idx, slot }) => {
              const p = PAGES[idx];
              const Icon = p.icon;
              const isRoute = routeIndex >= 0 && idx === routeIndex;
              const isCenter = slot === 2;
              const s = SLOTS[slot];

              return (
                <Link
                  key={`${idx}-${p.name}`}
                  href={p.href}
                  onClick={() => {
                    animateTo(idx);
                  }}
                  className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                  style={{
                    transform: `translateX(${s.x}px) translateZ(${s.z}px) rotateY(${s.rotateY}deg) scale(${s.scale})`,
                    opacity: s.opacity,
                    filter: s.blur > 0 ? `blur(${s.blur}px)` : "none",
                    zIndex: isCenter ? 10 : 5 - Math.abs(slot - 2),
                    transition: `transform 400ms ${SPRING}, opacity 350ms ${SMOOTH}, filter 350ms ${SMOOTH}, background 250ms ${SMOOTH}, border-color 250ms ${SMOOTH}, box-shadow 350ms ${SMOOTH}, color 250ms ${SMOOTH}`,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                    cursor: "pointer",
                    ...(isRoute && isCenter ? {
                      color: p.pastel,
                      background: `color-mix(in srgb, ${p.pastel} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${p.pastel} 20%, transparent)`,
                      boxShadow: `0 0 16px color-mix(in srgb, ${p.pastel} 10%, transparent), 0 2px 8px rgba(0,0,0,0.1)`,
                    } : isCenter ? {
                      color: "var(--fg)",
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    } : {
                      color: `color-mix(in srgb, var(--fg) 35%, transparent)`,
                      background: "transparent",
                      border: "1px solid transparent",
                    }),
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={isRoute && isCenter ? { filter: `drop-shadow(0 0 4px ${p.pastel})` } : undefined} />
                  <span>{p.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right chevron */}
          <button
            onClick={next}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-fg/25 hover:text-fg/60 hover:bg-fg/[0.06] active:scale-90 transition-all duration-200 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
