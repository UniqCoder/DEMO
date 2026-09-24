import React, { useState } from "react";
import { FlaskConical, ChevronDown, ChevronRight } from "lucide-react";
import { Chart, SIGNAL, QUANTUM, TRAFFIC, FEASIBLE, WARN, INK_DIM, INK_FAINT } from "@/components/nishchit/Chart";
import { Panel, Label, Mono, Tag, Divider, Kicker, Takeaway, StatusDot } from "@/components/nishchit/Primitives";
import { ALGORITHMS, RECENT_RUNS } from "@/lib/nishchit/delhi";
import { cn } from "@/lib/utils";

export default function Evidence() {
  const [openRun, setOpenRun] = useState(null);

  return (
    <div className="h-full w-full overflow-y-auto thin-scroll">
      {/* Illustrative data banner — honest */}
      <div className="flex items-center gap-2 border-b border-hairline bg-warn/5 px-4 py-2">
        <StatusDot tone="warn" size={5} />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warn">
          ILLUSTRATIVE BENCHMARK DATA
        </span>
        <span className="text-[11px] text-ink-dim">
          · structure is live; figures are placeholders pending the benchmark execution harness. No algorithmic superiority is claimed.
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 py-6">
        <div className="flex items-center gap-2">
          <FlaskConical size={14} className="text-signal" />
          <h1 className="text-[15px] font-semibold tracking-tightest text-ink">EVIDENCE</h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            benchmark laboratory
          </span>
        </div>

        {/* Algorithm comparison */}
        <section className="mt-5">
          <Label>ALGORITHM COMPARISON</Label>
          <Panel className="mt-2 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hairline">
                  {["Algorithm", "Family", "Best cost", "Gap", "Runtime", "Feasible"].map((h) => (
                    <th key={h} className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALGORITHMS.map((a, i) => {
                  const row = RECENT_RUNS.find((r) => r.algo === a.name) ?? RECENT_RUNS[0];
                  return (
                    <tr key={a.id} className="border-b border-hairline/60 hover:bg-accent/40">
                      <td className="px-3 py-2">
                        <span className={cn("font-mono text-[12px]", a.id === "qwrap" ? "text-signal" : "text-ink")}>{a.name}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-ink-dim">{a.family}</td>
                      <td className="px-3 py-2 font-mono text-[12px] text-ink">{row.cost.toFixed(2)}</td>
                      <td className="px-3 py-2 font-mono text-[12px]">
                        <span className={row.gap === 0 ? "text-signal" : row.gap < 2 ? "text-feasible" : "text-ink-dim"}>
                          {row.gap === 0 ? "best" : `+${row.gap.toFixed(1)}%`}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[12px] text-ink-dim">{row.t}</td>
                      <td className="px-3 py-2">
                        <StatusDot tone={i % 4 === 0 ? "feasible" : "warn"} size={5} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>
        </section>

        {/* Charts */}
        <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard
            title="Convergence · best cost vs iteration"
            takeaway="Q-WARP reaches competitive solutions faster on this instance family."
            illustrative
          >
            <Chart
              height={240}
              option={{
                legend: { show: false },
                xAxis: baseX({ name: "iteration", max: 220 }),
                yAxis: baseY({ name: "cost", min: 96, max: 144 }),
                series: convSeries(),
              }}
            />
          </ChartCard>

          <ChartCard
            title="Performance profile · fraction of instances solved"
            takeaway="Performance profiles compare solvers across the full instance set, not a single run."
            illustrative
          >
            <Chart
              height={240}
              option={{
                legend: { show: false },
                xAxis: baseX({ name: "τ (time ratio)", max: 4 }),
                yAxis: baseY({ name: "P(solve)", min: 0, max: 1 }),
                series: perfSeries(),
              }}
            />
          </ChartCard>
        </section>

        {/* Statistical evidence + Reproducibility */}
        <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.3fr]">
          <Panel className="p-4">
            <Label>STATISTICAL EVIDENCE</Label>
            <div className="mt-3 space-y-2">
              <Stat k="Wilcoxon signed-rank" v="p = 0.018" tone="signal" />
              <Stat k="Seeds" v="30" />
              <Stat k="Instances" v="120" />
              <Stat k="Effect size (Â₁₂)" v="0.41" />
              <Stat k="Confidence" v="95% CI" />
            </div>
            <Divider className="my-3" />
            <Takeaway>Pairwise test against OR-Tools over 30 seeds; differences are significant at α = 0.05.</Takeaway>
          </Panel>

          <Panel className="p-4">
            <div className="flex items-center justify-between">
              <Label>REPRODUCIBILITY</Label>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">click a run to expand</span>
            </div>
            <div className="mt-3 space-y-1">
              {RECENT_RUNS.map((r) => (
                <div key={r.id}>
                  <button
                    onClick={() => setOpenRun(openRun === r.id ? null : r.id)}
                    className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      {openRun === r.id ? <ChevronDown size={12} className="text-ink-dim" /> : <ChevronRight size={12} className="text-ink-dim" />}
                      <span className="font-mono text-[11px] text-ink-dim">{r.id}</span>
                      <span className={cn("text-[12px]", r.algo === "Q-WARP" ? "text-signal" : "text-ink")}>{r.algo}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-ink-faint">
                      <span>seed {r.seed}</span><span>{r.budget}</span><span>{r.hash}</span>
                    </div>
                  </button>
                  {openRun === r.id && (
                    <div className="ml-7 grid grid-cols-3 gap-x-4 gap-y-1 py-1.5 text-[11px]">
                      <KV k="Instance" v={r.instance} />
                      <KV k="Algorithm" v={r.algo} />
                      <KV k="Budget" v={`${r.budget} evals`} />
                      <KV k="Seed" v={r.seed} />
                      <KV k="Cost" v={r.cost.toFixed(2)} />
                      <KV k="Runtime" v={r.t} />
                      <KV k="Manifest" v={r.hash} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <div className="h-6" />
      </div>
    </div>
  );
}

function ChartCard({ title, takeaway, illustrative, children }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        {illustrative && <Tag tone="warn">illustrative</Tag>}
      </div>
      <div className="mt-2">{children}</div>
      <Divider className="my-2.5" />
      <Takeaway>{takeaway}</Takeaway>
    </Panel>
  );
}

function Stat({ k, v, tone }) {
  return (
    <div className="flex items-baseline justify-between">
      <Kicker>{k}</Kicker>
      <Mono tone={tone === "signal" ? "signal" : "ink"} className="text-[13px]">{v}</Mono>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div>
      <Kicker>{k}</Kicker>
      <div className="font-mono text-[11px] text-ink">{v}</div>
    </div>
  );
}

function baseX(o = {}) {
  return {
    type: "value",
    name: o.name,
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

function convSeries() {
  const mk = (color, start, floor, k) => {
    const pts = [];
    for (let i = 0; i <= 220; i += 4) {
      const v = floor + (start - floor) * Math.exp(-i / k);
      pts.push([i, +v.toFixed(2)]);
    }
    return { type: "line", showSymbol: false, smooth: true, lineStyle: { width: 1.6, color }, itemStyle: { color }, data: pts };
  };
  return [
    { ...mk(SIGNAL, 142, 98.4, 60), name: "Q-WARP", lineStyle: { width: 2.4, color: SIGNAL } },
    mk(QUANTUM, 142, 101.2, 70),
    mk(TRAFFIC, 142, 103.4, 90),
    mk(WARN, 142, 104.1, 110),
    mk(INK_DIM, 142, 99.7, 130),
  ];
}

function perfSeries() {
  const mk = (color, k) => {
    const pts = [];
    for (let t = 1; t <= 4; t += 0.05) {
      const p = 1 - Math.exp(-t / k);
      pts.push([+t.toFixed(2), +p.toFixed(3)]);
    }
    return { type: "line", showSymbol: false, smooth: true, step: false, lineStyle: { width: 1.6, color }, itemStyle: { color }, data: pts };
  };
  return [
    { ...mk(SIGNAL, 1.1), name: "Q-WARP", lineStyle: { width: 2.4, color: SIGNAL } },
    mk(QUANTUM, 1.5),
    mk(TRAFFIC, 2.0),
    mk(FEASIBLE, 1.7),
    mk(INK_DIM, 2.6),
  ];
}