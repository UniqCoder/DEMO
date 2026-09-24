import { create } from "zustand";
import { ROUTES, ROUTE_R1_ALT, SOLVER_PHASES } from "./delhi";

export const useNishchit = create((set, get) => ({
  zone: "Delhi SE Logistics",
  scenario: "2026-09-24 · Thursday Peak",
  regime: "Peak",
  reliability: 0.95,
  view: "overview",
  selectedRouteId: null,
  hoveredRouteId: null,
  incident: null,
  reoptimized: false,
  solver: {
    status: "idle", // idle | running | done
    iteration: 0,
    bestCost: 142.6,
    feasible: false,
    routesChanged: 0,
    runtime: 0,
    phase: 0,
    diversity: 1,
    candidates: 0,
  },
  _timer: null,

  setView: (view) => set({ view }),
  setZone: (zone) => set({ zone }),
  setReliability: (r) => set({ reliability: r }),
  setSelectedRoute: (id) => set({ selectedRouteId: id }),
  setHoveredRoute: (id) => set({ hoveredRouteId: id }),
  triggerIncident: () => set({ incident: true }),
  clearIncident: () => set({ incident: false }),

  routes: () => (get().reoptimized ? ROUTES.map((r) => (r.id === "R1" ? ROUTE_R1_ALT : r)) : ROUTES),

  startSolve: () => {
    const t = get()._timer;
    if (t) clearInterval(t);
    set({
      solver: {
        status: "running",
        iteration: 0,
        bestCost: 142.6,
        feasible: false,
        routesChanged: 0,
        runtime: 0,
        phase: 0,
        diversity: 1,
        candidates: 0,
      },
    });
    const timer = setInterval(() => {
      const s = get().solver;
      if (s.status !== "running") return;
      const iteration = s.iteration + Math.floor(2 + Math.random() * 4);
      const bestCost = Math.max(96.4, s.bestCost - (Math.random() * 0.7 + 0.18));
      const runtime = +(s.runtime + 0.09).toFixed(2);
      const phase = Math.min(SOLVER_PHASES.length - 1, Math.floor(iteration / 38));
      const feasible = iteration > 18;
      const diversity = +Math.max(0.12, 1 - iteration / 520).toFixed(3);
      const candidates = Math.floor(iteration * 1.7);
      const routesChanged = iteration > 44 ? Math.floor((iteration - 44) / 16) : 0;
      set({
        solver: {
          ...s,
          iteration,
          bestCost: +bestCost.toFixed(2),
          runtime,
          phase,
          feasible,
          diversity,
          candidates,
          routesChanged,
        },
      });
      if (iteration >= 224) {
        const cur = get()._timer;
        if (cur) clearInterval(cur);
        set({ solver: { ...get().solver, status: "done" }, reoptimized: true });
      }
    }, 110);
    set({ _timer: timer });
  },

  resetSolve: () => {
    const t = get()._timer;
    if (t) clearInterval(t);
    set({
      solver: {
        status: "idle",
        iteration: 0,
        bestCost: 142.6,
        feasible: false,
        routesChanged: 0,
        runtime: 0,
        phase: 0,
        diversity: 1,
        candidates: 0,
      },
      reoptimized: false,
    });
  },
}));