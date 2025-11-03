export type DataConnectorStatus = "healthy" | "syncing" | "issue";

export type DataConnector = {
  id: string;
  name: string;
  department: string;
  dataScope: string;
  status: DataConnectorStatus;
  freshnessMinutes: number;
  coverage: string;
  steward: string;
};

export type DataAutomationStatus = "on-time" | "attention" | "paused";

export type DataAutomation = {
  id: string;
  title: string;
  cadence: string;
  lastRun: string;
  nextRun: string;
  owner: string;
  status: DataAutomationStatus;
  outcome: string;
};

export type DataQualityAlertSeverity = "low" | "moderate" | "high";

export type DataQualityAlert = {
  id: string;
  topic: string;
  detail: string;
  impact: string;
  severity: DataQualityAlertSeverity;
  eta: string;
};

export type DataFabricMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "steady";
};

export const dataFabricMetrics: DataFabricMetric[] = [
  {
    id: "latency",
    label: "Indicator latency",
    value: "2.7 min",
    detail: "Average delay from source system to dashboard.",
    trend: "down",
  },
  {
    id: "connectors",
    label: "Connectors synced",
    value: "28",
    detail: "Feeds refreshed in the last hour.",
    trend: "steady",
  },
  {
    id: "vlr-coverage",
    label: "VLR coverage",
    value: "96%",
    detail: "Indicators mapped to the current VLR cycle.",
    trend: "up",
  },
];

export const dataConnectors: DataConnector[] = [
  {
    id: "sdg-indicators",
    name: "SDG indicator fabric",
    department: "Sustainability",
    dataScope: "Localization metrics and steward notes.",
    status: "healthy",
    freshnessMinutes: 4,
    coverage: "63 indicators refreshed overnight.",
    steward: "Localization desk",
  },
  {
    id: "district-gis-city-analysis",
    name: "GIS City Analysis stream",
    department: "Innovation studio",
    dataScope: "District wellbeing and sensor feeds.",
    status: "syncing",
    freshnessMinutes: 3,
    coverage: "11 focus districts streaming.",
    steward: "Impact lab",
  },
  {
    id: "finance-ledger",
    name: "Capital ledger",
    department: "Budget office",
    dataScope: "Capital drawdown and SDG spend.",
    status: "healthy",
    freshnessMinutes: 5,
    coverage: "All active programs reconciled.",
    steward: "Capital council",
  },
  {
    id: "community-feedback",
    name: "Community inbox",
    department: "Civic engagement",
    dataScope: "Sentiment and hotline transcripts.",
    status: "issue",
    freshnessMinutes: 38,
    coverage: "Backlog in Harbor Resilience Loop.",
    steward: "Community voice",
  },
];

export const dataAutomations: DataAutomation[] = [
  {
    id: "vlr-rollup",
    title: "Nightly VLR rollup",
    cadence: "Daily · 23:30",
    lastRun: "23:32 (on time)",
    nextRun: "Tonight 23:30",
    owner: "Sustainability office",
    status: "on-time",
    outcome: "Published SDG indicator pack for cabinet briefing.",
  },
  {
    id: "sdg-morning-brief",
    title: "SDG morning brief",
    cadence: "Hourly · 05:00-22:00",
    lastRun: "09:00 (on time)",
    nextRun: "10:00",
    owner: "Localization desk",
    status: "on-time",
    outcome: "Sent district outlook to localization stewards.",
  },
  {
    id: "capital-climate-ledger",
    title: "Capital + climate ledger",
    cadence: "Every 30 min",
    lastRun: "09:28 (delayed)",
    nextRun: "09:58",
    owner: "Capital council",
    status: "attention",
    outcome: "Waiting on shoreline spend reconciliation.",
  },
  {
    id: "community-studio-sync",
    title: "Community studio sync",
    cadence: "Every 15 min",
    lastRun: "08:45 (paused)",
    nextRun: "Paused",
    owner: "Community voice",
    status: "paused",
    outcome: "Paused while transcripts are anonymised.",
  },
];

export const dataQualityAlerts: DataQualityAlert[] = [
  {
    id: "indicator-gap",
    topic: "Indicator refresh gap",
    detail: "SDG-512 community health node stopped reporting at 08:21.",
    impact: "Care Corridor progress index now sits at 0.41 confidence.",
    severity: "moderate",
    eta: "Technician ETA 15 min",
  },
  {
    id: "survey-backlog",
    topic: "Community survey backlog",
    detail: "Harbor Loop wellbeing survey behind target sample size.",
    impact: "Equity scoring for VLR chapter 3 at risk.",
    severity: "high",
    eta: "Auto-reminders scheduled noon",
  },
  {
    id: "canopy-drift",
    topic: "Urban canopy drift check",
    detail: "SDG-317 cooling canopy index 12% above baseline.",
    impact: "Cross-checking with regional satellite feed.",
    severity: "low",
    eta: "Calibration drone deployed",
  },
];
