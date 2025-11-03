export type TrendDirection = "up" | "down";

export type SystemKpi = {
  id: string;
  label: string;
  unit: string;
  value: number;
  change: {
    direction: TrendDirection;
    percentage: number;
    period: string;
  };
};

export type ForecastPoint = {
  timestamp: string;
  value: number;
};

export type ForecastSeries = {
  scenario: string;
  metric: string;
  horizon: string;
  points: ForecastPoint[];
};

export type AnomalyCluster = {
  id: string;
  cluster: string;
  severity: "low" | "moderate" | "high";
  affectedAssets: number;
  expectedResolutionMinutes: number;
};

export const citywideKpis: SystemKpi[] = [
  {
    id: "mobility-throughput",
    label: "Mobility Throughput",
    unit: "rides/day",
    value: 128400,
    change: { direction: "up", percentage: 12.4, period: "7 days" },
  },
  {
    id: "grid-resilience",
    label: "Grid Resilience",
    unit: "stability index",
    value: 92,
    change: { direction: "up", percentage: 6.3, period: "30 days" },
  },
  {
    id: "incident-response",
    label: "Incident Response",
    unit: "minutes",
    value: 11.4,
    change: { direction: "down", percentage: 18.2, period: "quarter" },
  },
  {
    id: "air-quality-index",
    label: "Air Quality Index",
    unit: "AQI",
    value: 41,
    change: { direction: "down", percentage: 9.8, period: "month" },
  },
];

export const demandForecast: ForecastSeries = {
  scenario: "mobility",
  metric: "corridor-load",
  horizon: "Next 24 Hours",
  points: [
    { timestamp: "2025-11-03T08:00:00Z", value: 0.44 },
    { timestamp: "2025-11-03T10:00:00Z", value: 0.58 },
    { timestamp: "2025-11-03T12:00:00Z", value: 0.72 },
    { timestamp: "2025-11-03T14:00:00Z", value: 0.63 },
    { timestamp: "2025-11-03T16:00:00Z", value: 0.81 },
    { timestamp: "2025-11-03T18:00:00Z", value: 0.9 },
    { timestamp: "2025-11-03T20:00:00Z", value: 0.76 },
    { timestamp: "2025-11-03T22:00:00Z", value: 0.48 },
  ],
};

export const resilienceForecast: ForecastSeries = {
  scenario: "climate",
  metric: "heat-index",
  horizon: "Next 7 Days",
  points: [
    { timestamp: "2025-11-04", value: 32 },
    { timestamp: "2025-11-05", value: 34 },
    { timestamp: "2025-11-06", value: 31 },
    { timestamp: "2025-11-07", value: 29 },
    { timestamp: "2025-11-08", value: 27 },
    { timestamp: "2025-11-09", value: 30 },
    { timestamp: "2025-11-10", value: 33 },
  ],
};

export const anomalyClusters: AnomalyCluster[] = [
  {
    id: "mobility-aois",
    cluster: "Downtown Transit Hub",
    severity: "moderate",
    affectedAssets: 14,
    expectedResolutionMinutes: 26,
  },
  {
    id: "energy-surge",
    cluster: "Innovation Basin Microgrid",
    severity: "high",
    affectedAssets: 9,
    expectedResolutionMinutes: 38,
  },
  {
    id: "air-quality-spike",
    cluster: "Harbor District Sensor Array",
    severity: "low",
    affectedAssets: 6,
    expectedResolutionMinutes: 15,
  },
];

export type ModelPerformanceStat = {
  id: string;
  metric: string;
  value: string;
  change: string;
  tone: TrendDirection;
};

export const modelPerformanceStats: ModelPerformanceStat[] = [
  {
    id: "mobility-mape",
    metric: "Mobility Demand MAPE",
    value: "5.2%",
    change: "-1.4%",
    tone: "down",
  },
  {
    id: "energy-r2",
    metric: "Energy Load R²",
    value: "0.94",
    change: "+0.03",
    tone: "up",
  },
  {
    id: "incident-rmse",
    metric: "Incident ETA RMSE",
    value: "2.8 min",
    change: "-0.6",
    tone: "down",
  },
];

export type ScenarioComparison = {
  id: string;
  scenario: string;
  baseline: number;
  optimized: number;
  unit: string;
  narrative: string;
};

export const scenarioComparisons: ScenarioComparison[] = [
  {
    id: "mobility-vs-ai",
    scenario: "Mobility",
    baseline: 78,
    optimized: 93,
    unit: "corridor efficiency",
    narrative: "Adaptive signal retiming + curb reprioritization",
  },
  {
    id: "energy-vs-ai",
    scenario: "Energy",
    baseline: 74,
    optimized: 90,
    unit: "resilience buffer",
    narrative: "Edge battery dispatch + predictive load shedding",
  },
  {
    id: "climate-vs-ai",
    scenario: "Climate",
    baseline: 69,
    optimized: 88,
    unit: "risk mitigation score",
    narrative: "Storm surge simulation + shelter orchestration",
  },
  {
    id: "safety-vs-ai",
    scenario: "Safety",
    baseline: 81,
    optimized: 95,
    unit: "response readiness",
    narrative: "Crowd density fusion + sentiment triage",
  },
];

export type RiskCell = {
  id: string;
  district: string;
  quadrant: "Mobility" | "Energy" | "Climate" | "Safety";
  score: number;
  driver: string;
};

export const riskCells: RiskCell[] = [
  {
    id: "skyloop",
    district: "Skyloop Express",
    quadrant: "Mobility",
    score: 0.82,
    driver: "Evening rush surge",
  },
  {
    id: "innovation-basin",
    district: "Innovation Basin",
    quadrant: "Energy",
    score: 0.91,
    driver: "Microgrid overload risk",
  },
  {
    id: "harbor-district",
    district: "Harbor District",
    quadrant: "Climate",
    score: 0.76,
    driver: "Storm surge exposure",
  },
  {
    id: "northern-commons",
    district: "Northern Commons",
    quadrant: "Safety",
    score: 0.68,
    driver: "Festival crowding",
  },
  {
    id: "eastside-ring",
    district: "Eastside Ring",
    quadrant: "Mobility",
    score: 0.59,
    driver: "Transit reliability dip",
  },
  {
    id: "aerotropolis",
    district: "Aerotropolis Hub",
    quadrant: "Energy",
    score: 0.73,
    driver: "EV charging peaks",
  },
];

export type ExplainabilitySnippet = {
  id: string;
  title: string;
  detail: string;
};

export const explainabilitySnippets: ExplainabilitySnippet[] = [
  {
    id: "shap",
    title: "SHAP feature cascade surfaced load drivers",
    detail: "Demand spikes traced back to rideshare surge zones and ferry arrivals, aligning stakeholder intuition with model rationale.",
  },
  {
    id: "confidence-bands",
    title: "Confidence bands tighten after drift retraining",
    detail: "Active learning loop ingests field telemetry every 45 minutes, keeping prediction variance under 7%.",
  },
  {
    id: "policy-guardrails",
    title: "Policy guardrails enforce equity thresholds",
    detail: "Fairness constraints automatically rebalance interventions to prioritize historically underserved districts.",
  },
];
