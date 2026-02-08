import { PricingTable } from "@/components/ui/pricing";

export default function PricingPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 450, height: 450, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "2%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">pricing</h1>
          <p className="mt-2 text-sm text-fg/30">three-tier pricing table on 3D glass cards with pastel accents.</p>
          <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">npx sandbox-ui add pricing</code>

          <section className="mt-14">
            <PricingTable />
          </section>

          <footer className="text-center text-sm text-fg/15 pt-16 pb-8">
            &copy; {new Date().getFullYear()} Sandbox
          </footer>
        </div>
      </div>
    </>
  );
}
