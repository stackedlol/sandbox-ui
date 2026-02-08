export default function DevicesPage() {
  return (
    <>
      {/* ── Background ───────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "5%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      {/* ── Content ──────────────────────────────── */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-5xl">

          {/* ── Header ─────────────────────────────── */}
          <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">devices</h1>
          <p className="mt-2 text-sm text-fg/30 max-w-lg">
            pure CSS device mockups — iPhones, MacBooks, and iPads. zero images, infinitely scalable, fully themed.
          </p>
          <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">
            npx sandbox-ui add devices
          </code>

          {/* ════════════════════════════════════════ */}
          {/* ── HERO — MacBook with iPhone ─────────── */}
          {/* ════════════════════════════════════════ */}
          <section className="mt-16">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-10">hero showcase</h2>
            <div className="flex items-end justify-center gap-6 md:gap-10">
              {/* MacBook */}
              <div className="flex-shrink-0" style={{ width: "min(600px, 70vw)" }}>
                <MacBook>
                  <DashboardScreen />
                </MacBook>
              </div>
              {/* iPhone overlapping */}
              <div className="flex-shrink-0 -ml-20 md:-ml-28 mb-2 z-10" style={{ width: "min(140px, 22vw)" }}>
                <IPhone>
                  <MobileScreen />
                </IPhone>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* ── iPhone Row ─────────────────────────── */}
          {/* ════════════════════════════════════════ */}
          <section className="mt-20">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-10">iphone variants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
              <div className="w-full max-w-[180px]">
                <p className="text-[10px] uppercase tracking-widest text-fg/20 mb-3 text-center">social feed</p>
                <IPhone>
                  <SocialScreen />
                </IPhone>
              </div>
              <div className="w-full max-w-[180px]">
                <p className="text-[10px] uppercase tracking-widest text-fg/20 mb-3 text-center">music player</p>
                <IPhone>
                  <MusicScreen />
                </IPhone>
              </div>
              <div className="w-full max-w-[180px]">
                <p className="text-[10px] uppercase tracking-widest text-fg/20 mb-3 text-center">analytics</p>
                <IPhone>
                  <AnalyticsScreen />
                </IPhone>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* ── MacBook Row ────────────────────────── */}
          {/* ════════════════════════════════════════ */}
          <section className="mt-20">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-10">macbook variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-fg/20 mb-3 text-center">code editor</p>
                <MacBook>
                  <CodeEditorScreen />
                </MacBook>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-fg/20 mb-3 text-center">email client</p>
                <MacBook>
                  <EmailScreen />
                </MacBook>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* ── iPad Section ───────────────────────── */}
          {/* ════════════════════════════════════════ */}
          <section className="mt-20">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-10">ipad</h2>
            <div className="flex justify-center">
              <div style={{ width: "min(500px, 80vw)" }}>
                <IPad>
                  <NotesScreen />
                </IPad>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ */}
          {/* ── Tilted composition ──────────────────── */}
          {/* ════════════════════════════════════════ */}
          <section className="mt-20">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-10">perspective composition</h2>
            <div className="flex justify-center" style={{ perspective: "1200px" }}>
              <div className="flex items-end gap-6" style={{ transform: "rotateY(-8deg) rotateX(4deg)", transformStyle: "preserve-3d" }}>
                <div style={{ width: "min(120px, 18vw)" }}>
                  <IPhone>
                    <MobileScreen />
                  </IPhone>
                </div>
                <div style={{ width: "min(360px, 50vw)" }}>
                  <MacBook>
                    <DashboardScreen />
                  </MacBook>
                </div>
                <div style={{ width: "min(120px, 18vw)" }}>
                  <IPhone>
                    <AnalyticsScreen />
                  </IPhone>
                </div>
              </div>
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

/* ═══════════════════════════════════════════════════════════════════ */
/* ── DEVICE FRAMES ────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════ */

function IPhone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.2rem]" style={{
      padding: "1.5px",
      background: "linear-gradient(170deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.06) 100%)",
    }}>
      {/* Chassis — titanium-like finish */}
      <div className="relative rounded-[calc(1.2rem-1.5px)] overflow-hidden" style={{
        background: "#1c1c1e",
        boxShadow: `
          0 40px 80px rgba(0,0,0,0.5),
          0 16px 32px rgba(0,0,0,0.3),
          0 4px 8px rgba(0,0,0,0.2),
          inset 0 0.5px 0 rgba(255,255,255,0.06),
          inset 0 -0.5px 0 rgba(0,0,0,0.2)
        `,
      }}>
        {/* Subtle top-edge chamfer highlight */}
        <div className="absolute top-0 left-[8%] right-[8%] h-[0.5px] z-20" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

        {/* Side buttons — power (right) */}
        <div className="absolute right-[-0.5px] top-[22%] w-[1.5px] h-[12%] z-20" style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
          borderRadius: "0.5px 0 0 0.5px",
          boxShadow: "-0.5px 0 1px rgba(0,0,0,0.15)",
        }} />
        {/* Side buttons — silent switch (left top) */}
        <div className="absolute left-[-0.5px] top-[18%] w-[1.5px] h-[5%] z-20" style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          borderRadius: "0 0.5px 0.5px 0",
          boxShadow: "0.5px 0 1px rgba(0,0,0,0.15)",
        }} />
        {/* Volume up */}
        <div className="absolute left-[-0.5px] top-[27%] w-[1.5px] h-[9%] z-20" style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          borderRadius: "0 0.5px 0.5px 0",
          boxShadow: "0.5px 0 1px rgba(0,0,0,0.15)",
        }} />
        {/* Volume down */}
        <div className="absolute left-[-0.5px] top-[38%] w-[1.5px] h-[9%] z-20" style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          borderRadius: "0 0.5px 0.5px 0",
          boxShadow: "0.5px 0 1px rgba(0,0,0,0.15)",
        }} />

        {/* Antenna line breaks */}
        <div className="absolute right-0 top-[16%] w-[6px] h-[0.5px] z-20" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute left-0 top-[16%] w-[6px] h-[0.5px] z-20" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute right-0 bottom-[18%] w-[6px] h-[0.5px] z-20" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute left-0 bottom-[18%] w-[6px] h-[0.5px] z-20" style={{ background: "rgba(255,255,255,0.03)" }} />

        {/* Bezel area */}
        <div className="relative p-[3.5px]">
          {/* Dynamic Island */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-30">
            <div className="relative w-[48px] h-[14px] rounded-full overflow-hidden" style={{
              background: "#000",
              boxShadow: "0 0.5px 2px rgba(0,0,0,0.5), inset 0 0.5px 0.5px rgba(255,255,255,0.02)",
            }}>
              {/* Camera lens */}
              <div className="absolute right-[6px] top-1/2 -translate-y-1/2 w-[4.5px] h-[4.5px] rounded-full" style={{
                background: "radial-gradient(circle at 40% 35%, #252838 0%, #12121a 50%, #08080e 100%)",
                boxShadow: "0 0 1.5px rgba(60,80,180,0.15), inset 0 0.5px 0.5px rgba(255,255,255,0.04)",
              }} />
              {/* Face ID projector */}
              <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[2.5px] h-[2.5px] rounded-full" style={{
                background: "#0a0a12",
                boxShadow: "inset 0 0 0.5px rgba(255,255,255,0.03)",
              }} />
            </div>
          </div>

          {/* Screen */}
          <div className="relative rounded-[0.9rem] overflow-hidden" style={{
            aspectRatio: "9/19.5",
            background: "#000",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.5), inset 0 0 3px rgba(0,0,0,0.3)",
          }}>
            {children}
            {/* Glass reflection — very subtle diagonal streak */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              background: "linear-gradient(155deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 20%, transparent 40%, transparent 80%, rgba(255,255,255,0.008) 100%)",
            }} />
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex items-center justify-center pb-[2.5px] pt-[0.5px]">
          <div className="w-[28%] h-[2.5px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </div>
  );
}

function MacBook({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      {/* Lid — outer edge highlight */}
      <div className="w-full relative" style={{
        padding: "1.5px",
        borderRadius: "10px 10px 0 0",
        background: "linear-gradient(170deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.05) 100%)",
      }}>
        <div className="overflow-hidden" style={{
          borderRadius: "8.5px 8.5px 0 0",
          background: "#1c1c1e",
          boxShadow: `
            0 40px 80px rgba(0,0,0,0.45),
            0 16px 32px rgba(0,0,0,0.25),
            0 4px 8px rgba(0,0,0,0.15),
            inset 0 0.5px 0 rgba(255,255,255,0.05)
          `,
        }}>
          {/* Top chamfer highlight */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[0.5px] z-10" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

          {/* Bezel — camera strip */}
          <div className="flex items-center justify-center py-[5px] relative" style={{ background: "#1a1a1c" }}>
            <div className="w-[5px] h-[5px] rounded-full" style={{
              background: "radial-gradient(circle at 40% 35%, #20202a 0%, #101016 50%, #08080c 100%)",
              boxShadow: "0 0 2px rgba(50,60,140,0.1), inset 0 0.5px 0.5px rgba(255,255,255,0.03)",
            }} />
          </div>

          {/* Display — inset from bezel */}
          <div className="relative mx-[2.5px] mb-[2.5px]" style={{
            aspectRatio: "16/10",
            background: "#000",
            borderRadius: "0 0 2px 2px",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.3)",
          }}>
            {children}
            {/* Glass reflection */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              background: "linear-gradient(155deg, rgba(255,255,255,0.025) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.006) 100%)",
            }} />
          </div>
        </div>
      </div>

      {/* Hinge — tapered connection between lid and base */}
      <div className="relative" style={{ width: "103%", height: "5px" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, #262626 0%, #1e1e1e 50%, #1a1a1a 100%)",
          borderRadius: "0 0 1px 1px",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.03), 0 1px 4px rgba(0,0,0,0.2)",
        }} />
        {/* Shadow line between hinge and base */}
        <div className="absolute bottom-0 left-[2%] right-[2%] h-[0.5px]" style={{ background: "rgba(0,0,0,0.25)" }} />
      </div>

      {/* Base / keyboard deck */}
      <div className="relative" style={{
        width: "110%",
        height: "7px",
        borderRadius: "0 0 7px 7px",
        background: "linear-gradient(to bottom, #242424 0%, #1c1c1c 50%, #181818 100%)",
        boxShadow: "0 3px 12px rgba(0,0,0,0.18), inset 0 0.5px 0 rgba(255,255,255,0.025)",
      }}>
        {/* Front edge highlight */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-[0.5px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)" }} />
        {/* Trackpad notch */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[14%] h-[1.5px] rounded-b-sm" style={{ background: "rgba(255,255,255,0.025)" }} />
      </div>
    </div>
  );
}

function IPad({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1rem]" style={{
      padding: "1.5px",
      background: "linear-gradient(170deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.05) 100%)",
    }}>
      <div className="relative rounded-[calc(1rem-1.5px)] overflow-hidden" style={{
        background: "#1c1c1e",
        boxShadow: `
          0 40px 80px rgba(0,0,0,0.45),
          0 16px 32px rgba(0,0,0,0.25),
          0 4px 8px rgba(0,0,0,0.15),
          inset 0 0.5px 0 rgba(255,255,255,0.05),
          inset 0 -0.5px 0 rgba(0,0,0,0.15)
        `,
      }}>
        {/* Top chamfer highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[0.5px] z-10" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

        <div className="relative p-[4px]">
          {/* Camera */}
          <div className="absolute top-[7px] left-1/2 -translate-x-1/2 z-30 w-[4.5px] h-[4.5px] rounded-full" style={{
            background: "radial-gradient(circle at 40% 35%, #20202a 0%, #101016 50%, #08080c 100%)",
            boxShadow: "0 0 1.5px rgba(50,60,140,0.1), inset 0 0.5px 0.5px rgba(255,255,255,0.03)",
          }} />
          {/* Screen */}
          <div className="relative rounded-[0.5rem] overflow-hidden" style={{
            aspectRatio: "4/3",
            background: "#000",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.4), inset 0 0 3px rgba(0,0,0,0.25)",
          }}>
            {children}
            {/* Glass reflection */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              background: "linear-gradient(155deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 18%, transparent 35%, transparent 80%, rgba(255,255,255,0.006) 100%)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ── SCREEN CONTENTS ─────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════════ */

function DashboardScreen() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2 bg-gradient-to-br from-[#0c0c14] to-[#0a0a10]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--pastel-pink)", opacity: 0.5 }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--pastel-yellow)", opacity: 0.5 }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--pastel-green)", opacity: 0.5 }} />
        </div>
        <div className="h-2 w-16 rounded-full bg-white/5" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "users", val: "12.4k", color: "var(--pastel-blue)" },
          { label: "revenue", val: "$48k", color: "var(--pastel-green)" },
          { label: "growth", val: "+24%", color: "var(--pastel-pink)" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-2" style={{ background: `color-mix(in srgb, ${s.color} 5%, transparent)`, border: `1px solid color-mix(in srgb, ${s.color} 8%, transparent)` }}>
            <p className="text-[5px] text-white/20 uppercase tracking-wider">{s.label}</p>
            <p className="text-[9px] font-bold font-mono mt-0.5" style={{ color: s.color, opacity: 0.7 }}>{s.val}</p>
          </div>
        ))}
      </div>
      {/* Chart area */}
      <div className="flex-1 rounded-lg p-2 relative" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--pastel-blue)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--pastel-blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 50L20 42L40 46L60 30L80 35L100 22L120 28L140 15L160 20L180 8L200 12L200 60L0 60Z" fill="url(#dash-fill)" />
          <path d="M0 50L20 42L40 46L60 30L80 35L100 22L120 28L140 15L160 20L180 8L200 12" stroke="var(--pastel-blue)" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        </svg>
      </div>
      {/* Table rows */}
      <div className="space-y-1">
        {[0.7, 0.5, 0.3].map((o, i) => (
          <div key={i} className="flex items-center gap-2 px-1">
            <div className="w-3 h-3 rounded-full bg-white/5" />
            <div className="h-1.5 flex-1 rounded-full bg-white/5" />
            <div className="h-1.5 w-8 rounded-full" style={{ background: `color-mix(in srgb, var(--pastel-green) ${o * 20}%, transparent)` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileScreen() {
  return (
    <div className="w-full h-full pt-8 p-3 flex flex-col gap-2 bg-gradient-to-br from-[#0c0c14] to-[#0a0a10]">
      {/* Status bar placeholder */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="h-1 w-6 rounded-full bg-white/10" />
        <div className="h-1 w-4 rounded-full bg-white/10" />
      </div>
      {/* Avatar + greeting */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-6 h-6 rounded-full" style={{ background: "linear-gradient(135deg, var(--pastel-pink), var(--pastel-purple))", opacity: 0.4 }} />
        <div>
          <div className="h-1.5 w-12 rounded-full bg-white/10" />
          <div className="h-1 w-8 rounded-full bg-white/5 mt-1" />
        </div>
      </div>
      {/* Cards */}
      <div className="flex-1 flex flex-col gap-1.5 mt-1">
        <div className="rounded-xl p-2 flex-1" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--pastel-blue) 8%, transparent), color-mix(in srgb, var(--pastel-purple) 5%, transparent))", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="h-1 w-8 rounded-full bg-white/10 mb-1" />
          <div className="h-6 w-full rounded-lg bg-white/[0.03]" />
        </div>
        <div className="rounded-xl p-2 flex-1" style={{ background: "color-mix(in srgb, var(--pastel-green) 5%, transparent)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="h-1 w-10 rounded-full bg-white/10 mb-1" />
          <div className="flex gap-1">
            <div className="h-5 flex-1 rounded-lg bg-white/[0.03]" />
            <div className="h-5 flex-1 rounded-lg bg-white/[0.03]" />
          </div>
        </div>
      </div>
      {/* Bottom nav */}
      <div className="flex items-center justify-around py-1.5 rounded-xl bg-white/[0.03]">
        {[0,1,2,3].map((i) => (
          <div key={i} className="w-3 h-3 rounded-[3px]" style={{ background: i === 0 ? "var(--pastel-blue)" : "white", opacity: i === 0 ? 0.4 : 0.06 }} />
        ))}
      </div>
    </div>
  );
}

function SocialScreen() {
  return (
    <div className="w-full h-full pt-8 p-3 flex flex-col gap-2.5 bg-gradient-to-br from-[#0c0c14] to-[#0a0a10]">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="h-2 w-14 rounded-full bg-white/10" />
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/5" />
          <div className="w-3 h-3 rounded-full bg-white/5" />
        </div>
      </div>
      {/* Stories */}
      <div className="flex gap-2 px-1">
        {[
          "var(--pastel-pink)",
          "var(--pastel-blue)",
          "var(--pastel-green)",
          "var(--pastel-purple)",
        ].map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="w-7 h-7 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${c}, transparent)`, opacity: 0.5 }}>
              <div className="w-full h-full rounded-full bg-[#0c0c14]" />
            </div>
            <div className="h-0.5 w-4 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
      {/* Post */}
      <div className="flex-1 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="h-[55%] w-full" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--pastel-pink) 10%, transparent), color-mix(in srgb, var(--pastel-purple) 8%, transparent))" }} />
        <div className="p-2 space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--pastel-pink)", opacity: 0.3 }} />
            <div className="h-1 w-12 rounded-full bg-white/10" />
          </div>
          <div className="h-1 w-full rounded-full bg-white/5" />
          <div className="h-1 w-3/4 rounded-full bg-white/5" />
        </div>
      </div>
      {/* Bottom nav */}
      <div className="flex items-center justify-around py-1">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: i === 0 ? "var(--pastel-pink)" : "white", opacity: i === 0 ? 0.4 : 0.06 }} />
        ))}
      </div>
    </div>
  );
}

function MusicScreen() {
  return (
    <div className="w-full h-full pt-8 p-3 flex flex-col items-center bg-gradient-to-br from-[#0c0c14] to-[#0a0a10]">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-1 mb-3">
        <div className="w-3 h-3 rounded-sm bg-white/5" />
        <div className="h-1.5 w-16 rounded-full bg-white/8" />
        <div className="w-3 h-3 rounded-sm bg-white/5" />
      </div>
      {/* Album art */}
      <div className="w-[70%] aspect-square rounded-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--pastel-purple) 15%, transparent), color-mix(in srgb, var(--pastel-blue) 10%, transparent))", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}>
        {/* Abstract album art circles */}
        <div className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] rounded-full" style={{ background: "radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--pastel-pink) 12%, transparent), transparent 60%)" }} />
        <div className="absolute w-[80%] h-[80%] bottom-0 right-0 rounded-full" style={{ background: "radial-gradient(circle at 70% 60%, color-mix(in srgb, var(--pastel-blue) 10%, transparent), transparent 60%)" }} />
      </div>
      {/* Title */}
      <div className="mt-3 text-center w-full">
        <div className="h-2 w-20 rounded-full bg-white/12 mx-auto" />
        <div className="h-1 w-14 rounded-full bg-white/5 mx-auto mt-1" />
      </div>
      {/* Progress bar */}
      <div className="w-full mt-3 px-2">
        <div className="h-[2px] w-full rounded-full bg-white/5 relative">
          <div className="absolute h-full w-[62%] rounded-full" style={{ background: "var(--pastel-purple)", opacity: 0.4 }} />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[4px] text-white/15 font-mono">2:14</span>
          <span className="text-[4px] text-white/15 font-mono">3:42</span>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center gap-4 mt-2">
        <div className="w-3 h-3 rounded-full bg-white/5" />
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--pastel-purple) 15%, transparent)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 ml-[1px]" fill="white" fillOpacity="0.4"><path d="M2 1l7 4-7 4V1z" /></svg>
        </div>
        <div className="w-3 h-3 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

function AnalyticsScreen() {
  return (
    <div className="w-full h-full pt-8 p-3 flex flex-col gap-2 bg-gradient-to-br from-[#0c0c14] to-[#0a0a10]">
      {/* Header */}
      <div className="px-1">
        <div className="h-2 w-14 rounded-full bg-white/10" />
        <div className="h-1 w-10 rounded-full bg-white/5 mt-1" />
      </div>
      {/* Big number */}
      <div className="px-1">
        <div className="text-[16px] font-bold font-mono" style={{ color: "var(--pastel-green)", opacity: 0.5 }}>$84.2k</div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[5px] font-mono" style={{ color: "var(--pastel-green)", opacity: 0.4 }}>▲ 12.5%</span>
          <div className="h-0.5 w-6 rounded-full bg-white/5" />
        </div>
      </div>
      {/* Mini chart */}
      <div className="flex-1 rounded-xl p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <svg viewBox="0 0 100 40" className="w-full h-full" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ana-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--pastel-green)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--pastel-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 35L10 28L20 32L30 20L40 25L50 15L60 18L70 10L80 14L90 6L100 8L100 40L0 40Z" fill="url(#ana-fill)" />
          <path d="M0 35L10 28L20 32L30 20L40 25L50 15L60 18L70 10L80 14L90 6L100 8" stroke="var(--pastel-green)" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        </svg>
      </div>
      {/* Metric pills */}
      <div className="grid grid-cols-2 gap-1">
        {[
          { label: "ARR", val: "$1.2M", color: "var(--pastel-blue)" },
          { label: "MRR", val: "$98k", color: "var(--pastel-purple)" },
          { label: "CAC", val: "$42", color: "var(--pastel-pink)" },
          { label: "LTV", val: "$840", color: "var(--pastel-yellow)" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg p-1.5" style={{ background: `color-mix(in srgb, ${m.color} 4%, transparent)`, border: `1px solid color-mix(in srgb, ${m.color} 6%, transparent)` }}>
            <p className="text-[4px] text-white/20 uppercase">{m.label}</p>
            <p className="text-[7px] font-bold font-mono" style={{ color: m.color, opacity: 0.5 }}>{m.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeEditorScreen() {
  const lines = [
    { indent: 0, kw: "import", rest: " { Button } from ", str: "'@/ui'" },
    { indent: 0, text: "" },
    { indent: 0, kw: "export default", rest: " function ", fn: "App", rest2: "() {" },
    { indent: 1, kw: "return", rest: " (" },
    { indent: 2, tag: "<div ", attr: 'className="flex gap-4"', tag2: ">" },
    { indent: 3, tag: "<Button ", attr: 'variant="primary"', tag2: ">" },
    { indent: 4, text: "get started" },
    { indent: 3, tag: "</Button>" },
    { indent: 2, tag: "</div>" },
    { indent: 1, text: ")" },
    { indent: 0, text: "}" },
  ];

  return (
    <div className="w-full h-full flex bg-[#0c0c14]">
      {/* Sidebar */}
      <div className="w-[30px] border-r border-white/[0.04] flex flex-col items-center py-2 gap-1.5">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: i === 0 ? "var(--pastel-blue)" : "white", opacity: i === 0 ? 0.3 : 0.04 }} />
        ))}
      </div>
      {/* File tree */}
      <div className="w-[60px] border-r border-white/[0.04] p-1.5 space-y-1">
        {["app", "├ page.tsx", "├ layout.tsx", "components", "├ button.tsx", "├ card.tsx"].map((f, i) => (
          <div key={i} className="h-1 rounded-full" style={{ width: f.startsWith("├") ? "80%" : "60%", marginLeft: f.startsWith("├") ? "6px" : "0", background: i === 1 ? "var(--pastel-blue)" : "white", opacity: i === 1 ? 0.2 : 0.04 }} />
        ))}
      </div>
      {/* Editor */}
      <div className="flex-1 p-2">
        {/* Tab bar */}
        <div className="flex gap-1 mb-2">
          <div className="px-2 py-0.5 rounded-t text-[5px] font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "var(--pastel-blue)", opacity: 0.5 }}>page.tsx</div>
          <div className="px-2 py-0.5 rounded-t text-[5px] font-mono text-white/10">layout.tsx</div>
        </div>
        {/* Code */}
        <div className="space-y-[2px]">
          {lines.map((line, i) => (
            <div key={i} className="flex items-center gap-1" style={{ paddingLeft: `${line.indent * 8}px` }}>
              <span className="text-[4px] text-white/10 font-mono w-3 text-right shrink-0">{i + 1}</span>
              <div className="flex items-center gap-0">
                {"kw" in line && <span className="text-[5px] font-mono" style={{ color: "var(--pastel-purple)", opacity: 0.6 }}>{line.kw}</span>}
                {"rest" in line && <span className="text-[5px] font-mono text-white/20">{line.rest}</span>}
                {"str" in line && <span className="text-[5px] font-mono" style={{ color: "var(--pastel-green)", opacity: 0.5 }}>{line.str}</span>}
                {"fn" in line && <span className="text-[5px] font-mono" style={{ color: "var(--pastel-blue)", opacity: 0.6 }}>{line.fn}</span>}
                {"rest2" in line && <span className="text-[5px] font-mono text-white/20">{line.rest2}</span>}
                {"tag" in line && <span className="text-[5px] font-mono" style={{ color: "var(--pastel-pink)", opacity: 0.5 }}>{line.tag}</span>}
                {"attr" in line && <span className="text-[5px] font-mono" style={{ color: "var(--pastel-yellow)", opacity: 0.4 }}>{line.attr}</span>}
                {"tag2" in line && <span className="text-[5px] font-mono" style={{ color: "var(--pastel-pink)", opacity: 0.5 }}>{line.tag2}</span>}
                {"text" in line && <span className="text-[5px] font-mono text-white/20">{line.text}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmailScreen() {
  return (
    <div className="w-full h-full flex bg-[#0c0c14]">
      {/* Sidebar */}
      <div className="w-[28%] border-r border-white/[0.04] p-2 space-y-1.5">
        <div className="h-2 w-12 rounded-full bg-white/8 mb-2" />
        {["inbox", "starred", "sent", "drafts", "trash"].map((label, i) => (
          <div key={label} className="flex items-center gap-1 py-0.5 px-1 rounded" style={i === 0 ? { background: "color-mix(in srgb, var(--pastel-blue) 8%, transparent)" } : {}}>
            <div className="w-1.5 h-1.5 rounded-[1px]" style={{ background: i === 0 ? "var(--pastel-blue)" : "white", opacity: i === 0 ? 0.4 : 0.06 }} />
            <div className="h-1 rounded-full" style={{ width: `${40 + label.length * 3}%`, background: i === 0 ? "var(--pastel-blue)" : "white", opacity: i === 0 ? 0.25 : 0.05 }} />
          </div>
        ))}
      </div>
      {/* Mail list */}
      <div className="w-[35%] border-r border-white/[0.04] p-2 space-y-1">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex-1 h-2 rounded-full bg-white/[0.03] px-1">
            <div className="h-full w-6 rounded-full bg-white/5" />
          </div>
        </div>
        {[
          { from: "alice", color: "var(--pastel-pink)", unread: true },
          { from: "bob", color: "var(--pastel-blue)", unread: true },
          { from: "carol", color: "var(--pastel-green)", unread: false },
          { from: "dave", color: "var(--pastel-purple)", unread: false },
          { from: "eve", color: "var(--pastel-yellow)", unread: false },
        ].map((mail, i) => (
          <div key={i} className="py-1 px-1 rounded" style={i === 0 ? { background: "rgba(255,255,255,0.03)" } : {}}>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: mail.color, opacity: 0.25 }} />
              <div className="h-1 flex-1 rounded-full" style={{ background: "white", opacity: mail.unread ? 0.12 : 0.05 }} />
            </div>
            <div className="h-0.5 w-3/4 rounded-full bg-white/[0.03] mt-0.5 ml-3.5" />
          </div>
        ))}
      </div>
      {/* Mail preview */}
      <div className="flex-1 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: "var(--pastel-pink)", opacity: 0.2 }} />
          <div>
            <div className="h-1.5 w-14 rounded-full bg-white/10" />
            <div className="h-0.5 w-20 rounded-full bg-white/5 mt-0.5" />
          </div>
        </div>
        <div className="h-2 w-28 rounded-full bg-white/8" />
        <div className="space-y-1 pt-1">
          {[1,0.9,0.95,0.7,0.85,0.6].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-white/[0.04]" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesScreen() {
  return (
    <div className="w-full h-full flex bg-[#0c0c14]">
      {/* Left sidebar */}
      <div className="w-[20%] border-r border-white/[0.04] p-3 space-y-2">
        <div className="h-2.5 w-16 rounded-full bg-white/8 mb-3" />
        {["all notes", "favorites", "shared", "archive"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 py-1 px-2 rounded-lg" style={i === 0 ? { background: "color-mix(in srgb, var(--pastel-yellow) 8%, transparent)" } : {}}>
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: i === 0 ? "var(--pastel-yellow)" : "white", opacity: i === 0 ? 0.35 : 0.06 }} />
            <div className="h-1.5 rounded-full" style={{ width: `${60 + label.length * 2}%`, background: i === 0 ? "var(--pastel-yellow)" : "white", opacity: i === 0 ? 0.25 : 0.05 }} />
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-white/[0.04]">
          <div className="h-1 w-8 rounded-full bg-white/5 mb-2" />
          {["work", "personal", "ideas"].map((tag, i) => {
            const colors = ["var(--pastel-blue)", "var(--pastel-green)", "var(--pastel-purple)"];
            return (
              <div key={tag} className="flex items-center gap-2 py-0.5 px-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[i], opacity: 0.3 }} />
                <div className="h-1 w-10 rounded-full bg-white/5" />
              </div>
            );
          })}
        </div>
      </div>
      {/* Note list */}
      <div className="w-[25%] border-r border-white/[0.04] p-3 space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <div className="h-2 w-12 rounded-full bg-white/8" />
          <div className="w-3 h-3 rounded-md bg-white/5" />
        </div>
        {[
          { title: 12, color: "var(--pastel-yellow)", active: true },
          { title: 10, color: "var(--pastel-blue)", active: false },
          { title: 14, color: "var(--pastel-green)", active: false },
          { title: 8, color: "var(--pastel-pink)", active: false },
        ].map((note, i) => (
          <div key={i} className="p-2 rounded-lg" style={note.active ? { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" } : {}}>
            <div className="h-1.5 rounded-full bg-white/10" style={{ width: `${note.title * 5}%` }} />
            <div className="h-1 rounded-full bg-white/[0.04] mt-1 w-full" />
            <div className="h-1 rounded-full bg-white/[0.04] mt-0.5 w-3/4" />
            <div className="flex items-center gap-1 mt-1.5">
              <div className="w-1 h-1 rounded-full" style={{ background: note.color, opacity: 0.3 }} />
              <div className="h-0.5 w-6 rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
      {/* Note editor */}
      <div className="flex-1 p-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04]">
          {["B", "I", "U", "S", "≡", "•"].map((btn, i) => (
            <div key={i} className="w-4 h-4 rounded flex items-center justify-center text-[5px] font-mono text-white/15 bg-white/[0.03]">{btn}</div>
          ))}
          <div className="flex-1" />
          <div className="h-4 w-12 rounded bg-white/[0.03] flex items-center justify-center text-[5px] font-mono text-white/15">share</div>
        </div>
        {/* Title */}
        <div className="h-3 w-32 rounded-full bg-white/10 mt-4" />
        {/* Content lines */}
        <div className="space-y-1.5 mt-3">
          {[1, 0.92, 0.88, 0.95, 0.7, 0.85, 0.6, 0.93, 0.75, 0.88].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-white/[0.04]" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
