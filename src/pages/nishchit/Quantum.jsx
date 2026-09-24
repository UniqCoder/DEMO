import React, { useState, useMemo } from "react";
import { Atom, ArrowDown, Cpu } from "lucide-react";
import { Chart, SIGNAL, QUANTUM, TRAFFIC, INK_DIM, INK_FAINT } from "@/components/nishchit/Chart";
import { Panel, Label, Mono, Tag, Divider, Kicker, StatusDot } from "@/components/nishchit/Primitives";
import { cn } from "@/lib/utils";

const SOLVERS = [
  { id: "sa", name: "Simulated Annealing", status: "online" },
  { id: "tabu", name: "Tabu Search", status: "online" },
  { id: "highs", name: "HiGHS (LP/MILP)", status: "online" },
  { id: "dwave", name: "D-Wave (QPU)", status: "offline" },
];

const N = 14; // QUBO matrix dimension

export default function Quantum() {
  const [solver, setSolver] = useState("sa");
  const [density, setDensity] = useState(0.34);

  const matrix = useMemo(() => {
    // deterministic-ish QUBO-like matrix
    const m = [];
    let s = 7;
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    for (let i = 0; i < N; i++) {
      const row = [];
      for (let j = 0; j < N; j++) {
        if (i === j) row.push(rnd() * 0.4 - 0.2);
        else if (j > i) row.push(rnd() < density ? rnd() * 2 - 1 : 0);
        else row.push(m[j][i]);
      }
      m.push(row);
    }
    return m;
  }, [density]);

  const maxAbs = useMemo(
    () => Math.max(0.001, ...matrix.flat().map((v) => Math.abs(v))),
    [matrix]
  );

  return (
    <div className="h-full w-full overflow-y-auto thin-scroll">
      <div className="mx-auto max-w-[1280px] px-5 py-6">
        <div className="flex items-center gap-2">
          <Atom size={15} className="text-quantum" />
          <h1 className="text-[15px] font-semibold tracking-tightest text-ink">QUANTUM LAYER</h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            de-bunching · QUBO path assignment
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-[12px] leading-snug text-ink-dim">
          The quantum-inspired layer is invoked only at the de-bunching stage — resolving vehicle path
          conflicts into a candidate assignment. It does not run the full routing engine.
        </p>

        {/* Pipeline */}
        <Panel className="mt-5 p-4">
          <Label>DE-BUNCHING PIPELINE</Label>
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { k: "Vehicles", v: "9", tone: "traffic" },
              { k: "Candidate paths", v: "38", tone: "signal" },
              { k: "QUBO", v: `${N}×${N}`, tone: "quantum" },
              { k: "Path assignment", v: "9", tone: "feasible" },
            ].map((s, i, arr) => (
              <React.Fragment key={s.k}>
                <div className="flex min-w-[140px] flex-1 flex-col items-center rounded-md border border-hairline bg-panel-2/60 px-3 py-3">
                  <StatusDot tone={s.tone} size={5} />
                  <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">{s.k}</span>
                  <Mono tone={s.tone === "quantum" ? "quantum" : "ink"} className="mt-0.5 text-[18px]">{s.v}</Mono>
                </div>
                {i < arr.length - 1 && <ArrowDown size={14} className="-rotate-90 text-ink-faint" />}
              </React.Fragment>
            ))}
          </div>
        </Panel>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr]">
          {/* QUBO matrix */}
          <Panel className="p-4">
            <div className="flex items-center justify-between">
              <Label tone="quantum">QUBO · INTERACTIVE MATRIX</Label>
              <Tag tone="quantum">{N}×{N}</Tag>
            </div>
            <div className="mt-3 grid grid-cols-[auto_1fr] gap-1">
              <div />
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
                {Array.from({ length: N }).map((_, j) => (
                  <div key={j} className="text-center font-mono text-[8px] text-ink-faint">{j}</div>
                ))}
              </div>
              {matrix.map((row, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center pr-1 font-mono text-[8px] text-ink-faint">{i}</div>
                  <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
                    {row.map((v, j) => {
                      const a = Math.abs(v) / maxAbs;
                      const pos = v >= 0;
                      const bg = pos
                        ? `rgba(157,138,246,${0.08 + a * 0.7})`
                        : `rgba(242,107,107,${0.08 + a * 0.6})`;
                      return (
                        <div
                          key={j}
                          title={`Q[${i},${j}] = ${v.toFixed(3)}`}
                          className="aspect-square rounded-[2px] transition-colors hover:ring-1 hover:ring-quantum/60"
                          style={{ background: bg }}
                        />
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <Divider className="my-3" />
            <div className="grid grid-cols-3 gap-3">
              <Q k="Variables" v={N * N} />
              <Q k="Density" v={density.toFixed(2)} />
              <Q k="λ penalty" v="0.85" />
            </div>
            <div className="mt-3">
              <Kicker>Density</Kicker>
              <input
                type="range" min={0.1} max={0.7} step={0.02} value={density}
                onChange={(e) => setDensity(parseFloat(e.target.value))}
                className="mt-1 w-full accent-[hsl(var(--quantum))]"
              />
            </div>
          </Panel>

          {/* Solver + crossover */}
          <div className="flex flex-col gap-4">
            <Panel className="p-4">
              <Label>SOLVER</Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {SOLVERS.map((s) => {
                  const active = solver === s.id;
                  const offline = s.status === "offline";
                  return (
                    <button
                      key={s.id}
                      onClick={() => !offline && setSolver(s.id)}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-3 py-2.5 text-left transition-all",
                        offline
                          ? "border-hairline/60 opacity-50"
                          : active
                          ? "border-quantum/50 bg-quantum/10"
                          : "border-hairline hover:border-hairline-strong"
                      )}
                    >
                      <div>
                        <div className={cn("text-[12px]", active ? "text-quantum" : "text-ink")}>{s.name}</div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          {offline ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-incident" />
                              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-incident">Offline</span>
                            </>
                          ) : (
                            <>
                              <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-quantum" : "bg-feasible")} />
                              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                                {active ? "Selected" : "Available"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Cpu size={14} className={offline ? "text-ink-faint" : active ? "text-quantum" : "text-ink-dim"} />
                    </button>
                  );
                })}
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-2 gap-3">
                <Q k="Energy" v="-42.7" tone="quantum" />
                <Q k="Solver" v={SOLVERS.find((s) => s.id === solver)?.name.split(" ")[0] ?? "—"} />
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="flex items-center justify-between">
                <Label>QUANTUM CROSSOVER</Label>
                <Tag tone="quantum">fleet size scaling</Tag>
              </div>
              <div className="mt-2">
                <Chart
                  height={200}
                  option={{
                    legend: { show: false },
                    xAxis: baseX({ name: "fleet size", max: 60 }),
                    yAxis: baseY({ name: "cost", min: 0 }),
                    series: [
                      {
                        type: "line", showSymbol: false, smooth: true,
                        lineStyle: { width: 1.8, color: TRAFFIC }, itemStyle: { color: TRAFFIC },
                        data: Array.from({ length: 13 }, (_, i) => [5 + i * 5, +(80 + i * 9 - Math.log(5 + i * 5) * 4).toFixed(1)]),
                        name: "Classical",
                      },
                      {
                        type: "line", showSymbol: false, smooth: true,
                        lineStyle: { width: 2.2, color: QUANTUM }, itemStyle: { color: QUANTUM },
                        data: Array.from({ length: 13 }, (_, i) => [5 + i * 5, +(82 + i * 6 - Math.log(5 + i * 5) * 7).toFixed(1)]),
                        name: "Hybrid (QUBO)",
                        markArea: {
                          itemStyle: { color: "rgba(157,138,246,0.08)" },
                          data: [[{ xAxis: 35 }, { xAxis: 60 }]],
                        },
                      },
                    ],
                  }}
                />
              </div>
              <Divider className="my-2.5" />
              <p className="text-[11px] leading-snug text-ink-dim">
                Crossover region (shaded) indicates where hybrid QUBO de-bunching becomes competitive —
                not a claimed advantage. D-Wave QPU is offline in this environment.
              </p>
            </Panel>
          </div>
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}

function Q({ k, v, tone = "ink" }) {
  const c = tone === "quantum" ? "text-quantum" : "text-ink";
  return (
    <div>
      <Kicker>{k}</Kicker>
      <div className={`mt-0.5 font-mono text-[15px] ${c}`}>{v}</div>
    </div>
  );
}

function baseX(o = {}) {
  return {
    type: "value", name: o.name,
    nameTextStyle: { color: INK_FAINT, fontFamily: "JetBrains Mono", fontSize: 9, padding: [4, 0, 0, 0] },
    min: 0, max: o.max,
    axisLine: { show: false }, axisTick: { show: false },
    splitLine: { lineStyle: { color: "rgba(120,134,160,0.10)" } },
    axisLabel: { color: INK_FAINT, fontFamily: "JetBrains Mono", fontSize: 9 },
  };
}
function baseY(o = {}) {
  return {
    type: "value", name: o.name,
    nameTextStyle: { color: INK_FAINT, fontFamily: "JetBrains Mono", fontSize: 9 },
    min: o.min, max: o.max,
    axisLine: { show: false }, axisTick: { show: false },
    splitLine: { lineStyle: { color: "rgba(120,134,160,0.10)" } },
    axisLabel: { color: INK_FAINT, fontFamily: "JetBrains Mono", fontSize: 9 },
  };
}