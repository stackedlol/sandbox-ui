"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

/* ─── Constants ──────────────────────────────────────────────── */

const DAYS = ["su", "mo", "tu", "we", "th", "fr", "sa"];
const DAYS_FULL = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const MONTHS_SHORT = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

interface CalEvent {
  title: string;
  time: string;
  end: string;
  color: string;
  day: number;
  hour: number;
  month?: number; // 0-indexed, defaults to current
}

const EVENTS: CalEvent[] = [
  { title: "design review", time: "10:00", end: "11:30", color: "var(--pastel-blue)", day: 3, hour: 10 },
  { title: "standup", time: "14:00", end: "14:15", color: "var(--pastel-green)", day: 5, hour: 14 },
  { title: "team sync", time: "09:00", end: "09:30", color: "var(--pastel-purple)", day: 7, hour: 9 },
  { title: "sprint planning", time: "09:00", end: "10:00", color: "var(--pastel-purple)", day: 10, hour: 9 },
  { title: "lunch & learn", time: "12:00", end: "13:00", color: "var(--pastel-orange)", day: 12, hour: 12 },
  { title: "design review", time: "10:00", end: "11:00", color: "var(--pastel-blue)", day: 14, hour: 10 },
  { title: "code review", time: "15:00", end: "16:00", color: "var(--pastel-green)", day: 17, hour: 15 },
  { title: "1:1 with manager", time: "15:00", end: "15:30", color: "var(--pastel-pink)", day: 19, hour: 15 },
  { title: "deploy v2.4", time: "16:00", end: "17:00", color: "var(--pastel-yellow)", day: 21, hour: 16 },
  { title: "demo day", time: "14:00", end: "15:00", color: "var(--pastel-blue)", day: 24, hour: 14 },
  { title: "retro", time: "11:00", end: "12:00", color: "var(--pastel-green)", day: 26, hour: 11 },
  { title: "planning poker", time: "10:00", end: "11:00", color: "var(--pastel-orange)", day: 28, hour: 10 },
];

/* ─── Roadmap Data ───────────────────────────────────────────── */

interface RoadmapItem {
  id: string;
  title: string;
  team: string;
  status: "done" | "in-progress" | "planned";
  color: string;
  startWeek: number; // 0-based offset from timeline start
  duration: number;  // in weeks
  icon: string;
}

const ROADMAP_TEAMS = ["design", "engineering", "product", "marketing"];
const TEAM_COLORS: Record<string, string> = {
  design: "var(--pastel-pink)",
  engineering: "var(--pastel-blue)",
  product: "var(--pastel-purple)",
  marketing: "var(--pastel-green)",
};

const ROADMAP_ITEMS: RoadmapItem[] = [
  { id: "r1", title: "Design System v3", team: "design", status: "done", color: "var(--pastel-pink)", startWeek: 0, duration: 3, icon: "◐" },
  { id: "r2", title: "Component Library", team: "design", status: "in-progress", color: "var(--pastel-pink)", startWeek: 3, duration: 4, icon: "◑" },
  { id: "r3", title: "Brand Refresh", team: "design", status: "planned", color: "var(--pastel-pink)", startWeek: 8, duration: 3, icon: "◒" },
  { id: "r4", title: "API v2 Migration", team: "engineering", status: "done", color: "var(--pastel-blue)", startWeek: 0, duration: 4, icon: "⚡" },
  { id: "r5", title: "Performance Sprint", team: "engineering", status: "in-progress", color: "var(--pastel-blue)", startWeek: 4, duration: 3, icon: "⇄" },
  { id: "r6", title: "Auth Overhaul", team: "engineering", status: "in-progress", color: "var(--pastel-blue)", startWeek: 5, duration: 5, icon: "◆" },
  { id: "r7", title: "Edge Functions", team: "engineering", status: "planned", color: "var(--pastel-blue)", startWeek: 9, duration: 3, icon: "↗" },
  { id: "r8", title: "Q1 Roadmap", team: "product", status: "done", color: "var(--pastel-purple)", startWeek: 0, duration: 2, icon: "◎" },
  { id: "r9", title: "User Research", team: "product", status: "done", color: "var(--pastel-purple)", startWeek: 2, duration: 3, icon: "☞" },
  { id: "r10", title: "Pricing Redesign", team: "product", status: "in-progress", color: "var(--pastel-purple)", startWeek: 6, duration: 4, icon: "◻" },
  { id: "r11", title: "Launch Campaign", team: "marketing", status: "planned", color: "var(--pastel-green)", startWeek: 5, duration: 3, icon: "✦" },
  { id: "r12", title: "Blog Series", team: "marketing", status: "in-progress", color: "var(--pastel-green)", startWeek: 2, duration: 6, icon: "✓" },
  { id: "r13", title: "Conference Prep", team: "marketing", status: "planned", color: "var(--pastel-green)", startWeek: 9, duration: 2, icon: "◈" },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ── NOTION ROADMAP TIMELINE ─────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function RoadmapTimeline() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const TOTAL_WEEKS = 12;
  const COL_W = 72; // px per week column
  const ROW_H = 44;
  const HEADER_H = 56;

  // Generate week labels starting from ~now
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Monday of current week

  const weeks = useMemo(() => {
    return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i * 7);
      return {
        label: `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`,
        month: d.getMonth(),
        isCurrentWeek: i === 0,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group items by team
  const grouped = useMemo(() => {
    return ROADMAP_TEAMS.map(team => ({
      team,
      items: ROADMAP_ITEMS.filter(i => i.team === team),
    }));
  }, []);

  // Current week indicator position (fraction through the current week)
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0
  const todayOffset = (0 + dayOfWeek / 7) * COL_W;

  const selItem = selectedItem ? ROADMAP_ITEMS.find(i => i.id === selectedItem) : null;

  const statusIcons: Record<string, { label: string; color: string }> = {
    "done": { label: "done", color: "var(--pastel-green)" },
    "in-progress": { label: "in progress", color: "var(--pastel-orange)" },
    "planned": { label: "planned", color: "var(--fg)" },
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Title bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-fg/60">Roadmap</p>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md glass text-fg/25">Q1–Q2 {now.getFullYear()}</span>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(statusIcons).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: val.color, opacity: key === "planned" ? 0.2 : 0.6 }} />
              <span className="text-[10px] font-mono text-fg/25">{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Left: Team labels */}
        <div className="shrink-0 w-[140px] border-r border-[var(--glass-border)]">
          {/* Header spacer */}
          <div style={{ height: HEADER_H }} className="border-b border-[var(--glass-border)] px-4 flex items-end pb-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-fg/20">team</span>
          </div>
          {grouped.map(g => {
            const rowCount = Math.max(g.items.length, 1);
            return (
              <div
                key={g.team}
                className="border-b border-[var(--glass-border)] px-4 flex items-center gap-2"
                style={{ height: rowCount * ROW_H + 16 }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: TEAM_COLORS[g.team], opacity: 0.6 }} />
                <span className="text-[12px] font-medium text-fg/45 capitalize">{g.team}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Timeline grid */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ width: TOTAL_WEEKS * COL_W, position: "relative" }}>
            {/* Week headers */}
            <div className="flex border-b border-[var(--glass-border)]" style={{ height: HEADER_H }}>
              {weeks.map((w, i) => (
                <div
                  key={i}
                  className="shrink-0 flex flex-col items-center justify-end pb-2 border-r border-[var(--glass-border)]"
                  style={{ width: COL_W, opacity: w.isCurrentWeek ? 1 : 0.7 }}
                >
                  <span className="text-[10px] font-mono text-fg/30" style={{ color: w.isCurrentWeek ? "var(--pastel-blue)" : undefined }}>{w.label}</span>
                </div>
              ))}
            </div>

            {/* Today marker */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-10"
              style={{ left: todayOffset, width: 1 }}
            >
              <div className="w-px h-full" style={{ background: "var(--pastel-blue)", opacity: 0.25 }} />
              <div className="absolute top-1 -translate-x-1/2 text-[8px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: "color-mix(in srgb, var(--pastel-blue) 15%, var(--glass-bg-strong))", color: "var(--pastel-blue)", opacity: 0.8 }}>
                today
              </div>
            </div>

            {/* Rows */}
            {grouped.map(g => {
              const rowCount = Math.max(g.items.length, 1);
              return (
                <div key={g.team} className="relative border-b border-[var(--glass-border)]" style={{ height: rowCount * ROW_H + 16 }}>
                  {/* Vertical grid lines */}
                  {weeks.map((_, i) => (
                    <div key={i} className="absolute top-0 bottom-0 border-r border-[var(--glass-border)]" style={{ left: i * COL_W, width: COL_W, opacity: 0.5 }} />
                  ))}

                  {/* Items */}
                  {g.items.map((item, idx) => {
                    const left = item.startWeek * COL_W + 4;
                    const width = item.duration * COL_W - 8;
                    const top = idx * ROW_H + 8;
                    const isHov = hoveredItem === item.id;
                    const isSel = selectedItem === item.id;
                    const isDone = item.status === "done";
                    const isPlanned = item.status === "planned";

                    return (
                      <div
                        key={item.id}
                        className="absolute rounded-lg flex items-center gap-2 px-3 cursor-pointer transition-all duration-200 group"
                        style={{
                          left,
                          top,
                          width,
                          height: ROW_H - 12,
                          background: isSel
                            ? `color-mix(in srgb, ${item.color} 18%, var(--glass-bg-strong))`
                            : isHov
                              ? `color-mix(in srgb, ${item.color} 12%, var(--glass-bg))`
                              : `color-mix(in srgb, ${item.color} 6%, var(--glass-bg))`,
                          border: `1px solid ${isSel ? `color-mix(in srgb, ${item.color} 30%, transparent)` : isHov ? `color-mix(in srgb, ${item.color} 15%, transparent)` : "var(--glass-border)"}`,
                          boxShadow: isSel ? `0 4px 16px color-mix(in srgb, ${item.color} 8%, transparent)` : "none",
                          opacity: isDone && !isHov && !isSel ? 0.55 : isPlanned && !isHov && !isSel ? 0.5 : 1,
                          zIndex: isSel ? 5 : isHov ? 3 : 1,
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      >
                        {/* Left accent */}
                        <div className="absolute left-0 top-2 bottom-2 w-[2.5px] rounded-full" style={{ background: item.color, opacity: isSel ? 0.7 : 0.35 }} />

                        <span className="text-xs ml-1" style={{ color: item.color, opacity: 0.7 }}>{item.icon}</span>
                        <span className={`text-[11px] font-medium truncate ${isDone ? "line-through" : ""}`} style={{ color: "var(--fg)", opacity: isSel ? 0.7 : 0.5 }}>{item.title}</span>

                        {/* Status dot */}
                        <div className="ml-auto shrink-0 flex items-center gap-1">
                          {isDone && <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none"><circle cx="6" cy="6" r="5" stroke="var(--pastel-green)" strokeWidth="1.5" strokeOpacity={0.5} /><path d="M3.5 6L5.5 8L8.5 4" stroke="var(--pastel-green)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.6} /></svg>}
                          {item.status === "in-progress" && (
                            <div className="w-3 h-3 rounded-full border-[1.5px] border-r-transparent animate-spin" style={{ borderColor: "var(--pastel-orange)", borderRightColor: "transparent", opacity: 0.5 }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Month separator labels */}
            {(() => {
              const monthLabels: { label: string; left: number }[] = [];
              let lastMonth = -1;
              weeks.forEach((w, i) => {
                if (w.month !== lastMonth) {
                  monthLabels.push({ label: MONTHS[w.month], left: i * COL_W });
                  lastMonth = w.month;
                }
              });
              return monthLabels.map(ml => (
                <div key={ml.label + ml.left} className="absolute pointer-events-none" style={{ left: ml.left + 6, top: 6 }}>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-fg/15">{ml.label}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Selection detail bar */}
      {selItem && (
        <div className="px-5 py-3 border-t border-[var(--glass-border)] flex items-center gap-4" style={{ background: `color-mix(in srgb, ${selItem.color} 3%, transparent)` }}>
          <div className="flex items-center gap-2">
            <span className="text-base" style={{ color: selItem.color }}>{selItem.icon}</span>
            <div>
              <p className="text-[13px] font-semibold text-fg/60">{selItem.title}</p>
              <p className="text-[10px] font-mono text-fg/25 capitalize">{selItem.team} · {selItem.status}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] font-mono text-fg/25">week {selItem.startWeek + 1} → {selItem.startWeek + selItem.duration}</span>
            <span className="text-[10px] font-mono text-fg/25">{selItem.duration}w duration</span>
            <div className="w-16 h-1.5 rounded-full bg-fg/[0.06] overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: selItem.status === "done" ? "100%" : selItem.status === "in-progress" ? "55%" : "0%",
                background: selItem.color,
                opacity: 0.5,
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── FULL MONTH CALENDAR ─────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function FullCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const todayDate = now.getDate();

  // Previous month filler days
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const prevDays = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + 1 + i);
  // Next month filler days
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const nextDays = Array.from({ length: totalCells - firstDay - daysInMonth }, (_, i) => i + 1);

  // Events for this month
  const monthEvents = EVENTS.filter(e => e.month === undefined || e.month === month);
  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalEvent[]>();
    monthEvents.forEach(e => {
      const arr = map.get(e.day) || [];
      arr.push(e);
      map.set(e.day, arr);
    });
    return map;
  }, [monthEvents]);

  const totalEventsThisMonth = useMemo(() => monthEvents.length, [monthEvents]);
  const selectedDayEvents = selectedDay ? eventsByDay.get(selectedDay) || [] : [];

  // Which week row the current day falls on (for the highlight band)
  const todayWeekRow = isCurrentMonth ? Math.floor((firstDay + todayDate - 1) / 7) : -1;
  const totalWeekRows = Math.ceil((firstDay + daysInMonth) / 7);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }
  function goToToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDay(now.getDate());
  }

  // Helper: is this cell index a weekend column (0=sun, 6=sat)
  const isWeekend = (cellIndex: number) => {
    const col = cellIndex % 7;
    return col === 0 || col === 6;
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-[var(--glass-border)]">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-fg/60 capitalize">{MONTHS[month]}</h2>
          <span className="text-sm font-mono text-fg/20">{year}</span>
          {isCurrentMonth && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md" style={{ background: "color-mix(in srgb, var(--pastel-blue) 12%, transparent)", color: "var(--pastel-blue)", opacity: 0.8 }}>
              {totalEventsThisMonth} events
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={goToToday} className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono glass text-fg/35 hover:text-fg/60 hover:bg-fg/[0.04] transition-all cursor-pointer border border-[var(--glass-border)]">today</button>
          <div className="flex items-center ml-1">
            <button onClick={prevMonth} className="w-8 h-8 rounded-l-lg flex items-center justify-center text-fg/30 hover:text-fg/60 hover:bg-fg/[0.06] transition-all cursor-pointer border border-[var(--glass-border)]">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8L10 13" /></svg>
            </button>
            <button onClick={nextMonth} className="w-8 h-8 rounded-r-lg flex items-center justify-center text-fg/30 hover:text-fg/60 hover:bg-fg/[0.06] transition-all cursor-pointer border border-[var(--glass-border)] -ml-px">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3L11 8L6 13" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Calendar grid */}
        <div className="flex-1 p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_FULL.map((d, i) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium uppercase py-2"
                style={{
                  color: (i === 0 || i === 6) ? "var(--pastel-pink)" : "var(--fg)",
                  opacity: (i === 0 || i === 6) ? 0.45 : 0.3,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                {d.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px rounded-2xl overflow-hidden" style={{ background: "var(--glass-border)" }}>
            {/* Previous month */}
            {prevDays.map((d, i) => (
              <div key={`prev-${d}`} className="min-h-[100px] p-2.5" style={{ background: isWeekend(i) ? "var(--glass-bg)" : "var(--glass-bg)" }}>
                <span className="text-[11px] font-mono text-fg/12">{d}</span>
              </div>
            ))}
            {/* Current month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const cellIndex = firstDay + i;
              const isToday = isCurrentMonth && day === todayDate;
              const isSel = day === selectedDay;
              const isHov = day === hoveredDay && !isSel;
              const dayEvents = eventsByDay.get(day) || [];
              const weekRow = Math.floor(cellIndex / 7);
              const isCurrentWeekRow = weekRow === todayWeekRow;
              const weekend = isWeekend(cellIndex);

              return (
                <div
                  key={day}
                  className="min-h-[100px] p-2.5 cursor-pointer transition-all duration-200 relative"
                  style={{
                    background: isSel
                      ? "color-mix(in srgb, var(--pastel-blue) 8%, var(--glass-bg-strong))"
                      : isHov
                        ? "color-mix(in srgb, var(--fg) 3%, var(--glass-bg-strong))"
                        : weekend
                          ? "color-mix(in srgb, var(--fg) 2%, var(--glass-bg-strong))"
                          : "var(--glass-bg-strong)",
                  }}
                  onClick={() => setSelectedDay(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Day number */}
                  <div className="flex items-start justify-between mb-1.5">
                    <span
                      className="text-[13px] inline-flex items-center justify-center transition-all"
                      style={{
                        color: isToday ? "white" : isSel ? "var(--pastel-blue)" : "var(--fg)",
                        opacity: isToday ? 1 : isSel ? 0.9 : isHov ? 0.65 : 0.45,
                        fontWeight: isToday || isSel ? 700 : 500,
                        ...(isToday ? {
                          background: "var(--pastel-blue)",
                          borderRadius: "8px",
                          width: "26px",
                          height: "26px",
                        } : {}),
                      }}
                    >
                      {day}
                    </span>
                    {/* Event count badge */}
                    {dayEvents.length > 0 && !isSel && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: `color-mix(in srgb, ${dayEvents[0].color} 10%, transparent)`, color: dayEvents[0].color, opacity: 0.5 }}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Events */}
                  <div className="flex flex-col gap-[3px]">
                    {dayEvents.slice(0, 3).map((ev, ei) => (
                      <div
                        key={ei}
                        className="rounded-[5px] px-1.5 py-[3px] truncate text-[9px] font-medium transition-all flex items-center gap-1"
                        style={{
                          background: `color-mix(in srgb, ${ev.color} ${isSel ? 20 : isHov ? 16 : 12}%, transparent)`,
                          borderLeft: `2px solid ${ev.color}`,
                          borderLeftStyle: "solid",
                          opacity: isSel ? 1 : isHov ? 0.85 : 0.75,
                        }}
                      >
                        <span className="text-[8px] font-mono" style={{ color: ev.color, opacity: 0.8 }}>{ev.time.slice(0, 5)}</span>
                        <span className="truncate" style={{ color: "var(--fg)", opacity: 0.65 }}>{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[8px] font-mono text-fg/20 pl-1">+{dayEvents.length - 3} more</span>
                    )}
                  </div>

                  {/* Selection ring */}
                  {isSel && <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 0 2px color-mix(in srgb, var(--pastel-blue) 30%, transparent)" }} />}
                  {/* Hover ring */}
                  {isHov && <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--fg) 8%, transparent)" }} />}
                </div>
              );
            })}
            {/* Next month */}
            {nextDays.map((d, i) => {
              const cellIndex = firstDay + daysInMonth + i;
              return (
                <div key={`next-${d}`} className="min-h-[100px] p-2.5" style={{ background: "var(--glass-bg)" }}>
                  <span className="text-[11px] font-mono text-fg/10">{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: selected day detail */}
        <div className="w-[300px] shrink-0 border-l border-[var(--glass-border)] hidden lg:flex flex-col">
          {selectedDay ? (
            <div className="flex-1 flex flex-col">
              {/* Day header */}
              <div className="px-5 pt-5 pb-4 border-b border-[var(--glass-border)]">
                <div className="flex items-end gap-3 mb-1">
                  <p className="text-3xl font-bold text-fg/55 font-mono leading-none">{selectedDay}</p>
                  <p className="text-sm text-fg/25 capitalize leading-tight mb-0.5">
                    {DAYS_FULL[new Date(year, month, selectedDay).getDay()]}
                  </p>
                </div>
                <p className="text-[11px] text-fg/20 font-mono mt-1 capitalize">{MONTHS[month]} {year}</p>
              </div>

              {/* Mini day timeline (8am-6pm) */}
              <div className="px-5 pt-4 pb-3 border-b border-[var(--glass-border)]">
                <p className="text-[9px] font-mono uppercase tracking-widest text-fg/20 mb-3">schedule</p>
                <div className="relative" style={{ height: 120 }}>
                  {/* Hour lines */}
                  {[8, 10, 12, 14, 16, 18].map(h => {
                    const top = ((h - 8) / 10) * 120;
                    return (
                      <div key={h} className="absolute left-0 right-0 flex items-center" style={{ top }}>
                        <span className="text-[8px] font-mono text-fg/15 w-6 shrink-0">{h}:00</span>
                        <div className="flex-1 h-px bg-fg/[0.05]" />
                      </div>
                    );
                  })}
                  {/* Event blocks */}
                  {selectedDayEvents.map((ev, i) => {
                    const startH = ev.hour;
                    const endMatch = ev.end.match(/^(\d+)/);
                    const endH = endMatch ? parseInt(endMatch[1]) : startH + 1;
                    const top = ((startH - 8) / 10) * 120;
                    const height = Math.max(((endH - startH) / 10) * 120, 14);
                    return (
                      <div
                        key={i}
                        className="absolute left-7 right-0 rounded-md px-2 py-0.5 truncate transition-all"
                        style={{
                          top,
                          height,
                          background: `color-mix(in srgb, ${ev.color} 15%, transparent)`,
                          borderLeft: `2.5px solid ${ev.color}`,
                          opacity: 0.85,
                        }}
                      >
                        <span className="text-[9px] font-medium" style={{ color: "var(--fg)", opacity: 0.6 }}>{ev.title}</span>
                      </div>
                    );
                  })}
                  {/* Current time line */}
                  {isCurrentMonth && selectedDay === todayDate && (() => {
                    const nowH = now.getHours() + now.getMinutes() / 60;
                    if (nowH < 8 || nowH > 18) return null;
                    const top = ((nowH - 8) / 10) * 120;
                    return (
                      <div className="absolute left-6 right-0" style={{ top }}>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full" style={{ background: "var(--pastel-blue)" }} />
                          <div className="flex-1 h-[1.5px]" style={{ background: "var(--pastel-blue)", opacity: 0.5 }} />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Event list */}
              <div className="flex-1 px-5 pt-4 pb-4 overflow-y-auto">
                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedDayEvents.map((ev, i) => (
                      <div key={i} className="rounded-xl p-3.5 transition-all group hover:scale-[1.01]" style={{ background: `color-mix(in srgb, ${ev.color} 5%, var(--glass-bg))`, border: `1px solid color-mix(in srgb, ${ev.color} 8%, transparent)` }}>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: ev.color, opacity: 0.6, boxShadow: `0 0 6px ${ev.color}` }} />
                          <p className="text-[13px] font-medium text-fg/60">{ev.title}</p>
                        </div>
                        <div className="ml-5 flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: `color-mix(in srgb, ${ev.color} 8%, transparent)`, color: ev.color, opacity: 0.7 }}>
                            {ev.time}
                          </span>
                          <span className="text-[10px] text-fg/15">→</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: `color-mix(in srgb, ${ev.color} 8%, transparent)`, color: ev.color, opacity: 0.7 }}>
                            {ev.end}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-fg/15">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="3" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="12" cy="15" r="1" fill="currentColor" />
                    </svg>
                    <p className="text-[11px] font-mono">no events</p>
                    <p className="text-[9px] font-mono text-fg/10 mt-0.5">enjoy the free time</p>
                  </div>
                )}
              </div>

              {/* Day stats footer */}
              <div className="px-5 py-3 border-t border-[var(--glass-border)] shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-fg/20">
                    <span>{selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? "s" : ""}</span>
                    <span>day {selectedDay}/{daysInMonth}</span>
                  </div>
                  <div className="w-20 h-1.5 rounded-full bg-fg/[0.04] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(selectedDay / daysInMonth) * 100}%`, background: "var(--pastel-blue)", opacity: 0.35 }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-fg/15 py-12 px-6">
              <svg viewBox="0 0 24 24" className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className="text-[12px] font-mono text-fg/20">select a day</p>
              <p className="text-[10px] font-mono text-fg/10 mt-1 text-center">click any day to view its schedule and events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── LIVE ANALOG CLOCK ───────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function AnalogClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = time.getSeconds() + time.getMilliseconds() / 1000;
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;
  const cx = 100, cy = 100, r = 80;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center h-full">
      <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25 mb-4 self-start">live clock</p>
      <svg viewBox="0 0 200 200" className="w-full flex-1 max-h-[320px]">
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="var(--fg)" strokeWidth="0.5" strokeOpacity={0.06} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--fg)" strokeWidth="0.5" strokeOpacity={0.08} />

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = cx + Math.cos(angle) * (r - 6);
          const y1 = cy + Math.sin(angle) * (r - 6);
          const x2 = cx + Math.cos(angle) * (r - (i % 3 === 0 ? 14 : 10));
          const y2 = cy + Math.sin(angle) * (r - (i % 3 === 0 ? 14 : 10));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--fg)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8} strokeOpacity={i % 3 === 0 ? 0.3 : 0.12} strokeLinecap="round" />;
        })}

        {/* Hour hand */}
        <line
          x1={cx} y1={cy}
          x2={cx + Math.cos((h * 30 - 90) * Math.PI / 180) * 42}
          y2={cy + Math.sin((h * 30 - 90) * Math.PI / 180) * 42}
          stroke="var(--fg)" strokeWidth="2.5" strokeOpacity={0.6} strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1={cx} y1={cy}
          x2={cx + Math.cos((m * 6 - 90) * Math.PI / 180) * 58}
          y2={cy + Math.sin((m * 6 - 90) * Math.PI / 180) * 58}
          stroke="var(--fg)" strokeWidth="1.5" strokeOpacity={0.45} strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1={cx} y1={cy}
          x2={cx + Math.cos((s * 6 - 90) * Math.PI / 180) * 66}
          y2={cy + Math.sin((s * 6 - 90) * Math.PI / 180) * 66}
          stroke="var(--pastel-blue)" strokeWidth="0.8" strokeOpacity={0.6} strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill="var(--pastel-blue)" fillOpacity={0.5} />
        <circle cx={cx} cy={cy} r="1.5" fill="var(--fg)" fillOpacity={0.6} />

      </svg>
      <p className="mt-3 text-lg font-mono text-fg/50 tabular-nums tracking-wider">
        {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── RADIAL DATE PICKER ──────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function MonthCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<number>(now.getDate());
  const [hovered, setHovered] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const todayDate = now.getDate();
  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalEvent[]>();
    const monthEvents = EVENTS.filter(e => e.month === undefined || e.month === month);
    monthEvents.forEach(e => {
      const arr = map.get(e.day) || [];
      arr.push(e);
      map.set(e.day, arr);
    });
    return map;
  }, [month]);

  function prevM() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setSelected(1); }
  function nextM() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); setSelected(1); }
  function goToday() { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelected(now.getDate()); }

  const selectedEvents = eventsByDay.get(selected) || [];
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const trailingDays = totalCells - firstDay - daysInMonth;

  return (
    <div className="glass rounded-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between shrink-0">
        <div>
          <p className="text-base font-bold text-fg/60 capitalize">{MONTHS[month]}</p>
          <p className="text-[10px] font-mono text-fg/20">{year}</p>
        </div>
        <div className="flex items-center gap-1">
          {isCurrentMonth && selected === todayDate ? null : (
            <button onClick={goToday} className="h-6 px-2 rounded-md text-[9px] font-mono text-fg/25 hover:text-fg/50 hover:bg-fg/[0.04] transition-all cursor-pointer">today</button>
          )}
          <button onClick={prevM} className="w-6 h-6 rounded-md flex items-center justify-center text-fg/25 hover:text-fg/50 hover:bg-fg/[0.04] transition-all cursor-pointer">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8L10 13" /></svg>
          </button>
          <button onClick={nextM} className="w-6 h-6 rounded-md flex items-center justify-center text-fg/25 hover:text-fg/50 hover:bg-fg/[0.04] transition-all cursor-pointer">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3L11 8L6 13" /></svg>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 mb-0.5">
        {DAYS.map((d, i) => (
          <div key={d} className="text-center text-[9px] font-mono uppercase py-1.5 font-medium" style={{ color: (i === 0 || i === 6) ? "var(--pastel-pink)" : "var(--fg)", opacity: (i === 0 || i === 6) ? 0.35 : 0.2 }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px flex-1 px-3 pb-2">
        {/* Previous month trailing */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`prev-${i}`} className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-mono text-fg/10">{prevMonthDays - firstDay + 1 + i}</span>
          </div>
        ))}
        {/* Current month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === todayDate;
          const isSel = day === selected;
          const isHov = day === hovered && !isSel;
          const dayEvents = eventsByDay.get(day) || [];
          const col = (firstDay + i) % 7;
          const isWeekend = col === 0 || col === 6;
          const evColor = dayEvents[0]?.color || "var(--pastel-blue)";

          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              onMouseEnter={() => setHovered(day)}
              onMouseLeave={() => setHovered(null)}
              className="relative rounded-lg flex flex-col items-center justify-center py-1 transition-all duration-150 cursor-pointer"
              style={{
                background: isSel
                  ? `color-mix(in srgb, ${evColor} 16%, transparent)`
                  : isHov
                    ? "color-mix(in srgb, var(--fg) 4%, transparent)"
                    : "transparent",
              }}
            >
              <span
                className="text-[13px] leading-none inline-flex items-center justify-center transition-all"
                style={{
                  color: isToday ? "white" : isSel ? evColor : isWeekend ? "var(--fg)" : "var(--fg)",
                  opacity: isToday ? 1 : isSel ? 0.9 : isHov ? 0.6 : isWeekend ? 0.25 : 0.4,
                  fontWeight: isToday || isSel ? 700 : 500,
                  ...(isToday ? { background: "var(--pastel-blue)", borderRadius: "7px", width: "26px", height: "26px" } : {}),
                }}
              >
                {day}
              </span>
              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex gap-[3px] mt-1 h-[4px] items-center">
                  {dayEvents.slice(0, 3).map((ev, ei) => (
                    <span
                      key={ei}
                      className="rounded-full transition-all"
                      style={{
                        width: isSel ? 8 : 4,
                        height: isSel ? 2.5 : 4,
                        background: ev.color,
                        opacity: isSel ? 0.7 : isHov ? 0.6 : 0.4,
                        borderRadius: isSel ? "1px" : "50%",
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Selection ring */}
              {isSel && <div className="absolute inset-0.5 rounded-lg pointer-events-none" style={{ border: `1.5px solid color-mix(in srgb, ${evColor} 30%, transparent)` }} />}
            </button>
          );
        })}
        {/* Next month leading */}
        {Array.from({ length: trailingDays }, (_, i) => (
          <div key={`next-${i}`} className="flex flex-col items-center justify-center py-1">
            <span className="text-[11px] font-mono text-fg/10">{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      <div className="px-4 py-3 border-t border-[var(--glass-border)] shrink-0">
        {selectedEvents.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[9px] font-mono uppercase tracking-widest text-fg/20 mb-1.5">
              {MONTHS_SHORT[month]} {selected} · {selectedEvents.length} event{selectedEvents.length > 1 ? "s" : ""}
            </p>
            {selectedEvents.slice(0, 3).map((ev, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: `color-mix(in srgb, ${ev.color} 7%, transparent)`, border: `1px solid color-mix(in srgb, ${ev.color} 8%, transparent)` }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.color, opacity: 0.6, boxShadow: `0 0 6px ${ev.color}` }} />
                <span className="text-[11px] font-medium text-fg/55 truncate flex-1">{ev.title}</span>
                <span className="text-[9px] font-mono text-fg/25 shrink-0">{ev.time} – {ev.end}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-fg/15">{MONTHS_SHORT[month]} {selected}</span>
            <span className="text-[10px] font-mono text-fg/10">· no events</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── HEATMAP YEAR VIEW ───────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function YearHeatmap() {
  const now = new Date();
  const year = now.getFullYear();

  // Generate heatmap data — seeded pseudo-random
  const data = useMemo(() => {
    const d: { month: number; day: number; level: number }[] = [];
    let seed = 42;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };
    for (let m = 0; m < 12; m++) {
      const days = getDaysInMonth(year, m);
      for (let day = 1; day <= days; day++) {
        d.push({ month: m, day, level: rand() < 0.3 ? 0 : rand() < 0.5 ? 1 : rand() < 0.7 ? 2 : 3 });
      }
    }
    return d;
  }, [year]);

  const cellSize = 10, gap = 2;
  const colors = ["var(--fg)", "var(--pastel-green)", "var(--pastel-blue)", "var(--pastel-purple)"];
  const opacities = [0.04, 0.25, 0.45, 0.65];

  // Group by week
  const jan1 = new Date(year, 0, 1);
  const startOffset = jan1.getDay();

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25">{year} activity</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] text-fg/20">less</span>
          {[0, 1, 2, 3].map(l => (
            <span key={l} className="w-2 h-2 rounded-[2px]" style={{ background: colors[l], opacity: opacities[l] }} />
          ))}
          <span className="text-[8px] text-fg/20">more</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width={53 * (cellSize + gap) + 30} height={7 * (cellSize + gap) + 20} className="block">
          {/* Month labels */}
          {MONTHS_SHORT.map((m, mi) => {
            const firstOfMonth = new Date(year, mi, 1);
            const dayOfYear = Math.floor((firstOfMonth.getTime() - jan1.getTime()) / 86400000);
            const week = Math.floor((dayOfYear + startOffset) / 7);
            return (
              <text key={m} x={week * (cellSize + gap) + 30} y={10} fontSize="8" fill="var(--fg)" fillOpacity={0.2} fontFamily="monospace">
                {m}
              </text>
            );
          })}
          {/* Day labels */}
          {["", "mo", "", "we", "", "fr", ""].map((d, i) => (
            <text key={i} x={16} y={18 + i * (cellSize + gap) + cellSize / 2} fontSize="7" fill="var(--fg)" fillOpacity={0.15} fontFamily="monospace" textAnchor="end" dominantBaseline="central">
              {d}
            </text>
          ))}
          {/* Cells */}
          {data.map((d, i) => {
            const date = new Date(year, d.month, d.day);
            const dayOfYear = Math.floor((date.getTime() - jan1.getTime()) / 86400000);
            const week = Math.floor((dayOfYear + startOffset) / 7);
            const dow = date.getDay();
            const isToday = d.month === now.getMonth() && d.day === now.getDate();
            return (
              <rect
                key={i}
                x={week * (cellSize + gap) + 30}
                y={dow * (cellSize + gap) + 16}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={colors[d.level]}
                fillOpacity={opacities[d.level]}
                stroke={isToday ? "var(--pastel-blue)" : "none"}
                strokeWidth={isToday ? 1 : 0}
                strokeOpacity={isToday ? 0.6 : 0}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── EVENT TIMELINE ──────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function EventTimeline() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25 mb-5">upcoming</p>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-fg/[0.08]" />

        <div className="space-y-0">
          {EVENTS.map((e, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={e.title}
                className="relative flex items-start gap-4 py-3 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isHovered ? `color-mix(in srgb, ${e.color} 20%, transparent)` : `color-mix(in srgb, ${e.color} 8%, transparent)`,
                      boxShadow: isHovered ? `0 0 16px color-mix(in srgb, ${e.color} 20%, transparent)` : "none",
                    }}
                  >
                    <div
                      className="w-[8px] h-[8px] rounded-full transition-all duration-300"
                      style={{
                        background: e.color,
                        opacity: isHovered ? 0.8 : 0.4,
                        transform: isHovered ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: isHovered ? `color-mix(in srgb, ${e.color} 6%, var(--glass-bg))` : "transparent",
                    border: `1px solid ${isHovered ? `color-mix(in srgb, ${e.color} 12%, transparent)` : "transparent"}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-fg/60">{e.title}</p>
                    <span className="text-[10px] font-mono text-fg/20">{e.time} — {e.end}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `color-mix(in srgb, ${e.color} 10%, transparent)`, color: e.color, opacity: 0.7 }}>day {e.day}</span>
                    {/* Mini bar showing time position in day */}
                    <div className="flex-1 h-[3px] rounded-full bg-fg/[0.04] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${((e.hour - 8) / 10) * 100}%`,
                        background: e.color,
                        opacity: isHovered ? 0.5 : 0.2,
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── GRID CALENDAR (compact) ─────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function GridCalendar() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth());
  const [selected, setSelected] = useState<number>(now.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const isCurrentMonth = true;
  const todayDate = now.getDate();
  const eventDays = new Map(EVENTS.map(e => [e.day, e.color]));

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25">
          {MONTHS_SHORT[month]} {year}
        </p>
        <span className="text-[9px] font-mono px-2 py-1 rounded-md" style={{ background: "color-mix(in srgb, var(--pastel-blue) 10%, transparent)", color: "var(--pastel-blue)" }}>today: {todayDate}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[8px] font-mono uppercase text-fg/15 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }, (_, i) => <div key={`b-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === todayDate;
          const isSel = day === selected;
          const evtColor = eventDays.get(day);

          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className="relative aspect-square rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer flex items-center justify-center"
              style={{
                background: isSel
                  ? `color-mix(in srgb, ${evtColor || "var(--pastel-blue)"} 18%, transparent)`
                  : evtColor
                    ? `color-mix(in srgb, ${evtColor} 5%, transparent)`
                    : "transparent",
                color: isSel
                  ? (evtColor || "var(--pastel-blue)")
                  : isToday ? "var(--pastel-blue)" : "var(--fg)",
                opacity: isSel ? 1 : isToday ? 0.7 : 0.3,
                border: isSel ? `1px solid color-mix(in srgb, ${evtColor || "var(--pastel-blue)"} 25%, transparent)` : "1px solid transparent",
                boxShadow: isSel ? `0 0 12px color-mix(in srgb, ${evtColor || "var(--pastel-blue)"} 10%, transparent)` : "none",
              }}
            >
              {day}
              {evtColor && !isSel && (
                <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: evtColor, opacity: 0.7 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── WEEK RING (circular week view) ──────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function WeekRing() {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const busy = [6, 3, 4, 7, 5, 1, 0]; // hours busy per day
  const maxBusy = 8;
  const cx = 100, cy = 100;

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[10px] font-medium uppercase tracking-widest text-fg/25 mb-4">week load</p>
      <div className="flex items-center justify-center py-4">
        <svg viewBox="0 0 200 200" className="w-full max-w-[320px]">
          {/* Rings */}
          {[30, 50, 70].map(r => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--fg)" strokeWidth="0.5" strokeOpacity={0.04} />
          ))}

          {days.map((d, i) => {
            const angle = (i / 7) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const outerR = 25 + (busy[i] / maxBusy) * 55;
            const x = cx + Math.cos(rad) * outerR;
            const y = cy + Math.sin(rad) * outerR;
            const lx = cx + Math.cos(rad) * 85;
            const ly = cy + Math.sin(rad) * 85;
            const colors = ["var(--pastel-blue)", "var(--pastel-green)", "var(--pastel-purple)", "var(--pastel-orange)", "var(--pastel-pink)", "var(--pastel-yellow)", "var(--fg)"];
            const color = colors[i];

            return (
              <g key={d}>
                {/* Spoke */}
                <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth="3" strokeOpacity={0.2} strokeLinecap="round" />
                <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth="8" strokeOpacity={0.04} strokeLinecap="round" />
                {/* Endpoint */}
                <circle cx={x} cy={y} r="4" fill={color} fillOpacity={0.5} />
                <circle cx={x} cy={y} r="8" fill={color} fillOpacity={0.08} />
                {/* Label */}
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize="8" fill="var(--fg)" fillOpacity={0.25} fontFamily="monospace">{d}</text>
              </g>
            );
          })}

          {/* Connect endpoints */}
          <polygon
            points={days.map((_, i) => {
              const angle = (i / 7) * 360 - 90;
              const rad = angle * Math.PI / 180;
              const r = 25 + (busy[i] / maxBusy) * 55;
              return `${cx + Math.cos(rad) * r},${cy + Math.sin(rad) * r}`;
            }).join(" ")}
            fill="var(--pastel-blue)"
            fillOpacity={0.04}
            stroke="var(--pastel-blue)"
            strokeWidth="1"
            strokeOpacity={0.15}
          />

          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--fg)" fillOpacity={0.5} fontFamily="var(--font-display)">
            {busy.reduce((a, b) => a + b, 0)}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7" fill="var(--fg)" fillOpacity={0.2} fontFamily="monospace">
            hours
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── STATS ROW ───────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

function Stats() {
  const items = [
    { label: "events", value: "12", color: "var(--pastel-blue)", sub: "this week" },
    { label: "hours", value: "18.5", color: "var(--pastel-green)", sub: "booked" },
    { label: "free", value: "6", color: "var(--pastel-purple)", sub: "slots left" },
    { label: "focus", value: "73%", color: "var(--pastel-orange)", sub: "deep work" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(s => (
        <div key={s.label} className="glass rounded-2xl px-4 py-4 flex items-center gap-3">
          {/* Radial mini gauge */}
          <svg viewBox="0 0 36 36" className="w-9 h-9 shrink-0 -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--fg)" strokeWidth="2.5" strokeOpacity={0.05} />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke={s.color} strokeWidth="2.5" strokeOpacity={0.5}
              strokeDasharray={`${parseFloat(s.value) / (s.label === "focus" ? 100 : 24) * 88} 88`}
              strokeLinecap="round"
            />
          </svg>
          <div>
            <p className="text-lg font-bold font-mono leading-none" style={{ color: s.color, opacity: 0.7 }}>{s.value}</p>
            <p className="text-[9px] text-fg/20 font-mono mt-0.5">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ── PAGE ────────────────────────────────────────────────────  */
/* ═══════════════════════════════════════════════════════════════ */

export default function CalendarPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--orb-1)", filter: "blur(120px)", top: "-10%", left: "5%" }} />
        <div className="absolute rounded-full" style={{ width: 450, height: 450, background: "var(--orb-2)", filter: "blur(120px)", bottom: "-5%", right: "2%" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 pt-10 pb-10 sm:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tighter text-fg">calendar</h1>
              <p className="mt-2 text-sm text-fg/30 max-w-xl">full calendar, notion-style roadmap, live clock — everything you need for scheduling.</p>
            </div>
            <code className="hidden sm:inline-block text-[11px] font-mono px-4 py-2 rounded-xl glass text-fg/30 select-all border border-[var(--glass-border)]">npx sandbox-ui add calendar</code>
          </div>

          {/* Roadmap Timeline */}
          <section className="mb-5">
            <RoadmapTimeline />
          </section>

          {/* Row: Radial + Clock + Week Ring */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <MonthCalendar />
            <AnalogClock />
            <WeekRing />
          </section>

          <footer className="text-center text-sm text-fg/15 pt-12 pb-8">
            &copy; {new Date().getFullYear()} Sandbox
          </footer>
        </div>
      </div>
    </>
  );
}
