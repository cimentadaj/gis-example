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
