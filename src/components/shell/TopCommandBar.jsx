import React from "react";
import { Search, Settings, ChevronDown, Wifi, Activity } from "lucide-react";
import { useNishchit } from "@/lib/nishchit/store";
import { StatusDot, Mono } from "@/components/nishchit/Primitives";
import { cn } from "@/lib/utils";

export default function TopCommandBar() {
  const { zone, scenario, solver } = useNishchit();
  const solverLabel =
    solver.status === "running"
      ? "Q-WARP ACTIVE"
      : solver.status === "done"
      ? "Q-WARP READY"
      : "Q-WARP IDLE";
  const solverTone = solver.status === "running" ? "signal" : "dim";

  return (
    <header className="relative z-20 flex h-12 items-center gap-4 border-b border-hairline bg-panel/70 px-3 backdrop-blur-md">
      {/* Mark */}
      <div className="flex items-center gap-2.5">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-[5px] bg-signal/15" />
          <div className="absolute inset-[3px] rounded-[3px] border border-signal/70" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal animate-signal-pulse" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold tracking-tightest text-ink">NISHCHIT</span>
          <span className="font-mono text-[9px] uppercase tracking-ultra text-ink-faint">
            reliability-first routing
          </span>
        </div>
      </div>

      <div className="h-5 w-px bg-hairline" />

      {/* Zone + scenario */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <StatusDot tone="traffic" size={5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">ZONE</span>
          <span className="text-[12px] text-ink">{zone}</span>
          <ChevronDown size={12} className="text-ink-faint" />
        </div>
        <div className="hidden items-center gap-1.5 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">SCENARIO</span>
          <span className="font-mono text-[11px] text-ink-dim">{scenario}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Solver status */}
        <div className="flex items-center gap-2 rounded-sm border border-hairline px-2 py-1">
          <StatusDot tone="signal" active={solver.status === "running"} size={5} />
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              solverTone === "signal" ? "text-signal" : "text-ink-dim"
            )}
          >
            {solverLabel}
          </span>
          {solver.status === "running" && (
            <Mono tone="signal" className="text-[10px]">
              i{solver.iteration}
            </Mono>
          )}
        </div>

        {/* System status */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <Activity size={12} className="text-feasible" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
            SYSTEM NOMINAL
          </span>
        </div>

        {/* Network */}
        <div className="flex items-center gap-1.5">
          <Wifi size={13} className="text-feasible" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            ONLINE
          </span>
        </div>

        {/* Command */}
        <button className="flex items-center gap-2 rounded-sm border border-hairline px-2 py-1 text-ink-dim transition-colors hover:border-hairline-strong hover:text-ink">
          <Search size={13} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Command</span>
          <span className="font-mono text-[9px] text-ink-faint">⌘K</span>
        </button>

        <button className="text-ink-dim transition-colors hover:text-ink">
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}