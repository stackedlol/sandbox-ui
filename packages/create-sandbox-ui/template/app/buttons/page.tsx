import { Button } from "@/components/ui/button";

export default function ButtonsPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">button</h1>
          <p className="mt-2 text-sm text-fg/30">three variants, three sizes. glass-backed with blur, hover glow, and active press.</p>
          <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">npx sandbox-ui add button</code>

          {/* Variants */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">variants</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="md">primary</Button>
              <Button variant="secondary" size="md">secondary</Button>
              <Button variant="ghost" size="md">ghost</Button>
            </div>
          </section>

          {/* Sizes */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">sizes</h2>
            <div className="space-y-4">
              {(["sm", "md", "lg"] as const).map((size) => (
                <div key={size} className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size={size}>{size}</Button>
                  <Button variant="secondary" size={size}>{size}</Button>
                  <Button variant="ghost" size={size}>{size}</Button>
                </div>
              ))}
            </div>
          </section>

          {/* With icon */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">with icon</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="md">
                <svg viewBox="0 0 16 16" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
                create
              </Button>
              <Button variant="secondary" size="md">
                <svg viewBox="0 0 16 16" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 8h12M10 4l4 4-4 4" /></svg>
                continue
              </Button>
            </div>
          </section>

          {/* Animated CTA */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">animated cta</h2>
            <button className="cta-border group relative isolate inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl glass-strong border-[var(--glass-border-strong)] text-fg font-medium text-base cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.06)] hover:border-fg/25 active:scale-[0.97]">
              <span className="relative z-10">get started free</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </section>

          {/* Full width */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">full width</h2>
            <div className="flex flex-col gap-3 max-w-sm">
              <Button variant="primary" size="lg" className="w-full">sign up</Button>
              <Button variant="secondary" size="md" className="w-full">log in</Button>
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
