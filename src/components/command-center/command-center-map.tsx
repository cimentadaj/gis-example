"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map as MapInstance, NavigationControl, type StyleSpecification } from "maplibre-gl";
import type { GeoJSONSource, LngLatLike } from "maplibre-gl";
import type { FeatureCollection as GeoJSONFeatureCollection } from "geojson";
import type { ScenarioDefinition, ScenarioLayer } from "@/lib/scenarios";

import "maplibre-gl/dist/maplibre-gl.css";

type CommandCenterMapProps = {
  scenario: ScenarioDefinition;
  focus: number;
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
  name: "AetherCity Dark",
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
        "background-color": "#050915",
      },
    },
    {
      id: "osm-base",
      type: "raster",
      source: "osm-base",
      minzoom: 0,
      maxzoom: 19,
      paint: {
        "raster-opacity": 0.55,
        "raster-saturation": -0.8,
        "raster-brightness-min": 0.12,
        "raster-brightness-max": 0.85,
      },
    },
  ],
};

export function CommandCenterMap({ scenario, focus }: CommandCenterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const activeLayersRef = useRef<ActiveLayerRecord[]>([]);

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
        range: [-0.8, 2.5],
        color: "rgba(14, 165, 233, 0.12)",
        "horizon-blend": 0.18,
        "high-color": "rgba(124, 58, 237, 0.12)",
      });
      mapWithEffects.setLight?.({ color: "#6ee7b7", intensity: 0.45 });
      syncScenarioLayers(map, scenario, activeLayersRef);
    });

    mapRef.current = map;

    return () => {
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
      className="h-[420px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_rgba(8,12,25,0.9))] sm:h-[480px] lg:h-[560px] xl:h-[620px] 2xl:h-[680px]"
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
          "circle-opacity": 0.8,
          "circle-stroke-color": adjustOpacity(layer.style.secondaryColor ?? "#ffffff", 0.85),
          "circle-stroke-width": 1.5,
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
