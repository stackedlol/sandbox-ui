import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CrypticText } from "@/components/ui/cryptic-text";

/* ─── Small icons ─────────────────────────────────────────────── */

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ─── Section heading ─────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 pt-4">
      <h2 className="text-xs font-medium uppercase tracking-widest text-fg/20 shrink-0">
        {children}
      </h2>
      <div className="flex-1 h-px bg-fg/[0.06]" />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function GlassTheme() {
  return (
    <>
      {/* ── Background layer (fixed, out of flow) ───── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            background: "var(--orb-1)",
            filter: "blur(120px)",
            top: "-10%",
            left: "5%",
            animation: "float-1 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 450,
            height: 450,
            background: "var(--orb-2)",
            filter: "blur(120px)",
            bottom: "-5%",
            right: "2%",
            animation: "float-2 28s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            background: "var(--orb-3)",
            filter: "blur(100px)",
            top: "45%",
            left: "35%",
            animation: "float-3 20s ease-in-out infinite",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(var(--dot-color) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-4 pb-10 sm:pt-6">
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          {/* ── Hero ───────────────────────────────── */}
          <section className="relative flex flex-col items-center text-center py-20 sm:py-28 lg:py-36 px-4 overflow-hidden">

            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              opacity: 0.15,
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 0%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 0%, transparent 80%)",
            }} />

            {/* Grid accent lines — pastel tinted cross */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `linear-gradient(90deg, transparent calc(50% - 0.5px), var(--pastel-blue) calc(50% - 0.5px), var(--pastel-blue) calc(50% + 0.5px), transparent calc(50% + 0.5px)), linear-gradient(0deg, transparent calc(50% - 0.5px), var(--pastel-purple) calc(50% - 0.5px), var(--pastel-purple) calc(50% + 0.5px), transparent calc(50% + 0.5px))`,
              opacity: 0.2,
              maskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, black 0%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, black 0%, transparent 80%)",
            }} />

            {/* Subtle center glow */}
            <div className="absolute pointer-events-none" style={{
              width: "500px",
              height: "500px",
              left: "50%",
              top: "45%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, color-mix(in srgb, var(--pastel-blue) 20%, transparent) 0%, transparent 65%)",
            }} />

            <h1 className="relative font-display text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.95] max-w-5xl text-fg">
              <CrypticText
                text="welcome to"
                delay={300}
                duration={1600}
              />
              <br />
              <CrypticText
                text="the sandbox"
                delay={1200}
                duration={2000}
              />
            </h1>

            <p className="relative mt-6 text-lg text-fg/30 max-w-lg leading-relaxed animate-fade-up" style={{ animationDelay: "200ms" }}>
              a glassmorphism design system. explore every component below.
            </p>

            {/* ── CTA Buttons ─────────────────────── */}
            <div
              className="relative mt-12 flex flex-col sm:flex-row items-center gap-5 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <a href="#how-it-works" className="cta-border group relative isolate inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl glass-strong border-[var(--glass-border-strong)] text-fg font-medium text-base cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.06)] hover:border-fg/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30 no-underline">
                <span className="relative z-10">get started free</span>
                <ArrowIcon className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <Link href="/docs">
                <Button variant="ghost" size="lg">
                  documentation
                </Button>
              </Link>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* ── HOW IT WORKS — VISUAL WALKTHROUGH ──── */}
          {/* ════════════════════════════════════════ */}
          <SectionHeading>how it works</SectionHeading>

          {/* ── Timeline infographic ────────────────── */}
          <section id="how-it-works" className="relative mt-2 scroll-mt-24">
            {/* Vertical connector line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--pastel-blue) 15%, transparent) 10%, color-mix(in srgb, var(--pastel-purple) 15%, transparent) 50%, color-mix(in srgb, var(--pastel-green) 15%, transparent) 90%, transparent)" }} />

            <div className="flex flex-col gap-16 md:gap-20 py-8">

              {/* ── Step 1: Install ─────────────────────── */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center animate-fade-up" style={{ animationDelay: "100ms" }}>
                {/* Number node */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center text-sm font-bold font-mono" style={{ background: "var(--body-bg)", border: "2px solid color-mix(in srgb, var(--pastel-blue) 30%, transparent)", color: "var(--pastel-blue)", boxShadow: "0 0 20px color-mix(in srgb, var(--pastel-blue) 10%, transparent)" }}>
                  1
                </div>
                {/* Left: description */}
                <div className="md:text-right md:pr-12">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center md:hidden" style={{ background: "color-mix(in srgb, var(--pastel-blue) 12%, transparent)" }}>
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--pastel-blue)" }}>1</span>
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--pastel-blue)", opacity: 0.7 }}>scaffold</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-fg/80 mb-2">one command to start</h3>
                  <p className="text-sm text-fg/30 leading-relaxed max-w-sm md:ml-auto">
                    run the CLI to scaffold a full Next.js project with Tailwind v4, all glassmorphic tokens, and the component library pre-installed.
                  </p>
                </div>
                {/* Right: visual */}
                <div className="md:pl-12">
                  <div className="glass rounded-2xl overflow-hidden">
                    {/* Terminal chrome */}
                    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-fg/[0.05]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--pastel-pink)", opacity: 0.4 }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--pastel-yellow)", opacity: 0.4 }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--pastel-green)", opacity: 0.4 }} />
                      <span className="text-[10px] text-fg/20 ml-2 font-mono">terminal</span>
                    </div>
                    <div className="p-4 font-mono text-[13px] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-fg/20">$</span>
                        <span className="text-fg/50">npx create-sandbox-ui@latest my-app</span>
                      </div>
                      <div className="text-fg/15 text-[11px] space-y-0.5 pl-4">
                        <p>✓ created project structure</p>
                        <p>✓ installed dependencies</p>
                        <p>✓ configured tailwind v4</p>
                        <p>✓ added glass tokens</p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-fg/20">$</span>
                        <span className="text-fg/50">cd my-app && npm run dev</span>
                      </div>
                      <p className="text-[11px] pl-4" style={{ color: "var(--pastel-green)", opacity: 0.6 }}>▸ ready on localhost:3000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Step 2: Pick Components ─────────────── */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center text-sm font-bold font-mono" style={{ background: "var(--body-bg)", border: "2px solid color-mix(in srgb, var(--pastel-purple) 30%, transparent)", color: "var(--pastel-purple)", boxShadow: "0 0 20px color-mix(in srgb, var(--pastel-purple) 10%, transparent)" }}>
                  2
                </div>
                {/* Left: visual (reversed on desktop) */}
                <div className="md:pr-12 order-2 md:order-1">
                  <div className="glass rounded-2xl p-5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-fg/20 mb-4">available components</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "button", icon: "▣", color: "var(--pastel-pink)" },
                        { name: "card", icon: "▤", color: "var(--pastel-purple)" },
                        { name: "navbar", icon: "▥", color: "var(--pastel-orange)" },
                        { name: "pricing", icon: "◈", color: "var(--pastel-green)" },
                        { name: "calendar", icon: "◉", color: "var(--pastel-yellow)" },
                        { name: "table", icon: "▦", color: "var(--pastel-blue)" },
                        { name: "charts", icon: "◐", color: "var(--pastel-blue)" },
                      ].map((c) => (
                        <div key={c.name} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-fg/[0.03] transition-colors">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px]" style={{ background: `color-mix(in srgb, ${c.color} 10%, transparent)`, color: c.color }}>{c.icon}</span>
                          <div>
                            <p className="text-xs text-fg/50 font-medium">{c.name}</p>
                            <p className="text-[9px] text-fg/20 font-mono">npx add {c.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right: description */}
                <div className="md:pl-12 order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center md:hidden" style={{ background: "color-mix(in srgb, var(--pastel-purple) 12%, transparent)" }}>
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--pastel-purple)" }}>2</span>
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--pastel-purple)", opacity: 0.7 }}>compose</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-fg/80 mb-2">pick what you need</h3>
                  <p className="text-sm text-fg/30 leading-relaxed max-w-sm">
                    every component is self-contained with zero cross-dependencies. add them individually or install the full suite — each one is copy-paste ready.
                  </p>
                </div>
              </div>

              {/* ── Step 3: Customize ──────────────────── */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center text-sm font-bold font-mono" style={{ background: "var(--body-bg)", border: "2px solid color-mix(in srgb, var(--pastel-green) 30%, transparent)", color: "var(--pastel-green)", boxShadow: "0 0 20px color-mix(in srgb, var(--pastel-green) 10%, transparent)" }}>
                  3
                </div>
                {/* Left: description */}
                <div className="md:text-right md:pr-12">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center md:hidden" style={{ background: "color-mix(in srgb, var(--pastel-green) 12%, transparent)" }}>
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--pastel-green)" }}>3</span>
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--pastel-green)", opacity: 0.7 }}>customize</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-fg/80 mb-2">make it yours</h3>
                  <p className="text-sm text-fg/30 leading-relaxed max-w-sm md:ml-auto">
                    every visual property is a CSS variable. swap colors, adjust blur, change border radius — the entire design system adapts instantly. dark and light mode built in.
                  </p>
                </div>
                {/* Right: visual */}
                <div className="md:pl-12">
                  <div className="glass rounded-2xl p-5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-fg/20 mb-4">design tokens</p>
                    <div className="space-y-2.5">
                      {[
                        { token: "--glass-blur", value: "18px", color: "var(--pastel-blue)" },
                        { token: "--glass-bg", value: "rgba(255,255,255,0.03)", color: "var(--pastel-purple)" },
                        { token: "--pastel-blue", value: "#a0c4f2", color: "var(--pastel-blue)" },
                        { token: "--glass-border", value: "rgba(255,255,255,0.08)", color: "var(--pastel-green)" },
                      ].map((t) => (
                        <div key={t.token} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-[3px]" style={{ background: t.color, opacity: 0.4 }} />
                            <code className="text-[11px] font-mono text-fg/45">{t.token}</code>
                          </div>
                          <code className="text-[10px] font-mono text-fg/25">{t.value}</code>
                        </div>
                      ))}
                    </div>
                    {/* Visual bar showing the token in action */}
                    <div className="mt-4 h-10 rounded-lg overflow-hidden relative" style={{ background: "var(--glass-bg)", backdropFilter: "blur(var(--glass-blur))", border: "1px solid var(--glass-border)" }}>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-fg/25 font-mono">live preview of your tokens</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Step 4: Ship ───────────────────────── */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center animate-fade-up" style={{ animationDelay: "400ms" }}>
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center text-sm font-bold font-mono" style={{ background: "var(--body-bg)", border: "2px solid color-mix(in srgb, var(--pastel-orange) 30%, transparent)", color: "var(--pastel-orange)", boxShadow: "0 0 20px color-mix(in srgb, var(--pastel-orange) 10%, transparent)" }}>
                  4
                </div>
                {/* Left: visual */}
                <div className="md:pr-12 order-2 md:order-1">
                  <div className="glass rounded-2xl p-5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-fg/20 mb-4">what you get</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { stat: "7", label: "components", color: "var(--pastel-blue)" },
                        { stat: "12", label: "chart types", color: "var(--pastel-green)" },
                        { stat: "0", label: "dependencies", color: "var(--pastel-pink)" },
                        { stat: "2", label: "themes", color: "var(--pastel-purple)" },
                        { stat: "∞", label: "customization", color: "var(--pastel-orange)" },
                        { stat: "<1s", label: "setup time", color: "var(--pastel-yellow)" },
                      ].map((s) => (
                        <div key={s.label} className="text-center py-3">
                          <p className="text-xl font-bold font-mono mb-1" style={{ color: s.color, opacity: 0.6 }}>{s.stat}</p>
                          <p className="text-[9px] text-fg/25 uppercase tracking-wider">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-fg/[0.05]">
                      {["next.js 15+", "tailwind v4", "typescript", "pure SVG", "CSS variables", "zero deps"].map((t) => (
                        <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-fg/[0.03] text-fg/25">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right: description */}
                <div className="md:pl-12 order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center md:hidden" style={{ background: "color-mix(in srgb, var(--pastel-orange) 12%, transparent)" }}>
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--pastel-orange)" }}>4</span>
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--pastel-orange)", opacity: 0.7 }}>ship</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-fg/80 mb-2">deploy with confidence</h3>
                  <p className="text-sm text-fg/30 leading-relaxed max-w-sm">
                    zero external dependencies means no version conflicts, no bundle bloat, no supply chain risk. every component is your code — fork it, modify it, own it.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ── Final CTA ───────────────────────────── */}
          <section className="flex flex-col items-center text-center py-16 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <p className="text-sm text-fg/25 mb-6 max-w-md">ready to build something beautiful?</p>
            <a href="#how-it-works" className="cta-border group relative isolate inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl glass-strong border-[var(--glass-border-strong)] text-fg font-medium text-base cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.06)] hover:border-fg/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30 no-underline">
              <span className="relative z-10">get started free</span>
              <ArrowIcon className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <div className="flex items-center gap-4 mt-6 text-[10px] text-fg/15">
              <span>no credit card</span>
              <span className="w-1 h-1 rounded-full bg-fg/10" />
              <span>open source</span>
              <span className="w-1 h-1 rounded-full bg-fg/10" />
              <span>MIT license</span>
            </div>
          </section>

          {/* ── Footer ─────────────────────────────── */}
          <footer className="text-center text-sm text-fg/15 pb-8 pt-4">
            &copy; {new Date().getFullYear()} Sandbox. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
}
