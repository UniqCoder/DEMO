import React from "react";
import { useNishchit } from "@/lib/nishchit/store";
import { SOLVER_PHASES } from "@/lib/nishchit/delhi";
import { Label, Mono, StatusDot, MiniBar } from "@/components/nishchit/Primitives";
import { cn } from "@/lib/utils";

export default function SolverMonitor({ compact = false }) {
  const { solver } = useNishchit();
  const running = solver.status === "running";
  const done = solver.status === "done";

  return (
    <div
      className={cn(
        "w-[244px] rounded-md bg-panel/85 p-3 backdrop-blur-md hairline",
        running && "glow-signal"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusDot tone="signal" active={running} size={6} />
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              running ? "text-signal" : "text-ink-dim"
            )}
          >
            {running ? "Q-WARP ACTIVE" : done ? "Q-WARP READY" : "Q-WARP IDLE"}
          </span>
        </div>
        <Mono tone="faint" className="text-[9px]">
          {running ? "LIVE" : done ? "DONE" : "—"}
        </Mono>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
        <Metric label="Iteration" value={solver.iteration} />
        <Metric label="Runtime" value={solver.runtime.toFixed(2)} unit="s" />
        <Metric
          label="Best cost"
          value={solver.bestCost.toFixed(2)}
          tone={running ? "signal" : "ink"}
          arrow
          down={running}
        />
        <Metric
          label="Feasible"
          value={solver.feasible ? "YES" : "—"}
          tone={solver.feasible ? "feasible" : "faint"}
        />
        <Metric label="Routes Δ" value={solver.routesChanged} />
        <Metric label="Candidates" value={solver.candidates} />
      </div>

      {!compact && (
        <div className="mt-2.5">
          <div className="flex items-center justify-between">
            <Label tone="faint">Swarm diversity</Label>
            <Mono tone="dim" className="text-[9px]">
              {solver.diversity.toFixed(3)}
            </Mono>
          </div>
          <MiniBar value={solver.diversity} tone="quantum" className="mt-1" />
        </div>
      )}

      {/* Phase strip */}
      <div className="mt-3">
        <Label tone="faint">Phase</Label>
        <div className="mt-1.5 flex items-center gap-[3px]">
          {SOLVER_PHASES.map((p, i) => (
            <div
              key={p}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                i < solver.phase
                  ? "bg-signal/70"
                  : i === solver.phase
                  ? running
                    ? "bg-signal animate-signal-pulse"
                    : "bg-signal/40"
                  : "bg-hairline"
              )}
            />
          ))}
        </div>
        <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim">
          {SOLVER_PHASES[solver.phase]}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, unit, tone = "ink", arrow, down }) {
  const toneCls =
    tone === "signal"
      ? "text-signal"
      : tone === "feasible"
      ? "text-feasible"
      : tone === "faint"
      ? "text-ink-faint"
      : "text-ink";
  return (
    <div>
      <Label tone="faint">{label}</Label>
      <div className="mt-0.5 flex items-baseline gap-1">
        {arrow && down && <span className="text-[9px] text-feasible">▼</span>}
        <span className={cn("font-mono text-[13px] tabular-nums", toneCls)}>{value}</span>
        {unit && <span className="font-mono text-[9px] text-ink-faint">{unit}</span>}
      </div>
    </div>
  );
}