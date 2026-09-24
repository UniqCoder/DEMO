import React from "react";
import { useNishchit } from "@/lib/nishchit/store";
import { Label, Mono, Divider } from "@/components/nishchit/Primitives";
import { cn } from "@/lib/utils";

const LEVELS = [
  { value: 0.9, label: "90", note: "Lower buffer · lower expected cost" },
  { value: 0.95, label: "95", note: "Balanced reliability / cost" },
  { value: 0.99, label: "99", note: "Higher reliability · added route cost" },
];

export default function ReliabilityDial() {
  const { reliability, setReliability } = useNishchit();
  const active = LEVELS.find((l) => l.value === reliability) ?? LEVELS[1];
  const idx = LEVELS.findIndex((l) => l.value === reliability);
  // arc geometry
  const R = 52;
  const C = 2 * Math.PI * R;
  const start = -135;
  const sweep = 270;
  const value = reliability;
  const arcLen = (sweep / 360) * C * ((value - 0.85) / (0.99 - 0.85));

  const implications = [
    { label: "Buffer time", value: reliability === 0.9 ? "6.2" : reliability === 0.95 ? "9.4" : "14.1", unit: "min", tone: "dim" },
    { label: "Expected cost", value: reliability === 0.9 ? "98.4" : reliability === 0.95 ? "101.7" : "112.3", unit: "u", tone: "dim" },
    { label: "Min on-time p", value: reliability.toFixed(3), unit: "", tone: "signal" },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[140px] w-[140px]">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-[0deg]">
          {/* track */}
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="hsl(var(--hairline))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(sweep / 360) * C} ${C}`}
            transform="rotate(135 70 70)"
          />
          {/* value arc */}
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="hsl(var(--signal))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${C}`}
            transform="rotate(135 70 70)"
            style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.22,1,0.36,1)", filter: "drop-shadow(0 0 6px hsl(var(--signal)/0.5))" }}
          />
          {/* ticks */}
          {LEVELS.map((l, i) => {
            const a = ((start + (sweep * (l.value - 0.85)) / (0.99 - 0.85)) * Math.PI) / 180;
            const x1 = 70 + (R - 12) * Math.cos(a);
            const y1 = 70 + (R - 12) * Math.sin(a);
            const x2 = 70 + (R - 4) * Math.cos(a);
            const y2 = 70 + (R - 4) * Math.sin(a);
            return (
              <line
                key={l.label}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={l.value === reliability ? "hsl(var(--signal))" : "hsl(var(--hairline-strong))"}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Mono className="text-[26px] font-semibold tracking-tightest text-ink">{active.label}</Mono>
          <span className="font-mono text-[9px] uppercase tracking-ultra text-ink-faint">% promise</span>
        </div>
      </div>

      {/* presets */}
      <div className="mt-3 flex w-full items-center gap-1.5">
        {LEVELS.map((l) => (
          <button
            key={l.label}
            onClick={() => setReliability(l.value)}
            className={cn(
              "flex-1 rounded-sm border px-1 py-1.5 text-center transition-all",
              l.value === reliability
                ? "border-signal/50 bg-signal/10 text-signal"
                : "border-hairline text-ink-dim hover:border-hairline-strong hover:text-ink"
            )}
          >
            <span className="font-mono text-[11px] tracking-tight">{l.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 w-full">
        <Label tone="faint">Implication · {active.label}%</Label>
        <p className="mt-1 text-[11px] leading-snug text-ink-dim">{active.note}</p>
        <Divider className="my-2" />
        {implications.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between py-1">
            <Label>{m.label}</Label>
            <div className="flex items-baseline gap-1">
              <Mono tone={m.tone}>{m.value}</Mono>
              {m.unit && <span className="font-mono text-[9px] text-ink-faint">{m.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}