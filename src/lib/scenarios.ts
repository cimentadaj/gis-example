import { citywideKpis, demandForecast, resilienceForecast, anomalyClusters } from "@/data/metrics";
import { mobilityFlows } from "@/data/geo/mobility-flows";
import { resilienceZones } from "@/data/geo/resilience-zones";
import { sensorNetwork } from "@/data/geo/sensor-network";
import type { FeatureCollection, GeometryType } from "@/data/geo/types";
import type { SystemKpi } from "@/data/metrics";

export type ScenarioKey = "mobility" | "energy" | "climate" | "safety";

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
  mobility: {
    key: "mobility",
    name: "Mobility Flow Optimization",
    tagline: "Predictive demand, multimodal orchestration, and equitable curb space.",
    narrative:
      "AI agents fuse real-time feeds from transit turnstiles, ride-hail APIs, and curbside sensors to choreograph fleets across the city. Dynamic congestion pricing, micro-mobility balancing, and rapid incident triage keep riders moving.",
    command: "Stabilize downtown rush-hour throughput without triggering emissions penalties.",
    liveSignals: [
      { label: "Congestion", value: "Moderate", delta: "-12%", tone: "positive" },
      { label: "Energy Load", value: "High", delta: "+5%", tone: "warning" },
      { label: "Air Quality", value: "Stable", delta: "+2%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Adaptive signal timing suggests a 9% queue reduction along Skyloop Express.",
        detail: "Edge models detected platoon drift at two arterial intersections; re-timing is estimated to shave 3.5 minutes off peak commute.",
        confidence: 0.88,
      },
      {
        title: "Dynamic curb pricing curbs freight stalling in the Harbor Connector.",
        detail: "Freight compliance climbs to 94% when a surge fee is applied for 45 minutes; reroute suggestions keep micromobility lanes uncongested.",
        confidence: 0.79,
      },
    ],
    kpis: selectKpis(["mobility-throughput", "incident-response"]),
    layers: [
      {
        id: "corridor-flows",
        label: "Corridor Load vs Capacity",
        legend: "Line width and glow intensity represent corridor stress during peak windows.",
        visualization: "flow",
        dataset: mobilityFlows as unknown as GenericFeatureCollection,
        style: { color: "#38bdf8", secondaryColor: "#0ea5e9", intensity: 0.85 },
      },
      {
        id: "traffic-sensors",
        label: "Traffic Sensor Health",
        legend: "Node pulses highlight anomaly scores and hardware status.",
        visualization: "point",
        dataset: sensorNetwork as unknown as GenericFeatureCollection,
        style: { color: "#f97316", intensity: 0.6 },
      },
    ],
    actions: [
      "Activate adaptive signal pack for Skyloop Express and sync with micromobility feed.",
      "Notify curbside freight operators; recommend staging shift to Innovation Basin before 18:00.",
      "Push demand forecast overlay to command wall for joint operations briefing.",
    ],
  },
  energy: {
    key: "energy",
    name: "Energy Resilience Balancing",
    tagline: "Grid-aware microgrids, DER orchestration, and carbon-aware dispatch.",
    narrative:
      "Machine learning forecasts align district loads with distributed energy resources. The platform identifies cascading outages before they materialize and choreographs battery assets to keep critical services online.",
    command: "Maintain substation margins while keeping carbon intensity below 280 gCO₂/kWh.",
    liveSignals: [
      { label: "Substation Margin", value: "Safe", delta: "+8%", tone: "positive" },
      { label: "Carbon Intensity", value: "272 gCO₂", delta: "-6%", tone: "positive" },
      { label: "Microgrid Status", value: "Alerted", delta: "+1", tone: "warning" },
    ],
    aiInsights: [
      {
        title: "Thermal storage pre-charge recommended in Harbor District.",
        detail: "Temperature anomaly clusters align with demand spikes at 19:00; 11% cost avoidance projected with early charge.",
        confidence: 0.83,
      },
      {
        title: "Innovation Basin microgrid is trending toward brownout.",
        detail: "Transformer load forecast breaches 92% in 45 minutes; dispatch hybrid generators to maintain service.",
        confidence: 0.9,
      },
    ],
    kpis: selectKpis(["grid-resilience", "air-quality-index"]),
    layers: [
      {
        id: "resilience-cells",
        label: "District Resilience Scores",
        legend: "Choropleth shading communicates climate resilience readiness.",
        visualization: "choropleth",
        dataset: resilienceZones as unknown as GenericFeatureCollection,
        style: { color: "#14b8a6", secondaryColor: "#0f766e", intensity: 0.7 },
      },
      {
        id: "power-sensors",
        label: "Critical Power Sensors",
        legend: "Pulsing nodes surfaced when anomaly score exceeds 0.6.",
        visualization: "point",
        dataset: sensorNetwork as unknown as GenericFeatureCollection,
        style: { color: "#facc15", intensity: 0.65 },
      },
    ],
    actions: [
      "Dispatch DER fleet pre-charge for Innovation Basin before 18:45.",
      "Notify hospitals on Harbor District channel about potential load shedding sequence.",
      "Initiate automated carbon offset swap to keep intensity below target.",
    ],
  },
  climate: {
    key: "climate",
    name: "Climate Resilience Index",
    tagline: "Early warning on heat, flooding, and storm surge for vulnerable districts.",
    narrative:
      "Digital twin simulations ingest hyperlocal weather, tidal sensors, and satellite imagery to quantify exposure and guide proactive adaptation projects.",
    command: "Quantify and mitigate climate risk for coastal communities ahead of incoming storm front.",
    liveSignals: [
      { label: "Flood Probability", value: "Elevated", delta: "+9%", tone: "warning" },
      { label: "Heat Index", value: "32°C", delta: "+3°C", tone: "warning" },
      { label: "Shelter Capacity", value: "Adequate", delta: "+5%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Storm surge overlay highlights Harbor District vulnerabilities.",
        detail: "Projected inundation depth exceeds 0.6m across Pier 6; deploy temporary barriers within 3 hours.",
        confidence: 0.92,
      },
      {
        title: "Cooling center load expected to exceed safe capacity by 18%.",
        detail: "Recommend extending hours at Innovation Basin community nodes and alerting vulnerable populations.",
        confidence: 0.76,
      },
    ],
    kpis: selectKpis(["grid-resilience", "incident-response"]),
    layers: [
      {
        id: "resilience-gradient",
        label: "Resilience Gradient",
        legend: "Zones shaded by adaptive capacity to climate threats.",
        visualization: "choropleth",
        dataset: resilienceZones as unknown as GenericFeatureCollection,
        style: { color: "#6366f1", secondaryColor: "#a855f7", intensity: 0.8 },
      },
      {
        id: "environmental-sensors",
        label: "Environment Sensors",
        legend: "Air quality and heat stress monitors pulsing as anomalies emerge.",
        visualization: "point",
        dataset: sensorNetwork as unknown as GenericFeatureCollection,
        style: { color: "#22d3ee", intensity: 0.55 },
      },
    ],
    actions: [
      "Activate floodgate drill along Harbor District piers.",
      "Update climate risk dashboard with fresh resilience forecast outputs.",
      "Coordinate cooling center staffing for Northern Commons neighborhoods.",
    ],
  },
  safety: {
    key: "safety",
    name: "Public Safety Fusion",
    tagline: "Unified command across emergency response, crowd safety, and situational awareness.",
    narrative:
      "Machine vision, NLP incident parsing, and social listening unify the intelligence picture. Response teams receive AI-curated playbooks with equity-aware deployment suggestions.",
    command: "Stabilize festival crowds while preserving response readiness citywide.",
    liveSignals: [
      { label: "Response Readiness", value: "Optimal", delta: "+4%", tone: "positive" },
      { label: "Crowd Density", value: "High", delta: "+11%", tone: "warning" },
      { label: "Incident Volume", value: "Low", delta: "-6%", tone: "positive" },
    ],
    aiInsights: [
      {
        title: "Festival ingress lanes trending toward overcapacity.",
        detail: "Recommend geo-fencing micromobility drop zones and dispatching extra med units to Sector B.",
        confidence: 0.84,
      },
      {
        title: "Social sentiment suggests misinformation spike near Innovation Basin.",
        detail: "Deploy rapid messaging and coordinate with public information officers to stabilize sentiment.",
        confidence: 0.7,
      },
    ],
    kpis: selectKpis(["incident-response", "mobility-throughput"]),
    layers: [
      {
        id: "sensor-health",
        label: "Sensor Health Watchlist",
        legend: "Offline or degraded sensors surface for technician routing.",
        visualization: "point",
        dataset: sensorNetwork as unknown as GenericFeatureCollection,
        style: { color: "#ef4444", intensity: 0.75 },
      },
      {
        id: "movement-corridors",
        label: "Movement Corridors",
        legend: "Dynamic flows track ingress/egress to critical venues.",
        visualization: "flow",
        dataset: mobilityFlows as unknown as GenericFeatureCollection,
        style: { color: "#f472b6", secondaryColor: "#fb7185", intensity: 0.7 },
      },
    ],
    actions: [
      "Stage rapid response pod near Sector B with shared situational feed.",
      "Synchronize social sentiment insights with public communications team.",
      "Lock in drone corridor for aerial thermal scans every 15 minutes.",
    ],
  },
};

export const defaultScenarioKey: ScenarioKey = "mobility";

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
