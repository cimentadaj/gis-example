export type VlrStageStatus = "complete" | "active" | "pending";

export type VlrStageKpi = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  direction: "up" | "down";
  narrative: string;
};

export type VlrStageArtifact = {
  id: string;
  label: string;
  detail: string;
};

export type VlrComplianceBadge = {
  id: string;
  label: string;
  status: "pass" | "attention" | "risk";
  description: string;
};

export type VlrAuditEvent = {
  timestamp: string;
  actor: string;
  message: string;
};

export type VlrStageTrendPoint = {
  label: string;
  value: number;
};

export type VlrStageTrend = {
  id: string;
  title: string;
  metricLabel: string;
  unit?: string;
  points: VlrStageTrendPoint[];
  baselineLabel?: string;
  baselineValue?: number;
  summary: string;
};

export type VlrStage = {
  id: string;
  title: string;
  status: VlrStageStatus;
  etaMinutes: number;
  completion: number;
  summary: string;
  insights: string[];
  kpis: VlrStageKpi[];
  compliance: VlrComplianceBadge[];
  artifacts: VlrStageArtifact[];
  auditTrail: VlrAuditEvent[];
  trend?: VlrStageTrend;
};

export const vlrStages: VlrStage[] = [
  {
    id: "ingestion",
    title: "Telemetry Ingestion",
    status: "complete",
    etaMinutes: 0,
    completion: 100,
    summary: "64 feeds cleaned and aligned with the twin.",
    insights: ["Duplicate curb sensors removed before features load."],
    kpis: [
      {
        id: "ingestion-latency",
        label: "Pipeline latency",
        value: "84 s",
        deltaLabel: "-18%",
        direction: "down",
        narrative: "GPU streaming keeps weather feeds under 90 seconds.",
      },
    ],
    compliance: [
      {
        id: "gdpr",
        label: "GDPR",
        status: "pass",
        description: "PII removed across mobility surveys.",
      },
    ],
    artifacts: [
      {
        id: "feature-store",
        label: "Feature store snapshot",
        detail: "118 features ready for modeling.",
      },
    ],
    auditTrail: [
      { timestamp: "07:42", actor: "Pipeline bot", message: "All connectors returned healthy responses." },
      { timestamp: "07:48", actor: "Ops analyst", message: "Flagged EV charger feed for follow-up." },
    ],
    trend: {
      id: "ingestion-throughput",
      title: "Feeds cleared",
      metricLabel: "per 15 min",
      points: [
        { label: "07:00", value: 28 },
        { label: "07:15", value: 31 },
        { label: "07:30", value: 34 },
        { label: "07:45", value: 36 },
        { label: "08:00", value: 38 },
      ],
      baselineLabel: "Target",
      baselineValue: 32,
      summary: "Running 18% faster than last week's pull.",
    },
  },
  {
    id: "classification",
    title: "SDG Classification",
    status: "active",
    etaMinutes: 6,
    completion: 68,
    summary: "Models tag telemetry with SDG codes and policy context.",
    insights: ["Equity scan flagged a subsidy gap in East Dock."],
    kpis: [
      {
        id: "classification-precision",
        label: "Classification precision",
        value: "97.4%",
        deltaLabel: "+2.1%",
        direction: "up",
        narrative: "Active learning used the latest permit checks.",
      },
    ],
    compliance: [
      {
        id: "undp",
        label: "UN SDG taxonomy",
        status: "pass",
        description: "Indicators mapped with source evidence.",
      },
      {
        id: "equity-scan",
        label: "Equity scan",
        status: "attention",
        description: "Needs fresh census microdata for East Dock.",
      },
    ],
    artifacts: [
      {
        id: "taxonomy-crosswalk",
        label: "Taxonomy crosswalk",
        detail: "SDG to city KPI table with confidence scores.",
      },
    ],
    auditTrail: [
      { timestamp: "08:03", actor: "Model ops", message: "Scaled GPU nodes to 3× for inference." },
      { timestamp: "08:05", actor: "Policy engine", message: "Loaded 2025 VLR guidance update." },
    ],
    trend: {
      id: "classification-confidence",
      title: "Model confidence",
      metricLabel: "precision",
      unit: "%",
      points: [
        { label: "07:30", value: 94.2 },
        { label: "07:45", value: 95.6 },
        { label: "08:00", value: 96.1 },
        { label: "08:15", value: 97.4 },
      ],
      baselineLabel: "Floor",
      baselineValue: 92,
      summary: "Active learning lifted precision above the 95% floor.",
    },
  },
  {
    id: "scoring",
    title: "KPI Scoring",
    status: "pending",
    etaMinutes: 12,
    completion: 24,
    summary: "Simulator checks live KPIs against last year.",
    insights: [
      "Micromobility share is 12 points above last year.",
    ],
    kpis: [
      {
        id: "mobility-delta",
        label: "Mobility uplift",
        value: "+12.6 pts",
        deltaLabel: "+12.6 pts",
        direction: "up",
        narrative: "Curb pilots boosting throughput in Innovation Corridor.",
      },
    ],
    compliance: [
      {
        id: "audit-readiness",
        label: "Audit readiness",
        status: "pass",
        description: "Variance explanations link to twin snapshots.",
      },
      {
        id: "kpi-governance",
        label: "KPI governance",
        status: "attention",
        description: "Waiting on budget sign-off for affordability metric.",
      },
    ],
    artifacts: [
      {
        id: "scenario-sheets",
        label: "Scenario sheets",
        detail: "Baseline vs. improved comparison for 2023-2025.",
      },
    ],
    auditTrail: [
      { timestamp: "08:12", actor: "Twin simulator", message: "Monte Carlo batch #2 at 70% completion." },
      { timestamp: "08:15", actor: "Finance liaison", message: "Budget office notified for affordability review." },
    ],
    trend: {
      id: "scoring-uplift",
      title: "Mobility uplift",
      metricLabel: "vs baseline",
      unit: "pts",
      points: [
        { label: "Baseline", value: 0 },
        { label: "Week 1", value: 4.5 },
        { label: "Week 2", value: 7.3 },
        { label: "Week 3", value: 9.8 },
        { label: "Week 4", value: 12.6 },
      ],
      baselineLabel: "Goal",
      baselineValue: 8,
      summary: "Mobility plan is already four points above the quarterly goal.",
    },
  },
  {
    id: "narrative",
    title: "Narrative Assembly",
    status: "pending",
    etaMinutes: 18,
    completion: 12,
    summary: "Writer bot turns KPIs into clear VLR stories.",
    insights: [
      "Executive summary waits for SDG 9 evidence.",
    ],
    kpis: [
      {
        id: "draft-speed",
        label: "Draft speed",
        value: "4m 28s",
        deltaLabel: "-1.9 min",
        direction: "down",
        narrative: "Template tuning trimmed drafting time this week.",
      },
    ],
    compliance: [
      {
        id: "language-pack",
        label: "Language pack",
        status: "pass",
        description: "Multilingual glossary validated.",
      },
      {
        id: "sensitivity",
        label: "Sensitivity review",
        status: "risk",
        description: "Human review needed for coastal displacement section.",
      },
    ],
    artifacts: [
      {
        id: "briefing-deck",
        label: "Briefing deck",
        detail: "Slides with twin heatmaps ready for export.",
      },
    ],
    auditTrail: [
      { timestamp: "08:20", actor: "Narrative bot", message: "Drafted climate resilience chapter v1.4." },
      { timestamp: "08:23", actor: "Sensitivity reviewer", message: "Requested community quotes for Harbor District." },
    ],
    trend: {
      id: "narrative-cycle",
      title: "Draft cycle time",
      metricLabel: "per chapter",
      unit: "min",
      points: [
        { label: "Kickoff", value: 9.4 },
        { label: "Climate", value: 6.2 },
        { label: "Equity", value: 5.5 },
        { label: "Mobility", value: 4.8 },
      ],
      baselineLabel: "Target",
      baselineValue: 6,
      summary: "Playbooks keep chapters under the six minute target.",
    },
  },
];

export const vlrProcessSignals = ["Data feeds healthy", "Policy pack up to date", "Explainability ready"];

export const vlrPdfPreview = {
  period: "2025 Q3",
  filename: "Nexus_VLR_2025_Q3.pdf",
  size: "44.1 MB",
  summary: "Executive kit bundles climate, mobility, and equity results.",
  chapters: [
    { id: "climate", label: "Climate resilience", status: "ready" },
    { id: "equity", label: "Social equity", status: "review" },
    { id: "mobility", label: "Mobility", status: "ready" },
    { id: "governance", label: "Governance", status: "draft" },
  ],
};

export const vlrAlerts = [
  {
    id: "heat-strategy",
    severity: "warning",
    message: "Heat plan pending for two waterfront schools.",
    suggestedAction: "Trigger the cooling shelter protocol.",
  },
  {
    id: "der-incentives",
    severity: "critical",
    message: "DER incentives need council approval before the Q4 vote.",
    suggestedAction: "Book a finance briefing with the innovation committee.",
  },
  {
    id: "equity-gap",
    severity: "info",
    message: "Mobility subsidy data missing for East Dock.",
    suggestedAction: "Request census microdata and fare card reports.",
  },
];
