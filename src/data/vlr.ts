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
};

export const vlrStages: VlrStage[] = [
  {
    id: "ingestion",
    title: "Telemetry Ingestion",
    status: "complete",
    etaMinutes: 0,
    completion: 100,
    summary:
      "64 heterogeneous feeds normalized, deduplicated, and synchronized with the Nexus digital twin baseline.",
    insights: [
      "Anomaly scrubber removed 312 duplicate curb sensors before feature extraction.",
      "Geo-enrichment aligned mobility events to the 500m hex grid for downstream scoring.",
    ],
    kpis: [
      {
        id: "ingestion-latency",
        label: "Pipeline Latency",
        value: "84 s",
        deltaLabel: "-18.6%",
        direction: "down",
        narrative: "Latencies dropped via GPU stream processing applied to weather feeds.",
      },
      {
        id: "ingestion-completeness",
        label: "Data Completeness",
        value: "99.1%",
        deltaLabel: "+4.2%",
        direction: "up",
        narrative: "Fallback routing captured late-arriving IoT packets from Harbor District assets.",
      },
    ],
    compliance: [
      {
        id: "gdpr",
        label: "GDPR alignment",
        status: "pass",
        description: "PII scrubbing verified for social equity mobility surveys.",
      },
      {
        id: "iso37120",
        label: "ISO 37120",
        status: "pass",
        description: "Dataset coverage satisfies smart city quality of life metrics.",
      },
    ],
    artifacts: [
      {
        id: "raw-drops",
        label: "Raw ingest bundles",
        detail: "Mobility, climate, energy, permitting data zipped for audit.",
      },
      {
        id: "feature-store",
        label: "Feature store snapshot",
        detail: "2.3M rows across 118 engineered features ready for modeling.",
      },
    ],
    auditTrail: [
      { timestamp: "07:42", actor: "Pipeline Bot", message: "All connectors returned healthy response." },
      { timestamp: "07:48", actor: "Ops Analyst", message: "Flagged anomalous EV charger feed for follow-up." },
    ],
  },
  {
    id: "classification",
    title: "SDG Classification",
    status: "active",
    etaMinutes: 6,
    completion: 68,
    summary: "Transformer models map telemetry to SDG indicators and municipal KPIs with explainability overlays.",
    insights: [
      "LLM grounded explanations show 0.78 alignment score for SDG 11.B urban resilience markers.",
      "Policy library updated with the 2025 regional climate accord and auto-linked to heat risk assets.",
    ],
    kpis: [
      {
        id: "classification-precision",
        label: "Classification Precision",
        value: "97.4%",
        deltaLabel: "+2.1%",
        direction: "up",
        narrative: "Active learning loop retrained on latest building permit validations.",
      },
      {
        id: "classification-drift",
        label: "Model Drift",
        value: "0.12 ψ",
        deltaLabel: "-0.08 ψ",
        direction: "down",
        narrative: "Concept drift suppressed after ingesting coastal adaptation policies.",
      },
    ],
    compliance: [
      {
        id: "undp",
        label: "UN SDG Taxonomy",
        status: "pass",
        description: "Indicators mapped to SDG 1, 7, 9, 11, and 13 with supporting evidence.",
      },
      {
        id: "equity-scan",
        label: "Equity Scan",
        status: "attention",
        description: "AI flagged mobility subsidy data gap for East Dock neighborhood.",
      },
    ],
    artifacts: [
      {
        id: "explainability",
        label: "Explainable heatmaps",
        detail: "Class activation maps at block-group resolution for SDG 11.",
      },
      {
        id: "taxonomy-crosswalk",
        label: "Taxonomy crosswalk",
        detail: "SDG ↔ municipal KPIs translation table with confidence scores.",
      },
    ],
    auditTrail: [
      { timestamp: "08:03", actor: "Model Ops", message: "GPU node scaled to 3× for transformer inference." },
      { timestamp: "08:05", actor: "Policy Engine", message: "Imported 2025 VLR guidance update from UN DESA." },
      { timestamp: "08:09", actor: "Equity Copilot", message: "Requested additional census microdata for East Dock." },
    ],
  },
  {
    id: "scoring",
    title: "KPI Scoring",
    status: "pending",
    etaMinutes: 12,
    completion: 24,
    summary: "Scenario simulator benchmarks live KPIs against baseline year and automates variance narratives.",
    insights: [
      "Micromobility mode share exceeds 2024 baseline by 14.8% with congestion butterfly charts.",
      "Grid resilience buffer holds at 90% due to predictive DER dispatch recommendations.",
    ],
    kpis: [
      {
        id: "mobility-delta",
        label: "Mobility KPI Delta",
        value: "+12.6%",
        deltaLabel: "+12.6 pts",
        direction: "up",
        narrative: "Curb orchestration pilots boosting throughput in Midtown Innovation Corridor.",
      },
      {
        id: "climate-risk",
        label: "Climate Risk Drop",
        value: "-18 pts",
        deltaLabel: "-18 pts",
        direction: "down",
        narrative: "Hydrodynamic twin indicates reduced flood exposure post sea-wall upgrade.",
      },
    ],
    compliance: [
      {
        id: "audit-readiness",
        label: "Audit readiness",
        status: "pass",
        description: "Variance explanations tie to digital twin snapshots with source metadata.",
      },
      {
        id: "kpi-governance",
        label: "KPI governance",
        status: "attention",
        description: "Awaiting budget office acknowledgment for new affordability metric.",
      },
    ],
    artifacts: [
      {
        id: "scenario-sheets",
        label: "Scenario sheets",
        detail: "Baseline vs optimized KPI comparison for 2023-2025 horizon.",
      },
      {
        id: "variance-briefs",
        label: "Variance briefs",
        detail: "Auto-authored variance statements with traceability links.",
      },
    ],
    auditTrail: [
      { timestamp: "08:12", actor: "Twin Simulator", message: "Monte Carlo batch #2 at 70% completion." },
      { timestamp: "08:15", actor: "Finance Liaison", message: "Budget office notified for affordability metric review." },
    ],
  },
  {
    id: "narrative",
    title: "Narrative Assembly",
    status: "pending",
    etaMinutes: 18,
    completion: 12,
    summary: "Generative authoring translates KPIs and policies into PDF-ready VLR chapters and executive briefs.",
    insights: [
      "Narrative prompts primed with resilience scenarios and community sentiment feedback loops.",
      "Translation memory seeded for Spanish, Japanese, and Arabic export packages.",
    ],
    kpis: [
      {
        id: "draft-speed",
        label: "Draft Speed",
        value: "4m 28s",
        deltaLabel: "-1.9 min",
        direction: "down",
        narrative: "Adaptive prompting trimmed drafting time after template fine-tunes.",
      },
      {
        id: "readability",
        label: "Readability Score",
        value: "11.2",
        deltaLabel: "+0.8 clarity",
        direction: "up",
        narrative: "Refined tone alignment for executive summaries lifted clarity ratings.",
      },
    ],
    compliance: [
      {
        id: "language-pack",
        label: "Language pack",
        status: "pass",
        description: "Multilingual narratives validated against municipal glossary.",
      },
      {
        id: "sensitivity",
        label: "Sensitivity review",
        status: "risk",
        description: "Human-in-the-loop review required for coastal displacement storyline.",
      },
    ],
    artifacts: [
      {
        id: "chapter-drafts",
        label: "Chapter drafts",
        detail: "Climate resilience and equity chapters in review queue.",
      },
      {
        id: "briefing-deck",
        label: "Briefing deck",
        detail: "Auto-summarized slides with heatmap embeds from digital twin.",
      },
    ],
    auditTrail: [
      { timestamp: "08:20", actor: "Narrative Bot", message: "Drafted climate resilience chapter v1.4." },
      { timestamp: "08:23", actor: "Sensitivity Reviewer", message: "Requested community feedback quotes for Harbor District." },
    ],
  },
];

export const vlrProcessSignals = [
  "Edge-to-cloud sync verified",
  "UN SDG policy pack updated",
  "Explainability overlays warmed",
  "Monte Carlo sim queue primed",
];

export const vlrPdfPreview = {
  period: "2025 Q3",
  filename: "Nexus_VLR_2025_Q3.pdf",
  size: "44.1 MB",
  summary:
    "Executive package bundles climate resilience, mobility equity, and clean energy KPIs with AI-backed narratives.",
  chapters: [
    { id: "climate", label: "Climate Resilience", status: "ready" },
    { id: "equity", label: "Social Equity", status: "in-review" },
    { id: "mobility", label: "Mobility Transformation", status: "ready" },
    { id: "governance", label: "Governance & Policy", status: "draft" },
  ],
};

export const vlrAlerts = [
  {
    id: "heat-strategy",
    severity: "warning",
    message: "Heat resilience strategy pending for two waterfront schools.",
    suggestedAction: "Trigger cooling shelter readiness protocol.",
  },
  {
    id: "der-incentives",
    severity: "critical",
    message: "DER incentives require City Council approval before Q4 vote.",
    suggestedAction: "Schedule finance briefing with council innovation committee.",
  },
  {
    id: "equity-gap",
    severity: "info",
    message: "Mobility subsidy data gap detected for East Dock neighborhood.",
    suggestedAction: "Request latest census microdata and fare card reports.",
  },
];
