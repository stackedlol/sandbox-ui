"use client";

import { useState } from "react";

/* ─── Types ──────────────────────────────────────────────────── */

interface Node {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  color: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
}

interface Edge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  animated?: boolean;
}

/* ─── Drawing helpers ────────────────────────────────────────── */

function bezierPath(x0: number, y0: number, x1: number, y1: number) {
  const dx = Math.abs(x1 - x0) * 0.5;
  const dy = Math.abs(y1 - y0) * 0.2;
  return `M ${x0} ${y0} C ${x0 + dx} ${y0 + dy}, ${x1 - dx} ${y1 - dy}, ${x1} ${y1}`;
}

/* ─── NodeGraph ──────────────────────────────────────────────── */

function NodeGraph({
  nodes,
  edges,
  width,
  height,
  title,
  subtitle,
}: {
  nodes: Node[];
  edges: Edge[];
  width: number;
  height: number;
  title: string;
  subtitle: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const isHL = (id: string) => {
    if (!hovered) return false;
    if (id === hovered) return true;
    return edges.some((e) => (e.from === hovered && e.to === id) || (e.to === hovered && e.from === id));
  };
  const isEdgeHL = (e: Edge) => hovered ? e.from === hovered || e.to === hovered : false;

  const R = { sm: 28, md: 36, lg: 46 };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="mb-5 shrink-0">
        <p className="text-base font-semibold text-fg/65">{title}</p>
        <p className="text-xs text-fg/30 mt-1">{subtitle}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" fill="none" onMouseLeave={() => setHovered(null)}>
          <defs>
            {edges.map((e, i) => {
              const from = nodeMap.get(e.from);
              const to = nodeMap.get(e.to);
              if (!from || !to) return null;
              return (
                <linearGradient key={i} id={`eg-${title.replace(/\s/g, "")}-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={from.color} />
                  <stop offset="100%" stopColor={to.color} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const from = nodeMap.get(e.from);
            const to = nodeMap.get(e.to);
            if (!from || !to) return null;
            const hl = isEdgeHL(e);
            const dim = hovered && !hl;
            const path = bezierPath(from.x, from.y, to.x, to.y);
            const gid = `eg-${title.replace(/\s/g, "")}-${i}`;

            return (
              <g key={`e-${i}`}>
                {/* Glow */}
                <path d={path} stroke={`url(#${gid})`} strokeWidth={hl ? 8 : 4} strokeOpacity={dim ? 0 : hl ? 0.1 : 0.03} fill="none" strokeLinecap="round" style={{ filter: "blur(4px)", transition: "all 0.3s" }} />
                {/* Line */}
                <path d={path} stroke={`url(#${gid})`} strokeWidth={hl ? 2.5 : 1.5} strokeOpacity={dim ? 0.04 : hl ? 0.55 : 0.15} strokeDasharray={e.dashed ? "8 5" : undefined} strokeLinecap="round" style={{ transition: "all 0.3s" }} />
                {/* Particle */}
                {e.animated !== false && (
                  <circle r={hl ? 3.5 : 2} fill={from.color} opacity={dim ? 0 : hl ? 0.7 : 0.2} style={{ transition: "opacity 0.3s" }}>
                    <animateMotion dur={`${2.5 + (i % 3) * 0.6}s`} repeatCount="indefinite" path={path} begin={`${(i * 0.4) % 2}s`} />
                  </circle>
                )}
                {/* Label */}
                {e.label && (
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10} textAnchor="middle" fill="currentColor" fillOpacity={dim ? 0.03 : hl ? 0.4 : 0.12} fontSize={10} fontFamily="var(--font-mono)" style={{ transition: "fill-opacity 0.3s" }}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const r = R[n.size || "md"];
            const hl = isHL(n.id);
            const isHov = hovered === n.id;
            const dim = hovered && !hl;

            return (
              <g key={n.id} onMouseEnter={() => setHovered(n.id)} className="cursor-pointer">
                {/* Outer glow */}
                <circle cx={n.x} cy={n.y} r={r + 14} fill={n.color} opacity={isHov ? 0.14 : hl ? 0.06 : 0.015} style={{ filter: "blur(12px)", transition: "opacity 0.3s" }} />
                {/* Ring */}
                <circle cx={n.x} cy={n.y} r={r} fill={n.color} fillOpacity={dim ? 0.03 : isHov ? 0.2 : hl ? 0.1 : 0.05} stroke={n.color} strokeWidth={isHov ? 2 : 1.2} strokeOpacity={dim ? 0.06 : isHov ? 0.55 : hl ? 0.3 : 0.14} style={{ transition: "all 0.3s" }} />
                {/* Icon */}
                {n.icon && (
                  <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.5} fill={n.color} fillOpacity={dim ? 0.1 : isHov ? 0.85 : 0.5} style={{ transition: "fill-opacity 0.3s" }}>
                    {n.icon}
                  </text>
                )}
                {/* Label */}
                <text x={n.x} y={n.y + r + 16} textAnchor="middle" fill="currentColor" fillOpacity={dim ? 0.06 : isHov ? 0.7 : 0.35} fontSize={11} fontFamily="var(--font-mono)" fontWeight={isHov ? 600 : 400} style={{ transition: "fill-opacity 0.3s" }}>
                  {n.label}
                </text>
                {/* Sublabel */}
                {n.sub && (
                  <text x={n.x} y={n.y + r + 30} textAnchor="middle" fill={n.color} fillOpacity={dim ? 0 : isHov ? 0.55 : 0.2} fontSize={9} fontFamily="var(--font-mono)" style={{ transition: "fill-opacity 0.3s" }}>
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── GRAPH DATA (4 focused graphs, spread out for readability)  */
/* ═══════════════════════════════════════════════════════════════ */

/* ── 1. Component Tree ─────────────────────────────────────── */

const COMP_NODES: Node[] = [
  { id: "app", label: "App", sub: "root layout", x: 420, y: 50, color: "var(--pastel-blue)", icon: "◆", size: "lg" },
  { id: "layout", label: "Layout", sub: "shell", x: 200, y: 170, color: "var(--pastel-purple)", icon: "▤", size: "lg" },
  { id: "router", label: "Router", sub: "pages", x: 640, y: 170, color: "var(--pastel-green)", icon: "⬡", size: "lg" },
  { id: "navbar", label: "Navbar", x: 80, y: 310, color: "var(--pastel-orange)", icon: "▥" },
  { id: "sidebar", label: "Sidebar", x: 310, y: 310, color: "var(--pastel-pink)", icon: "▧" },
  { id: "home", label: "Home", sub: "/", x: 500, y: 310, color: "var(--pastel-blue)", icon: "⌂" },
  { id: "dash", label: "Dashboard", sub: "/dash", x: 680, y: 310, color: "var(--pastel-green)", icon: "◐" },
  { id: "settings", label: "Settings", sub: "/set", x: 830, y: 310, color: "var(--pastel-yellow)", icon: "⚙" },
];

const COMP_EDGES: Edge[] = [
  { from: "app", to: "layout", label: "wraps" },
  { from: "app", to: "router", label: "routes" },
  { from: "layout", to: "navbar" },
  { from: "layout", to: "sidebar" },
  { from: "router", to: "home" },
  { from: "router", to: "dash" },
  { from: "router", to: "settings" },
];

/* ── 2. State Management ──────────────────────────────────── */

const STATE_NODES: Node[] = [
  { id: "user", label: "User Action", sub: "click / input", x: 100, y: 200, color: "var(--pastel-pink)", icon: "☞", size: "lg" },
  { id: "dispatch", label: "Dispatch", sub: "action creator", x: 320, y: 80, color: "var(--pastel-orange)", icon: "▸", size: "lg" },
  { id: "store", label: "Store", sub: "global state", x: 560, y: 80, color: "var(--pastel-blue)", icon: "◈", size: "lg" },
  { id: "reducer", label: "Reducer", sub: "pure function", x: 560, y: 280, color: "var(--pastel-purple)", icon: "ƒ", size: "lg" },
  { id: "middleware", label: "Middleware", sub: "async / logging", x: 320, y: 280, color: "var(--pastel-yellow)", icon: "⇄" },
  { id: "selector", label: "Selector", sub: "derived data", x: 780, y: 180, color: "var(--pastel-green)", icon: "⊙", size: "lg" },
];

const STATE_EDGES: Edge[] = [
  { from: "user", to: "dispatch", label: "triggers" },
  { from: "dispatch", to: "store", label: "action" },
  { from: "dispatch", to: "middleware", dashed: true },
  { from: "middleware", to: "reducer", label: "side effects" },
  { from: "store", to: "reducer", label: "next state" },
  { from: "store", to: "selector", label: "subscribe" },
  { from: "selector", to: "user", dashed: true, label: "re-render" },
];

/* ── 3. Build Pipeline ───────────────────────────────────── */

const BUILD_NODES: Node[] = [
  { id: "src", label: "Source", sub: ".tsx / .ts", x: 80, y: 180, color: "var(--pastel-blue)", icon: "{ }", size: "lg" },
  { id: "lint", label: "Lint", sub: "eslint", x: 280, y: 90, color: "var(--pastel-yellow)", icon: "✓" },
  { id: "typecheck", label: "TypeCheck", sub: "tsc", x: 280, y: 270, color: "var(--pastel-purple)", icon: "T" },
  { id: "compile", label: "Compile", sub: "SWC / Babel", x: 480, y: 180, color: "var(--pastel-orange)", icon: "⚡", size: "lg" },
  { id: "bundle", label: "Bundle", sub: "turbopack", x: 680, y: 100, color: "var(--pastel-green)", icon: "◫" },
  { id: "optimize", label: "Optimize", sub: "treeshake", x: 680, y: 260, color: "var(--pastel-pink)", icon: "⚙" },
  { id: "output", label: "Output", sub: ".next / dist", x: 880, y: 180, color: "var(--pastel-blue)", icon: "▸", size: "lg" },
];

const BUILD_EDGES: Edge[] = [
  { from: "src", to: "lint" },
  { from: "src", to: "typecheck" },
  { from: "lint", to: "compile", label: "pass" },
  { from: "typecheck", to: "compile", label: "pass" },
  { from: "compile", to: "bundle" },
  { from: "compile", to: "optimize" },
  { from: "bundle", to: "output", label: "chunks" },
  { from: "optimize", to: "output", label: "minified" },
];

/* ── 4. Data Fetching ────────────────────────────────────── */

const FETCH_NODES: Node[] = [
  { id: "page", label: "Page", sub: "RSC / client", x: 100, y: 180, color: "var(--pastel-blue)", icon: "◻", size: "lg" },
  { id: "cache", label: "Cache", sub: "SWR / LRU", x: 320, y: 70, color: "var(--pastel-yellow)", icon: "⧫", size: "lg" },
  { id: "api", label: "API Route", sub: "/api/*", x: 520, y: 180, color: "var(--pastel-green)", icon: "⬡", size: "lg" },
  { id: "auth", label: "Auth", sub: "JWT / session", x: 320, y: 290, color: "var(--pastel-pink)", icon: "🔒" },
  { id: "db", label: "Database", sub: "postgres", x: 740, y: 100, color: "var(--pastel-purple)", icon: "⊞", size: "lg" },
  { id: "ext", label: "External API", sub: "3rd party", x: 740, y: 260, color: "var(--pastel-orange)", icon: "↗" },
];

const FETCH_EDGES: Edge[] = [
  { from: "page", to: "cache", label: "check" },
  { from: "cache", to: "api", label: "miss → fetch", dashed: true },
  { from: "page", to: "api", label: "request" },
  { from: "page", to: "auth", label: "validate" },
  { from: "auth", to: "api", dashed: true },
  { from: "api", to: "db", label: "query" },
  { from: "api", to: "ext", label: "fetch" },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ── PAGE ────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

export default function NodesPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">nodes</h1>
          <p className="mt-2 text-sm text-fg/30 max-w-lg">
            interactive architecture diagrams — hover any node to trace its connections.
          </p>
          <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">
            npx sandbox-ui add nodes
          </code>

          {/* 1. Component Tree — full width hero */}
          <section className="mt-14" style={{ height: 460 }}>
            <NodeGraph nodes={COMP_NODES} edges={COMP_EDGES} width={900} height={400} title="component tree" subtitle="hierarchical structure from app root to leaf components" />
          </section>

          {/* 2. State Management — full width */}
          <section className="mt-6" style={{ height: 460 }}>
            <NodeGraph nodes={STATE_NODES} edges={STATE_EDGES} width={900} height={380} title="state management" subtitle="unidirectional data flow — action → reducer → store → UI" />
          </section>

          {/* 3. Build Pipeline — full width */}
          <section className="mt-6" style={{ height: 460 }}>
            <NodeGraph nodes={BUILD_NODES} edges={BUILD_EDGES} width={960} height={380} title="build pipeline" subtitle="source → lint & typecheck → compile → bundle & optimize → output" />
          </section>

          {/* 4. Data Fetching — full width */}
          <section className="mt-6" style={{ height: 460 }}>
            <NodeGraph nodes={FETCH_NODES} edges={FETCH_EDGES} width={860} height={380} title="data fetching" subtitle="page → cache → API route → database / external services" />
          </section>

          <footer className="text-sm text-fg/15 pt-16 pb-8">
            &copy; {new Date().getFullYear()} Sandbox
          </footer>
        </div>
      </div>
    </>
  );
}
