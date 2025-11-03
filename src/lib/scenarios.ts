import { citywideKpis, demandForecast, resilienceForecast, anomalyClusters } from "@/data/metrics";
import { impactCorridors } from "@/data/geo/impact-corridors";
import { districtSnapshots } from "@/data/geo/district-snapshots";
import { indicatorSites } from "@/data/geo/indicator-sites";
import type { FeatureCollection, GeometryType } from "@/data/geo/types";
import type { SystemKpi } from "@/data/metrics";

export type ScenarioKey = "sdg-localization" | "vlr-automation" | "city-profiling";

export type ScenarioSignal = {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "warning" | "neutral";
};

export type ScenarioInsight = {
  title: string;
  detail: string;
  confidence: number;
};

export type ScenarioLayer = {
  id: string;
  label: string;
  legend: string;
  visualization: "flow" | "choropleth" | "point";
  dataset: FeatureCollection<GeometryType, Record<string, unknown>>;
  style: {
    color: string;
    secondaryColor?: string;
    intensity: number;
  };
};

type GenericFeatureCollection = FeatureCollection<GeometryType, Record<string, unknown>>;

export type ScenarioDefinition = {
  key: ScenarioKey;
  name: string;
  tagline: string;
  narrative: string;
  command: string;
  liveSignals: ScenarioSignal[];
  aiInsights: ScenarioInsight[];
  kpis: SystemKpi[];
  layers: ScenarioLayer[];
  actions: string[];
};

const defaultKpiLookup = Object.fromEntries(citywideKpis.map((kpi) => [kpi.id, kpi]));

function selectKpis(ids: string[]): SystemKpi[] {
  return ids
    .map((id) => defaultKpiLookup[id])
    .filter((kpi): kpi is SystemKpi => Boolean(kpi))
    .map((kpi) => ({ ...kpi }));
}

const scenarioRegistry: Record<ScenarioKey, ScenarioDefinition> = {
  "sdg-localization": {
    key: "sdg-localization",
    name: "SDG Localization Twin",
    tagline: "District SDG scorecards update in real time.",
    narrative:
      "Census, budget, and survey feeds flag which districts fall behind so crews can move before targets slip.",
    command: "Resolve the two districts slipping before the daily stand-up.",
    liveSignals: [
      { label: "Districts on track", value: "12 of 18", delta: "+1 today", tone: "positive" },
      { label: "Data refresh", value: "98%", delta: "Live", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Send the tutoring crew back to Innovation Basin.",
        detail: "Attendance dipped in two schools; a mobile team lifts SDG 4 back on track within five days.",
        confidence: 0.82,
      },
    ],
    kpis: selectKpis(["sdg-progress"]),
    layers: [
      {
        id: "district-sdg-composite",
        label: "District SDG Composite",
        legend: "Blue shows overall SDG score for each district.",
        visualization: "choropleth",
        dataset: districtSnapshots as unknown as GenericFeatureCollection,
        style: { color: "#38bdf8", secondaryColor: "#0ea5e9", intensity: 0.78 },
      },
      {
        id: "indicator-observatories",
        label: "Indicator Observatories",
        legend: "Pins mark indicators drifting from plan.",
        visualization: "point",
        dataset: indicatorSites as unknown as GenericFeatureCollection,
        style: { color: "#7c3aed", secondaryColor: "#a855f7", intensity: 0.62 },
      },
      {
        id: "impact-corridors",
        label: "Impact Corridors",
        legend: "Lines show active programs boosting SDG delivery.",
        visualization: "flow",
        dataset: impactCorridors as unknown as GenericFeatureCollection,
        style: { color: "#0ea5e9", secondaryColor: "#22d3ee", intensity: 0.7 },
      },
    ],
    actions: [
      "Deploy the mobile tutoring team to Innovation Basin.",
      "Add Harbor Loop’s climate win to tomorrow’s VLR brief.",
    ],
  },
  "vlr-automation": {
    key: "vlr-automation",
    name: "VLR Automation Console",
    tagline: "AI keeps the voluntary local review on schedule.",
    narrative:
      "Evidence from finance, climate, and community teams syncs automatically so drafts stay ready for sign-off.",
    command: "Publish the executive summary by Friday.",
    liveSignals: [
      { label: "Sections ready", value: "7 / 9", delta: "+2 today", tone: "positive" },
      { label: "Evidence cleared", value: "92%", delta: "+6%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "SDG 9 packet still waits on invoice tags.",
        detail: "Finance is missing two project codes; approve the fetch and the automation will reconcile them.",
        confidence: 0.9,
      },
    ],
    kpis: selectKpis(["vlr-ready"]),
    layers: [
      {
        id: "evidence-corridors",
        label: "Evidence Corridors",
        legend: "Lines show which programs feed the VLR workspace.",
        visualization: "flow",
        dataset: impactCorridors as unknown as GenericFeatureCollection,
        style: { color: "#14b8a6", secondaryColor: "#22c55e", intensity: 0.68 },
      },
      {
        id: "evidence-sites",
        label: "Evidence Sites",
        legend: "Pins highlight packets waiting for review.",
        visualization: "point",
        dataset: indicatorSites as unknown as GenericFeatureCollection,
        style: { color: "#f97316", secondaryColor: "#fb923c", intensity: 0.58 },
      },
    ],
    actions: [
      "Nudge finance to clear the SDG 9 invoices.",
      "Publish the SDG 11 public space story after quotes land.",
    ],
  },
  "city-profiling": {
    key: "city-profiling",
    name: "City Profiling Studio",
    tagline: "Compare wellbeing lift by district.",
    narrative:
      "The twin blends demographics, capital plans, and sentiment to show which projects move wellbeing fastest.",
    command: "Select the next three districts for council funding.",
    liveSignals: [
      { label: "Wellbeing score", value: "74 index", delta: "+4 pts", tone: "positive" },
      { label: "Capital on track", value: "81% funded", delta: "-3%", tone: "warning" },
    ],
    aiInsights: [
      {
        title: "Northern Commons still delivers the biggest lift.",
        detail: "A $14M streetscape bundle lifts wellbeing six points without raising displacement risk.",
        confidence: 0.88,
      },
    ],
    kpis: selectKpis(["wellbeing-score", "capital-ready"]),
    layers: [
      {
        id: "profile-districts",
        label: "District Profiles",
        legend: "Purple shows overall wellbeing score.",
        visualization: "choropleth",
        dataset: districtSnapshots as unknown as GenericFeatureCollection,
        style: { color: "#a855f7", secondaryColor: "#6366f1", intensity: 0.74 },
      },
      {
        id: "investment-corridors",
        label: "Investment Corridors",
        legend: "Lines trace priority capital programs.",
        visualization: "flow",
        dataset: impactCorridors as unknown as GenericFeatureCollection,
        style: { color: "#38bdf8", secondaryColor: "#22d3ee", intensity: 0.65 },
      },
      {
        id: "wellbeing-sentinels",
        label: "Wellbeing Sentinels",
        legend: "Pins pulse if wellbeing deviates from forecast.",
        visualization: "point",
        dataset: indicatorSites as unknown as GenericFeatureCollection,
        style: { color: "#22c55e", secondaryColor: "#4ade80", intensity: 0.6 },
      },
    ],
    actions: [
      "Advance the Northern Commons package to the council agenda.",
      "Share Harbor Loop shoreline options with the budget office.",
    ],
  },
};

export const defaultScenarioKey: ScenarioKey = "sdg-localization";

export function listScenarioSummaries() {
  return Object.values(scenarioRegistry).map((scenario) => ({
    key: scenario.key,
    name: scenario.name,
    tagline: scenario.tagline,
    command: scenario.command,
  }));
}

export function getScenarioConfig(key: ScenarioKey) {
  return scenarioRegistry[key];
}

export function getScenarioLayers(key: ScenarioKey) {
  return scenarioRegistry[key]?.layers ?? [];
}

export function listScenarioInsights(key: ScenarioKey) {
  const scenario = scenarioRegistry[key];
  if (!scenario) {
    return [];
  }

  return {
    signals: scenario.liveSignals,
    aiInsights: scenario.aiInsights,
    kpis: scenario.kpis,
    actions: scenario.actions,
  };
}

export const scenarioDataRail = {
  demandForecast,
  resilienceForecast,
  anomalyClusters,
};
