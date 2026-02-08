"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

/* ─── SVG Helpers ─────────────────────────────────────────────── */

/** Build a smooth cubic-bezier path through points */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function mapPoints(data: number[], w: number, h: number, padX: number, padY: number) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (w - padX * 2),
    y: padY + (1 - (v - min) / range) * (h - padY * 2),
    value: v,
  }));
}

/* ─── Section Heading ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">{children}</h2>
  );
}

/* ─── Feature Tags ────────────────────────────────────────────── */


/* ═══════════════════════════════════════════════════════════════ */
/* ── 1. KPI STAT CARDS ──────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const w = 80, h = 24;
  const pts = mapPoints(data, w, h, 2, 2);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  const id = `mini-spark-${data.join("-")}`;
  const color = positive ? "var(--pastel-green)" : "var(--pastel-pink)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-6" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={positive ? 0.2 : 0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} stroke={color} strokeWidth={1.5} strokeOpacity={positive ? 0.6 : 0.4} strokeLinecap="round" />
    </svg>
  );
}

const KPI_DATA = [
  { label: "revenue", value: "$48.2k", change: "+18.3%", positive: true, data: [22, 28, 25, 38, 35, 42, 40, 52, 48, 58, 55, 68] },
  { label: "active users", value: "3,847", change: "+12.1%", positive: true, data: [120, 135, 148, 162, 155, 178, 190, 205, 198, 220, 235, 248] },
  { label: "churn rate", value: "2.4%", change: "-0.6%", positive: true, data: [4.2, 3.8, 3.5, 3.2, 3.4, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4] },
  { label: "avg. order", value: "$67.30", change: "-$2.10", positive: false, data: [72, 70, 71, 69, 68, 70, 69, 67, 68, 67, 68, 67] },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ── 2. AREA CHART — MULTI-SERIES WITH GRADIENT ─────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const AREA_SERIES = [
  { label: "this year", data: [18, 24, 32, 28, 42, 38, 52, 48, 62, 58, 72, 85], opacity: 0.25, pastel: "var(--pastel-blue)" },
  { label: "last year", data: [12, 16, 20, 22, 28, 32, 35, 38, 40, 42, 48, 52], opacity: 0.08, pastel: "var(--pastel-purple)" },
];
const AREA_LABELS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function AreaChart() {
  const w = 360, h = 160, padX = 34, padY = 16;
  const allValues = AREA_SERIES.flatMap((s) => s.data);
  const max = Math.max(...allValues);
  const min = 0;
  const range = max - min || 1;

  function toPoints(data: number[]) {
    return data.map((v, i) => ({
      x: padX + (i / (data.length - 1)) * (w - padX * 2),
      y: padY + (1 - (v - min) / range) * (h - padY * 2),
    }));
  }

  const yTicks = [0, 25, 50, 75, 100].map((v) => ({
    label: `$${v}k`,
    y: padY + (1 - v / max) * (h - padY * 2),
  }));

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-fg/60">revenue over time</p>
          <p className="text-xs text-fg/25 mt-0.5">year-over-year comparison</p>
        </div>
        <div className="flex items-center gap-3">
          {AREA_SERIES.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-[2px] rounded-full" style={{ background: s.pastel, opacity: 0.6 }} />
              <span className="text-[10px] text-fg/30">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full flex-1" fill="none" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="area-grad-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pastel-blue)" stopOpacity={0.2} />
            <stop offset="80%" stopColor="var(--pastel-blue)" stopOpacity={0.03} />
            <stop offset="100%" stopColor="var(--pastel-blue)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="area-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pastel-purple)" stopOpacity={0.1} />
            <stop offset="100%" stopColor="var(--pastel-purple)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="line-grad-0" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--pastel-blue)" stopOpacity={0.3} />
            <stop offset="50%" stopColor="var(--pastel-blue)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="var(--pastel-blue)" stopOpacity={0.7} />
          </linearGradient>
        </defs>

        {/* Grid */}
        {yTicks.map((t) => (
          <g key={t.label}>
            <line x1={padX} x2={w - padX} y1={t.y} y2={t.y} stroke="currentColor" strokeOpacity={0.04} strokeDasharray="4 4" />
            <text x={padX - 6} y={t.y + 3} textAnchor="end" fill="currentColor" fillOpacity={0.12} fontSize={8} fontFamily="monospace">{t.label}</text>
          </g>
        ))}

        {/* Series (reversed so primary is on top) */}
        {[...AREA_SERIES].reverse().map((series, si) => {
          const idx = AREA_SERIES.length - 1 - si;
          const pts = toPoints(series.data);
          const line = smoothPath(pts);
          const area = `${line} L ${pts[pts.length - 1].x} ${h - padY} L ${pts[0].x} ${h - padY} Z`;
          return (
            <g key={series.label}>
              <path d={area} fill={`url(#area-grad-${idx})`} />
              <path d={line} stroke={idx === 0 ? "url(#line-grad-0)" : series.pastel} strokeWidth={idx === 0 ? 2 : 1} strokeOpacity={idx === 0 ? 1 : 0.25} strokeLinecap="round" />
              {idx === 0 && pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={series.pastel} fillOpacity={0.25} stroke={series.pastel} strokeWidth={1} strokeOpacity={0.4} />
              ))}
            </g>
          );
        })}

        {/* X labels */}
        {AREA_LABELS.map((l, i) => {
          const x = padX + (i / (AREA_LABELS.length - 1)) * (w - padX * 2);
          return <text key={l} x={x} y={h + 14} textAnchor="middle" fill="currentColor" fillOpacity={0.12} fontSize={8} fontFamily="monospace">{l}</text>;
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 3. HORIZONTAL BAR CHART ────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const HBAR_DATA = [
  { label: "enterprise", value: 84, pastel: "var(--pastel-blue)" },
  { label: "pro", value: 62, pastel: "var(--pastel-purple)" },
  { label: "starter", value: 45, pastel: "var(--pastel-green)" },
  { label: "free", value: 28, pastel: "var(--pastel-pink)" },
];

function HorizontalBarChart() {
  const max = Math.max(...HBAR_DATA.map((d) => d.value));

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5">
        <p className="text-sm font-medium text-fg/60">revenue by plan</p>
        <p className="text-xs text-fg/25 mt-0.5">distribution across pricing tiers</p>
      </div>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {HBAR_DATA.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-fg/45">{d.label}</span>
              <span className="text-xs font-mono text-fg/50">${d.value}k</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-fg/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  background: `linear-gradient(90deg, color-mix(in srgb, ${d.pastel} 30%, transparent), color-mix(in srgb, ${d.pastel} 60%, transparent))`,
                  boxShadow: `0 0 12px color-mix(in srgb, ${d.pastel} 20%, transparent)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 4. DONUT CHART — ENHANCED ──────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const DONUT_DATA = [
  { label: "direct", value: 42, pastel: "var(--pastel-blue)" },
  { label: "organic search", value: 28, pastel: "var(--pastel-green)" },
  { label: "referral", value: 18, pastel: "var(--pastel-purple)" },
  { label: "social", value: 12, pastel: "var(--pastel-pink)" },
];

function DonutChart() {
  const total = DONUT_DATA.reduce((s, d) => s + d.value, 0);
  const r = 56, cx = 72, cy = 72, circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5">
        <p className="text-sm font-medium text-fg/60">traffic sources</p>
        <p className="text-xs text-fg/25 mt-0.5">channel attribution breakdown</p>
      </div>
      <div className="flex items-center gap-8 flex-1">
        <div className="relative shrink-0">
          <svg width="144" height="144" viewBox="0 0 144 144">
            {/* Background ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--fg)" strokeWidth={12} strokeOpacity={0.03} />
            {DONUT_DATA.map((d) => {
              const pct = d.value / total;
              const dashLength = circumference * pct;
              const dashGap = circumference - dashLength;
              const currentOffset = offset;
              offset += dashLength;
              return (
                  <circle
                  key={d.label}
                  cx={cx} cy={cy} r={r}
                  fill="none" stroke={d.pastel} strokeWidth={12}
                  strokeOpacity={0.55}
                  strokeDasharray={`${dashLength - 2} ${dashGap + 2}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-fg/70 font-mono">{total}%</span>
            <span className="text-[9px] text-fg/20 mt-0.5">total reach</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {DONUT_DATA.map((d) => (
            <div key={d.label} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-150" style={{ background: d.pastel, opacity: 0.7 }} />
                <span className="text-xs text-fg/40 group-hover:text-fg/60 transition-colors">{d.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-fg/55">{d.value}%</span>
                <div className="w-12 h-1 rounded-full bg-fg/[0.04] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.pastel, opacity: 0.45 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 5. HEATMAP — ACTIVITY GRID ─────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

function Heatmap() {
  // 7 rows (days) x 20 cols (weeks)
  const weeks = 20, days = 7;
  const cells: number[][] = [];
  let total = 0;
  let peak = 0;
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const base = (w / weeks) * 0.5;
      const weekend = (d === 0 || d === 6) ? 0.15 : 0;
      const v = Math.max(0, Math.min(1, base + Math.random() * 0.6 - 0.15 - weekend));
      week.push(v);
      total += v;
      if (v > peak) peak = v;
    }
    cells.push(week);
  }
  const avg = total / (weeks * days);

  const dayLabels = ["", "m", "", "w", "", "f", ""];

  const stats = [
    { label: "contributions", value: Math.round(total * 10).toLocaleString(), color: "var(--pastel-green)" },
    { label: "daily avg", value: (avg * 10).toFixed(1), color: "var(--pastel-blue)" },
    { label: "peak", value: `${Math.round(peak * 100)}%`, color: "var(--pastel-purple)" },
  ];

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-fg/60">activity heatmap</p>
          <p className="text-xs text-fg/25 mt-0.5">contribution density — last 20 weeks</p>
        </div>
        <div className="flex items-center gap-3">
          {stats.map((s) => (
            <div key={s.label} className="text-right">
              <p className="text-xs font-mono font-semibold" style={{ color: s.color, opacity: 0.7 }}>{s.value}</p>
              <p className="text-[9px] text-fg/20">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid — fills available width */}
      <div className="flex gap-[3px] flex-1 w-full">
        <div className="flex flex-col gap-[3px] shrink-0 mr-1 pt-0.5">
          {dayLabels.map((l, i) => (
            <div key={i} className="aspect-square flex items-center flex-1">
              <span className="text-[8px] text-fg/15 font-mono">{l}</span>
            </div>
          ))}
        </div>
        {cells.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] flex-1 min-w-0">
            {week.map((v, di) => (
              <div
                key={di}
                className="w-full aspect-square rounded-[2.5px] transition-all duration-200 hover:ring-1 hover:ring-fg/20 hover:scale-110"
                style={{
                  background: "var(--pastel-green)",
                  opacity: Math.max(0.03, v * 0.5),
                }}
                title={`${Math.round(v * 100)}% activity`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer: legend + month markers */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-fg/[0.04]">
        <div className="flex items-center gap-2">
          {["jan", "", "", "", "may", "", "", "", "sep", "", "", "", ""].slice(0, Math.min(Math.ceil(weeks / 4) * 2, 10)).map((m, i) => (
            <span key={i} className="text-[8px] text-fg/12 font-mono">{m}</span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-fg/15 font-mono mr-1">less</span>
          {[0.03, 0.1, 0.2, 0.35, 0.5].map((o, i) => (
            <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: "var(--pastel-green)", opacity: o }} />
          ))}
          <span className="text-[8px] text-fg/15 font-mono ml-1">more</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 6. RADAR CHART ─────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const RADAR_METRICS = ["speed", "reliability", "cost", "scale", "security", "ux"];
const RADAR_A = [0.9, 0.7, 0.6, 0.85, 0.8, 0.75]; // product A
const RADAR_B = [0.6, 0.85, 0.8, 0.5, 0.9, 0.6];  // product B

function RadarChart() {
  const cx = 100, cy = 100, r = 70;
  const n = RADAR_METRICS.length;

  function polyPoints(values: number[]) {
    return values.map((v, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return { x: cx + Math.cos(angle) * r * v, y: cy + Math.sin(angle) * r * v };
    });
  }

  function toPath(pts: { x: number; y: number }[]) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  }

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const axes = RADAR_METRICS.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, lx: cx + Math.cos(angle) * (r + 14), ly: cy + Math.sin(angle) * (r + 14) };
  });

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-fg/60">feature comparison</p>
          <p className="text-xs text-fg/25 mt-0.5">multi-dimensional analysis across key metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--pastel-blue)", opacity: 0.6 }} />
            <span className="text-[10px] text-fg/30">product a</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--pastel-orange)", opacity: 0.5 }} />
            <span className="text-[10px] text-fg/30">product b</span>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 200 200" className="w-full max-w-[280px] mx-auto flex-1">
        <defs>
          <radialGradient id="radar-a">
            <stop offset="0%" stopColor="var(--pastel-blue)" stopOpacity={0.12} />
            <stop offset="100%" stopColor="var(--pastel-blue)" stopOpacity={0.03} />
          </radialGradient>
          <radialGradient id="radar-b">
            <stop offset="0%" stopColor="var(--pastel-orange)" stopOpacity={0.08} />
            <stop offset="100%" stopColor="var(--pastel-orange)" stopOpacity={0.02} />
          </radialGradient>
        </defs>

        {/* Grid rings */}
        {gridLevels.map((l) => (
          <polygon key={l} points={polyPoints(Array(n).fill(l)).map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--fg)" strokeOpacity={0.04} strokeWidth={0.5} />
        ))}

        {/* Axis lines */}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="var(--fg)" strokeOpacity={0.06} strokeWidth={0.5} />
        ))}

        {/* Data B (behind) */}
        <path d={toPath(polyPoints(RADAR_B))} fill="url(#radar-b)" stroke="var(--pastel-orange)" strokeWidth={1} strokeOpacity={0.25} />

        {/* Data A */}
        <path d={toPath(polyPoints(RADAR_A))} fill="url(#radar-a)" stroke="var(--pastel-blue)" strokeWidth={1.5} strokeOpacity={0.4} />
        {polyPoints(RADAR_A).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--pastel-blue)" fillOpacity={0.35} stroke="var(--pastel-blue)" strokeWidth={1} strokeOpacity={0.3} />
        ))}

        {/* Labels */}
        {axes.map((a, i) => (
          <text key={i} x={a.lx} y={a.ly + 3} textAnchor="middle" fill="currentColor" fillOpacity={0.18} fontSize={7} fontFamily="monospace">
            {RADAR_METRICS[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 7. FUNNEL CHART ────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const FUNNEL_DATA = [
  { label: "visitors", value: 12400, pct: 100, pastel: "var(--pastel-blue)" },
  { label: "sign ups", value: 3800, pct: 30.6, pastel: "var(--pastel-purple)" },
  { label: "activated", value: 1920, pct: 15.5, pastel: "var(--pastel-green)" },
  { label: "subscribed", value: 680, pct: 5.5, pastel: "var(--pastel-yellow)" },
  { label: "enterprise", value: 142, pct: 1.1, pastel: "var(--pastel-pink)" },
];

function FunnelChart() {
  const maxWidth = 100;

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5">
        <p className="text-sm font-medium text-fg/60">conversion funnel</p>
        <p className="text-xs text-fg/25 mt-0.5">drop-off analysis from visit to enterprise conversion</p>
      </div>
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {FUNNEL_DATA.map((d, i) => {
          const widthPct = (d.pct / 100) * maxWidth;
          const opacity = 0.06 + (1 - i / (FUNNEL_DATA.length - 1)) * 0.18;
          const dropoff = i > 0 ? Math.round((1 - d.value / FUNNEL_DATA[i - 1].value) * 100) : 0;

          return (
            <div key={d.label} className="flex items-center gap-3">
              <div className="w-20 text-right">
                <span className="text-xs text-fg/40">{d.label}</span>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-8 relative rounded-lg overflow-hidden bg-fg/[0.02]">
                  <div
                    className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-3"
                    style={{
                      width: `${widthPct}%`,
                      background: `color-mix(in srgb, ${d.pastel} ${Math.round(opacity * 200)}%, transparent)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-[11px] font-mono text-fg/50">{d.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-12 text-right">
                  {i > 0 ? (
                    <span className="text-[10px] font-mono text-fg/25">-{dropoff}%</span>
                  ) : (
                    <span className="text-[10px] font-mono text-fg/25">{d.pct}%</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 8. SCATTER PLOT ────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const SCATTER_DATA = [
  { x: 12, y: 42, size: 4, label: "acme", cat: 0 }, { x: 25, y: 58, size: 6, label: "beta", cat: 1 },
  { x: 38, y: 35, size: 3, label: "core", cat: 0 }, { x: 45, y: 72, size: 8, label: "delta", cat: 2 },
  { x: 52, y: 48, size: 5, label: "echo", cat: 1 }, { x: 60, y: 82, size: 7, label: "flux", cat: 2 },
  { x: 68, y: 55, size: 4, label: "gear", cat: 0 }, { x: 75, y: 90, size: 9, label: "hive", cat: 2 },
  { x: 82, y: 65, size: 5, label: "iris", cat: 1 }, { x: 88, y: 78, size: 6, label: "jolt", cat: 2 },
  { x: 35, y: 62, size: 5, label: "kite", cat: 1 }, { x: 55, y: 40, size: 3, label: "lynx", cat: 0 },
  { x: 70, y: 70, size: 7, label: "mesa", cat: 2 }, { x: 20, y: 30, size: 4, label: "node", cat: 0 },
  { x: 92, y: 85, size: 8, label: "opus", cat: 2 },
];

const SCATTER_CATS = [
  { label: "starter", pastel: "var(--pastel-blue)" },
  { label: "pro", pastel: "var(--pastel-purple)" },
  { label: "enterprise", pastel: "var(--pastel-green)" },
];

function ScatterPlot() {
  const w = 400, h = 220, padX = 42, padY = 24;
  const yLabels = ["0%", "25%", "50%", "75%", "100%"];
  const xLabels = ["$0", "$25k", "$50k", "$75k", "$100k"];

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-fg/60">engagement vs. spend</p>
          <p className="text-xs text-fg/25 mt-0.5">bubble size = account value</p>
        </div>
        <div className="flex items-center gap-3">
          {SCATTER_CATS.map((c) => (
            <div key={c.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c.pastel, opacity: 0.6 }} />
              <span className="text-[10px] text-fg/30">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full flex-1" fill="none" preserveAspectRatio="xMidYMid meet">
        <defs>
          {SCATTER_CATS.map((c, ci) => (
            <radialGradient key={ci} id={`scatter-glow-${ci}`}>
              <stop offset="0%" stopColor={c.pastel} stopOpacity={0.25} />
              <stop offset="100%" stopColor={c.pastel} stopOpacity={0.04} />
            </radialGradient>
          ))}
        </defs>

        {/* Background grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padY + pct * (h - padY * 2);
          return (
            <g key={`h-${pct}`}>
              <line x1={padX} x2={w - padX} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.06} />
              <text x={padX - 6} y={y + 3} textAnchor="end" fill="currentColor" fillOpacity={0.2} fontSize={7} fontFamily="monospace">{yLabels[4 - i]}</text>
            </g>
          );
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const x = padX + pct * (w - padX * 2);
          return (
            <g key={`v-${pct}`}>
              <line x1={x} x2={x} y1={padY} y2={h - padY} stroke="currentColor" strokeOpacity={0.04} />
              <text x={x} y={h + 4} textAnchor="middle" fill="currentColor" fillOpacity={0.2} fontSize={7} fontFamily="monospace">{xLabels[i]}</text>
            </g>
          );
        })}

        {/* Trend line */}
        <line x1={padX + 8} y1={h - padY - 16} x2={w - padX - 8} y2={padY + 8} stroke="var(--fg)" strokeWidth={1} strokeOpacity={0.1} strokeDasharray="6 4" />

        {/* Bubbles — layered: glow → fill → ring → center → label */}
        {SCATTER_DATA.map((d, i) => {
          const px = padX + (d.x / 100) * (w - padX * 2);
          const py = padY + (1 - d.y / 100) * (h - padY * 2);
          const cat = SCATTER_CATS[d.cat];
          const r = d.size * 2.2;
          return (
            <g key={i} className="group">
              {/* Glow */}
              <circle cx={px} cy={py} r={r + 4} fill={`url(#scatter-glow-${d.cat})`} className="opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
              {/* Fill */}
              <circle cx={px} cy={py} r={r} fill={cat.pastel} fillOpacity={0.15} className="group-hover:fill-opacity-[0.3] transition-all duration-200" />
              {/* Ring */}
              <circle cx={px} cy={py} r={r} fill="none" stroke={cat.pastel} strokeWidth={1.5} strokeOpacity={0.4} className="group-hover:stroke-opacity-[0.7] transition-all duration-200" />
              {/* Center dot */}
              <circle cx={px} cy={py} r={2} fill={cat.pastel} fillOpacity={0.7} />
              {/* Hover label */}
              <text x={px} y={py - r - 5} textAnchor="middle" fill={cat.pastel} fillOpacity={0} fontSize={7} fontFamily="monospace" className="group-hover:fill-opacity-[0.7] transition-all duration-200">{d.label}</text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={w / 2} y={h + 18} textAnchor="middle" fill="currentColor" fillOpacity={0.2} fontSize={8} fontFamily="monospace">monthly spend →</text>
        <text x={10} y={h / 2} textAnchor="middle" fill="currentColor" fillOpacity={0.2} fontSize={8} fontFamily="monospace" transform={`rotate(-90, 10, ${h / 2})`}>engagement rate →</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 9. SPARKLINE TABLE ─────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

function SparkArea({ data, id }: { data: number[]; id: string }) {
  const w = 100, h = 28;
  const pts = mapPoints(data, w, h, 0, 2);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  const positive = data[data.length - 1] > data[0];
  const color = positive ? "var(--pastel-green)" : "var(--pastel-pink)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-7 shrink-0" fill="none" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={positive ? 0.15 : 0.08} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} stroke={color} strokeWidth={1.5} strokeOpacity={positive ? 0.5 : 0.3} strokeLinecap="round" />
    </svg>
  );
}

const SPARK_ROWS = [
  { label: "mrr", value: "$48.2k", change: "+18.3%", positive: true, data: [22, 28, 25, 38, 35, 42, 40, 52, 48, 58, 55, 68] },
  { label: "active users", value: "3,847", change: "+12.1%", positive: true, data: [120, 135, 148, 162, 155, 178, 190, 205, 198, 220, 235, 248] },
  { label: "nps score", value: "72", change: "+4", positive: true, data: [58, 60, 62, 64, 62, 66, 68, 70, 69, 71, 70, 72] },
  { label: "churn rate", value: "2.4%", change: "-0.6%", positive: true, data: [4.2, 3.8, 3.5, 3.2, 3.4, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4] },
  { label: "cac", value: "$34", change: "+$3", positive: false, data: [28, 29, 30, 31, 30, 32, 31, 33, 32, 33, 34, 34] },
  { label: "ltv:cac", value: "4.2x", change: "+0.3x", positive: true, data: [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2] },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ── 10. RADIAL / GAUGE CHART ─────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const RADIAL_DATA = [
  { label: "cpu usage", value: 73, pastel: "var(--pastel-blue)" },
  { label: "memory", value: 58, pastel: "var(--pastel-purple)" },
  { label: "disk i/o", value: 42, pastel: "var(--pastel-green)" },
  { label: "network", value: 87, pastel: "var(--pastel-orange)" },
];

function RadialChart() {
  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-5">
        <p className="text-sm font-medium text-fg/60">system health</p>
        <p className="text-xs text-fg/25 mt-0.5">real-time resource utilization gauges</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1 items-center">
        {RADIAL_DATA.map((d) => {
          const r = 36, cx = 44, cy = 44, strokeW = 7;
          const circumference = 2 * Math.PI * r;
          const arcLength = circumference * 0.75; // 270° arc
          const filled = arcLength * (d.value / 100);
          const gap = arcLength - filled;

          return (
            <div key={d.label} className="flex flex-col items-center gap-2">
              <div className="relative">
                <svg width="88" height="88" viewBox="0 0 88 88">
                  {/* Background arc */}
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke="var(--fg)"
                    strokeWidth={strokeW}
                    strokeOpacity={0.04}
                    strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                    strokeDashoffset={-circumference * 0.125}
                    strokeLinecap="round"
                    transform={`rotate(0 ${cx} ${cy})`}
                  />
                  {/* Filled arc */}
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={d.pastel}
                    strokeWidth={strokeW}
                    strokeOpacity={0.55}
                    strokeDasharray={`${filled} ${gap + (circumference - arcLength)}`}
                    strokeDashoffset={-circumference * 0.125}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  {/* Glow */}
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={d.pastel}
                    strokeWidth={strokeW + 6}
                    strokeOpacity={0.08}
                    strokeDasharray={`${filled} ${gap + (circumference - arcLength)}`}
                    strokeDashoffset={-circumference * 0.125}
                    strokeLinecap="round"
                    style={{ filter: "blur(4px)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold font-mono" style={{ color: d.pastel, opacity: 0.8 }}>{d.value}%</span>
                </div>
              </div>
              <span className="text-[10px] text-fg/30 font-medium">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Single large radial gauge */
function RadialGaugeLarge() {
  const value = 72;
  const r = 64, cx = 80, cy = 80, strokeW = 10;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.75;
  const filled = arcLength * (value / 100);
  const gap = arcLength - filled;

  // Tick marks along the arc
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const pct = i / 12;
    const angle = (135 + pct * 270) * (Math.PI / 180);
    const innerR = r - 16;
    const outerR = r - 12;
    return {
      x1: cx + Math.cos(angle) * innerR,
      y1: cy + Math.sin(angle) * innerR,
      x2: cx + Math.cos(angle) * outerR,
      y2: cy + Math.sin(angle) * outerR,
      major: i % 3 === 0,
    };
  });

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col items-center">
      <div className="mb-4 self-start">
        <p className="text-sm font-medium text-fg/60">performance score</p>
        <p className="text-xs text-fg/25 mt-0.5">composite index across all services</p>
      </div>
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="radial-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--pastel-green)" stopOpacity={0.6} />
              <stop offset="60%" stopColor="var(--pastel-blue)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="var(--pastel-purple)" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--fg)" strokeWidth={t.major ? 1.5 : 0.5} strokeOpacity={t.major ? 0.15 : 0.08} strokeLinecap="round" />
          ))}

          {/* Background arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="var(--fg)"
            strokeWidth={strokeW}
            strokeOpacity={0.04}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={-circumference * 0.125}
            strokeLinecap="round"
          />

          {/* Filled arc with gradient */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#radial-grad)"
            strokeWidth={strokeW}
            strokeDasharray={`${filled} ${gap + (circumference - arcLength)}`}
            strokeDashoffset={-circumference * 0.125}
            strokeLinecap="round"
            className="transition-all duration-700"
          />

          {/* Glow layer */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#radial-grad)"
            strokeWidth={strokeW + 8}
            strokeOpacity={0.1}
            strokeDasharray={`${filled} ${gap + (circumference - arcLength)}`}
            strokeDashoffset={-circumference * 0.125}
            strokeLinecap="round"
            style={{ filter: "blur(6px)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-fg/80">{value}</span>
          <span className="text-[9px] text-fg/20 mt-0.5">out of 100</span>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        {["poor", "fair", "good", "excellent"].map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-1 rounded-full" style={{
              background: ["var(--pastel-pink)", "var(--pastel-yellow)", "var(--pastel-blue)", "var(--pastel-green)"][i],
              opacity: 0.5,
            }} />
            <span className="text-[8px] text-fg/20">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── 11. SANKEY DIAGRAM ──────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

interface SankeyNode {
  id: string;
  label: string;
  value: number;
  pastel: string;
  x: number;
  y: number;
  h: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  pastel: string;
}

const SANKEY_W = 380, SANKEY_H = 240;
const NODE_W = 10;

const SANKEY_NODES: SankeyNode[] = [
  // Column 0 — Sources
  { id: "organic", label: "organic", value: 80, pastel: "var(--pastel-green)", x: 0, y: 12, h: 80 },
  { id: "paid", label: "paid ads", value: 60, pastel: "var(--pastel-blue)", x: 0, y: 102, h: 60 },
  { id: "referral", label: "referral", value: 50, pastel: "var(--pastel-purple)", x: 0, y: 172, h: 50 },
  { id: "social", label: "social", value: 40, pastel: "var(--pastel-pink)", x: 0, y: 232, h: 40 },

  // Column 1 — Pages
  { id: "landing", label: "landing page", value: 125, pastel: "var(--pastel-blue)", x: 200, y: 12, h: 105 },
  { id: "blog", label: "blog", value: 60, pastel: "var(--pastel-green)", x: 200, y: 127, h: 60 },
  { id: "docs", label: "docs", value: 55, pastel: "var(--pastel-purple)", x: 200, y: 197, h: 70 },

  // Column 2 — Outcomes
  { id: "signup", label: "sign up", value: 85, pastel: "var(--pastel-green)", x: 400, y: 12, h: 85 },
  { id: "trial", label: "free trial", value: 65, pastel: "var(--pastel-blue)", x: 400, y: 107, h: 65 },
  { id: "bounce", label: "bounce", value: 50, pastel: "var(--pastel-pink)", x: 400, y: 182, h: 50 },
  { id: "return", label: "return visit", value: 30, pastel: "var(--pastel-yellow)", x: 400, y: 242, h: 30 },
];

const SANKEY_LINKS: SankeyLink[] = [
  // Sources → Pages
  { source: "organic", target: "landing", value: 45, pastel: "var(--pastel-green)" },
  { source: "organic", target: "blog", value: 25, pastel: "var(--pastel-green)" },
  { source: "organic", target: "docs", value: 10, pastel: "var(--pastel-green)" },
  { source: "paid", target: "landing", value: 50, pastel: "var(--pastel-blue)" },
  { source: "paid", target: "blog", value: 10, pastel: "var(--pastel-blue)" },
  { source: "referral", target: "landing", value: 15, pastel: "var(--pastel-purple)" },
  { source: "referral", target: "docs", value: 35, pastel: "var(--pastel-purple)" },
  { source: "social", target: "blog", value: 25, pastel: "var(--pastel-pink)" },
  { source: "social", target: "landing", value: 15, pastel: "var(--pastel-pink)" },

  // Pages → Outcomes
  { source: "landing", target: "signup", value: 55, pastel: "var(--pastel-blue)" },
  { source: "landing", target: "trial", value: 35, pastel: "var(--pastel-blue)" },
  { source: "landing", target: "bounce", value: 25, pastel: "var(--pastel-pink)" },
  { source: "landing", target: "return", value: 10, pastel: "var(--pastel-yellow)" },
  { source: "blog", target: "signup", value: 15, pastel: "var(--pastel-green)" },
  { source: "blog", target: "trial", value: 20, pastel: "var(--pastel-green)" },
  { source: "blog", target: "bounce", value: 15, pastel: "var(--pastel-pink)" },
  { source: "blog", target: "return", value: 10, pastel: "var(--pastel-yellow)" },
  { source: "docs", target: "signup", value: 15, pastel: "var(--pastel-purple)" },
  { source: "docs", target: "trial", value: 10, pastel: "var(--pastel-purple)" },
  { source: "docs", target: "bounce", value: 10, pastel: "var(--pastel-pink)" },
  { source: "docs", target: "return", value: 10, pastel: "var(--pastel-yellow)" },
];

function SankeyDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodeMap = new Map(SANKEY_NODES.map((n) => [n.id, n]));
  const padX = 40;
  const scale = (SANKEY_W - padX * 2 - NODE_W) / 400;

  function getNode(id: string) {
    const n = nodeMap.get(id)!;
    return { ...n, px: padX + n.x * scale, py: n.y };
  }

  // Track cumulative offsets for stacking links at each node
  const sourceOffsets = new Map<string, number>();
  const targetOffsets = new Map<string, number>();

  function buildPath(link: SankeyLink) {
    const s = getNode(link.source);
    const t = getNode(link.target);

    const sTotal = SANKEY_LINKS.filter((l) => l.source === link.source).reduce((a, l) => a + l.value, 0);
    const tTotal = SANKEY_LINKS.filter((l) => l.target === link.target).reduce((a, l) => a + l.value, 0);
    const thickness = Math.max(3, Math.min(
      (link.value / sTotal) * s.h,
      (link.value / tTotal) * t.h
    ));

    const sOff = sourceOffsets.get(link.source) ?? 0;
    const tOff = targetOffsets.get(link.target) ?? 0;
    sourceOffsets.set(link.source, sOff + thickness + 1);
    targetOffsets.set(link.target, tOff + thickness + 1);

    const x0 = s.px + NODE_W;
    const y0 = s.py + sOff + thickness / 2;
    const x1 = t.px;
    const y1 = t.py + tOff + thickness / 2;
    const cx0 = x0 + (x1 - x0) * 0.4;
    const cx1 = x0 + (x1 - x0) * 0.6;

    return {
      d: `M ${x0} ${y0} C ${cx0} ${y0}, ${cx1} ${y1}, ${x1} ${y1}`,
      thickness,
      x0, y0, x1, y1,
    };
  }

  const renderedLinks = SANKEY_LINKS.map((link, i) => ({
    ...link,
    idx: i,
    ...buildPath(link),
  }));

  // Determine if a node is connected to the hovered node
  function isNodeHighlighted(nodeId: string) {
    if (!hovered) return false;
    if (nodeId === hovered) return true;
    return SANKEY_LINKS.some((l) =>
      (l.source === hovered && l.target === nodeId) ||
      (l.target === hovered && l.source === nodeId)
    );
  }

  function isLinkHighlighted(link: SankeyLink) {
    if (!hovered) return false;
    return link.source === hovered || link.target === hovered;
  }

  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-fg/60">user flow</p>
          <p className="text-xs text-fg/25 mt-0.5">source → page → outcome</p>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <svg
          viewBox={`0 0 ${SANKEY_W} ${SANKEY_H}`}
          className="w-full h-full"
          fill="none"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            {/* Gradient definitions for each link */}
            {renderedLinks.map((link) => (
              <linearGradient key={`grad-${link.idx}`} id={`sankey-grad-${link.idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={nodeMap.get(link.source)!.pastel} />
                <stop offset="100%" stopColor={nodeMap.get(link.target)!.pastel} />
              </linearGradient>
            ))}
            {/* Node glow filters */}
            <filter id="sankey-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated particle along path */}
            {renderedLinks.map((link) => (
              <circle key={`particle-def-${link.idx}`} id={`particle-${link.idx}`} r={Math.max(1.5, link.thickness * 0.25)} fill={link.pastel} opacity={0.6}>
                <animateMotion
                  dur={`${3 + (link.idx % 4)}s`}
                  repeatCount="indefinite"
                  path={link.d}
                  begin={`${(link.idx * 0.4) % 3}s`}
                />
              </circle>
            ))}
          </defs>

          {/* Column labels */}
          <text x={padX + NODE_W / 2} y={SANKEY_H - 4} textAnchor="middle" fill="currentColor" fillOpacity={0.1} fontSize={7} fontFamily="var(--font-mono)">source</text>
          <text x={padX + 200 * scale + NODE_W / 2} y={SANKEY_H - 4} textAnchor="middle" fill="currentColor" fillOpacity={0.1} fontSize={7} fontFamily="var(--font-mono)">page</text>
          <text x={padX + 400 * scale + NODE_W / 2} y={SANKEY_H - 4} textAnchor="middle" fill="currentColor" fillOpacity={0.1} fontSize={7} fontFamily="var(--font-mono)">outcome</text>

          {/* Links — filled ribbons */}
          {renderedLinks.map((link) => {
            const highlighted = isLinkHighlighted(link);
            const dimmed = hovered && !highlighted;
            return (
              <path
                key={`link-${link.idx}`}
                d={link.d}
                stroke={`url(#sankey-grad-${link.idx})`}
                strokeWidth={link.thickness}
                strokeOpacity={dimmed ? 0.04 : highlighted ? 0.4 : 0.15}
                fill="none"
                strokeLinecap="round"
                style={{ transition: "stroke-opacity 0.4s ease, stroke-width 0.3s ease" }}
              />
            );
          })}

          {/* Animated flow particles */}
          {renderedLinks.map((link) => {
            const highlighted = isLinkHighlighted(link);
            const dimmed = hovered && !highlighted;
            return (
              <circle
                key={`dot-${link.idx}`}
                r={Math.max(1.5, link.thickness * 0.2)}
                fill={link.pastel}
                opacity={dimmed ? 0 : highlighted ? 0.8 : 0.35}
                style={{ transition: "opacity 0.4s ease" }}
              >
                <animateMotion
                  dur={`${2.5 + (link.idx % 3) * 0.8}s`}
                  repeatCount="indefinite"
                  path={link.d}
                  begin={`${(link.idx * 0.3) % 2.5}s`}
                />
              </circle>
            );
          })}

          {/* Nodes */}
          {SANKEY_NODES.map((n) => {
            const nd = getNode(n.id);
            const isRight = n.x === 400;
            const isLeft = n.x === 0;
            const highlighted = isNodeHighlighted(n.id);
            const isHoveredNode = hovered === n.id;
            const dimmed = hovered && !highlighted;

            return (
              <g
                key={n.id}
                onMouseEnter={() => setHovered(n.id)}
                className="cursor-pointer"
              >
                {/* Outer glow */}
                <rect
                  x={nd.px - 4} y={nd.py - 4}
                  width={NODE_W + 6} height={n.h + 6}
                  rx={6} fill={n.pastel}
                  opacity={isHoveredNode ? 0.15 : highlighted ? 0.08 : 0.03}
                  style={{ filter: "blur(8px)", transition: "opacity 0.4s ease" }}
                />
                {/* Bar background */}
                <rect
                  x={nd.px} y={nd.py}
                  width={NODE_W} height={n.h}
                  rx={4} fill={n.pastel}
                  opacity={dimmed ? 0.12 : isHoveredNode ? 0.7 : highlighted ? 0.5 : 0.3}
                  style={{ transition: "opacity 0.3s ease" }}
                />
                {/* Top highlight edge */}
                <rect
                  x={nd.px + 1} y={nd.py}
                  width={NODE_W - 2} height={1}
                  rx={0.5} fill={n.pastel}
                  opacity={dimmed ? 0 : isHoveredNode ? 0.6 : 0.2}
                  style={{ transition: "opacity 0.3s ease" }}
                />
                {/* Label */}
                <text
                  x={isLeft ? nd.px - 6 : isRight ? nd.px + NODE_W + 6 : nd.px + NODE_W + 6}
                  y={nd.py + n.h / 2}
                  textAnchor={isLeft ? "end" : "start"}
                  dominantBaseline="central"
                  fill="currentColor"
                  fillOpacity={dimmed ? 0.1 : isHoveredNode ? 0.6 : 0.3}
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                  style={{ transition: "fill-opacity 0.3s ease" }}
                >
                  {n.label}
                </text>
                {/* Value below label */}
                <text
                  x={isLeft ? nd.px - 6 : isRight ? nd.px + NODE_W + 6 : nd.px + NODE_W + 6}
                  y={nd.py + n.h / 2 + 11}
                  textAnchor={isLeft ? "end" : "start"}
                  dominantBaseline="central"
                  fill={n.pastel}
                  fillOpacity={dimmed ? 0 : isHoveredNode ? 0.7 : 0.25}
                  fontSize={7}
                  fontFamily="var(--font-mono)"
                  style={{ transition: "fill-opacity 0.3s ease" }}
                >
                  {n.value.toLocaleString()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── PAGE ───────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export default function ChartsPage() {
  return (
    <>
      {/* ── Background layer ───────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 450, height: 450, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "2%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      {/* ── Content ────────────────────────────────── */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-6xl">

          {/* ── Page header ─────────────────────────── */}
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">charts</h1>
            <p className="mt-2 text-sm text-fg/30">pure SVG data visualizations on glass surfaces — no external dependencies.</p>
            <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">npx sandbox-ui add charts</code>
          </div>

          {/* ── KPI Cards ────────────────────────────── */}
          <section>
            <SectionLabel>key metrics</SectionLabel>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {KPI_DATA.map((kpi) => (
                <Card key={kpi.label} className="flex flex-col gap-3">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25">{kpi.label}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-fg font-mono leading-none">{kpi.value}</p>
                      <p className="text-[11px] font-mono mt-1.5" style={{ color: kpi.positive ? "var(--pastel-green)" : "var(--pastel-pink)", opacity: 0.7 }}>{kpi.change}</p>
                    </div>
                    <MiniSparkline data={kpi.data} positive={kpi.positive} />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ── All charts in a uniform 2-col grid ───── */}
          <section className="mt-10">
            <SectionLabel>visualizations</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-[340px]">
              {/* Row 1 — area + sankey side-by-side */}
              <AreaChart />
              <SankeyDiagram />

              {/* Row 2 */}
              <HorizontalBarChart />
              <DonutChart />

              {/* Row 3 */}
              <Heatmap />
              <RadarChart />

              {/* Row 4 */}
              <FunnelChart />
              <ScatterPlot />

              {/* Row 5 */}
              <RadialChart />
              <RadialGaugeLarge />

              {/* Row 6 — sparkline table full width */}
              <div className="lg:col-span-2 h-auto">
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 px-5 py-2.5 border-b border-fg/[0.06]">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-fg/20">metric</span>
                    <span className="text-[10px] font-medium uppercase tracking-widest text-fg/20 text-right">value</span>
                    <span className="text-[10px] font-medium uppercase tracking-widest text-fg/20 text-center">trend</span>
                    <span className="text-[10px] font-medium uppercase tracking-widest text-fg/20 text-right">change</span>
                  </div>
                  {SPARK_ROWS.map((row, i) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-6 items-center px-5 py-3 transition-colors duration-150 hover:bg-fg/[0.02] ${i < SPARK_ROWS.length - 1 ? "border-b border-fg/[0.04]" : ""}`}
                    >
                      <span className="text-sm text-fg/50">{row.label}</span>
                      <span className="text-sm font-mono text-fg/65 text-right">{row.value}</span>
                      <SparkArea data={row.data} id={`spark-${row.label.replace(/\s/g, "-")}`} />
                      <span className="text-xs font-mono text-right w-14" style={{ color: row.positive ? "var(--pastel-green)" : "var(--pastel-pink)", opacity: 0.65 }}>{row.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center text-sm text-fg/15 pt-12 pb-8">
            &copy; {new Date().getFullYear()} Sandbox
          </footer>
        </div>
      </div>
    </>
  );
}
