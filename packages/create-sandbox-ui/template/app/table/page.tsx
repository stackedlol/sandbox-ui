"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

/* ─── Sample data ─────────────────────────────────────────────── */

interface Row {
  id: number;
  name: string;
  avatar: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  revenue: string;
  change: string;
  positive: boolean;
}

const DATA: Row[] = [
  { id: 1, avatar: "AN", name: "alice nakamura", email: "alice@acme.co", status: "active", role: "engineer", revenue: "$4,200", change: "+12%", positive: true },
  { id: 2, avatar: "BC", name: "bob chen", email: "bob@acme.co", status: "active", role: "designer", revenue: "$3,800", change: "+8%", positive: true },
  { id: 3, avatar: "CW", name: "carol wright", email: "carol@acme.co", status: "pending", role: "pm", revenue: "$2,100", change: "-3%", positive: false },
  { id: 4, avatar: "DK", name: "david kim", email: "david@acme.co", status: "inactive", role: "engineer", revenue: "$1,500", change: "+1%", positive: true },
  { id: 5, avatar: "EC", name: "elena costa", email: "elena@acme.co", status: "active", role: "designer", revenue: "$5,600", change: "+22%", positive: true },
  { id: 6, avatar: "FL", name: "frank lee", email: "frank@acme.co", status: "pending", role: "analyst", revenue: "$2,900", change: "-5%", positive: false },
  { id: 7, avatar: "GP", name: "grace park", email: "grace@acme.co", status: "active", role: "engineer", revenue: "$4,800", change: "+15%", positive: true },
  { id: 8, avatar: "HM", name: "henry muller", email: "henry@acme.co", status: "inactive", role: "pm", revenue: "$900", change: "-12%", positive: false },
];

const AVATAR_COLORS = [
  "var(--pastel-blue)", "var(--pastel-green)", "var(--pastel-purple)",
  "var(--pastel-orange)", "var(--pastel-pink)", "var(--pastel-yellow)",
  "var(--pastel-blue)", "var(--pastel-purple)",
];

/* ─── Status badge ────────────────────────────────────────────── */

function StatusBadge({ status }: { status: Row["status"] }) {
  const colorMap = {
    active: "var(--pastel-green)",
    inactive: "var(--pastel-pink)",
    pending: "var(--pastel-yellow)",
  };
  const color = colorMap[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border"
      style={{
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        color,
        borderColor: `color-mix(in srgb, ${color} 18%, transparent)`,
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "pending" ? "animate-pulse" : ""}`}
        style={{ background: color, opacity: 0.6 }}
      />
      {status}
    </span>
  );
}

/* ─── Sort icon ───────────────────────────────────────────────── */

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  return (
    <svg viewBox="0 0 10 14" fill="none" className="w-2.5 h-3.5 ml-1 inline-block">
      <path d="M5 1L8 5H2Z" fill="currentColor" opacity={active && asc ? 0.6 : 0.12} />
      <path d="M5 13L2 9H8Z" fill="currentColor" opacity={active && !asc ? 0.6 : 0.12} />
    </svg>
  );
}

/* ─── Full Data Table ─────────────────────────────────────────── */

type SortKey = "name" | "status" | "role" | "revenue";

function GlassTable() {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [asc, setAsc] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  function handleSort(key: SortKey) {
    if (key === sortKey) setAsc(!asc);
    else { setSortKey(key); setAsc(true); }
  }

  function toggleRow(id: number) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedRows.size === DATA.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(DATA.map((r) => r.id)));
  }

  const sorted = [...DATA].sort((a, b) => {
    const mul = asc ? 1 : -1;
    if (sortKey === "revenue") {
      return mul * (parseFloat(a.revenue.replace(/[$,]/g, "")) - parseFloat(b.revenue.replace(/[$,]/g, "")));
    }
    return mul * a[sortKey].localeCompare(b[sortKey]);
  });

  const headers: { key: SortKey; label: string; align?: string }[] = [
    { key: "name", label: "member" },
    { key: "status", label: "status" },
    { key: "role", label: "role" },
    { key: "revenue", label: "revenue", align: "text-right" },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-fg/[0.06]">
        <div className="flex items-center gap-3">
          {selectedRows.size > 0 ? (
            <p className="text-sm font-medium" style={{ color: "var(--pastel-blue)" }}>
              {selectedRows.size} selected
            </p>
          ) : (
            <p className="text-sm font-medium text-fg/50">{DATA.length} members</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="glass rounded-lg px-3 py-1.5 text-xs text-fg/25 flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-fg/20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
            search...
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fg/[0.06]">
              <th className="pl-5 pr-2 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.size === DATA.length}
                  onChange={toggleAll}
                  className="accent-current opacity-30 cursor-pointer"
                />
              </th>
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className={`px-3 py-3 text-[10px] font-medium uppercase tracking-widest text-fg/25 cursor-pointer hover:text-fg/50 transition-colors ${h.align ?? "text-left"}`}
                >
                  {h.label}
                  <SortIcon active={sortKey === h.key} asc={asc} />
                </th>
              ))}
              <th className="px-3 py-3 text-right text-[10px] font-medium uppercase tracking-widest text-fg/25">change</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const isSelected = selectedRows.has(row.id);
              return (
                <tr
                  key={row.id}
                  onClick={() => toggleRow(row.id)}
                  className={[
                    "border-b border-fg/[0.04] transition-colors duration-150 cursor-pointer",
                    isSelected ? "bg-fg/[0.06]" : "hover:bg-fg/[0.03]",
                  ].join(" ")}
                >
                  <td className="pl-5 pr-2 py-3">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleRow(row.id)} className="accent-current opacity-30 cursor-pointer" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{
                          background: `color-mix(in srgb, ${AVATAR_COLORS[i]} 12%, transparent)`,
                          color: AVATAR_COLORS[i],
                          border: `1px solid color-mix(in srgb, ${AVATAR_COLORS[i]} 15%, transparent)`,
                        }}
                      >
                        {row.avatar}
                      </div>
                      <div>
                        <p className="text-fg/60 font-medium">{row.name}</p>
                        <p className="text-[10px] text-fg/20">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-3 py-3 text-fg/35">{row.role}</td>
                  <td className="px-3 py-3 text-fg/50 text-right font-mono text-xs">{row.revenue}</td>
                  <td className="px-3 py-3 text-right font-mono text-xs" style={{ color: row.positive ? "var(--pastel-green)" : "var(--pastel-pink)", opacity: 0.65 }}>
                    {row.change}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-fg/[0.06]">
        <p className="text-xs text-fg/20">showing {DATA.length} of {DATA.length}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={[
                "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer",
                p === 1 ? "bg-fg/[0.08] text-fg/70" : "text-fg/25 hover:bg-fg/[0.04] hover:text-fg/50",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Key-Value List ──────────────────────────────────────────── */

function KeyValueList() {
  const items = [
    { key: "plan", value: "pro", color: "var(--pastel-blue)" },
    { key: "billing", value: "monthly", color: "var(--pastel-green)" },
    { key: "members", value: "12", color: "var(--pastel-purple)" },
    { key: "storage", value: "48 gb / 100 gb", color: "var(--pastel-orange)", bar: 48 },
  ];

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-fg/[0.04] last:border-0">
          <span className="text-xs text-fg/30">{item.key}</span>
          <div className="flex items-center gap-3">
            {item.bar !== undefined && (
              <div className="w-16 h-1 rounded-full bg-fg/[0.04] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.bar}%`, background: item.color, opacity: 0.4 }} />
              </div>
            )}
            <span className="text-xs text-fg/60 font-medium">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Stats Row ───────────────────────────────────────────────── */

function StatsRow() {
  const stats = [
    { label: "revenue", value: "$24.8k", change: "+12%", positive: true, color: "var(--pastel-green)" },
    { label: "users", value: "1,482", change: "+8%", positive: true, color: "var(--pastel-blue)" },
    { label: "conversion", value: "3.2%", change: "-0.4%", positive: false, color: "var(--pastel-pink)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-lg p-3">
          <p className="text-[10px] text-fg/25 uppercase tracking-widest">{s.label}</p>
          <p className="text-xl font-bold text-fg/70 font-mono mt-1">{s.value}</p>
          <p className="text-[10px] font-mono mt-1" style={{ color: s.color, opacity: 0.7 }}>{s.change}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Activity Feed ───────────────────────────────────────────── */

function ActivityFeed() {
  const items = [
    { user: "alice", action: "pushed 3 commits to", target: "main", time: "2m ago", color: "var(--pastel-green)" },
    { user: "bob", action: "opened PR", target: "#142", time: "15m ago", color: "var(--pastel-blue)" },
    { user: "carol", action: "commented on", target: "#138", time: "1h ago", color: "var(--pastel-purple)" },
    { user: "elena", action: "deployed to", target: "production", time: "3h ago", color: "var(--pastel-orange)" },
  ];

  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 py-3 border-b border-fg/[0.04] last:border-0">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.color, opacity: 0.6 }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-fg/45">
              <span className="text-fg/60 font-medium">{item.user}</span>
              {" "}{item.action}{" "}
              <span className="font-mono text-fg/50">{item.target}</span>
            </p>
            <p className="text-[10px] text-fg/20 mt-0.5">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function TablePage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 450, height: 450, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "2%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-12 pb-10 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold tracking-tighter text-fg">data table</h1>
            <p className="mt-2 text-sm text-fg/30">sortable, selectable rows with avatars, status badges, and pagination.</p>
            <code className="inline-block mt-3 text-[11px] font-mono px-3 py-1.5 rounded-lg glass text-fg/30 select-all">npx sandbox-ui add table</code>
          </div>

          {/* Stats overview */}
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">overview</h2>
            <StatsRow />
          </section>

          {/* Main table */}
          <section className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">interactive</h2>
            <GlassTable />
          </section>

          {/* Variants row — key-value, activity feed */}
          <section className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg/25 mb-4">variants</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-start">
              <Card className="flex flex-col">
                <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25 mb-4">key-value list</p>
                <KeyValueList />
              </Card>
              <Card className="flex flex-col">
                <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25 mb-4">activity feed</p>
                <ActivityFeed />
              </Card>
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
