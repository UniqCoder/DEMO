import React, { useState } from "react";
import { Crosshair, Truck, Package, GitBranch, Play, RotateCcw, Layers, Zap } from "lucide-react";
import NishchitMap from "@/components/map/NishchitMap";
import ReliabilityDial from "@/components/nishchit/ReliabilityDial";
import SolverMonitor from "@/components/nishchit/SolverMonitor";
import { Panel, Label, Mono, StatusDot, Tag, Divider, Kicker, MiniBar } from "@/components/nishchit/Primitives";
import { useNishchit } from "@/lib/nishchit/store";
import { ROUTES, STOPS, VEHICLES, ZONE, SOLVER_PHASES } from "@/lib/nishchit/delhi";
import { cn } from "@/lib/utils";

const TRAFFIC_REGIMES = ["Off-peak", "Peak", "Congested", "Event"];

export default function PlanStudio() {
  const { reliability, solver, startSolve, resetSolve, selectedRouteId, setSelectedRoute, scenario } =
    useNishchit();
  const [regime, setRegime] = useState("Peak");
  const [warp, setWarp] = useState(false);
  const running = solver.status === "running";

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header strip */}
      <div className="flex h-9 items-center gap-3 border-b border-hairline px-3">
        <Crosshair size={13} className="text-signal" />
        <span className="text-[12px] font-semibold tracking-tightest text-ink">PLAN STUDIO</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          {scenario}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setWarp((w) => !w)}
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-all",
              warp ? "border-quantum/50 bg-quantum/10 text-quantum" : "border-hairline text-ink-dim hover:text-ink"
            )}
          >
            <Layers size={12} /> Warp Lens
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* LEFT — scenario config */}
        <aside className="w-[268px] shrink-0 overflow-y-auto border-r border-hairline bg-panel/40 p-3 thin-scroll">
          <Section icon={GitBranch} title="Scenario">
            <Field label="Zone" value={ZONE.name} />
            <Field label="Day" value="2026-09-24" mono />
            <div>
              <Kicker>Traffic regime</Kicker>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {TRAFFIC_REGIMES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegime(r)}
                    className={cn(
                      "rounded-sm border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all",
                      regime === r
                        ? "border-traffic/50 bg-traffic/10 text-traffic"
                        : "border-hairline text-ink-dim hover:text-ink"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Divider className="my-3" />

          <Section icon={Truck} title="Fleet">
            <Field label="Vehicles" value="9" mono />
            <Field label="Capacity" value="1.2 t" mono />
            <Field label="Depots" value="1 · Okhla" />
            <div className="mt-1">
              <Kicker>Utilization</Kicker>
              <MiniBar value={0.78} tone="signal" className="mt-1" />
            </div>
          </Section>

          <Divider className="my-3" />

          <Section icon={Package} title="Orders">
            <Field label="Stops" value="174" mono />
            <Field label="Demand" value="2.4 t" mono />
            <Field label="Time windows" value="strict" />
            <Field label="Service" value="3.1 min avg" mono />
          </Section>
        </aside>

        {/* CENTER — map */}
        <div className="relative min-w-0 flex-1">
          <NishchitMap
            routes={ROUTES}
            stops={STOPS}
            vehicles={VEHICLES}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRoute}
            zoom={11.6}
            className="absolute inset-0"
          />
          {warp && <WarpFieldOverlay />}
          {/* route legend */}
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoute(selectedRouteId === r.id ? null : r.id)}
                className={cn(
                  "pointer-events-auto flex items-center gap-2 rounded-sm bg-panel/70 px-2 py-1 backdrop-blur-md hairline transition-all",
                  selectedRouteId === r.id ? "border-signal/50" : "hover:border-hairline-strong"
                )}
              >
                <span
                  className={cn("h-1.5 w-4 rounded-full", selectedRouteId === r.id ? "bg-signal" : "bg-ink-faint")}
                />
                <span className="font-mono text-[10px] text-ink-dim">{r.vehicle}</span>
                <span className="font-mono text-[10px] text-ink-faint">{r.stopIds.length} stops</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — optimization config */}
        <aside className="w-[300px] shrink-0 overflow-y-auto border-l border-hairline bg-panel/40 p-3 thin-scroll">
          <Label tone="signal">RELIABILITY TARGET</Label>
          <div className="mt-2">
            <ReliabilityDial />
          </div>

          <Divider className="my-3" />

          <Label>OBJECTIVE</Label>
          <div className="mt-2 space-y-1.5">
            <ObjRow k="Expected cost" v="0.62" />
            <ObjRow k="CVaR penalty" v="0.28" />
            <ObjRow k="Overtime" v="0.10" />
          </div>

          <Divider className="my-3" />

          <Label>SOLVER</Label>
          <div className="mt-2">
            <SolverMonitor />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={startSolve}
              disabled={running}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all",
                running
                  ? "bg-signal/10 text-signal/60"
                  : "bg-signal text-background hover:brightness-110"
              )}
            >
              {running ? (
                <>
                  <span className="h-3 w-3 animate-spin-slow rounded-full border border-signal/40 border-t-signal" />
                  Solving
                </>
              ) : (
                <>
                  <Play size={12} /> Solve
                </>
              )}
            </button>
            <button
              onClick={resetSolve}
              className="flex items-center justify-center rounded-md border border-hairline px-2.5 text-ink-dim transition-colors hover:text-ink"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </aside>
      </div>

      {/* BOTTOM — solver timeline */}
      <div className="h-16 shrink-0 border-t border-hairline bg-panel/50 px-3 py-2">
        <SolverTimeline />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Icon size={12} className="text-ink-dim" />
        <Label>{title}</Label>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, value, mono: isMono }) {
  return (
    <div className="flex items-baseline justify-between">
      <Kicker>{label}</Kicker>
      {isMono ? (
        <Mono className="text-[12px]">{value}</Mono>
      ) : (
        <span className="text-[12px] text-ink">{value}</span>
      )}
    </div>
  );
}

function ObjRow({ k, v }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Kicker>{k}</Kicker>
        <Mono className="text-[11px]">{v}</Mono>
      </div>
      <MiniBar value={parseFloat(v)} tone={k === "CVaR penalty" ? "quantum" : "signal"} className="mt-1" />
    </div>
  );
}

function WarpFieldOverlay() {
  const bumps = [
    [77.26, 28.55, 0.9], [77.29, 28.53, 0.7], [77.27, 28.51, 0.8],
    [77.25, 28.54, 0.6], [77.31, 28.56, 0.5], [77.28, 28.57, 0.65],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      <svg className="absolute inset-0 h-full w-full opacity-60">
        <defs>
          <radialGradient id="warp" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(var(--quantum))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--quantum))" stopOpacity="0" />
          </radialGradient>
        </defs>
        {bumps.map((b, i) => {
          const x = ((b[0] - 77.22) / 0.12) * 100;
          const y = (1 - (b[1] - 28.47) / 0.12) * 100;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={40 + b[2] * 50}
              fill="url(#warp)"
              className="animate-breathe"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          );
        })}
      </svg>
      <div className="absolute right-3 top-3 rounded-md bg-panel/85 p-2.5 backdrop-blur-md hairline">
        <div className="flex items-center gap-1.5">
          <Zap size={11} className="text-quantum" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-quantum">WARP FIELD</span>
        </div>
        <div className="mt-1.5 space-y-0.5">
          <div className="flex justify-between gap-4"><Kicker>Bumps</Kicker><Mono className="text-[10px]">16</Mono></div>
          <div className="flex justify-between gap-4"><Kicker>Amplitude</Kicker><Mono className="text-[10px]">0.74</Mono></div>
          <div className="flex justify-between gap-4"><Kicker>Locality</Kicker><Mono className="text-[10px]">0.31</Mono></div>
          <div className="flex justify-between gap-4"><Kicker>Iteration</Kicker><Mono className="text-[10px]">184</Mono></div>
        </div>
      </div>
    </div>
  );
}

function SolverTimeline() {
  const { solver } = useNishchit();
  const pct = Math.min(100, (solver.iteration / 224) * 100);
  return (
    <div className="flex h-full items-center gap-3">
      <Label tone={solver.status === "running" ? "signal" : "faint"}>PROGRESS</Label>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-signal transition-all duration-200"
          style={{ width: `${pct}%`, boxShadow: "0 0 8px hsl(var(--signal)/0.6)" }}
        />
        {solver.status === "running" && (
          <div className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
        )}
      </div>
      <Mono className="text-[11px]">{solver.iteration}/224</Mono>
      <Divider className="!w-px !h-4" />
      <div className="flex items-center gap-1.5">
        {SOLVER_PHASES.map((p, i) => (
          <span
            key={p}
            className={cn(
              "font-mono text-[9px] uppercase tracking-[0.14em]",
              i === solver.phase ? "text-signal" : i < solver.phase ? "text-ink-dim" : "text-ink-faint"
            )}
          >
            {p.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}