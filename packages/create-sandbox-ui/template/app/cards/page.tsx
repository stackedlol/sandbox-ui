import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CardsPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">card</h1>
          <p className="mt-2 text-sm text-fg/30">3D glass cards with interactive tilt, cursor-following specular glow, and hover lift.</p>
          <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">npx sandbox-ui add card</code>

          {/* Default */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">interactive 3d tilt</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card>
                <h3 className="text-lg font-semibold text-fg">default card</h3>
                <p className="mt-2 text-sm text-fg/30 leading-relaxed">
                  hover to see the tilt and specular highlight follow your cursor.
                </p>
              </Card>
              <Card className="glass-strong border-[var(--glass-border-strong)]">
                <h3 className="text-lg font-semibold text-fg">strong surface</h3>
                <p className="mt-2 text-sm text-fg/30 leading-relaxed">
                  uses .glass-strong for elevated appearance.
                </p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-fg">with action</h3>
                <p className="mt-2 text-sm text-fg/30 leading-relaxed">
                  cards can contain any content including buttons.
                </p>
                <Button variant="primary" size="sm" className="mt-4">learn more</Button>
              </Card>
            </div>
          </section>

          {/* Stat cards */}
          <section className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-6">stat cards</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "revenue", value: "$48.2k", change: "+18.3%", positive: true },
                { label: "users", value: "3,847", change: "+12.1%", positive: true },
                { label: "churn", value: "2.4%", change: "-0.6%", positive: true },
                { label: "avg. order", value: "$67", change: "-$2.10", positive: false },
              ].map((s) => (
                <Card key={s.label} className="flex flex-col gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25">{s.label}</p>
                  <p className="text-2xl font-bold text-fg font-mono leading-none">{s.value}</p>
                  <p className="text-xs font-mono" style={{ color: s.positive ? "var(--pastel-green)" : "var(--pastel-pink)", opacity: 0.7 }}>{s.change}</p>
                </Card>
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
