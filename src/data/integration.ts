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
    label: "Median Latency",
    value: "2.7 min",
    detail: "Sensor-to-twin delay across active feeds",
    trend: "down",
  },
  {
    id: "connectors",
    label: "Connectors Online",
    value: "28",
    detail: "City + partner feeds synced in the last hour",
    trend: "steady",
  },
  {
    id: "vlr-coverage",
    label: "VLR Coverage",
    value: "96%",
    detail: "Indicators captured for current SDG cycle",
    trend: "up",
  },
];

export const dataConnectors: DataConnector[] = [
  {
    id: "land-use-registry",
    name: "Land Use Registry",
    department: "Planning",
    dataScope: "Parcels, zoning actions, permitting checkpoints",
    status: "healthy",
    freshnessMinutes: 4,
    coverage: "100% parcels this quarter",
    steward: "Planning Insights",
  },
  {
    id: "mobility-sensors",
    name: "Mobility Sensors",
    department: "Transportation",
    dataScope: "Signal phase, curb occupancy, corridor counts",
    status: "syncing",
    freshnessMinutes: 2,
    coverage: "94% corridors live",
    steward: "Mobility Ops",
  },
  {
    id: "energy-telemetry",
    name: "Energy Telemetry",
    department: "Utilities",
    dataScope: "Substation load, DER dispatch, outage tickets",
    status: "healthy",
    freshnessMinutes: 5,
    coverage: "12 microgrids streaming",
    steward: "Grid Coordination",
  },
  {
    id: "civic-feedback",
    name: "Civic Feedback Inbox",
    department: "Civic Engagement",
    dataScope: "Hotline transcripts, service requests, sentiment tags",
    status: "issue",
    freshnessMinutes: 38,
    coverage: "Backlog in 2 districts",
    steward: "Service 311",
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
    id: "mobility-ops-brief",
    title: "AM Mobility Brief",
    cadence: "Hourly • 05:00-22:00",
    lastRun: "09:00 (on time)",
    nextRun: "10:00",
    owner: "Mobility Ops",
    status: "on-time",
    outcome: "Updated rush-hour forecast sent to field supervisors.",
  },
  {
    id: "grid-carbon-ledger",
    title: "Grid & Carbon Ledger",
    cadence: "Every 30 min",
    lastRun: "09:28 (delayed)",
    nextRun: "09:58",
    owner: "Energy Resilience",
    status: "attention",
    outcome: "Waiting on Innovation Basin DER confirmation.",
  },
  {
    id: "civic-feedback-sync",
    title: "Civic Feedback Sync",
    cadence: "Every 15 min",
    lastRun: "08:45 (paused)",
    nextRun: "Paused",
    owner: "Service 311",
    status: "paused",
    outcome: "Queue paused for data quality review in Harbor District.",
  },
];

export const dataQualityAlerts: DataQualityAlert[] = [
  {
    id: "mobility-gap",
    topic: "Mobility sensor gap",
    detail: "Skyloop sensor TR-512 stopped reporting occupancy at 08:21.",
    impact: "Forecast confidence dipped to 82% for the corridor.",
    severity: "moderate",
    eta: "Technician eta 15 min",
  },
  {
    id: "survey-backlog",
    topic: "Community survey backlog",
    detail: "Harbor District wellbeing survey responses lagging behind target sample size.",
    impact: "Equity scoring for VLR chapter 3 at risk.",
    severity: "high",
    eta: "Auto-reminders scheduled noon",
  },
  {
    id: "air-quality-drift",
    topic: "Air quality drift check",
    detail: "AQ-317 drifting 12% above calibration baseline.",
    impact: "Triggered cross-check with regional station feed.",
    severity: "low",
    eta: "Calibration drone deployed",
  },
];
