// Illustrative scenario geometry for NISHCHIT.
// Coordinates are real Delhi locations; routes/stops/vehicles are scenario
// placeholders pending the live optimization backend. No algorithm results
// are fabricated here — only spatial structure for the map.

export const ZONE = {
  name: "Delhi SE Logistics",
  center: [77.272, 28.545],
  bounds: [[77.22, 28.47], [77.34, 28.59]],
  regime: "Thursday Peak",
  day: "2026-09-24",
};

export const DEPOTS = [
  { id: "D1", name: "Okhla Depot", lng: 77.249, lat: 28.5355 },
];

export const STOPS = [
  { id: "S1", name: "Kalkaji Mandir", lng: 77.2540, lat: 28.5460, service: 3.2, eta: 8.4, p90: 11.1, prob: 0.961 },
  { id: "S2", name: "Govindpuri", lng: 77.2620, lat: 28.5400, service: 2.8, eta: 12.7, p90: 16.9, prob: 0.943 },
  { id: "S3", name: "Nehru Place", lng: 77.2510, lat: 28.5495, service: 4.1, eta: 17.2, p90: 23.0, prob: 0.928 },
  { id: "S4", name: "New Friends Colony", lng: 77.2720, lat: 28.5550, service: 3.0, eta: 21.5, p90: 28.4, prob: 0.917 },
  { id: "S5", name: "Jasola District Centre", lng: 77.2850, lat: 28.5410, service: 3.6, eta: 26.1, p90: 34.7, prob: 0.908 },
  { id: "S6", name: "Sarita Vihar", lng: 77.2980, lat: 28.5245, service: 2.5, eta: 30.8, p90: 41.0, prob: 0.894 },
  { id: "S7", name: "Kalindi Kunj", lng: 77.2760, lat: 28.5230, service: 2.9, eta: 35.4, p90: 47.6, prob: 0.881 },
  { id: "S8", name: "Tughlakabad", lng: 77.2960, lat: 28.5110, service: 3.3, eta: 40.2, p90: 54.1, prob: 0.869 },
  { id: "S9", name: "Badarpur Border", lng: 77.3040, lat: 28.4930, service: 4.4, eta: 45.0, p90: 61.3, prob: 0.852 },
  { id: "S10", name: "Faridabad Edge", lng: 77.3120, lat: 28.4830, service: 3.1, eta: 49.7, p90: 68.0, prob: 0.841 },
  { id: "S11", name: "Noida Sec-37", lng: 77.3260, lat: 28.5700, service: 2.7, eta: 24.3, p90: 32.1, prob: 0.921 },
  { id: "S12", name: "Sarita Vihar Depot-2", lng: 77.3010, lat: 28.5310, service: 1.2, eta: 33.6, p90: 44.2, prob: 0.901 },
];

// Build a gently curved path through a list of [lng,lat] waypoints.
function curve(points) {
  const path = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    path.push([x1, y1]);
    const mx = (x1 + x2) / 2 + (y2 - y1) * 0.012;
    const my = (y1 + y2) / 2 - (x2 - x1) * 0.012;
    path.push([mx, my]);
  }
  path.push(points[points.length - 1]);
  return path;
}

const coord = (id) => {
  const s = STOPS.find((s) => s.id === id);
  return [s.lng, s.lat];
};
const depot = [DEPOTS[0].lng, DEPOTS[0].lat];

export const ROUTES = [
  {
    id: "R1",
    vehicle: "VHC-07",
    stopIds: ["S1", "S2", "S3", "S4"],
    path: curve([depot, coord("S1"), coord("S2"), coord("S3"), coord("S4")]),
    distance: 9.4,
    load: 0.86,
  },
  {
    id: "R2",
    vehicle: "VHC-12",
    stopIds: ["S5", "S6", "S7", "S8"],
    path: curve([depot, coord("S5"), coord("S6"), coord("S7"), coord("S8")]),
    distance: 12.1,
    load: 0.74,
  },
  {
    id: "R3",
    vehicle: "VHC-03",
    stopIds: ["S9", "S10", "S12"],
    path: curve([depot, coord("S9"), coord("S10"), coord("S12")]),
    distance: 14.8,
    load: 0.91,
  },
  {
    id: "R4",
    vehicle: "VHC-21",
    stopIds: ["S11", "S6", "S7"],
    path: curve([depot, coord("S11"), coord("S6"), coord("S7")]),
    distance: 10.2,
    load: 0.68,
  },
];

// Re-optimized alternate for R1 (used by the Live Ops route diff).
export const ROUTE_R1_ALT = {
  id: "R1",
  vehicle: "VHC-07",
  stopIds: ["S1", "S4", "S3", "S2"],
  path: curve([depot, coord("S1"), coord("S4"), coord("S3"), coord("S2")]),
  distance: 8.7,
  load: 0.86,
};

export const VEHICLES = ROUTES.map((r, i) => {
  const p = r.path;
  const t = 0.28 + i * 0.06;
  const idx = Math.min(p.length - 1, Math.floor(t * (p.length - 1)));
  return {
    id: r.vehicle,
    routeId: r.id,
    lng: p[idx][0],
    lat: p[idx][1],
    status: i === 0 ? "active" : "enroute",
    speed: 22 + i * 4,
    eta: r.distance * 4.2,
  };
});

export const INCIDENT = {
  id: "INC-4421",
  type: "ROAD CLOSURE",
  title: "Okhla → Nehru Place",
  window: "17:30 – 19:00",
  affectedVehicles: 7,
  affectedStops: 19,
  expectedLateness: 11.4,
  lng: 77.2505,
  lat: 28.5422,
};

export const RECENT_RUNS = [
  { id: "RUN-09C1", seed: 4471, instance: "delhi-se-0924", algo: "Q-WARP", budget: "5k", cost: 98.42, gap: 0.0, t: "2.7s", hash: "0x7a3f…e1" },
  { id: "RUN-09C0", seed: 4471, instance: "delhi-se-0924", algo: "RK-QPSO", budget: "5k", cost: 101.18, gap: 2.8, t: "3.1s", hash: "0x6b2e…9c" },
  { id: "RUN-09BF", seed: 4471, instance: "delhi-se-0924", algo: "OR-Tools", budget: "5k", cost: 99.74, gap: 1.3, t: "8.4s", hash: "0x5510…4a" },
  { id: "RUN-09BE", seed: 4471, instance: "delhi-se-0924", algo: "PyVRP", budget: "5k", cost: 100.91, gap: 2.5, t: "4.0s", hash: "0x4f8d…77" },
];

export const ALGORITHMS = [
  { id: "qwrap", name: "Q-WARP", family: "QPSO", color: "signal" },
  { id: "rkqpso", name: "RK-QPSO", family: "QPSO", color: "quantum" },
  { id: "pso", name: "PSO", family: "Metaheuristic", color: "traffic" },
  { id: "ga", name: "GA", family: "Metaheuristic", color: "warn" },
  { id: "sa", name: "SA", family: "Metaheuristic", color: "ink-dim" },
  { id: "ortools", name: "OR-Tools", family: "Exact/CP", color: "feasible" },
  { id: "pyvrp", name: "PyVRP", family: "Metaheuristic", color: "ink-dim" },
  { id: "milp", name: "Exact MILP", family: "Exact", color: "incident" },
];

export const SOLVER_PHASES = [
  "BUILDING LEG TENSOR",
  "SEARCHING WARP FIELD",
  "LOCAL IMPROVEMENT",
  "EXACT COLLAPSE",
  "SAA VALIDATION",
  "FINAL ASSIGNMENT",
];