import React, { useState } from "react";
import { AlertTriangle, RotateCcw, Check, X, GitCompare } from "lucide-react";
import NishchitMap from "@/components/map/NishchitMap";
import SolverMonitor from "@/components/nishchit/SolverMonitor";
import { Panel, Label, Mono, StatusDot, Tag, Divider, Kicker } from "@/components/nishchit/Primitives";
import { useNishchit } from "@/lib/nishchit/store";
import { ROUTES, ROUTE_R1_ALT, STOPS, VEHICLES, INCIDENT } from "@/lib/nishchit/delhi";
import { cn } from "@/lib/utils";

export default function LiveOps() {
  const { solver, startSolve, selectedRouteId, setSelectedRoute, reoptimized } = useNishchit();
  const [stage, setStage] = useState("incident");
  const running = solver.status === "running";

  const routes = reoptimized ? ROUTES.map((r) => (r.id === "R1" ? ROUTE_R1_ALT : r)) : ROUTES;
  const diffRoutes =
    stage === "diff"
      ? [...ROUTES.map((r) => ({ ...r, _old: r.id === "R1" })), { ...ROUTE_R1_ALT, _new: true }]
      : routes;

  return (
    <div className="relative h-full w-full">
      <NishchitMap
        routes={diffRoutes}
        stops={STOPS}
        vehicles={VEHICLES}
        incidents={[INCIDENT]}
        selectedRouteId={selectedRouteId}
        onSelectRoute={setSelectedRoute}
        showTraffic
        zoom={11.4}
        className="absolute inset-0"
      />

      {/* Floating solver monitor — top right */}
      <div className="pointer-events-auto absolute right-3 top-3 z-10">
        <SolverMonitor />
      </div>

      {/* Route inspector — top left */}
      {selectedRouteId && (
        <Panel className="pointer-events-auto absolute left-3 top-3 z-10 w-[244px] p-3.5 animate-rise">
          <div className="flex items-center justify-between">
            <Label tone="signal">ROUTE</Label>
            <button onClick={() => setSelectedRoute(null)} className="text-ink-faint hover:text-ink">
              <X size={13} />
            </button>
          </div>
          <div className="mt-1 font-mono text-[13px] text-ink">{selectedRouteId}</div>
          <Divider className="my-2.5" />
          <div className="space-y-1.5">
            <Row k="Vehicle" v={ROUTES.find((r) => r.id === selectedRouteId)?.vehicle ?? "—"} />
            <Row k="Stops" v={`${ROUTES.find((r) => r.id === selectedRouteId)?.stopIds.length ?? 0}`} mono />
            <Row k="Distance" v={`${(ROUTES.find((r) => r.id === selectedRouteId)?.distance ?? 0).toFixed(1)} km`} mono />
            <Row k="Load" v={`${Math.round((ROUTES.find((r) => r.id === selectedRouteId)?.load ?? 0) * 100)}%`} mono />
          </div>
          <Divider className="my-2.5" />
          <Label tone="faint">Stop ETA band</Label>
          <div className="mt-1.5 space-y-1">
            {STOPS.filter((s) => ROUTES.find((r) => r.id === selectedRouteId)?.stopIds.includes(s.id)).slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-baseline justify-between">
                <span className="text-[11px] text-ink-dim truncate">{s.name}</span>
                <span className="font-mono text-[10px] text-ink">
                  {s.eta.toFixed(1)} <span className="text-ink-faint">[{s.p90.toFixed(1)}]</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Incident interaction — bottom left */}
      <Panel className="pointer-events-auto absolute bottom-3 left-3 z-10 w-[340px] p-3.5 animate-rise">
        <div className="flex items-center justify-between">
          <Label tone="incident">INCIDENT</Label>
          <Tag tone="incident">
            <AlertTriangle size={10} /> {INCIDENT.type}
          </Tag>
        </div>
        <div className="mt-1.5 text-[13px] text-ink">{INCIDENT.title}</div>
        <div className="font-mono text-[11px] text-ink-dim">{INCIDENT.window}</div>

        {stage === "incident" && (
          <>
            <Divider className="my-2.5" />
            <p className="text-[11px] leading-snug text-ink-dim">
              Road closure detected on the Okhla–Nehru Place corridor during evening peak. Run impact analysis to quantify exposure.
            </p>
            <button
              onClick={() => setStage("impact")}
              className="mt-3 w-full rounded-md border border-incident/40 bg-incident/10 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-incident transition-colors hover:bg-incident/20"
            >
              Impact analysis
            </button>
          </>
        )}

        {stage === "impact" && (
          <>
            <Divider className="my-2.5" />
            <Label tone="faint">IMPACT ANALYSIS</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              <Impact label="Vehicles" value={INCIDENT.affectedVehicles} tone="incident" />
              <Impact label="Stops" value={INCIDENT.affectedStops} tone="warn" />
              <Impact label="Late" value={`+${INCIDENT.expectedLateness}`} unit="m" tone="warn" />
            </div>
            <button
              onClick={() => {
                setStage("reopt");
                startSolve();
              }}
              disabled={running}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all",
                running ? "bg-signal/10 text-signal/60" : "bg-signal text-background hover:brightness-110"
              )}
            >
              {running ? (
                <>
                  <span className="h-3 w-3 animate-spin-slow rounded-full border border-signal/40 border-t-signal" />
                  Re-optimizing
                </>
              ) : (
                <>
                  <RotateCcw size={12} /> Re-optimize
                </>
              )}
            </button>
          </>
        )}

        {stage === "reopt" && (
          <>
            <Divider className="my-2.5" />
            <div className="flex items-center gap-2">
              <StatusDot tone="signal" active size={5} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                Q-WARP RE-SOLVING
              </span>
            </div>
            <div className="mt-1.5 font-mono text-[10px] text-ink-dim">
              iteration {solver.iteration} · best {solver.bestCost.toFixed(2)} · {solver.runtime.toFixed(1)}s
            </div>
            {solver.status === "done" && (
              <button
                onClick={() => setStage("diff")}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-signal/40 bg-signal/10 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-signal hover:bg-signal/20"
              >
                <GitCompare size={12} /> View route diff
              </button>
            )}
          </>
        )}

        {stage === "diff" && (
          <>
            <Divider className="my-2.5" />
            <Label tone="signal">ROUTE DIFF · R1</Label>
            <div className="mt-2 space-y-1.5">
              <DiffRow label="Old path" value="Okhla→Kalkaji→Govindpuri→Nehru" tone="faint" strike />
              <DiffRow label="New path" value="Okhla→Kalkaji→NFC→Nehru" tone="signal" />
              <DiffRow label="Distance" value="9.4 → 8.7 km" mono />
              <DiffRow label="Late stops" value="3 → 1" mono />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-signal py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-background hover:brightness-110">
                <Check size={12} /> Accept
              </button>
              <button
                onClick={() => setStage("incident")}
                className="rounded-md border border-hairline px-3 text-ink-dim hover:text-ink"
              >
                <X size={13} />
              </button>
            </div>
          </>
        )}
      </Panel>

      {/* legend bottom right */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex flex-col gap-1 rounded-md bg-panel/70 p-2.5 backdrop-blur-md hairline">
        <div className="flex items-center gap-2"><span className="h-0.5 w-5 bg-signal" /><Kicker>Active route</Kicker></div>
        <div className="flex items-center gap-2"><span className="h-0.5 w-5 bg-ink-faint" /><Kicker>Inactive</Kicker></div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-signal" /><Kicker>Vehicle</Kicker></div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-incident" /><Kicker>Incident</Kicker></div>
      </div>
    </div>
  );
}

function Row({ k, v, mono: isMono }) {
  return (
    <div className="flex items-baseline justify-between">
      <Kicker>{k}</Kicker>
      {isMono ? <Mono className="text-[12px]">{v}</Mono> : <span className="text-[12px] text-ink">{v}</span>}
    </div>
  );
}

function Impact({ label, value, unit, tone }) {
  const c = tone === "incident" ? "text-incident" : "text-warn";
  return (
    <div>
      <Kicker>{label}</Kicker>
      <div className="mt-0.5 flex items-baseline gap-0.5">
        <span className={`font-mono text-[16px] ${c}`}>{value}</span>
        {unit && <span className="font-mono text-[9px] text-ink-faint">{unit}</span>}
      </div>
    </div>
  );
}

function DiffRow({ label, value, mono, tone, strike }) {
  const c = tone === "signal" ? "text-signal" : tone === "faint" ? "text-ink-faint" : "text-ink";
  return (
    <div className="flex items-baseline justify-between gap-2">
      <Kicker>{label}</Kicker>
      {mono ? (
        <Mono tone={tone === "faint" ? "faint" : "ink"} className="text-[11px]">{value}</Mono>
      ) : (
        <span className={cn("text-[11px]", c, strike && "line-through")}>{value}</span>
      )}
    </div>
  );
}