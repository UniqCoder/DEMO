import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export const SIGNAL = "#3DDCBE";
export const QUANTUM = "#9D8AF6";
export const TRAFFIC = "#5AA9F5";
export const FEASIBLE = "#5FE08A";
export const WARN = "#F0B35E";
export const INK = "#E6E8EC";
export const INK_DIM = "#8A92A0";
export const INK_FAINT = "#5A6270";
export const GRID = "rgba(120,134,160,0.10)";

export function Chart({ option, height = 220, className, onEvents }) {
  const merged = useMemo(
    () => ({
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 600,
      animationEasing: "cubicOut",
      textStyle: { fontFamily: "Inter, sans-serif", color: INK },
      grid: { left: 44, right: 18, top: 16, bottom: 28, containLabel: false },
      tooltip: {
        backgroundColor: "rgba(11,14,19,0.94)",
        borderColor: "rgba(61,220,190,0.25)",
        borderWidth: 1,
        textStyle: { color: INK, fontFamily: "JetBrains Mono", fontSize: 11 },
        extraCssText: "border-radius:6px;backdrop-filter:blur(6px);",
        ...(option.tooltip || {}),
      },
      ...option,
    }),
    [option]
  );
  return (
    <ReactECharts
      option={merged}
      notMerge
      lazyUpdate
      style={{ height, width: "100%" }}
      className={className}
      onEvents={onEvents}
    />
  );
}