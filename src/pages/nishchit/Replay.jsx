import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, History, GitCompare } from "lucide-react";
import NishchitMap from "@/components/map/NishchitMap";
import { Panel, Label, Mono, Tag, Divider, Kicker, StatusDot } from "@/components/nishchit/Primitives";
import { ROUTES, STOPS, ZONE } from "@/lib/nishchit/delhi";
import { cn } from "@/lib/utils";

const T0 = 8 * 60; // 08:00
const T1 = 20 * 60; // 20:00

function posAt(route, frac) {
  const p = route.path;
  const total = p.length - 1;
  const f = Math.min(0.999, Math.max(0, frac)) * total;
  const i = Math.floor(f);
  const t = f - i;
  const a = p[i];
  const b = p[Math.min(total, i + 1)];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export default function Replay() {
  const [plan, setPlan] = useState("P50");
  const [time, setTime] = useState(T0 + 90);
  const [playing, setPlaying] = useState(false);
  const raf = useRef();

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setTime((t) => {
        const nt = t + dt * 8; // 8 min per real second
        if (nt >= T1) {
          setPlaying(false);
          return T1;
        }
        return nt;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const frac = (time - T0) / (T1 - T0);
  const vehicles = ROUTES.map((r, i) => {
    const [lng, lat] = posAt(r, (frac + i * 0.05) % 1);
    return { id: r.vehicle, routeId: r.id, lng, lat, status: "enroute" };
  });

  // P90 plan: shift R1 ordering slightly (use alt-ish). Keep base for simplicity.
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-9 items-center gap-3 border-b border-hairline px-3">
        <History size={13} className="text-quantum" />
        <span className="text-[12px] font-semibold tracking-tightest text-ink">REPLAY</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          Replay reality · {ZONE.day}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">PLAN</span>
          {["P50", "P90"].map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={cn(
                "rounded-sm border px-2 py-1 font-mono text-[10px] tracking-tight transition-all",
                plan === p
                  ? p === "P50"
                    ? "border-traffic/50 bg-traffic/10 text-traffic"
                    : "border-quantum/50 bg-quantum/10 text-quantum"
                  : "border-hairline text-ink-dim hover:text-ink"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <NishchitMap
          routes={ROUTES}
          stops={STOPS}
          vehicles={vehicles}
          zoom={11.5}
          className="absolute inset-0"
        />

        {/* plan comparison panel — top right */}
        <Panel className="pointer-events-auto absolute right-3 top-3 z-10 w-[280px] p-3.5">
          <div className="flex items-center justify-between">
            <Label tone={plan === "P50" ? "traffic" : "quantum"}>{plan} PLAN</Label>
            <Tag tone={plan === "P50" ? "traffic" : "quantum"}>vs {plan === "P50" ? "P90" : "P50"}</Tag>
          </div>
          <Divider className="my-2.5" />
          <div className="space-y-1.5">
            <CmpRow k="Expected time" a="41.2 h" b="44.8 h" />
            <CmpRow k="Late stops" a="18" b="9" />
            <CmpRow k="Min on-time p" a="0.901" b="0.951" />
            <CmpRow k="Buffer" a="6.2 m" b="9.4 m" />
          </div>
          <p className="mt-2.5 text-[11px] leading-snug text-ink-dim">
            {plan === "P50"
              ? "P50 is cheaper but exposes more stops to lateness under peak traffic."
              : "P90 adds buffer time, lifting on-time probability at higher route cost."}
          </p>
        </Panel>

        {/* reality check — bottom right */}
        <Panel className="pointer-events-auto absolute bottom-3 right-3 z-10 w-[280px] p-3.5">
          <div className="flex items-center gap-2">
            <StatusDot tone="feasible" size={5} />
            <Label tone="feasible">REALITY CHECK</Label>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
            <RC label="Promised" value="95.0%" tone="dim" />
            <RC label="Achieved" value="93.8%" tone="feasible" />
            <RC label="Stops" value="174" tone="ink" />
            <RC label="Late" value="11" tone="warn" />
          </div>
          <Divider className="my-2.5" />
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
            Held-out day · 2026-09-24 · seed 4471
          </p>
        </Panel>
      </div>

      {/* Time scrubber */}
      <div className="h-20 shrink-0 border-t border-hairline bg-panel/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-signal text-background transition hover:brightness-110"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => { setPlaying(false); setTime(T0); }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-ink-dim hover:text-ink"
          >
            <RotateCcw size={13} />
          </button>
          <Mono className="text-[14px] text-signal">{fmt(time)}</Mono>

          <div className="relative mx-2 flex-1">
            <div className="relative h-1.5 w-full rounded-full bg-hairline">
              <div className="absolute inset-y-0 left-0 rounded-full bg-quantum/70" style={{ width: `${frac * 100}%` }} />
              <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-quantum bg-background" style={{ left: `calc(${frac * 100}% - 7px)` }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
              <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-ink-dim">
            <GitCompare size={12} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{plan}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CmpRow({ k, a, b }) {
  return (
    <div className="flex items-baseline justify-between">
      <Kicker>{k}</Kicker>
      <div className="flex items-baseline gap-2 font-mono text-[11px]">
        <span className="text-traffic">{a}</span>
        <span className="text-ink-faint">→</span>
        <span className="text-quantum">{b}</span>
      </div>
    </div>
  );
}

function RC({ label, value, tone }) {
  const c = tone === "feasible" ? "text-feasible" : tone === "warn" ? "text-warn" : tone === "dim" ? "text-ink-dim" : "text-ink";
  return (
    <div>
      <Kicker>{label}</Kicker>
      <div className={`mt-0.5 font-mono text-[16px] ${c}`}>{value}</div>
    </div>
  );
}