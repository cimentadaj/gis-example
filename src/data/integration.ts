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
    label: "Indicator Latency",
    value: "2.7 min",
    detail: "Feed-to-twin delay across active SDG indicators",
    trend: "down",
  },
  {
    id: "connectors",
    label: "Connectors Synced",
    value: "28",
    detail: "City + partner feeds reconciled in the last hour",
    trend: "steady",
  },
  {
    id: "vlr-coverage",
    label: "VLR Coverage",
    value: "96%",
    detail: "SDG indicators captured for current review cycle",
    trend: "up",
  },
];

export const dataConnectors: DataConnector[] = [
  {
    id: "sdg-indicators",
    name: "SDG Indicator Fabric",
    department: "Sustainability",
    dataScope: "Localization metrics, SDG targets, steward commentary",
    status: "healthy",
    freshnessMinutes: 4,
    coverage: "63 indicators refreshed overnight",
    steward: "Localization Desk",
  },
  {
    id: "district-digital-twin",
    name: "District Digital Twin",
    department: "Innovation Studio",
    dataScope: "District wellbeing, public realm sensors, mobility equity",
    status: "syncing",
    freshnessMinutes: 3,
    coverage: "11 focus districts streaming",
    steward: "Impact Lab",
  },
  {
    id: "finance-ledger",
    name: "Capital & Finance Ledger",
    department: "Budget Office",
    dataScope: "Capital drawdown, climate disclosures, SDG investments",
    status: "healthy",
    freshnessMinutes: 5,
    coverage: "All active programmes reconciled",
    steward: "Capital Council",
  },
  {
    id: "community-feedback",
    name: "Community Feedback Inbox",
    department: "Civic Engagement",
    dataScope: "Studio transcripts, hotline sentiment, participatory budget notes",
    status: "issue",
    freshnessMinutes: 38,
    coverage: "Backlog in Harbor Resilience Loop",
    steward: "Community Voice",
  },
];

export const dataAutomations: DataAutomation[] = [
  {
    id: "vlr-rollup",
    title: "Nightly VLR Rollup",
    cadence: "Daily • 23:30",
    lastRun: "23:32 (on time)",
    nextRun: "Tonight 23:30",
    owner: "Sustainability Office",
    status: "on-time",
    outcome: "Published SDG indicator pack for cabinet briefing.",
  },
  {
    id: "sdg-morning-brief",
    title: "SDG Morning Brief",
    cadence: "Hourly • 05:00-22:00",
    lastRun: "09:00 (on time)",
    nextRun: "10:00",
    owner: "Localization Desk",
    status: "on-time",
    outcome: "District alignment outlook sent to localization stewards.",
  },
  {
    id: "capital-climate-ledger",
    title: "Capital & Climate Ledger",
    cadence: "Every 30 min",
    lastRun: "09:28 (delayed)",
    nextRun: "09:58",
    owner: "Capital Council",
    status: "attention",
    outcome: "Waiting on Harbor shoreline spend reconciliation.",
  },
  {
    id: "community-studio-sync",
    title: "Community Studio Sync",
    cadence: "Every 15 min",
    lastRun: "08:45 (paused)",
    nextRun: "Paused",
    owner: "Community Voice",
    status: "paused",
    outcome: "Queue paused while transcripts undergo anonymisation refresh.",
  },
];

export const dataQualityAlerts: DataQualityAlert[] = [
  {
    id: "indicator-gap",
    topic: "Indicator refresh gap",
    detail: "SDG-512 community health access node stopped reporting at 08:21.",
    impact: "Progress index confidence dipped to 0.41 for Care Corridor Spine.",
    severity: "moderate",
    eta: "Technician eta 15 min",
  },
  {
    id: "survey-backlog",
    topic: "Community survey backlog",
    detail: "Harbor Resilience Loop wellbeing survey responses lagging behind target sample size.",
    impact: "Equity scoring for VLR chapter 3 at risk.",
    severity: "high",
    eta: "Auto-reminders scheduled noon",
  },
  {
    id: "canopy-drift",
    topic: "Urban canopy drift check",
    detail: "SDG-317 cooling canopy index drifting 12% above calibration baseline.",
    impact: "Triggered cross-check with regional satellite feed.",
    severity: "low",
    eta: "Calibration drone deployed",
  },
];
