import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Crosshair, Radio, History, FlaskConical, Atom } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "OVERVIEW", icon: LayoutDashboard, hint: "Operations overview" },
  { to: "/plan", label: "PLAN", icon: Crosshair, hint: "Mission planning studio" },
  { to: "/live", label: "LIVE", icon: Radio, hint: "Live operations" },
  { to: "/replay", label: "REPLAY", icon: History, hint: "Held-out day replay" },
  { to: "/evidence", label: "EVIDENCE", icon: FlaskConical, hint: "Benchmark laboratory" },
  { to: "/quantum", label: "QUANTUM", icon: Atom, hint: "De-bunching QUBO layer" },
];

export default function LeftRail() {
  return (
    <nav className="group relative z-30 flex h-full w-[56px] flex-col items-center gap-1 border-r border-hairline bg-panel/70 py-3 backdrop-blur-md transition-[width] duration-300 hover:w-[180px]">
      <div className="mb-3 flex h-8 w-8 items-center justify-center">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-[5px] bg-signal/15" />
          <div className="absolute inset-[3px] rounded-[3px] border border-signal/70" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal animate-signal-pulse" />
        </div>
      </div>

      <div className="mb-1 h-px w-7 bg-hairline" />

      {NAV.map(({ to, label, icon: Icon, hint }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "group/item relative flex h-11 w-11 items-center justify-center rounded-md transition-all",
              "hover:bg-accent/60",
              isActive && "bg-accent"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-signal" />
              )}
              <Icon
                size={17}
                strokeWidth={1.6}
                className={cn(
                  "transition-colors",
                  isActive ? "text-signal" : "text-ink-dim group-hover/item:text-ink"
                )}
              />
              <span
                className={cn(
                  "pointer-events-none absolute left-[52px] z-40 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                  isActive ? "text-signal" : "text-ink-dim"
                )}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="h-px w-7 bg-hairline" />
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint [writing-mode:vertical-rl] rotate-180">
          Q-WARP
        </div>
      </div>
    </nav>
  );
}