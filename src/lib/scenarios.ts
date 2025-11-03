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
    tagline: "Track SDG progress district by district.",
    narrative:
      "Live census, budget, and sensor feeds show how close each district sits to its SDG goals. The twin points to places that need help right now.",
    command: "Back the districts slipping under target before the mayoral stand-up.",
    liveSignals: [
      { label: "Targets on track", value: "68%", delta: "+5%", tone: "positive" },
      { label: "Data refreshed", value: "98%", delta: "+3%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Innovation Basin needs tutoring crews this week.",
        detail: "Attendance dips are pulling SDG 4 behind target; mobile workshops close the gap within five days.",
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
      "Send tutoring teams to Innovation Basin schools.",
      "Share Harbor Loop climate win in tomorrow's VLR brief.",
    ],
  },
  "vlr-automation": {
    key: "vlr-automation",
    name: "VLR Automation Console",
    tagline: "AI keeps the voluntary local review moving.",
    narrative:
      "Evidence from finance, climate, and community systems syncs automatically. Drafts stay live until each steward signs off.",
    command: "Close the executive summary before Friday.",
    liveSignals: [
      { label: "Sections ready", value: "7 / 9", delta: "+2", tone: "positive" },
      { label: "Evidence cleared", value: "92%", delta: "+6%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "SDG 9 packet still needs invoice proof.",
        detail: "Finance ledger lacks tags for two projects; automation can reconcile once the steward approves the fetch.",
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
      "Ping finance to clear the SDG 9 invoice evidence.",
      "Publish the SDG 11 public space story once quotes land.",
    ],
  },
  "city-profiling": {
    key: "city-profiling",
    name: "City Profiling Studio",
    tagline: "See how funding choices shift wellbeing.",
    narrative:
      "The twin blends demographics, capital plans, and sentiment to rank regeneration moves. Leaders get a clear view of where money changes outcomes.",
    command: "Choose the next three districts for funding before the council vote.",
    liveSignals: [
      { label: "Wellbeing score", value: "74 / 100", delta: "+4", tone: "positive" },
      { label: "Capital on track", value: "81%", delta: "-3%", tone: "warning" },
    ],
    aiInsights: [
      {
        title: "Northern Commons still delivers the biggest lift.",
        detail: "A $14M streetscape bundle moves the wellbeing score six points while keeping displacement risk low.",
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
      "Advance Northern Commons bundle to the council pipeline.",
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
