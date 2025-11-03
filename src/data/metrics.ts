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
    id: "sdg-progress",
    label: "SDG Progress",
    unit: "% on track",
    value: 68,
    change: { direction: "up", percentage: 4.8, period: "month" },
  },
  {
    id: "vlr-ready",
    label: "VLR Ready",
    unit: "% ready",
    value: 78,
    change: { direction: "up", percentage: 12.4, period: "week" },
  },
  {
    id: "wellbeing-score",
    label: "Wellbeing Score",
    unit: "index",
    value: 74,
    change: { direction: "up", percentage: 4.2, period: "quarter" },
  },
  {
    id: "capital-ready",
    label: "Capital Ready",
    unit: "% funded",
    value: 81,
    change: { direction: "down", percentage: 2.6, period: "month" },
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
    cluster: "Schoolyard retrofit evidence lag",
    severity: "moderate",
    affectedAssets: 4,
    expectedResolutionMinutes: 32,
  },
  {
    id: "housing-dossier",
    cluster: "Affordable housing packet waiting sign-off",
    severity: "high",
    affectedAssets: 6,
    expectedResolutionMinutes: 38,
  },
  {
    id: "climate-innovation",
    cluster: "Innovation Basin climate log sync",
    severity: "low",
    affectedAssets: 3,
    expectedResolutionMinutes: 16,
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
    metric: "Narratives on target",
    value: "94%",
    change: "+5%",
    tone: "up",
  },
  {
    id: "evidence-match",
    metric: "Evidence matched",
    value: "97%",
    change: "+3%",
    tone: "up",
  },
  {
    id: "assurance-drift",
    metric: "Assurance drift",
    value: "1.2%",
    change: "-0.4%",
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
    narrative: "AI routing keeps stewards focused on districts slipping.",
  },
  {
    id: "vlr-vs-ai",
    scenario: "VLR Automation",
    baseline: 58,
    optimized: 86,
    unit: "sections ready",
    narrative: "Automated drafting clears the backlog before review day.",
  },
  {
    id: "city-vs-ai",
    scenario: "City Profiling",
    baseline: 69,
    optimized: 83,
    unit: "wellbeing index",
    narrative: "Capital shifts move the wellbeing score without extra spend.",
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
    driver: "Shoreline works still missing SDG 13 sign-off.",
  },
  {
    id: "innovation-basin",
    district: "Innovation Basin Studio",
    quadrant: "VLR",
    score: 0.79,
    driver: "Evidence packets due from finance and mobility desks.",
  },
  {
    id: "northern-commons",
    district: "Northern Commons Network",
    quadrant: "Equity",
    score: 0.91,
    driver: "Housing upgrades beating the equity target.",
  },
  {
    id: "civic-spine",
    district: "Civic Learning Spine",
    quadrant: "Capital",
    score: 0.74,
    driver: "Capital drawdown pacing below plan.",
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
    title: "Every claim links back to source data",
    detail: "Narratives surface the dataset, steward, and refresh time in one click.",
  },
  {
    id: "fairness-monitor",
    title: "Equity guardrails stay on",
    detail: "Counterfactual tests confirm interventions keep the wellbeing gap shrinking.",
  },
  {
    id: "copilot-review",
    title: "Human notes train the models",
    detail: "Operators edit suggestions and the copilot learns the local rules.",
  },
];
