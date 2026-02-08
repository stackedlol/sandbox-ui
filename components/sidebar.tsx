"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useTheme } from "./theme-provider";

/* ─── Icons ───────────────────────────────────────────────────── */

function DiamondIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 1L16 9L9 17L2 9Z" />
    </svg>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7.5L9 2l6 5.5V15a1 1 0 01-1 1H4a1 1 0 01-1-1V7.5z" />
      <path d="M7 16V10h4v6" />
    </svg>
  );
}

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 2h5.5l8.5 8.5-5.5 5.5L2 7.5z" />
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ButtonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="14" height="8" rx="2" />
      <line x1="6" y1="9" x2="12" y2="9" />
    </svg>
  );
}

function CardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="14" height="12" rx="2" />
      <line x1="2" y1="7" x2="16" y2="7" />
    </svg>
  );
}

function NavIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <line x1="3" y1="5" x2="15" y2="5" />
      <line x1="3" y1="9" x2="15" y2="9" />
      <line x1="3" y1="13" x2="15" y2="13" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="14" height="13" rx="2" />
      <path d="M2 7h14" />
      <path d="M6 1v3M12 1v3" />
    </svg>
  );
}

function TableIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="14" height="14" rx="2" />
      <path d="M2 6h14M2 10h14M2 14h14M7 2v14M12 2v14" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 16V2" />
      <path d="M2 16h14" />
      <path d="M5 12l3-4 3 2 4-6" />
    </svg>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3.5A1.5 1.5 0 013.5 2H7a2 2 0 012 2v11.5a1 1 0 00-1-1H3.5A1.5 1.5 0 012 13V3.5z" />
      <path d="M16 3.5A1.5 1.5 0 0014.5 2H11a2 2 0 00-2 2v11.5a1 1 0 011-1h4.5a1.5 1.5 0 001.5-1.5V3.5z" />
    </svg>
  );
}

function NodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="4" r="2" />
      <circle cx="4" cy="14" r="2" />
      <circle cx="14" cy="14" r="2" />
      <path d="M9 6v3M7.5 10.5L5.5 12.5M10.5 10.5l2 2" />
    </svg>
  );
}

function DeviceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="1" width="10" height="16" rx="2" />
      <path d="M8 14h2" />
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4L6 9L11 14" />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <circle cx="9" cy="9" r="3.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15.1 9.9A6.5 6.5 0 018.1 2.9 6.5 6.5 0 1015.1 9.9z" />
    </svg>
  );
}

function FlowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="5" height="4" rx="1" />
      <rect x="12" y="2" width="5" height="4" rx="1" />
      <rect x="12" y="12" width="5" height="4" rx="1" />
      <path d="M6 5h3c2 0 3 1 3 3v3" />
      <path d="M6 5h2c2 0 3-1 3-1h1" />
    </svg>
  );
}

/* ─── Navigation items ────────────────────────────────────────── */

const navItems = [
  { name: "Pricing", href: "/pricing", icon: TagIcon, color: "var(--pastel-green)" },
  { name: "Buttons", href: "/buttons", icon: ButtonIcon, color: "var(--pastel-pink)" },
  { name: "Cards", href: "/cards", icon: CardIcon, color: "var(--pastel-purple)" },
  { name: "Navbar", href: "/navbar", icon: NavIcon, color: "var(--pastel-orange)" },
  { name: "Calendar", href: "/calendar", icon: CalendarIcon, color: "var(--pastel-yellow)" },
  { name: "Table", href: "/table", icon: TableIcon, color: "var(--pastel-green)" },
  { name: "Charts", href: "/charts", icon: ChartIcon, color: "var(--pastel-blue)" },
  { name: "Devices", href: "/devices", icon: DeviceIcon, color: "var(--pastel-pink)" },
  { name: "Nodes", href: "/nodes", icon: NodeIcon, color: "var(--pastel-blue)" },
  { name: "Flow", href: "/flow", icon: FlowIcon, color: "var(--pastel-green)" },
];

/* ─── Sidebar ─────────────────────────────────────────────────── */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-50 flex flex-col overflow-clip relative",
        "transition-[width] duration-300 ease-out",
        collapsed ? "w-14" : "w-52",
      )}
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-edge)",
      }}
    >
      {/* ── Grid lines background layer ──────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--fg) 1px, transparent 1px), linear-gradient(to bottom, var(--fg) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.03,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />
      {/* ── Soft radial glow ───────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--pastel-purple) 6%, transparent), transparent 70%)",
        }}
      />
      {/* ── Brand ──────────────────────────────── */}
      <div
        className={cn(
          "flex items-center shrink-0 h-12 relative z-10",
          collapsed ? "justify-center" : "gap-2.5 px-4",
        )}
      >
        <DiamondIcon className="w-4 h-4 text-fg/40 shrink-0" />
        {!collapsed && (
          <span className="text-[11px] font-semibold tracking-widest uppercase text-fg/50">
            Sandbox
          </span>
        )}
      </div>

      {/* ── Divider ────────────────────────────── */}
      <div className="h-px mx-3 relative z-10" style={{ background: "var(--sidebar-edge)" }} />

      {/* ── Main section label ──────────────────── */}
      {!collapsed && (
        <div className="px-5 pt-3 pb-1 relative z-10">
          <span className="text-[10px] font-medium uppercase tracking-widest text-fg/20">
            Main
          </span>
        </div>
      )}
      {collapsed && <div className="pt-2 relative z-10" />}

      {/* ── Main nav (Welcome + Docs) ────────────── */}
      <nav className={cn("shrink-0 relative z-10 space-y-px", collapsed ? "px-1.5" : "px-2")}>
        {(() => {
          const isActive = pathname === "/";
          return (
            <Link
              href="/"
              className={cn(
                "relative flex items-center gap-2.5 rounded-md transition-all duration-150",
                collapsed ? "w-9 h-9 justify-center mx-auto" : "px-2.5 py-[7px]",
                isActive
                  ? "bg-fg/[0.06] text-fg/70"
                  : "text-fg/30 hover:text-fg/55 hover:bg-fg/[0.03]",
              )}
              title={collapsed ? "Welcome" : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-fg/70" />
              )}
              <HomeIcon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="text-[13px]">Welcome</span>}
            </Link>
          );
        })()}
        {(() => {
          const isActive = pathname === "/docs" || pathname.startsWith("/docs/");
          return (
            <Link
              href="/docs"
              className={cn(
                "relative flex items-center gap-2.5 rounded-md transition-all duration-150",
                collapsed ? "w-9 h-9 justify-center mx-auto" : "px-2.5 py-[7px]",
                isActive
                  ? "bg-fg/[0.06] text-fg/70"
                  : "text-fg/30 hover:text-fg/55 hover:bg-fg/[0.03]",
              )}
              title={collapsed ? "Docs" : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-fg/70" />
              )}
              <BookIcon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="text-[13px]">Docs</span>}
            </Link>
          );
        })()}
      </nav>

      {/* ── Components section label ─────────────── */}
      {!collapsed && (
        <div className="px-5 pt-5 pb-1 relative z-10">
          <span className="text-[10px] font-medium uppercase tracking-widest text-fg/20">
            Components
          </span>
        </div>
      )}
      {collapsed && <div className="pt-3 relative z-10" />}

      {/* ── Navigation ─────────────────────────── */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto space-y-px relative z-10",
          collapsed ? "px-1.5" : "px-2",
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-md transition-all duration-150",
                collapsed ? "w-9 h-9 justify-center mx-auto" : "px-2.5 py-[7px]",
                isActive
                  ? "bg-fg/[0.06]"
                  : "text-fg/30 hover:text-fg/55 hover:bg-fg/[0.03]",
              )}
              style={isActive ? { color: item.color } : undefined}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                  style={{ background: item.color }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <span className="text-[13px]">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom controls ────────────────────── */}
      <div className={cn("flex flex-col gap-px pb-2 relative z-10", collapsed ? "px-1.5" : "px-2")}>
        <div className="h-px mx-1 mb-2" style={{ background: "var(--sidebar-edge)" }} />

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={cn(
            "flex items-center gap-2.5 rounded-md transition-colors duration-150 cursor-pointer",
            "text-fg/25 hover:text-fg/50 hover:bg-fg/[0.03]",
            collapsed ? "w-9 h-9 justify-center mx-auto" : "px-2.5 py-[7px]",
          )}
        >
          {theme === "dark" ? (
            <SunIcon className="w-4 h-4 shrink-0" />
          ) : (
            <MoonIcon className="w-4 h-4 shrink-0" />
          )}
          {!collapsed && (
            <span className="text-[13px]">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          )}
        </button>

        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center gap-2.5 rounded-md transition-colors duration-150 cursor-pointer",
            "text-fg/25 hover:text-fg/50 hover:bg-fg/[0.03]",
            collapsed ? "w-9 h-9 justify-center mx-auto" : "px-2.5 py-[7px]",
          )}
        >
          <ChevronIcon
            className={cn(
              "w-4 h-4 shrink-0 transition-transform duration-300",
              collapsed && "rotate-180",
            )}
          />
          {!collapsed && <span className="text-[13px]">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
