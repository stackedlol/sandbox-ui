"use client";

import { Navbar } from "@/components/ui/navbar";

/* ═══════════════════════════════════════════════════════════════════
   Navbar Page
   ═══════════════════════════════════════════════════════════════════ */

export default function NavbarPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">navbar</h1>
            <p className="mt-2 text-sm text-fg/30">glassmorphic navigation bar with carousel links, route syncing, and a 3D logo.</p>
            <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">npx sandbox-ui add navbar</code>
          </div>

          {/* Preview */}
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">preview</h2>
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 60% 80% at 50% 100%, color-mix(in srgb, var(--pastel-blue) 8%, transparent) 0%, transparent 70%)",
                }}
              />
              <div className="relative px-4 sm:px-6 pt-8 pb-10">
                <Navbar />
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "carousel links", desc: "3-item sliding window with chevron navigation through all pages", color: "var(--pastel-blue)" },
                { label: "route syncing", desc: "active item automatically tracks the current page via pathname", color: "var(--pastel-green)" },
                { label: "glass surface", desc: "frosted backdrop-filter blur with layered borders and shadows", color: "var(--pastel-purple)" },
                { label: "3D logo", desc: "animated floating diamond with perspective transform", color: "var(--pastel-orange)" },
                { label: "pastel accents", desc: "each page link has a unique pastel tint for active state", color: "var(--pastel-pink)" },
                { label: "responsive", desc: "carousel hidden on mobile, full layout on desktop", color: "var(--pastel-yellow)" },
              ].map((feat) => (
                <div key={feat.label} className="glass rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: feat.color, opacity: 0.6 }} />
                  <div>
                    <p className="text-sm text-fg/60 font-medium">{feat.label}</p>
                    <p className="text-xs text-fg/25 mt-0.5">{feat.desc}</p>
                  </div>
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
