export type PolicyTheme = {
  id: string;
  title: string;
  summary: string;
  sdgAlignment: string[];
  vlrStages: string[];
  priorityLevel: "immediate" | "near-term" | "mid-term";
  focusAreas: string[];
  anchorKpis: string[];
};

export type PolicyInsight = {
  id: string;
  themeId: string;
  title: string;
  sdgTargets: string[];
  vlrStageRef: string;
  decisionType: "executive directive" | "budget decision" | "legislative pact";
  signalSummary: string;
  narrative: string;
  recommendation: string;
  expectedImpact: {
    metricId: string;
    delta: string;
    horizon: string;
  };
  dependencies: string[];
  confidence: number;
  readinessWindow: string;
};

export const policyThemes: PolicyTheme[] = [
  {
    id: "learning-equity",
    title: "Learning Equity & Workforce Futures",
    summary: "Unify education recovery, gender parity, and workforce readiness targets before the mid-year VLR checkpoint.",
    sdgAlignment: ["SDG 4", "SDG 5", "SDG 8"],
    vlrStages: ["classification", "scoring"],
    priorityLevel: "immediate",
    focusAreas: ["Citywide learning systems", "Equity funding streams"],
    anchorKpis: ["sdg-progress"],
  },
  {
    id: "green-industry",
    title: "Green Industry & Finance",
    summary: "Lock budget and procurement guardrails that keep SDG 8/9 delivery synchronized with the VLR automation pipeline.",
    sdgAlignment: ["SDG 8", "SDG 9"],
    vlrStages: ["scoring", "narrative"],
    priorityLevel: "near-term",
    focusAreas: ["Advanced industry corridors", "Treasury operations"],
    anchorKpis: ["vlr-ready"],
  },
  {
    id: "public-realm",
    title: "Housing & Public Realm Pact",
    summary: "Frame a cross-agency stewardship agenda that keeps SDG 11 narratives investor-ready while capital plans stay on schedule.",
    sdgAlignment: ["SDG 11"],
    vlrStages: ["narrative"],
    priorityLevel: "near-term",
    focusAreas: ["Affordable housing portfolio", "Public realm upgrades", "Civic partnerships"],
    anchorKpis: ["wellbeing-score", "capital-ready"],
  },
  {
    id: "climate-resilience",
    title: "Climate Resilience Stack",
    summary: "Codify climate intelligence, finance, and emergency readiness policies so SDG 13 reporting stays audit-proof.",
    sdgAlignment: ["SDG 13"],
    vlrStages: ["ingestion", "scoring"],
    priorityLevel: "mid-term",
    focusAreas: ["Climate infrastructure", "Grid control rooms", "Emergency coordination"],
    anchorKpis: ["sdg-progress", "wellbeing-score"],
  },
];

export const policyInsights: PolicyInsight[] = [
  {
    id: "learning-equity-accord",
    themeId: "learning-equity",
    title: "Adopt the Learning Equity Accord",
    sdgTargets: ["SDG 4.1", "SDG 5.c"],
    vlrStageRef: "classification",
    decisionType: "executive directive",
    signalSummary: "SDG classification flagged attendance dips in several priority districts while equity scans cite subsidy gaps in essential services.",
    narrative:
      "A mayoral accord would align education, gender equity, and workforce policies into one charter so every district team reports progress through the same SDG 4/5 lens.",
    recommendation:
      "Issue an executive directive that sets shared equity KPIs for all districts, formalizes the mobility tutoring surge plan, and requires weekly evidence uploads to the VLR workspace.",
    expectedImpact: {
      metricId: "sdg-progress",
      delta: "+2 districts back on track",
      horizon: "30 days",
    },
    dependencies: ["Education department sign-off", "Equity scan refresh", "Ops budget for mobile teams"],
    confidence: 0.82,
    readinessWindow: "0-30 days",
  },
  {
    id: "gender-balanced-workforce-compact",
    themeId: "learning-equity",
    title: "Launch the Gender-Balanced Workforce Compact",
    sdgTargets: ["SDG 5.5", "SDG 8.5"],
    vlrStageRef: "scoring",
    decisionType: "legislative pact",
    signalSummary: "Micromobility share is 12 points up, yet female participation in emerging jobs is lagging across permitting pipelines.",
    narrative:
      "Council legislation can tie procurement incentives to inclusive hiring ratios, forcing every SDG-linked grant to disclose gender outcomes before funds flow.",
    recommendation:
      "Advance a compact that conditions workforce subsidies on gender parity dashboards, with automation hooks that sync hiring data into the KPI scoring stage.",
    expectedImpact: {
      metricId: "sdg-progress",
      delta: "+1.5 pt sustainable jobs index",
      horizon: "60 days",
    },
    dependencies: ["Labor council testimony", "Shared gender parity ontology", "Procurement policy update"],
    confidence: 0.78,
    readinessWindow: "30-60 days",
  },
  {
    id: "lifelong-learning-fund",
    themeId: "learning-equity",
    title: "Stand Up the Lifelong Learning Reskilling Fund",
    sdgTargets: ["SDG 4.3", "SDG 8.6"],
    vlrStageRef: "narrative",
    decisionType: "budget decision",
    signalSummary: "Scenario planning shows tutoring crews lift SDG 4 within five days, but funding is ad hoc.",
    narrative:
      "A pooled reskilling fund lets finance, workforce, and community teams trigger rapid response learning pilots without reauthorizing every grant.",
    recommendation:
      "Earmark a $25M revolving allocation tied to SDG 4/8 narratives, with governance requiring each release to publish evidence packets into the VLR automation queue.",
    expectedImpact: {
      metricId: "sdg-progress",
      delta: "+3 signature programs funded",
      horizon: "90 days",
    },
    dependencies: ["Budget office pact", "Legal structure for pooled fund", "Outcome-based reporting template"],
    confidence: 0.74,
    readinessWindow: "60-90 days",
  },
  {
    id: "green-export-credit",
    themeId: "green-industry",
    title: "Activate the Green Export Credit Line",
    sdgTargets: ["SDG 8.3", "SDG 9.2"],
    vlrStageRef: "scoring",
    decisionType: "budget decision",
    signalSummary: "Finance is missing key SDG 9 invoice tags and green jobs grants are awaiting classification.",
    narrative:
      "A dedicated credit line would let procurement reconcile invoices instantly, keeping the AI pipelines stocked with verified SDG 8/9 evidence.",
    recommendation:
      "Authorize treasury to front-load the export credit facility with climate bond proceeds, contingent upon automated tagging of every invoice before VLR scoring.",
    expectedImpact: {
      metricId: "vlr-ready",
      delta: "VLR sections ready: 9/9",
      horizon: "14 days",
    },
    dependencies: ["Treasury approval", "Invoice taxonomy automation", "Green bond disclosure"],
    confidence: 0.81,
    readinessWindow: "0-30 days",
  },
  {
    id: "industrial-supply-taskforce",
    themeId: "green-industry",
    title: "Seat the Industrial Supply Taskforce",
    sdgTargets: ["SDG 9.4", "SDG 12.2"],
    vlrStageRef: "narrative",
    decisionType: "executive directive",
    signalSummary: "Scenario comparisons show the Green Economy pipeline can jump from 52 to 81 projects once supply data is synchronized.",
    narrative:
      "A cross-agency taskforce would align permitting, grid upgrades, and export controls, producing a single storyline for SDG 9 narratives.",
    recommendation:
      "Issue an order standing up the taskforce with fortnightly deliverables: unified supplier registry, clean energy siting map, and a policy memo for the narrative stage.",
    expectedImpact: {
      metricId: "vlr-ready",
      delta: "+3 flagship case studies",
      horizon: "45 days",
    },
    dependencies: ["Industry council charter", "Shared permitting dashboard", "Legal authority for data sharing"],
    confidence: 0.76,
    readinessWindow: "30-60 days",
  },
  {
    id: "regional-green-board",
    themeId: "green-industry",
    title: "Form the Regional Green Jobs Board",
    sdgTargets: ["SDG 8.2", "SDG 17.17"],
    vlrStageRef: "narrative",
    decisionType: "legislative pact",
    signalSummary: "Model performance data shows only 64% of green jobs milestones are funded despite strong demand.",
    narrative:
      "A regional board with statutory power to publish quarterly SDG workforce benchmarks will keep funders, unions, and startups aligned.",
    recommendation:
      "Pass enabling legislation for a multi-jurisdiction board that publishes binding workforce scorecards and plugs its data feed directly into VLR narratives.",
    expectedImpact: {
      metricId: "vlr-ready",
      delta: "+6% evidence cleared",
      horizon: "90 days",
    },
    dependencies: ["Interlocal agreements", "Labor seat appointments", "Regional data trust"],
    confidence: 0.7,
    readinessWindow: "60-90 days",
  },
  {
    id: "housing-charter",
    themeId: "public-realm",
    title: "Issue the Housing & Public Realm Charter",
    sdgTargets: ["SDG 11.1", "SDG 11.7"],
    vlrStageRef: "narrative",
    decisionType: "executive directive",
    signalSummary: "Flagship public realm programs are delivering the strongest wellbeing lift but lack a citywide governance frame.",
    narrative:
      "A charter would codify design standards, displacement guardrails, and reporting cadence so every district project feeds the SDG 11 storyline coherently.",
    recommendation:
      "Publish the charter with binding design criteria, community benefit clauses, and an instruction to attach outcomes to the SDG 11 narrative packet.",
    expectedImpact: {
      metricId: "wellbeing-score",
      delta: "+4 pts sustained",
      horizon: "60 days",
    },
    dependencies: ["Planning commission review", "Community benefits toolkit", "Legal review"],
    confidence: 0.79,
    readinessWindow: "30-60 days",
  },
  {
    id: "public-space-bond",
    themeId: "public-realm",
    title: "Advance the Public Space Resilience Bond",
    sdgTargets: ["SDG 11.b", "SDG 13.1"],
    vlrStageRef: "scoring",
    decisionType: "budget decision",
    signalSummary: "Coastal resilience projects are waiting for environmental audits while capital readiness dipped three points.",
    narrative:
      "Bundling parks, housing, and climate retrofits into a single bond unlocks funding certainty and creates a marquee SDG 11/13 story for the VLR.",
    recommendation:
      "Send a $500M ordinance to council that ties bond proceeds to verifiable SDG metrics and requires quarterly feed updates to the KPI scoring engine.",
    expectedImpact: {
      metricId: "capital-ready",
      delta: "+10% funding certainty",
      horizon: "90 days",
    },
    dependencies: ["Treasury modeling", "Rating agency briefing", "Environmental review packets"],
    confidence: 0.72,
    readinessWindow: "60-90 days",
  },
  {
    id: "civic-stewardship-framework",
    themeId: "public-realm",
    title: "Codify the Civic Stewardship Framework",
    sdgTargets: ["SDG 11.3", "SDG 16.7"],
    vlrStageRef: "narrative",
    decisionType: "legislative pact",
    signalSummary: "Civic infrastructure capital pacing fell below plan, risking the SDG 11 evidence pipeline.",
    narrative:
      "Formal stewardship agreements would bind community organizations, mobility teams, and capital planners to the same reporting cadence.",
    recommendation:
      "Adopt legislation that creates stewardship MOUs, embeds them into each CIP contract, and mandates uploading evidence to the VLR narrative queue.",
    expectedImpact: {
      metricId: "capital-ready",
      delta: "+8 partnership projects certified",
      horizon: "75 days",
    },
    dependencies: ["Community board ratification", "Contract templates", "Digital reporting workspace"],
    confidence: 0.69,
    readinessWindow: "60-90 days",
  },
  {
    id: "climate-data-trust",
    themeId: "climate-resilience",
    title: "Stand Up the Climate Data Trust",
    sdgTargets: ["SDG 13.2", "SDG 17.16"],
    vlrStageRef: "ingestion",
    decisionType: "executive directive",
    signalSummary: "Telemetry ingestion cleared 64 feeds but lacks a governance wrapper for cross-agency sharing.",
    narrative:
      "A trust charter would set retention, privacy, and evidence lineage rules so every climate feed can be cited in the VLR without manual audits.",
    recommendation:
      "Issue an executive order creating the trust, appoint stewards from energy, water, and emergency ops, and mandate provenance metadata for every ingestion feed.",
    expectedImpact: {
      metricId: "sdg-progress",
      delta: "+5% data readiness",
      horizon: "45 days",
    },
    dependencies: ["Data privacy office", "Interagency MOUs", "Metadata automation"],
    confidence: 0.8,
    readinessWindow: "30-60 days",
  },
  {
    id: "heat-resilience-mandate",
    themeId: "climate-resilience",
    title: "Issue the Heat Resilience Mandate",
    sdgTargets: ["SDG 3.d", "SDG 13.1"],
    vlrStageRef: "scoring",
    decisionType: "executive directive",
    signalSummary: "Wellbeing index is 74 but heat sentinel alerts are pulsing in multiple dense neighborhoods.",
    narrative:
      "A mandate aligning cooling centers, grid ops, and public health unlocks a flagship SDG 13 story and keeps wellbeing gains intact.",
    recommendation:
      "Publish a mandate that defines neighborhood heat thresholds, authorizes automatic microgrid activation, and forces agencies to post evidence into the KPI scoring stream.",
    expectedImpact: {
      metricId: "wellbeing-score",
      delta: "+3 pts resilience lift",
      horizon: "30 days",
    },
    dependencies: ["Public health concurrence", "Microgrid protocols", "Community messaging plan"],
    confidence: 0.77,
    readinessWindow: "0-30 days",
  },
  {
    id: "climate-bond-dashboard",
    themeId: "climate-resilience",
    title: "Publish the Climate Bond Accountability Dashboard",
    sdgTargets: ["SDG 9.1", "SDG 13.a"],
    vlrStageRef: "narrative",
    decisionType: "budget decision",
    signalSummary: "Investors want real-time audit readiness before committing to the next climate bond tranche.",
    narrative:
      "A live dashboard connecting audit badges, capital pacing, and SDG impact scores derisks the next issuance and feeds the VLR narrative with verifiable data.",
    recommendation:
      "Fund a public dashboard that streams audit readiness data, ties every capital dollar to SDG indicators, and exports packets straight into the VLR story.",
    expectedImpact: {
      metricId: "capital-ready",
      delta: "+12% investor confidence",
      horizon: "90 days",
    },
    dependencies: ["Investor relations office", "Assurance partners", "Open data engineering"],
    confidence: 0.73,
    readinessWindow: "60-90 days",
  },
];
