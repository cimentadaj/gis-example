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
  changeLabel?: string;
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
  expectedResolutionDays: number;
};

export const citywideKpis: SystemKpi[] = [
  {
    id: "sdg-progress",
    label: "Cities ready",
    unit: "of 18",
    value: 12,
    change: { direction: "up", percentage: 1, period: "day" },
    changeLabel: "+1 today",
  },
  {
    id: "vlr-ready",
    label: "SDG Goals",
    unit: "of 9",
    value: 7,
    change: { direction: "up", percentage: 2, period: "day" },
    changeLabel: "+2 today",
  },
  {
    id: "wellbeing-score",
    label: "Wellbeing index",
    unit: "index",
    value: 74,
    change: { direction: "up", percentage: 4.2, period: "quarter" },
    changeLabel: "+4.2 vs last quarter",
  },
  {
    id: "capital-ready",
    label: "Capital funded",
    unit: "% funded",
    value: 81,
    change: { direction: "down", percentage: 2.6, period: "month" },
    changeLabel: "-2.6% vs last month",
  },
];

export const demandForecast: ForecastSeries = {
  scenario: "sdg-localization",
  metric: "Gender equity index",
  horizon: "Next 12 Months",
  points: [
    { timestamp: "2025-01-01T00:00:00Z", value: 0.62 },
    { timestamp: "2025-02-01T00:00:00Z", value: 0.64 },
    { timestamp: "2025-03-01T00:00:00Z", value: 0.67 },
    { timestamp: "2025-04-01T00:00:00Z", value: 0.7 },
    { timestamp: "2025-05-01T00:00:00Z", value: 0.73 },
    { timestamp: "2025-06-01T00:00:00Z", value: 0.75 },
    { timestamp: "2025-07-01T00:00:00Z", value: 0.77 },
    { timestamp: "2025-08-01T00:00:00Z", value: 0.79 },
  ],
};

export const resilienceForecast: ForecastSeries = {
  scenario: "city-profiling",
  metric: "Inclusive growth index",
  horizon: "Next 6 Quarters",
  points: [
    { timestamp: "2025-03-31", value: 68 },
    { timestamp: "2025-06-30", value: 69 },
    { timestamp: "2025-09-30", value: 71 },
    { timestamp: "2025-12-31", value: 72 },
    { timestamp: "2026-03-31", value: 74 },
    { timestamp: "2026-06-30", value: 76 },
  ],
};

export const anomalyClusters: AnomalyCluster[] = [
  {
    id: "gender-pay-gap",
    cluster: "Gender wage data gap",
    severity: "moderate",
    affectedAssets: 5,
    expectedResolutionDays: 14,
  },
  {
    id: "green-jobs-status",
    cluster: "Green jobs grant awaiting codes",
    severity: "high",
    affectedAssets: 7,
    expectedResolutionDays: 21,
  },
  {
    id: "housing-sdg11",
    cluster: "Affordable units inventory refresh",
    severity: "low",
    affectedAssets: 3,
    expectedResolutionDays: 10,
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
    metric: "Gender equity benchmarks met",
    value: "78%",
    change: "+5%",
    tone: "up",
  },
  {
    id: "evidence-match",
    metric: "Green jobs milestones funded",
    value: "64%",
    change: "+8%",
    tone: "up",
  },
  {
    id: "assurance-drift",
    metric: "Critical reviews pending",
    value: "9%",
    change: "-3%",
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
    id: "gender-equity",
    scenario: "Gender Equity Acceleration",
    baseline: 58,
    optimized: 74,
    unit: "index score",
    narrative: "Targeted programs close the gender gap across priority districts.",
  },
  {
    id: "green-economy",
    scenario: "Green Economy Pipeline",
    baseline: 52,
    optimized: 81,
    unit: "projects delivered",
    narrative: "Job grants tied to SDG 8 keep small business support on schedule.",
  },
  {
    id: "affordable-housing",
    scenario: "Affordable Housing Progress",
    baseline: 61,
    optimized: 84,
    unit: "units certified",
    narrative: "Coordinated VLR tracking keeps SDG 11 reporting ahead of reviews.",
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
    driver: "SDG 13 shoreline projects still waiting environmental audits.",
  },
  {
    id: "innovation-basin",
    district: "Innovation Basin Studio",
    quadrant: "VLR",
    score: 0.79,
    driver: "VLR labor evidence pending upload from economic development.",
  },
  {
    id: "northern-commons",
    district: "Northern Commons Network",
    quadrant: "Equity",
    score: 0.91,
    driver: "Gender parity initiatives beating the SDG 5 target.",
  },
  {
    id: "civic-spine",
    district: "Civic Learning Spine",
    quadrant: "Capital",
    score: 0.74,
    driver: "Green skills training budget pacing below plan.",
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
    title: "Equality metrics cite their source",
    detail: "Gender parity scores list the census feed, steward, and refresh cycle.",
  },
  {
    id: "fairness-monitor",
    title: "Economic guardrails stay tuned",
    detail: "Scenario tests confirm new jobs and SDG 8 targets stay within budget.",
  },
  {
    id: "copilot-review",
    title: "Teams leave plain-language notes",
    detail: "Planner comments teach the copilot which VLR evidence cleared review.",
  },
];
