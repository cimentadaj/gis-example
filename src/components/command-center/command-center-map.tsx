"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map as MapInstance, NavigationControl, type StyleSpecification } from "maplibre-gl";
import type { GeoJSONSource, LngLatLike } from "maplibre-gl";
import type { FeatureCollection as GeoJSONFeatureCollection } from "geojson";
import type { ScenarioDefinition, ScenarioLayer } from "@/lib/scenarios";

import "maplibre-gl/dist/maplibre-gl.css";

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
        "raster-opacity": 0.92,
        "raster-saturation": -0.1,
        "raster-brightness-min": 0.95,
        "raster-brightness-max": 1.12,
      },
    },
  ],
};

export function CommandCenterMap({ scenario, focus, highlights = [] }: CommandCenterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const activeLayersRef = useRef<ActiveLayerRecord[]>([]);
  const calloutMarkersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASE_STYLE,
      center: MAP_CENTER,
      zoom: MAPZOOM,
      pitch: MAP_PITCH,
      bearing: MAP_BEARING,
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");

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
    });

    mapRef.current = map;

    return () => {
      calloutMarkersRef.current.forEach((marker) => marker.remove());
      calloutMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [scenario]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const updateLayers = () => {
      syncScenarioLayers(map, scenario, activeLayersRef);
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
    <div
      ref={mapContainerRef}
      className="h-[320px] w-full overflow-hidden rounded-3xl bg-[#f8fafc] sm:h-[380px] lg:h-[440px] xl:h-[480px]"
    />
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
      "rounded-xl border border-slate-200/80 bg-white/85 px-3 py-2 text-slate-700 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.28)] backdrop-blur-sm";

    const title = document.createElement("p");
    title.className = "text-xs font-semibold text-slate-800";
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
      "inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[10px] font-medium text-sky-700";
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
        ? "bg-rose-50 text-rose-600 border border-rose-100"
        : state === "Watch"
          ? "bg-amber-50 text-amber-600 border border-amber-100"
          : "bg-emerald-50 text-emerald-600 border border-emerald-100";
    healthTag.className = `mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${baseClass}`;
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
          "circle-radius": 14,
          "circle-color": adjustOpacity(layer.style.secondaryColor ?? layer.style.color, 0.35),
          "circle-blur": 0.7,
          "circle-opacity": 0.25,
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
            5,
            1,
            12,
          ],
          "circle-color": adjustOpacity(layer.style.color, 0.95),
          "circle-opacity": 0.85,
          "circle-stroke-color": adjustOpacity(layer.style.secondaryColor ?? "#38bdf8", 0.85),
          "circle-stroke-width": 1.5,
          "circle-stroke-opacity": 0.9,
          "circle-blur": 0.2,
        },
        metadata: { zIndex: zIndex * 2 + 1 },
      });
      break;
    }
    default:
      break;
  }
}

function adjustOpacity(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
