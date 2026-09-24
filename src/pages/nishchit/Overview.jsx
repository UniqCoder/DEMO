import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, AlertTriangle, Zap, RotateCcw, ChevronRight } from "lucide-react";
import NishchitMap from "@/components/map/NishchitMap";
import { Panel, Label, Mono, StatusDot, Tag, Divider, Kicker } from "@/components/nishchit/Primitives";
import { useNishchit } from "@/lib/nishchit/store";
import { ROUTES, VEHICLES, STOPS, INCIDENT, RECENT_RUNS } from "@/lib/nishchit/delhi";
import { mono } from "@/lib/nishchit/format";

const RIBBON = [
  { q: "WHAT IS HAPPENING", a: "Thursday Peak · 9 vehicles live", tone: "traffic" },
  { q: "WHAT IS OPTIMIZING", a: "Q-WARP · re-solving R1 closure", tone: "signal" },
  { q: "WHAT IS AT RISK", a: "1 incident · 7 vehicles exposed", tone: "incident" },
  { q: "WHAT CHANGED", a: "R1 rerouted · −0.7 km · +2 stops", tone: "warn" },
  { q: "WHAT TO DO NOW", a: "Accept re-optimized plan", tone: "feasible" },
];

export default function Overview() {
  const { selectedRouteId, setSelectedRoute } = useNishchit();

  return (
    <div className="relative h-full w-full">
      {/* Map as environment */}
      <NishchitMap
        routes={ROUTES}
        stops={STOPS}
        vehicles={VEHICLES}
        incidents={[INCIDENT]}
        selectedRouteId={selectedRouteId}
        onSelectRoute={setSelectedRoute}
        showTraffic
        zoom={11.2}
        className="absolute inset-0"
      />

      {/* Top status ribbon */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-stretch gap-px overflow-x-auto border-b border-hairline/60 bg-background/40 p-2 backdrop-blur-sm no-scrollbar">
        {RIBBON.map((r) => (
          <div
            key={r.q}
            className="flex min-w-[180px] flex-1 items-center gap-2.5 rounded-sm bg-panel/60 px-2.5 py-1.5"
          >
            <StatusDot tone={r.tone} size={5} active={r.tone === "signal"} />
            <div className="min-w-0">
              <Kicker>{r.q}</Kicker>
              <div className="truncate text-[11px] text-ink">{r.a}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active plan — top left */}
      <Panel className="pointer-events-auto absolute left-3 top-14 z-10 w-[280px] p-3.5">
        <div className="flex items-center justify-between">
          <Label tone="signal">ACTIVE PLAN</Label>
          <Tag tone="signal">95% PROMISE</Tag>
        </div>
        <div className="mt-2 text-[15px] font-semibold tracking-tightest text-ink">
          Delhi SE Logistics
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          Thursday Peak · 2026-09-24
        </div>
        <Divider className="my-2.5" />
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Expected" value="41.2" unit="h" />
          <Stat label="Distance" value="386" unit="km" />
          <Stat label="Vehicles" value="9" unit="" />
        </div>
        <Divider className="my-2.5" />
        <div className="flex items-baseline justify-between">
          <Label>Min on-time p</Label>
          <Mono tone="signal" className="text-[15px]">
            0.951
          </Mono>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <Label>Late stops</Label>
          <Mono tone="warn" className="text-[13px]">
            11 / 174
          </Mono>
        </div>
      </Panel>

      {/* Optimization state — top right */}
      <Panel className="pointer-events-auto absolute right-3 top-14 z-10 w-[244px] p-3.5">
        <div className="flex items-center justify-between">
          <Label tone="signal">OPTIMIZATION</Label>
          <StatusDot tone="signal" active size={5} />
        </div>
        <div className="mt-2 space-y-1.5">
          <Row k="Engine" v="Q-WARP · QPSO" />
          <Row k="Iteration" v="184" mono />
          <Row k="Best cost" v="98.42 ↓" mono signal />
          <Row k="Feasible" v="YES" feasible />
          <Row k="Runtime" v="2.7s" mono />
        </div>
        <Divider className="my-2.5" />
        <div className="flex items-center gap-2 text-[11px] text-ink-dim">
          <Zap size={12} className="text-signal" />
          Re-solving for incident INC-4421
        </div>
      </Panel>

      {/* Incidents — bottom left */}
      <Panel className="pointer-events-auto absolute bottom-3 left-3 z-10 w-[300px] p-3.5">
        <div className="flex items-center justify-between">
          <Label tone="incident">AT RISK</Label>
          <Tag tone="incident">
            <AlertTriangle size={10} /> INCIDENT
          </Tag>
        </div>
        <div className="mt-2 text-[13px] text-ink">Road closure</div>
        <div className="font-mono text-[11px] text-ink-dim">{INCIDENT.title} · {INCIDENT.window}</div>
        <Divider className="my-2.5" />
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Vehicles" value={INCIDENT.affectedVehicles} unit="" tone="incident" />
          <Stat label="Stops" value={INCIDENT.affectedStops} unit="" tone="incident" />
          <Stat label="Late" value={`+${INCIDENT.expectedLateness}`} unit="m" tone="warn" />
        </div>
        <Link
          to="/live"
          className="mt-3 flex items-center justify-between rounded-sm border border-signal/40 bg-signal/10 px-2.5 py-1.5 text-[11px] text-signal transition-colors hover:bg-signal/20"
        >
          <span className="font-mono uppercase tracking-[0.18em]">Open Live Ops</span>
          <ChevronRight size={13} />
        </Link>
      </Panel>

      {/* Recent runs — bottom right */}
      <Panel className="pointer-events-auto absolute bottom-3 right-3 z-10 w-[300px] p-3.5">
        <div className="flex items-center justify-between">
          <Label>RECENT RUNS</Label>
          <Link to="/evidence" className="flex items-center gap-0.5 text-[10px] text-ink-dim hover:text-ink">
            <span className="font-mono uppercase tracking-[0.18em]">Evidence</span>
            <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="mt-2 space-y-1">
          {RECENT_RUNS.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-sm px-1.5 py-1 hover:bg-accent/50"
            >
              <div className="flex items-center gap-2">
                <StatusDot tone={r.algo === "Q-WARP" ? "signal" : "dim"} size={4} />
                <span className="font-mono text-[10px] text-ink-dim">{r.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-ink">{r.algo}</span>
                <Mono tone={r.gap === 0 ? "signal" : "dim"} className="text-[10px]">
                  {mono(r.cost)}
                </Mono>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value, unit, tone = "ink" }) {
  const toneCls =
    tone === "incident" ? "text-incident" : tone === "warn" ? "text-warn" : tone === "signal" ? "text-signal" : "text-ink";
  return (
    <div>
      <Label tone="faint">{label}</Label>
      <div className="mt-0.5 flex items-baseline gap-0.5">
        <span className={`font-mono text-[15px] tabular-nums ${toneCls}`}>{value}</span>
        {unit && <span className="font-mono text-[9px] text-ink-faint">{unit}</span>}
      </div>
    </div>
  );
}

function Row({ k, v, mono: isMono, signal, feasible }) {
  const tone = signal ? "signal" : feasible ? "feasible" : "ink";
  return (
    <div className="flex items-baseline justify-between">
      <Label>{k}</Label>
      {isMono ? (
        <Mono tone={tone} className="text-[12px]">{v}</Mono>
      ) : (
        <span className={`text-[12px] ${signal ? "text-signal" : feasible ? "text-feasible" : "text-ink"}`}>{v}</span>
      )}
    </div>
  );
}