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
    .filter((kpi): kpi is SystemKpi => Boolean(kpi));
}

const scenarioRegistry: Record<ScenarioKey, ScenarioDefinition> = {
  "sdg-localization": {
    key: "sdg-localization",
    name: "SDG Localization Twin",
    tagline: "District-level SDG progress blending equity signals with live evidence feeds.",
    narrative:
      "Nexus fuses census refreshes, participatory budgeting inputs, and IoT observatories to map how SDG targets land street-by-street. Automated insights highlight districts slipping behind before the next quarterly briefing.",
    command: "Prioritize districts that need SDG acceleration ahead of the mayoral check-in.",
    liveSignals: [
      { label: "Targets On Track", value: "68%", delta: "+5%", tone: "positive" },
      { label: "Equity Gap", value: "Moderate", delta: "-7%", tone: "positive" },
      { label: "Data Freshness", value: "98%", delta: "+3%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Innovation Basin Studio lags on SDG 4.3 despite new training pods.",
        detail: "Cohort completion sits 11 points under target; AI recommends deploying mobile workshop units and micro-credential campaigns within 10 days.",
        confidence: 0.87,
      },
      {
        title: "Harbor Resilience Loop can hit SDG 13.1 ahead of schedule.",
        detail: "Climate adaptation projects deliver 340 households beyond plan; pitch this as a headline outcome in the VLR narrative.",
        confidence: 0.79,
      },
    ],
    kpis: selectKpis(["sdg-alignment", "equity-gap-closure"]),
    layers: [
      {
        id: "district-sdg-composite",
        label: "District SDG Composite",
        legend: "Polygons shaded by composite SDG readiness and equity lift.",
        visualization: "choropleth",
        dataset: districtSnapshots as unknown as GenericFeatureCollection,
        style: { color: "#38bdf8", secondaryColor: "#0ea5e9", intensity: 0.78 },
      },
      {
        id: "indicator-observatories",
        label: "Indicator Observatories",
        legend: "Pulsing sites surface indicators trending off target.",
        visualization: "point",
        dataset: indicatorSites as unknown as GenericFeatureCollection,
        style: { color: "#7c3aed", secondaryColor: "#a855f7", intensity: 0.62 },
      },
      {
        id: "impact-corridors",
        label: "Impact Corridors",
        legend: "Activations highlight live programs accelerating SDG delivery.",
        visualization: "flow",
        dataset: impactCorridors as unknown as GenericFeatureCollection,
        style: { color: "#0ea5e9", secondaryColor: "#22d3ee", intensity: 0.7 },
      },
    ],
    actions: [
      "Publish SDG 11 micro-brief with resolved gaps for Innovation Basin Studio.",
      "Escalate Civic Learning Spine success story into the VLR storytelling track.",
      "Trigger community studio invite for Care Corridor Spine stakeholders.",
    ],
  },
  "vlr-automation": {
    key: "vlr-automation",
    name: "VLR Automation Console",
    tagline: "AI assembles evidence, drafts narratives, and flags compliance gaps for the next submission.",
    narrative:
      "Digital pipelines pull finance, sustainability, and community feedback sources into a governed workspace. Draft sections, evidence tables, and assurance checks update continuously as new data flows in.",
    command: "Lock the VLR executive summary by Friday with clear SDG wins and remediation paths.",
    liveSignals: [
      { label: "Sections Drafted", value: "7 / 9", delta: "+2", tone: "positive" },
      { label: "Evidence Confidence", value: "92%", delta: "+6%", tone: "positive" },
      { label: "Assurance Flags", value: "Low", delta: "-3", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Narrative engine recommends elevating SDG 11.7 public space upgrades.",
        detail: "Auto-summarized testimony from citizens in the Civic Commons Lab strengthens the story and aligns with council priorities.",
        confidence: 0.83,
      },
      {
        title: "Compliance bot spotted metadata gaps in SDG 9.1 evidence packets.",
        detail: "Two corridor programs lack geotagged invoices; automation can reconcile with the finance API in 14 minutes once authorized.",
        confidence: 0.9,
      },
    ],
    kpis: selectKpis(["vlr-completion", "assurance-health"]),
    layers: [
      {
        id: "evidence-corridors",
        label: "Evidence Corridors",
        legend: "Flow intensity shows program evidence feeding the VLR workspace.",
        visualization: "flow",
        dataset: impactCorridors as unknown as GenericFeatureCollection,
        style: { color: "#14b8a6", secondaryColor: "#22c55e", intensity: 0.68 },
      },
      {
        id: "evidence-sites",
        label: "Evidence Sites",
        legend: "Nodes pulse when indicator packets need curator review.",
        visualization: "point",
        dataset: indicatorSites as unknown as GenericFeatureCollection,
        style: { color: "#f97316", secondaryColor: "#fb923c", intensity: 0.58 },
      },
    ],
    actions: [
      "Route SDG 9.1 packet reconciliation to automation queue and notify finance steward.",
      "Approve AI narrative draft for SDG 11.7 and push to executive summary.",
      "Trigger cross-team review for Care Corridor Spine health access indicator.",
    ],
  },
  "city-profiling": {
    key: "city-profiling",
    name: "City Profiling Studio",
    tagline: "Urban digital twin compares investment pathways and wellbeing outcomes at district scale.",
    narrative:
      "Scenario engine blends demographic trends, capital plans, and community sentiment to prioritize regeneration investments. AI surfaces which levers move the wellbeing index without overspending.",
    command: "Select the next three districts for regeneration funding before council vote.",
    liveSignals: [
      { label: "Wellbeing Index", value: "74 / 100", delta: "+4", tone: "positive" },
      { label: "Capital Utilization", value: "81%", delta: "-3%", tone: "warning" },
      { label: "Community Sentiment", value: "Optimistic", delta: "+2%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Northern Commons Network shows strongest wellbeing lift per dollar.",
        detail: "A $14M streetscape bundle moves the wellbeing index by 6 points while cutting displacement risk by 18%.",
        confidence: 0.88,
      },
      {
        title: "Harbor Resilience Loop needs supplemental funding for shoreline access.",
        detail: "Equity model warns SDG 11.7 progress plateaus without an additional $4.2M in inclusive design upgrades.",
        confidence: 0.76,
      },
    ],
    kpis: selectKpis(["wellbeing-index", "capital-readiness"]),
    layers: [
      {
        id: "profile-districts",
        label: "District Profiles",
        legend: "Choropleth shading reflects the composite wellbeing index.",
        visualization: "choropleth",
        dataset: districtSnapshots as unknown as GenericFeatureCollection,
        style: { color: "#a855f7", secondaryColor: "#6366f1", intensity: 0.74 },
      },
      {
        id: "investment-corridors",
        label: "Investment Corridors",
        legend: "Flows indicate prioritized capital programs and reach.",
        visualization: "flow",
        dataset: impactCorridors as unknown as GenericFeatureCollection,
        style: { color: "#38bdf8", secondaryColor: "#22d3ee", intensity: 0.65 },
      },
      {
        id: "wellbeing-sentinels",
        label: "Wellbeing Sentinels",
        legend: "Sites pulse when wellbeing indicators deviate from forecast.",
        visualization: "point",
        dataset: indicatorSites as unknown as GenericFeatureCollection,
        style: { color: "#22c55e", secondaryColor: "#4ade80", intensity: 0.6 },
      },
    ],
    actions: [
      "Advance Northern Commons streetscape bundle to council pipeline.",
      "Draft community feedback brief for Harbor Resilience Loop shoreline upgrades.",
      "Share wellbeing uplift scenarios with budget office for funding alignment.",
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
