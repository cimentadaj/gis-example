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
    id: "sdg-alignment",
    label: "SDG Alignment Rate",
    unit: "% targets on track",
    value: 68,
    change: { direction: "up", percentage: 5.4, period: "quarter" },
  },
  {
    id: "vlr-completion",
    label: "VLR Completion",
    unit: "% sections ready",
    value: 78,
    change: { direction: "up", percentage: 12.6, period: "week" },
  },
  {
    id: "equity-gap-closure",
    label: "Equity Gap Closure",
    unit: "index",
    value: 0.63,
    change: { direction: "up", percentage: 8.1, period: "month" },
  },
  {
    id: "assurance-health",
    label: "Assurance Health",
    unit: "% coverage",
    value: 92,
    change: { direction: "up", percentage: 3.2, period: "14 days" },
  },
  {
    id: "wellbeing-index",
    label: "Wellbeing Index",
    unit: "score",
    value: 74,
    change: { direction: "up", percentage: 4.7, period: "quarter" },
  },
  {
    id: "capital-readiness",
    label: "Capital Readiness",
    unit: "% pipeline funded",
    value: 81,
    change: { direction: "down", percentage: 3.1, period: "month" },
  },
];

export const demandForecast: ForecastSeries = {
  scenario: "sdg-localization",
  metric: "sdg-impact",
  horizon: "Next 24 Hours",
  points: [
    { timestamp: "2025-11-03T08:00:00Z", value: 0.46 },
    { timestamp: "2025-11-03T10:00:00Z", value: 0.58 },
    { timestamp: "2025-11-03T12:00:00Z", value: 0.72 },
    { timestamp: "2025-11-03T14:00:00Z", value: 0.66 },
    { timestamp: "2025-11-03T16:00:00Z", value: 0.81 },
    { timestamp: "2025-11-03T18:00:00Z", value: 0.88 },
    { timestamp: "2025-11-03T20:00:00Z", value: 0.76 },
    { timestamp: "2025-11-03T22:00:00Z", value: 0.52 },
  ],
};

export const resilienceForecast: ForecastSeries = {
  scenario: "city-profiling",
  metric: "wellbeing-outlook",
  horizon: "Next 6 Weeks",
  points: [
    { timestamp: "2025-11-04", value: 72 },
    { timestamp: "2025-11-11", value: 73 },
    { timestamp: "2025-11-18", value: 74 },
    { timestamp: "2025-11-25", value: 72 },
    { timestamp: "2025-12-02", value: 75 },
    { timestamp: "2025-12-09", value: 77 },
    { timestamp: "2025-12-16", value: 79 },
  ],
};

export const anomalyClusters: AnomalyCluster[] = [
  {
    id: "sdg-green-schoolyards",
    cluster: "Green Schoolyards Evidence Gap",
    severity: "moderate",
    affectedAssets: 6,
    expectedResolutionMinutes: 34,
  },
  {
    id: "housing-dossier",
    cluster: "Affordable Housing Dossier",
    severity: "high",
    affectedAssets: 9,
    expectedResolutionMinutes: 42,
  },
  {
    id: "climate-innovation",
    cluster: "Innovation Basin Climate Packet",
    severity: "low",
    affectedAssets: 4,
    expectedResolutionMinutes: 18,
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
    id: "narrative-quality",
    metric: "Narrative Draft Quality",
    value: "94%",
    change: "+5%",
    tone: "up",
  },
  {
    id: "evidence-match",
    metric: "Evidence Match Rate",
    value: "97%",
    change: "+3%",
    tone: "up",
  },
  {
    id: "assurance-drift",
    metric: "Assurance Drift",
    value: "1.8%",
    change: "-0.6%",
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
    id: "sdg-vs-ai",
    scenario: "SDG Localization",
    baseline: 62,
    optimized: 78,
    unit: "targets met",
    narrative: "AI prioritization + community studio sprint",
  },
  {
    id: "vlr-vs-ai",
    scenario: "VLR Automation",
    baseline: 58,
    optimized: 86,
    unit: "sections ready",
    narrative: "Evidence reconciliation + AI narratives",
  },
  {
    id: "city-vs-ai",
    scenario: "City Profiling",
    baseline: 69,
    optimized: 83,
    unit: "wellbeing index",
    narrative: "Capital re-sequencing + wellbeing uplift",
  },
];

export type RiskQuadrant = "SDG" | "VLR" | "Equity" | "Capital";

export type RiskCell = {
  id: string;
  district: string;
  quadrant: RiskQuadrant;
  score: number;
  driver: string;
};

export const riskCells: RiskCell[] = [
  {
    id: "harbor-loop",
    district: "Harbor Resilience Loop",
    quadrant: "SDG",
    score: 0.86,
    driver: "SDG 13.1 climate adaptation surge",
  },
  {
    id: "innovation-basin",
    district: "Innovation Basin Studio",
    quadrant: "VLR",
    score: 0.79,
    driver: "Evidence packets pending curator sign-off",
  },
  {
    id: "northern-commons",
    district: "Northern Commons Network",
    quadrant: "Equity",
    score: 0.91,
    driver: "Housing inclusion investments outperform forecast",
  },
  {
    id: "civic-spine",
    district: "Civic Learning Spine",
    quadrant: "Capital",
    score: 0.74,
    driver: "Capital drawdown pacing below target",
  },
];

export type ExplainabilitySnippet = {
  id: string;
  title: string;
  detail: string;
};

export const explainabilitySnippets: ExplainabilitySnippet[] = [
  {
    id: "sdg-traceability",
    title: "Traceability links every claim to source evidence",
    detail: "Each SDG statement in the narrative carries a deep link to its dataset, steward, and refresh timestamp.",
  },
  {
    id: "fairness-monitor",
    title: "Equity monitor enforces distributional guardrails",
    detail: "Counterfactual tests confirm interventions do not widen the wellbeing gap for historically excluded districts.",
  },
  {
    id: "copilot-review",
    title: "Copilot review mode captures human overrides",
    detail: "City analysts annotate AI suggestions, training the model to respect local policy nuance without manual retraining.",
  },
];
