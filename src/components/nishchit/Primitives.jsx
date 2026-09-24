import React from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children, inset, ...props }) {
  return (
    <div
      className={cn(
        "bg-panel/80 backdrop-blur-md hairline rounded-md",
        inset && "bg-panel-2/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Label({ children, className, tone = "dim" }) {
  const toneCls =
    tone === "signal" ? "text-signal" : tone === "faint" ? "text-ink-faint" : "text-ink-dim";
  return (
    <span
      className={cn(
        "font-mono uppercase tracking-ultra text-[10px] leading-none",
        toneCls,
        className
      )}
    >
      {children}
    </span>
  );
}

export function Mono({ children, className, tone = "ink" }) {
  const toneCls =
    tone === "signal"
      ? "text-signal"
      : tone === "dim"
      ? "text-ink-dim"
      : tone === "faint"
      ? "text-ink-faint"
      : "text-ink";
  return <span className={cn("font-mono tabular-nums", toneCls, className)}>{children}</span>;
}

export function DataRow({ label, value, unit, tone = "ink", className }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3 py-1.5", className)}>
      <Label>{label}</Label>
      <div className="flex items-baseline gap-1">
        <Mono tone={tone}>{value}</Mono>
        {unit && <span className="font-mono text-[10px] text-ink-faint">{unit}</span>}
      </div>
    </div>
  );
}

export function StatusDot({ tone = "signal", active, size = 6 }) {
  const color =
    tone === "incident"
      ? "bg-incident"
      : tone === "warn"
      ? "bg-warn"
      : tone === "feasible"
      ? "bg-feasible"
      : tone === "quantum"
      ? "bg-quantum"
      : tone === "traffic"
      ? "bg-traffic"
      : "bg-signal";
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span className={cn("absolute inset-0 rounded-full", color)} />
      {active && (
        <span
          className={cn("absolute inset-0 rounded-full animate-ping", color, "opacity-60")}
        />
      )}
    </span>
  );
}

export function Tag({ children, tone = "neutral", className }) {
  const map = {
    neutral: "text-ink-dim border-hairline",
    signal: "text-signal border-signal/40",
    quantum: "text-quantum border-quantum/40",
    traffic: "text-traffic border-traffic/40",
    feasible: "text-feasible border-feasible/40",
    warn: "text-warn border-warn/40",
    incident: "text-incident border-incident/40",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        map[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Takeaway({ children, className }) {
  return (
    <div className={cn("flex items-start gap-2 text-[12px] leading-snug text-ink", className)}>
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
      <span>{children}</span>
    </div>
  );
}

export function Divider({ className }) {
  return <div className={cn("h-px w-full bg-hairline", className)} />;
}

export function MiniBar({ value, tone = "signal", className }) {
  const color =
    tone === "quantum"
      ? "bg-quantum"
      : tone === "traffic"
      ? "bg-traffic"
      : tone === "feasible"
      ? "bg-feasible"
      : tone === "warn"
      ? "bg-warn"
      : tone === "incident"
      ? "bg-incident"
      : "bg-signal";
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-hairline", className)}>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${value * 100}%` }} />
    </div>
  );
}

export function Kicker({ children, className }) {
  return (
    <div
      className={cn(
        "font-mono text-[10px] uppercase tracking-ultra text-ink-faint",
        className
      )}
    >
      {children}
    </div>
  );
}