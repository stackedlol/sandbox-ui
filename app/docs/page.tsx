"use client";

import { useState } from "react";

/* ─── Icons ─────────────────────────────────────────────────────── */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V3.5a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3.5 3.5L13 4" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
      <path d="M4.5 6l2.5 2-2.5 2" />
      <path d="M8.5 10h3" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5L14 4.5v7L8 14.5L2 11.5v-7L8 1.5z" />
      <path d="M8 8L14 4.5" />
      <path d="M8 8L2 4.5" />
      <path d="M8 8v6.5" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3H6l1.5 1.5h5A1.5 1.5 0 0 1 14 6v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12V4.5z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.5 3.5l2 2M10.5 10.5l2 2M12.5 3.5l-2 2M5.5 10.5l-2 2" />
    </svg>
  );
}

/* ─── Copy Button ───────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-fg/25 hover:text-fg/60 hover:bg-fg/[0.06] transition-all duration-200 cursor-pointer shrink-0"
      aria-label="Copy to clipboard"
    >
      {copied ? <span style={{ color: "var(--pastel-green)" }}><CheckIcon className="w-3.5 h-3.5" /></span> : <CopyIcon className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ─── Code Block ────────────────────────────────────────────────── */

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      {label && (
        <div className="px-4 py-2 border-b border-fg/[0.05] flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-fg/20" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-fg/25">{label}</span>
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-[13px] font-mono text-fg/50 select-all">{code}</code>
        <CopyButton text={code} />
      </div>
    </div>
  );
}

/* ─── Components list ───────────────────────────────────────────── */

const COMPONENTS = [
  { name: "button", desc: "three variants, three sizes with glass blur and glow", color: "var(--pastel-pink)" },
  { name: "card", desc: "glass surface with border, shadow, and tilt-on-hover", color: "var(--pastel-purple)" },
  { name: "navbar", desc: "carousel links, 3D logo, route syncing", color: "var(--pastel-orange)" },
  { name: "pricing", desc: "three-tier pricing cards with pastel accents and icons", color: "var(--pastel-green)" },
  { name: "calendar", desc: "date picker, event list, range picker, time slots", color: "var(--pastel-yellow)" },
  { name: "table", desc: "data table, key-value list, stats, activity feed", color: "var(--pastel-green)" },
  { name: "charts", desc: "12 pure SVG charts — area, bar, donut, sankey, and more", color: "var(--pastel-blue)" },
];

/* ═══════════════════════════════════════════════════════════════════
   Docs Page
   ═══════════════════════════════════════════════════════════════════ */

export default function DocsPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-3xl">

          {/* ── Header ──────────────────────────────── */}
          <div className="mb-12">
            <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">getting started</h1>
            <p className="mt-2 text-sm text-fg/30 max-w-lg">
              set up a new project with Sandbox UI in under a minute. all components are copy-paste ready with zero external dependencies.
            </p>
          </div>

          {/* ── Quick Start ─────────────────────────── */}
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4 flex items-center gap-2">
              <SparkleIcon className="w-3.5 h-3.5" />
              quick start
            </h2>
            <div className="space-y-3">
              <CodeBlock label="create project" code="npx create-sandbox-ui@latest my-app" />
              <CodeBlock label="navigate" code="cd my-app" />
              <CodeBlock label="install dependencies" code="npm install" />
              <CodeBlock label="start dev server" code="npm run dev" />
            </div>
            <p className="text-xs text-fg/25 mt-3">
              this scaffolds a Next.js app with Tailwind v4, all glassmorphic tokens, and the full component library pre-installed.
            </p>
          </section>

          {/* ── Add to existing project ──────────────── */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4 flex items-center gap-2">
              <PackageIcon className="w-3.5 h-3.5" />
              add to existing project
            </h2>
            <p className="text-sm text-fg/35 mb-4">
              already have a Next.js + Tailwind project? add individual components:
            </p>
            <div className="space-y-3">
              <CodeBlock label="install cli" code="npm install -g sandbox-ui" />
              <CodeBlock label="init config" code="npx sandbox-ui init" />
            </div>
            <p className="text-xs text-fg/25 mt-3">
              this adds the required CSS tokens, theme provider, and utility functions to your project.
            </p>
          </section>

          {/* ── Individual components ─────────────────── */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4 flex items-center gap-2">
              <FolderIcon className="w-3.5 h-3.5" />
              components
            </h2>
            <p className="text-sm text-fg/35 mb-4">
              add components individually — each is self-contained with no cross-dependencies.
            </p>
            <div className="space-y-2">
              {COMPONENTS.map((comp) => (
                <div key={comp.name} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: comp.color, opacity: 0.6 }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg/60">{comp.name}</p>
                      <p className="text-xs text-fg/25 mt-0.5 truncate">{comp.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <code className="text-[11px] font-mono text-fg/30 hidden sm:block">npx sandbox-ui add {comp.name}</code>
                    <CopyButton text={`npx sandbox-ui add ${comp.name}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Project structure ─────────────────────── */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4 flex items-center gap-2">
              <FolderIcon className="w-3.5 h-3.5" />
              project structure
            </h2>
            <div className="glass rounded-xl p-5 font-mono text-[12px] text-fg/40 leading-relaxed">
              <pre>{`my-app/
├── app/
│   ├── globals.css          # theme tokens & animations
│   ├── layout.tsx           # root layout with providers
│   └── page.tsx             # landing page
├── components/
│   ├── ui/
│   │   ├── button.tsx       # glass button component
│   │   ├── card.tsx         # glass card surface
│   │   ├── navbar.tsx       # carousel navbar
│   │   └── ...              # other components
│   ├── sidebar.tsx          # collapsible sidebar
│   ├── theme-provider.tsx   # dark / light mode
│   └── theme-shell.tsx      # layout wrapper
├── lib/
│   └── cn.ts                # classname utility
├── tailwind.config.ts
└── package.json`}</pre>
            </div>
          </section>

          {/* ── Requirements ──────────────────────────── */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Next.js", version: "15+", color: "var(--pastel-blue)" },
                { label: "Tailwind CSS", version: "v4", color: "var(--pastel-green)" },
                { label: "Node.js", version: "18+", color: "var(--pastel-purple)" },
              ].map((req) => (
                <div key={req.label} className="glass rounded-xl px-4 py-3 text-center">
                  <p className="text-sm font-medium text-fg/60">{req.label}</p>
                  <p className="text-xs font-mono mt-1" style={{ color: req.color, opacity: 0.7 }}>{req.version}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="text-sm text-fg/15 pt-16 pb-8">
            &copy; {new Date().getFullYear()} Sandbox
          </footer>
        </div>
      </div>
    </>
  );
}
