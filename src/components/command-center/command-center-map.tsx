"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { AmbientLight, LightingEffect, _SunLight as SunLight } from "@deck.gl/core";
import { BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "deck.gl";
import type { Layer } from "@deck.gl/core";
import type { ScenarioDefinition, ScenarioLayer } from "@/lib/scenarios";

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

const INITIAL_VIEW_STATE = {
  longitude: -73.9777,
  latitude: 40.7527,
  zoom: 10.6,
  minZoom: 8.5,
  maxZoom: 16,
  pitch: 5,
  bearing: -4,
};

const CITY_NAME = "New York City";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 0.65,
});

const sunLight = new SunLight({
  timestamp: Date.UTC(2024, 4, 18, 20),
  color: [253, 186, 116],
  intensity: 1.1,
  direction: [-0.7, -0.6, -0.5],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  directionalLights: [sunLight],
});

export function CommandCenterMap({ scenario, focus, highlights = [] }: CommandCenterMapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [renderSupport, setRenderSupport] = useState<"unknown" | "supported" | "unsupported">(
    typeof window === "undefined" ? "unknown" : "supported",
  );

  const intensityFactor = useMemo(() => 0.55 + (focus / 100) * 0.55, [focus]);

  const baseTiles = useMemo(
    () =>
      new TileLayer({
        id: "osm-base-tiles",
        data: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        refinementStrategy: "best-available",
        renderSubLayers: (subLayerProps) => {
          const { tile, data } = subLayerProps;
          if (!tile || !tile.bbox || !data) {
            return null;
          }
          const {
            bbox: { west, south, east, north },
          } = tile;
          return new BitmapLayer(subLayerProps, {
            data: null,
            image: data,
            bounds: [west, south, east, north],
          });
        },
      }),
    [],
  );

  const scenarioLayers = useMemo(() => {
    return scenario.layers
      .flatMap<Layer | null>((layer, index) => buildScenarioLayers(layer, intensityFactor, index))
      .filter((layer): layer is Layer => Boolean(layer));
  }, [scenario.layers, intensityFactor]);

  const highlightLayer = useMemo(() => {
    if (highlights.length === 0) {
      return null;
    }
    const radius = clamp(5 + intensityFactor * 8, 5, 18);
    return new ScatterplotLayer<SpatialHighlight>({
      id: "scenario-highlights",
      data: highlights.slice(0, 6),
      pickable: true,
      parameters: { depthTest: false },
      getPosition: (highlight) => highlight.coordinates,
      radiusUnits: "pixels",
      getRadius: () => radius,
      getFillColor: [14, 165, 233, 210],
      getLineColor: [236, 254, 255, 240],
      lineWidthUnits: "pixels",
      lineWidthMinPixels: 2,
      updateTriggers: {
        getRadius: radius,
      },
    });
  }, [highlights, intensityFactor]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      const tryContexts: Array<"webgl2" | "webgl" | "experimental-webgl"> = ["webgl2", "webgl", "experimental-webgl"];
      const supported = tryContexts.some((contextName) => canvas.getContext(contextName) !== null);
      setRenderSupport(supported ? "supported" : "unsupported");
    });
  }, []);

  const layers = useMemo(() => {
    const composed: Layer[] = [baseTiles, ...scenarioLayers];
    if (highlightLayer) {
      composed.push(highlightLayer);
    }
    return composed;
  }, [baseTiles, scenarioLayers, highlightLayer]);

  const tooltip = useMemo(() => {
    return ({
      object,
      layer,
    }: {
      object: Record<string, unknown> | SpatialHighlight | null;
      layer: Layer;
    }) => {
      if (!object) {
        return null;
      }

      if (layer.id === "scenario-highlights") {
        const highlight = object as SpatialHighlight;
        return {
          html: [
            `<div class="font-semibold text-slate-900">${highlight.sensorId}</div>`,
            `<div class="text-[12px] text-slate-500">${highlight.sensorType}${
              highlight.district ? ` · ${highlight.district}` : ""
            }</div>`,
            `<div class="mt-1 text-[12px] text-slate-600">Score ${highlight.anomalyScore.toFixed(2)}</div>`,
            highlight.health
              ? `<div class="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-[2px] text-[11px] font-medium text-slate-600">${highlight.health}</div>`
              : "",
          ].join(""),
          style: tooltipStyle,
        };
      }

      const properties =
        ("properties" in object ? (object.properties as Record<string, unknown> | undefined) : null) ?? undefined;
      if (!properties) {
        return null;
      }

      const title =
        (properties.district as string) ??
        (properties.program as string) ??
        (properties.indicator as string) ??
        (properties.name as string);
      if (!title) {
        return null;
      }

      const detail = [
        properties.priority,
        properties.status,
        properties.stage,
        properties.leadTheme,
        properties.leadAgency,
        properties.borough,
      ]
        .map((value) => (typeof value === "string" ? value : null))
        .filter(Boolean)
        .join(" · ");

      const metricValue = extractMetric(properties);

      return {
        html: [
          `<div class="font-semibold text-slate-900">${title}</div>`,
          detail ? `<div class="text-[12px] text-slate-500">${detail}</div>` : "",
          metricValue !== null
            ? `<div class="mt-1 text-[12px] text-slate-600">Metric ${metricValue}</div>`
            : "",
        ].join(""),
        style: tooltipStyle,
      };
    };
  }, []);

  const handleZoom = useCallback(
    (delta: number) => {
      setViewState((current) => ({
        ...current,
        zoom: clamp(current.zoom + delta, current.minZoom ?? 4, current.maxZoom ?? 18),
      }));
    },
    [],
  );

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-100 via-slate-200/90 to-slate-100 sm:h-[440px] lg:h-[520px] xl:h-[560px]">
      {renderSupport === "supported" ? (
        <DeckGL
          viewState={viewState}
          controller={{
            dragPan: true,
            scrollZoom: true,
            dragRotate: false,
            doubleClickZoom: true,
            touchZoom: true,
          }}
          onViewStateChange={({ viewState: next }) => setViewState(next)}
          layers={layers}
          effects={[lightingEffect]}
          getTooltip={tooltip}
          parameters={{
            clearColor: [0.94, 0.97, 0.99, 1],
          }}
        />
      ) : renderSupport === "unsupported" ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200/90 to-slate-100 text-sm font-medium text-slate-500">
          Interactive map unavailable on this device.
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200/90 to-slate-100 text-sm font-medium text-slate-500">
          Preparing interactive map…
        </div>
      )}
      <div className="pointer-events-none absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm ring-1 ring-slate-900/5">
        {CITY_NAME}
      </div>
      <div className="absolute right-6 top-6 flex flex-col gap-2">
        <button
          type="button"
          className="rounded-full bg-white/95 p-2 shadow-md ring-1 ring-slate-900/10 transition hover:scale-105 hover:bg-white"
          onClick={() => handleZoom(0.6)}
          aria-label="Zoom in"
        >
          <span className="block text-base font-semibold text-slate-600">+</span>
        </button>
        <button
          type="button"
          className="rounded-full bg-white/95 p-2 shadow-md ring-1 ring-slate-900/10 transition hover:scale-105 hover:bg-white"
          onClick={() => handleZoom(-0.6)}
          aria-label="Zoom out"
        >
          <span className="block text-base font-semibold text-slate-600">-</span>
        </button>
      </div>
    </div>
  );
}

const tooltipStyle: Partial<CSSStyleDeclaration> = {
  backgroundColor: "rgba(255,255,255,0.95)",
  borderRadius: "12px",
  padding: "10px 12px",
  boxShadow: "0 18px 32px -20px rgba(15,23,42,0.35)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  color: "#0f172a",
};

function buildScenarioLayers(layer: ScenarioLayer, intensityFactor: number): Layer[] {
  switch (layer.visualization) {
    case "choropleth":
      return [];
    case "flow":
      return [];
    case "point": {
      const radiusMin = clamp(3 + intensityFactor * 4, 3, 12);
      return [
        new ScatterplotLayer({
          id: `scenario-${layer.id}-points`,
          data: layer.dataset.features,
          pickable: true,
          parameters: { depthTest: false },
          getPosition: (feature: { geometry: { coordinates: [number, number] } }) =>
            feature.geometry.coordinates,
          radiusUnits: "pixels",
          getRadius: () => radiusMin,
          getFillColor: () => hexToRgba(layer.style.color, 0.65 + intensityFactor * 0.25),
          getLineColor: () => hexToRgba(layer.style.secondaryColor ?? layer.style.color, 0.9),
          lineWidthUnits: "pixels",
          lineWidthMinPixels: 1.8,
          updateTriggers: {
            getRadius: radiusMin,
          },
        }),
      ];
    }
    default:
      return [];
  }
}

function hexToRgba(color: string, alpha = 1): [number, number, number, number] {
  const normalized = color.replace("#", "");
  const hex = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;
  const value = Number.parseInt(hex, 16);
  if (Number.isNaN(value) || hex.length !== 6) {
    return [30, 64, 175, Math.round(alpha * 255)];
  }
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return [r, g, b, Math.round(clamp(alpha, 0, 1) * 255)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function extractMetric(properties: Record<string, unknown>): string | null {
  const metricKeys: Array<[string, (value: number) => string]> = [
    ["sdgComposite", (value) => `${(value * 100).toFixed(0)} index`],
    ["impactScore", (value) => `${Math.round(value * 100)} impact`],
    ["progressIndex", (value) => `${Math.round(value * 100)} progress`],
    ["householdsReached", (value) => `${Math.round(value / 1000)}k households`],
    ["wellbeingScore", (value) => `${Math.round(value)} wellbeing`],
    ["resilienceScore", (value) => `${Math.round(value * 100)} resilience`],
    ["score", (value) => value.toFixed(2)],
    ["percentage", (value) => `${Math.round(value)}%`],
    ["height", (value) => `${Math.round(value)} m`],
  ];

  for (const [key, formatter] of metricKeys) {
    const raw = properties[key];
    if (typeof raw === "number" && Number.isFinite(raw)) {
      return formatter(raw);
    }
  }

  return null;
}
