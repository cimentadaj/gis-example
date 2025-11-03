"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type ErrorEvent,
  type Map as MapInstance,
  NavigationControl,
  type StyleSpecification,
} from "maplibre-gl";
import type { GeoJSONSource, LngLatLike } from "maplibre-gl";
import type { FeatureCollection as GeoJSONFeatureCollection, Geometry } from "geojson";
import type { ScenarioDefinition, ScenarioLayer } from "@/lib/scenarios";

import "maplibre-gl/dist/maplibre-gl.css";

type MapLibreWorkerClass = new (...args: unknown[]) => Worker;

let workerAttached = false;

async function ensureMapLibreWorker() {
  if (workerAttached || typeof window === "undefined") {
    return;
  }
  const module = await import("maplibre-gl/dist/maplibre-gl-csp-worker");
  const WorkerClass = module.default as unknown as MapLibreWorkerClass;
  (maplibregl as typeof maplibregl & { workerClass?: MapLibreWorkerClass }).workerClass = WorkerClass;
  workerAttached = true;
}

export type SpatialHighlight = {
  id: string;
  sensorId: string;
  sensorType: string;
  layerLabel: string;
  district: string | null;
  health: string | null;
  anomalyScore: number;
  lastReadingMinutes: number | null;
  coordinates: [number, number];
};

type CommandCenterMapProps = {
  scenario: ScenarioDefinition;
  focus: number;
  highlights?: SpatialHighlight[];
};

type ActiveLayerRecord = {
  id: string;
  sourceId: string;
  visualization: ScenarioLayer["visualization"];
  baseIntensity: number;
};

const MAP_CENTER: LngLatLike = [-73.9925, 40.741];
const MAPZOOM = 12.7;
const MAP_PITCH = 58;
const MAP_BEARING = -16;

const BASE_STYLE: StyleSpecification = {
  version: 8,
  name: "Nexus Light",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    "osm-base": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#f4f6fb",
      },
    },
    {
      id: "osm-base",
      type: "raster",
      source: "osm-base",
      minzoom: 0,
      maxzoom: 19,
      paint: {
        "raster-opacity": 0.98,
        "raster-saturation": -0.05,
        "raster-contrast": 0.05,
        "raster-brightness-min": 1.03,
        "raster-brightness-max": 1.24,
      },
    },
  ],
};

export function CommandCenterMap({ scenario, focus, highlights = [] }: CommandCenterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const activeLayersRef = useRef<ActiveLayerRecord[]>([]);
  const calloutMarkersRef = useRef<maplibregl.Marker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      await ensureMapLibreWorker();
      if (isCancelled) {
        return;
      }

      const container = mapContainerRef.current;
      if (!container || mapRef.current) {
        return;
      }

      const map = new maplibregl.Map({
        container,
        style: BASE_STYLE,
        center: MAP_CENTER,
        zoom: MAPZOOM,
        pitch: MAP_PITCH,
        bearing: MAP_BEARING,
        attributionControl: false,
        hash: false,
      });

      map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => map.resize());
        observer.observe(container);
        resizeObserverRef.current = observer;
      }

      const handleError = (event: ErrorEvent) => {
        const rawMessage = event?.error instanceof Error ? event.error.message : null;
        const friendlyMessage = rawMessage && rawMessage.toLowerCase().includes("failed to fetch")
          ? "Basemap tiles are temporarily unavailable."
          : rawMessage ?? "Map rendering error";
        setIsReady(false);
        setMapError(friendlyMessage);
      };

      map.on("error", handleError);
      const handleIdle = () => {
        setMapError(null);
        setIsReady(true);
      };
      map.on("idle", handleIdle);

      map.once("load", () => {
        const mapWithEffects = map as MapInstance & {
          setFog?: (options: unknown) => void;
          setLight?: (options: unknown) => void;
        };

        mapWithEffects.setFog?.({
          range: [-0.8, 2.2],
          color: "rgba(148, 163, 184, 0.18)",
          "horizon-blend": 0.22,
          "high-color": "rgba(59, 130, 246, 0.12)",
        });
        mapWithEffects.setLight?.({ color: "#38bdf8", intensity: 0.55 });
        syncScenarioLayers(map, scenario, activeLayersRef);
        fitMapToScenario(map, scenario);
        map.resize();
        setIsReady(true);
      });

      mapRef.current = map;
      const handleResize = () => map.resize();
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        }
        calloutMarkersRef.current.forEach((marker) => marker.remove());
        calloutMarkersRef.current = [];
        map.off("error", handleError);
        map.off("idle", handleIdle);
        map.remove();
        mapRef.current = null;
      };
    };

    void boot();

    return () => {
      isCancelled = true;
      cleanup?.();
    };
  }, [scenario]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const updateLayers = () => {
      setMapError(null);
      syncScenarioLayers(map, scenario, activeLayersRef);
      fitMapToScenario(map, scenario);
      if (map.isStyleLoaded()) {
        setIsReady(true);
      }
    };

    if (map.isStyleLoaded()) {
      updateLayers();
    } else {
      map.once("load", updateLayers);
    }
  }, [scenario]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const updateMarkers = () => {
      syncScenarioMarkers(map, highlights, calloutMarkersRef);
    };

    if (map.isStyleLoaded()) {
      updateMarkers();
    } else {
      map.once("load", updateMarkers);
    }
  }, [highlights]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const intensityFactor = 0.55 + (focus / 100) * 0.55;

    activeLayersRef.current.forEach((layer) => {
      if (!map.getLayer(layer.id)) {
        return;
      }

      const scaled = Math.min(1.25, layer.baseIntensity * intensityFactor);

      switch (layer.visualization) {
        case "flow": {
          map.setPaintProperty(layer.id, "line-opacity", 0.25 + scaled * 0.65);
          map.setPaintProperty(layer.id, "line-width", 2 + scaled * 6);
          map.setPaintProperty(`${layer.id}-glow`, "line-width", 6 + scaled * 12);
          map.setPaintProperty(`${layer.id}-glow`, "line-opacity", 0.15 + scaled * 0.25);
          break;
        }
        case "choropleth": {
          map.setPaintProperty(layer.id, "fill-opacity", 0.25 + scaled * 0.55);
          break;
        }
        case "point": {
          map.setPaintProperty(layer.id, "circle-radius", 6 + scaled * 6);
          map.setPaintProperty(layer.id, "circle-opacity", 0.35 + scaled * 0.65);
          map.setPaintProperty(layer.id, "circle-stroke-width", 1.2 + scaled * 1.6);
          if (map.getLayer(`${layer.id}-halo`)) {
            map.setPaintProperty(`${layer.id}-halo`, "circle-radius", 14 + scaled * 14);
            map.setPaintProperty(`${layer.id}-halo`, "circle-opacity", 0.18 + scaled * 0.35);
          }
          break;
        }
        default:
          break;
      }
    });
  }, [focus]);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[32px] bg-slate-100 sm:h-[440px] lg:h-[520px] xl:h-[560px]">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {!isReady && !mapError ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
          Initialising city view…
        </div>
      ) : null}
      {mapError ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-rose-200 bg-white/95 p-6 text-center text-sm font-medium text-rose-600">
          {mapError}
        </div>
      ) : null}
    </div>
  );
}

function syncScenarioLayers(
  map: MapInstance,
  scenario: ScenarioDefinition,
  activeLayersRef: React.MutableRefObject<ActiveLayerRecord[]>,
) {
  const previous = activeLayersRef.current;

  previous.forEach(({ id, sourceId }) => {
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
    if (map.getLayer(`${id}-glow`)) {
      map.removeLayer(`${id}-glow`);
    }
    if (map.getLayer(`${id}-halo`)) {
      map.removeLayer(`${id}-halo`);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });

  const nextActive: ActiveLayerRecord[] = [];

  scenario.layers.forEach((layer, layerIndex) => {
    const sourceId = `scenario-${scenario.key}-${layer.id}-source`;
    const layerId = `scenario-${scenario.key}-${layer.id}`;

    const geojson = layer.dataset as GeoJSONFeatureCollection;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });
    } else {
      (map.getSource(sourceId) as GeoJSONSource).setData(geojson);
    }

    createLayer(map, { ...layer, style: layer.style }, sourceId, layerId, layerIndex);

    nextActive.push({
      id: layerId,
      sourceId,
      visualization: layer.visualization,
      baseIntensity: layer.style.intensity,
    });
  });

  activeLayersRef.current = nextActive;
}

function syncScenarioMarkers(
  map: MapInstance,
  highlights: SpatialHighlight[],
  calloutMarkersRef: React.MutableRefObject<maplibregl.Marker[]>,
) {
  calloutMarkersRef.current.forEach((marker) => marker.remove());
  calloutMarkersRef.current = [];

  const sorted = [...highlights].sort((a, b) => b.anomalyScore - a.anomalyScore).slice(0, 3);

  sorted.forEach((highlight) => {
    const wrapper = document.createElement("div");
    wrapper.className = "pointer-events-auto flex flex-col items-center gap-1";

    const card = document.createElement("div");
    card.className =
      "rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-700 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.28)]";

    const title = document.createElement("p");
    title.className = "text-xs font-semibold uppercase tracking-wide text-slate-800";
    title.textContent = `${highlight.sensorType}`;
    card.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "mt-1 text-[11px] text-slate-500";
    subtitle.textContent = [highlight.sensorId, highlight.district, highlight.layerLabel]
      .filter(Boolean)
      .join(" · ");
    card.appendChild(subtitle);

    const metaRow = document.createElement("div");
    metaRow.className = "mt-2 flex items-center gap-2";

    const anomalyBadge = document.createElement("span");
    anomalyBadge.className =
      "inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700";
    anomalyBadge.textContent = `${Math.round(highlight.anomalyScore * 100)}% attention`;
    metaRow.appendChild(anomalyBadge);

    if (highlight.lastReadingMinutes !== null) {
      const latency = document.createElement("span");
      latency.className = "text-[10px] text-slate-400";
      latency.textContent = `${highlight.lastReadingMinutes}m`;
      metaRow.appendChild(latency);
    }

    card.appendChild(metaRow);

    const state = highlight.health ?? "On Track";
    const healthTag = document.createElement("span");
    const baseClass =
      state === "Delayed"
        ? "bg-rose-100 text-rose-700 border border-rose-200"
        : state === "Watch"
          ? "bg-amber-100 text-amber-700 border border-amber-200"
          : "bg-emerald-100 text-emerald-700 border border-emerald-200";
    healthTag.className = `mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${baseClass}`;
    healthTag.textContent = state;
    card.appendChild(healthTag);

    wrapper.appendChild(card);

    const stem = document.createElement("div");
    stem.className = "h-3 w-px rounded-full bg-sky-400/70";
    wrapper.appendChild(stem);

    const anchor = document.createElement("div");
    anchor.className = "h-1.5 w-1.5 rounded-full border border-white bg-sky-500";
    wrapper.appendChild(anchor);

    const marker = new maplibregl.Marker({ element: wrapper, anchor: "bottom" })
      .setLngLat(highlight.coordinates)
      .addTo(map);

    calloutMarkersRef.current.push(marker);
  });
}

function createLayer(
  map: MapInstance,
  layer: ScenarioLayer,
  sourceId: string,
  layerId: string,
  zIndex: number,
) {
  switch (layer.visualization) {
    case "flow": {
      const lineColor = layer.style.color;
      const glowColor = layer.style.secondaryColor ?? layer.style.color;
      map.addLayer({
        id: `${layerId}-glow`,
        type: "line",
        source: sourceId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": glowColor,
          "line-width": 12,
          "line-blur": 2.5,
          "line-opacity": 0.28,
        },
        metadata: { zIndex: zIndex * 2 },
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": lineColor,
          "line-width": 4,
          "line-opacity": 0.65,
          "line-blur": 0.7,
        },
        metadata: { zIndex: zIndex * 2 + 1 },
      });
      break;
    }
    case "choropleth": {
      const fillColor = layer.style.color;
      const secondary = layer.style.secondaryColor ?? layer.style.color;
      map.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "resilienceScore"], ["get", "peakLoad"], 0.5],
            0,
            adjustOpacity(fillColor, 0.25),
            1,
            adjustOpacity(secondary, 0.95),
          ],
          "fill-opacity": 0.4,
          "fill-outline-color": adjustOpacity(secondary, 0.6),
        },
        metadata: { zIndex: zIndex * 2 + 1 },
      });
      break;
    }
    case "point": {
      map.addLayer({
        id: `${layerId}-halo`,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 16,
          "circle-color": adjustOpacity(layer.style.secondaryColor ?? layer.style.color, 0.3),
          "circle-blur": 0.6,
          "circle-opacity": 0.3,
        },
        metadata: { zIndex: zIndex * 2 },
      });

      map.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "anomalyScore"], ["get", "peakLoad"], 0.5],
            0,
            6,
            1,
            14,
          ],
          "circle-color": adjustOpacity(layer.style.color, 0.92),
          "circle-opacity": 0.9,
          "circle-stroke-color": adjustOpacity(layer.style.secondaryColor ?? "#38bdf8", 0.95),
          "circle-stroke-width": 1.8,
          "circle-stroke-opacity": 0.95,
          "circle-blur": 0.12,
        },
        metadata: { zIndex: zIndex * 2 + 1 },
      });
      break;
    }
    default:
      break;
  }
}

type BoundsTuple = [number, number, number, number];

function fitMapToScenario(map: MapInstance, scenario: ScenarioDefinition) {
  const bounds = calculateScenarioBounds(scenario);
  if (!bounds) {
    return;
  }

  const [minLng, minLat, maxLng, maxLat] = bounds;
  if ([minLng, minLat, maxLng, maxLat].some((value) => !Number.isFinite(value))) {
    return;
  }

  const spanLng = Math.abs(maxLng - minLng);
  const spanLat = Math.abs(maxLat - minLat);

  if (spanLng < 0.0005 && spanLat < 0.0005) {
    map.setCenter([(minLng + maxLng) / 2, (minLat + maxLat) / 2]);
    map.setZoom(14);
    return;
  }

  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    {
      padding: { top: 48, bottom: 48, left: 64, right: 64 },
      duration: 0,
      maxZoom: 14.5,
    },
  );
}

function calculateScenarioBounds(scenario: ScenarioDefinition): BoundsTuple | null {
  let bounds: BoundsTuple | null = null;

  scenario.layers.forEach((layer) => {
    const dataset = layer.dataset as GeoJSONFeatureCollection;
    const layerBounds = extractDatasetBounds(dataset);
    bounds = mergeBounds(bounds, layerBounds);
  });

  return bounds;
}

function extractDatasetBounds(dataset: GeoJSONFeatureCollection): BoundsTuple | null {
  let bounds: BoundsTuple | null = null;

  dataset.features.forEach((feature) => {
    const geometry = feature.geometry as Geometry | null;
    if (!geometry) {
      return;
    }
    const geometryBounds = getGeometryBounds(geometry);
    bounds = mergeBounds(bounds, geometryBounds);
  });

  return bounds;
}

function getGeometryBounds(geometry: Geometry): BoundsTuple | null {
  switch (geometry.type) {
    case "Point":
      return coordinatesToBounds(geometry.coordinates as [number, number]);
    case "LineString":
      return coordinateArrayToBounds(geometry.coordinates as [number, number][]);
    case "Polygon":
      return polygonToBounds(geometry.coordinates as [number, number][][]);
    case "MultiPoint":
      return coordinateArrayToBounds(geometry.coordinates as [number, number][]);
    case "MultiLineString":
      return multiLineStringToBounds(geometry.coordinates as [number, number][][]);
    case "MultiPolygon":
      return multiPolygonToBounds(geometry.coordinates as [number, number][][][]);
    case "GeometryCollection":
      return geometry.geometries.reduce<BoundsTuple | null>(
        (accumulator, item) => mergeBounds(accumulator, getGeometryBounds(item)),
        null,
      );
    default:
      return null;
  }
}

function coordinatesToBounds(coordinate: [number, number]): BoundsTuple | null {
  const [lng, lat] = coordinate;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null;
  }
  return [lng, lat, lng, lat];
}

function coordinateArrayToBounds(coordinates: [number, number][]): BoundsTuple | null {
  let bounds: BoundsTuple | null = null;
  coordinates.forEach((coordinate) => {
    bounds = mergeBounds(bounds, coordinatesToBounds(coordinate));
  });
  return bounds;
}

function polygonToBounds(rings: [number, number][][]): BoundsTuple | null {
  let bounds: BoundsTuple | null = null;
  rings.forEach((ring) => {
    bounds = mergeBounds(bounds, coordinateArrayToBounds(ring));
  });
  return bounds;
}

function multiLineStringToBounds(lines: [number, number][][]): BoundsTuple | null {
  let bounds: BoundsTuple | null = null;
  lines.forEach((line) => {
    bounds = mergeBounds(bounds, coordinateArrayToBounds(line));
  });
  return bounds;
}

function multiPolygonToBounds(polygons: [number, number][][][]): BoundsTuple | null {
  let bounds: BoundsTuple | null = null;
  polygons.forEach((polygon) => {
    bounds = mergeBounds(bounds, polygonToBounds(polygon));
  });
  return bounds;
}

function mergeBounds(a: BoundsTuple | null, b: BoundsTuple | null): BoundsTuple | null {
  if (!a && !b) {
    return null;
  }
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }

  return [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.max(a[3], b[3]),
  ];
}

function adjustOpacity(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
