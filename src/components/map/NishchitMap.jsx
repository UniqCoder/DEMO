import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer, ScatterplotLayer, LineLayer } from "@deck.gl/layers";
import { cn } from "@/lib/utils";

const STYLE_URL = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const SIGNAL = [61, 220, 190];
const TRAFFIC = [90, 169, 245];
const INCIDENT = [242, 107, 107];
const INK_DIM = [120, 134, 150];

function rgba(rgb, a = 255) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a / 255})`;
}

function buildLayers({
  routes = [],
  stops = [],
  vehicles = [],
  incidents = [],
  selectedRouteId,
  hoveredRouteId,
  onSelectRoute,
  onHoverRoute,
  showTraffic,
}) {
  const isActive = (r) =>
    selectedRouteId === r.id || (hoveredRouteId && hoveredRouteId === r.id);
  const dim = (r) => (selectedRouteId && selectedRouteId !== r.id ? 0.16 : 0.5);

  const routeFeatures = routes.map((r) => ({
    type: "Feature",
    geometry: { type: "LineString", coordinates: r.path },
    properties: { id: r.id, active: isActive(r), dim: dim(r) },
  }));

  // wide glow underlay
  const glow = new GeoJsonLayer({
    id: "route-glow",
    data: routeFeatures,
    stroked: false,
    filled: false,
    lineWidthMinPixels: 1,
    getLineWidth: (f) => (f.properties.active ? 9 : 0),
    getLineColor: (f) => [...SIGNAL, f.properties.active ? 90 : 0],
    lineWidthUnits: "pixels",
    parameters: { depthTest: false },
    pickable: false,
  });

  const line = new GeoJsonLayer({
    id: "routes",
    data: routeFeatures,
    stroked: false,
    filled: false,
    lineWidthMinPixels: 2,
    getLineWidth: (f) => (f.properties.active ? 3.2 : 1.8),
    getLineColor: (f) => {
      if (f.properties.active) return [...SIGNAL, 255];
      return [...INK_DIM, Math.round(f.properties.dim * 255)];
    },
    lineWidthUnits: "pixels",
    pickable: true,
    autoHighlight: true,
    highlightColor: [61, 220, 190, 60],
    onClick: (info) => onSelectRoute && onSelectRoute(info.object?.properties?.id),
    onHover: (info) => onHoverRoute && onHoverRoute(info.object?.properties?.id ?? null),
    parameters: { depthTest: false },
    updateTriggers: {
      getLineWidth: { selectedRouteId, hoveredRouteId },
      getLineColor: { selectedRouteId, hoveredRouteId },
    },
  });

  const stopLayer = new ScatterplotLayer({
    id: "stops",
    data: stops,
    getPosition: (d) => [d.lng, d.lat],
    getRadius: 4,
    radiusUnits: "pixels",
    getFillColor: [11, 14, 19, 255],
    getLineColor: [...SIGNAL, 200],
    getLineWidthPixels: 1.2,
    stroked: true,
    pickable: true,
    parameters: { depthTest: false },
  });

  const vehicleLayer = new ScatterplotLayer({
    id: "vehicles",
    data: vehicles,
    getPosition: (d) => [d.lng, d.lat],
    getRadius: 7,
    radiusUnits: "pixels",
    getFillColor: (d) => (d.status === "active" ? [...SIGNAL, 255] : [...TRAFFIC, 230]),
    getLineColor: [11, 14, 19, 255],
    getLineWidthPixels: 1.5,
    stroked: true,
    pickable: true,
    parameters: { depthTest: false },
  });

  const incidentLayer = new ScatterplotLayer({
    id: "incidents",
    data: incidents,
    getPosition: (d) => [d.lng, d.lat],
    getRadius: 26,
    radiusUnits: "pixels",
    getFillColor: [...INCIDENT, 40],
    getLineColor: [...INCIDENT, 220],
    getLineWidthPixels: 1.5,
    stroked: true,
    pickable: true,
    parameters: { depthTest: false },
  });

  const layers = [glow, line];
  if (showTraffic) layers.push(incidentLayer);
  layers.push(stopLayer, vehicleLayer);
  return layers;
}

export default function NishchitMap({
  routes = [],
  stops = [],
  vehicles = [],
  incidents = [],
  selectedRouteId,
  hoveredRouteId,
  onSelectRoute,
  onHoverRoute,
  showTraffic = false,
  center = [77.272, 28.545],
  zoom = 11.4,
  pitch = 24,
  className,
  children,
  controls = true,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const propsRef = useRef({});

  // init once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center,
      zoom,
      pitch,
      bearing: -8,
      attributionControl: { compact: true },
      antialias: true,
    });
    map.on("error", () => {});
    if (controls) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), "top-right");
    }
    const overlay = new MapboxOverlay({
      interleaved: true,
      layers: [],
    });
    map.addControl(overlay, "top-left");
    mapRef.current = map;
    overlayRef.current = overlay;
    return () => {
      map.remove();
      mapRef.current = null;
      overlayRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update layers on prop change
  useEffect(() => {
    propsRef.current = {
      routes,
      stops,
      vehicles,
      incidents,
      selectedRouteId,
      hoveredRouteId,
      onSelectRoute,
      onHoverRoute,
      showTraffic,
    };
    if (overlayRef.current) {
      overlayRef.current.setProps({
        layers: buildLayers(propsRef.current),
      });
    }
  }, [
    routes,
    stops,
    vehicles,
    incidents,
    selectedRouteId,
    hoveredRouteId,
    onSelectRoute,
    onHoverRoute,
    showTraffic,
  ]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-background", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {/* subtle vignette + grid scrim for command-center feel */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_90%_at_50%_0%,transparent_55%,hsl(var(--background)/0.55)_100%)]" />
      {children}
    </div>
  );
}