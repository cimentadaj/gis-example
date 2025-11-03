export type CopilotScenarioKey = "sdg-localization" | "vlr-automation" | "city-profiling";

export type CopilotMetricTone = "positive" | "warning" | "neutral";

export type CopilotMetric = {
  label: string;
  value: string;
  delta: string;
  detail: string;
  tone: CopilotMetricTone;
};

export type CopilotModule = {
  key: CopilotScenarioKey;
  title: string;
  subtitle: string;
  description: string;
  metrics: CopilotMetric[];
  playbook: string[];
  assurance: {
    label: string;
    score: number;
    detail: string;
  };
};

export type CopilotMessage = {
  id: string;
  speaker: "Operator" | "Nexus Copilot";
  time: string;
  body: string;
  tags?: string[];
};

export type CopilotMissionStatus = "active" | "queued" | "complete";

export type CopilotMission = {
  id: string;
  title: string;
  status: CopilotMissionStatus;
  eta: string;
  owner: string;
  detail: string;
};

export type CopilotPrompt = {
  id: string;
  label: string;
  prompt: string;
};

export type CopilotRecommendationPriority = "critical" | "high" | "medium";

export type CopilotRecommendation = {
  id: string;
  title: string;
  detail: string;
  priority: CopilotRecommendationPriority;
  channel: string;
  impact: string;
};

export type CopilotAuditCategory = "governance" | "ops" | "policy";

export type CopilotAuditEntry = {
  id: string;
  time: string;
  label: string;
  description: string;
  category: CopilotAuditCategory;
};

export const copilotModules: CopilotModule[] = [
  {
    key: "sdg-localization",
    title: "SDG Localization Steward",
    subtitle: "District indicators, citizens, and policy stitched in one loop.",
    description:
      "The steward keeps every SDG indicator fresh, grounded in source evidence, and equity-checked before the next council touchpoint. Nexus Copilot handles indicator scoring, provenance, and community storytelling so analysts stay in decision mode.",
    metrics: [
      {
        label: "Alignment Confidence",
        value: "94%",
        delta: "+6%",
        detail: "Indicators with full provenance and steward sign-off.",
        tone: "positive",
      },
      {
        label: "Equity Coverage",
        value: "0.87",
        delta: "+0.05",
        detail: "Share of households sitting inside prioritized interventions.",
        tone: "positive",
      },
      {
        label: "Data Freshness",
        value: "98%",
        delta: "+3%",
        detail: "Indicator feeds refreshed in the last 24 hours.",
        tone: "positive",
      },
    ],
    playbook: [
      "Blend census, participatory budgeting, and IoT feeds into a single indicator story.",
      "Surface districts with SDG 11 and SDG 13 variance ahead of the weekly stand-up.",
      "Push localized micro-briefs with recommended actions to community captains.",
    ],
    assurance: {
      label: "Localization Assurance",
      score: 93,
      detail: "Equity guardrails and provenance checks validated at 07:42.",
    },
  },
  {
    key: "vlr-automation",
    title: "VLR Automation Orchestrator",
    subtitle: "Evidence packets, AI narratives, and compliance cues auto-assembled.",
    description:
      "The orchestrator keeps voluntary local review pipelines humming. Draft narratives, evidence tables, and compliance attestations are generated on the fly with clear human-in-the-loop checkpoints.",
    metrics: [
      {
        label: "Sections Ready",
        value: "78%",
        delta: "+12%",
        detail: "Chapters with narrative, charts, and citations pre-approved.",
        tone: "positive",
      },
      {
        label: "Evidence Confidence",
        value: "0.92",
        delta: "+0.04",
        detail: "Packets with dual-source verification and SDG tagging.",
        tone: "positive",
      },
      {
        label: "Assurance Flags",
        value: "3 open",
        delta: "-2",
        detail: "Items awaiting steward acknowledgement.",
        tone: "neutral",
      },
    ],
    playbook: [
      "Reconcile finance ledger metrics with climate disclosures before export.",
      "Promote AI-generated summary for SDG 11.7 to the executive draft.",
      "Trigger assurance review for indicator packets missing community commentary.",
    ],
    assurance: {
      label: "Compliance Ledger Health",
      score: 96,
      detail: "UN DESA alignment and audit trail locked 09:12.",
    },
  },
  {
    key: "city-profiling",
    title: "City Profiling Strategist",
    subtitle: "Investments, wellbeing, and capital plans aligned in real time.",
    description:
      "Scenario analysis blends demographic trends, wellbeing metrics, and capital pipelines. The strategist keeps leadership focused on the next high-impact regeneration moves with transparent AI reasoning.",
    metrics: [
      {
        label: "Wellbeing Lift",
        value: "+6 pts",
        delta: "+2",
        detail: "Projected uplift in priority districts this quarter.",
        tone: "positive",
      },
      {
        label: "Capital On Track",
        value: "81%",
        delta: "-3%",
        detail: "Projects funded vs. plan with AI re-sequencing.",
        tone: "warning",
      },
      {
        label: "Community Sentiment",
        value: "Optimistic",
        delta: "+2%",
        detail: "Signals from forums, surveys, and helpline transcripts.",
        tone: "positive",
      },
    ],
    playbook: [
      "Simulate wellbeing impact of reallocating $5.2M to Northern Commons.",
      "Bundle inclusive design upgrades for Harbor shoreline before council vote.",
      "Generate neighborhood fact sheets with AI-grounded talking points.",
    ],
    assurance: {
      label: "Profile Governance Index",
      score: 91,
      detail: "Budget office and equity guard confirmed audit at 08:26.",
    },
  },
];

export const copilotModuleIndex = copilotModules.reduce<Record<CopilotScenarioKey, CopilotModule>>((acc, module) => {
  acc[module.key] = module;
  return acc;
}, {} as Record<CopilotScenarioKey, CopilotModule>);

export const copilotThreads: Record<CopilotScenarioKey, CopilotMessage[]> = {
  "sdg-localization": [
    {
      id: "sdg-msg-01",
      speaker: "Operator",
      time: "07:34",
      body: "Need an SDG 11 alignment story for Innovation Basin before the steering committee call.",
      tags: ["SDG Brief"],
    },
    {
      id: "sdg-msg-02",
      speaker: "Nexus Copilot",
      time: "07:34",
      body:
        "Drafting micro-brief now—highlighting training pods, public space upgrades, and the equity lift. Provenance links embedded.",
      tags: ["Narrative Draft"],
    },
    {
      id: "sdg-msg-03",
      speaker: "Operator",
      time: "07:35",
      body: "Flag any indicators that still need steward confirmation.",
    },
    {
      id: "sdg-msg-04",
      speaker: "Nexus Copilot",
      time: "07:35",
      body:
        "Three indicators pending commentary from the community studio. I can route requests and auto-remind stewards every 4 hours.",
      tags: ["Follow-up"],
    },
    {
      id: "sdg-msg-05",
      speaker: "Nexus Copilot",
      time: "07:36",
      body: "Delivering a shareable dashboard snapshot with on-track, watch, and delayed clusters colour-coded.",
      tags: ["Snapshot"],
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-msg-01",
      speaker: "Operator",
      time: "09:18",
      body: "Executive team wants the VLR executive summary before lunch. Are the SDG 9 sections solid?",
      tags: ["Executive Brief"],
    },
    {
      id: "vlr-msg-02",
      speaker: "Nexus Copilot",
      time: "09:18",
      body:
        "Evidence packets reconciled and narratives drafted. Only the green schoolyard investment citation still needs finance approval.",
      tags: ["Citation Check"],
    },
    {
      id: "vlr-msg-03",
      speaker: "Operator",
      time: "09:19",
      body: "Queue the assurance review for that citation and let me know once cleared.",
    },
    {
      id: "vlr-msg-04",
      speaker: "Nexus Copilot",
      time: "09:19",
      body:
        "Done. Compliance steward looped in, estimated clearance 16 minutes. Draft export will auto-update as soon as it's signed off.",
      tags: ["Assurance"],
    },
    {
      id: "vlr-msg-05",
      speaker: "Nexus Copilot",
      time: "09:21",
      body: "Packaging executive summary in PDF and interactive deck formats and logging provenance.",
      tags: ["Export"],
    },
  ],
  "city-profiling": [
    {
      id: "city-msg-01",
      speaker: "Operator",
      time: "11:06",
      body: "Need to compare Northern Commons and Harbor Loop for next quarter's capital allocation.",
      tags: ["Capital Planning"],
    },
    {
      id: "city-msg-02",
      speaker: "Nexus Copilot",
      time: "11:06",
      body:
        "Running wellbeing uplift vs cost scenarios. Northern Commons yields +6 wellbeing points per $10M, Harbor +4 unless shoreline access is funded.",
      tags: ["Scenario"],
    },
    {
      id: "city-msg-03",
      speaker: "Operator",
      time: "11:07",
      body: "Give me a resident-facing storyline with equity and climate talking points.",
    },
    {
      id: "city-msg-04",
      speaker: "Nexus Copilot",
      time: "11:07",
      body:
        "Draft ready—includes housing stability, public space access, and climate resilience narratives with sentiment snapshots.",
      tags: ["Storyline"],
    },
    {
      id: "city-msg-05",
      speaker: "Nexus Copilot",
      time: "11:08",
      body: "Logging decision trail and sharing to the joint budget channel for transparency.",
      tags: ["Audit Trail"],
    },
  ],
};

export const copilotMissionDeck: Record<CopilotScenarioKey, CopilotMission[]> = {
  "sdg-localization": [
    {
      id: "sdg-mission-01",
      title: "District steward sync",
      status: "active",
      eta: "07:48",
      owner: "Localization Desk",
      detail: "Collect commentary from Innovation Basin and Harbor Resilience stewards.",
    },
    {
      id: "sdg-mission-02",
      title: "SDG 11 narrative draft",
      status: "active",
      eta: "07:55",
      owner: "Narrative Studio",
      detail: "Auto-generate micro-brief with AI explanations and comparatives.",
    },
    {
      id: "sdg-mission-03",
      title: "Equity data refresh",
      status: "queued",
      eta: "08:20",
      owner: "Equity Guard",
      detail: "Pull latest community feedback loops into the indicator store.",
    },
    {
      id: "sdg-mission-04",
      title: "Council briefing kit",
      status: "complete",
      eta: "07:29",
      owner: "Policy Office",
      detail: "Slide deck sealed with provenance links and SDG callouts.",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-mission-01",
      title: "Evidence reconciliation",
      status: "active",
      eta: "09:26",
      owner: "Compliance Hub",
      detail: "Resolve ledger variance for SDG 9.1 infrastructure spend.",
    },
    {
      id: "vlr-mission-02",
      title: "Narrative polish sprint",
      status: "active",
      eta: "09:31",
      owner: "Narrative Studio",
      detail: "Incorporate citizen quotes and climate tie-ins into summary.",
    },
    {
      id: "vlr-mission-03",
      title: "Assurance sign-offs",
      status: "queued",
      eta: "09:44",
      owner: "Governance Desk",
      detail: "Confirm policy guardrails for three outstanding indicators.",
    },
    {
      id: "vlr-mission-04",
      title: "Executive export bundle",
      status: "complete",
      eta: "08:58",
      owner: "Automation Bot",
      detail: "PDF + interactive twin view zipped with provenance manifest.",
    },
  ],
  "city-profiling": [
    {
      id: "city-mission-01",
      title: "Wellbeing uplift scenario",
      status: "active",
      eta: "11:18",
      owner: "Impact Lab",
      detail: "Model cross-district wellbeing impact of capital re-sequencing.",
    },
    {
      id: "city-mission-02",
      title: "Capital pacing review",
      status: "active",
      eta: "11:24",
      owner: "Budget Office",
      detail: "Flag projects trending behind funding glidepath.",
    },
    {
      id: "city-mission-03",
      title: "Community story weave",
      status: "queued",
      eta: "11:36",
      owner: "Community Voice",
      detail: "Curate testimonies from resident forums into decision brief.",
    },
    {
      id: "city-mission-04",
      title: "Transparency ledger update",
      status: "complete",
      eta: "10:58",
      owner: "Governance Desk",
      detail: "Decision rationale recorded with budget and equity annotations.",
    },
  ],
};

export const copilotPromptLibrary: Record<CopilotScenarioKey, CopilotPrompt[]> = {
  "sdg-localization": [
    {
      id: "sdg-prompt-01",
      label: "Brief the steering committee",
      prompt: "Summarize SDG 11 progress across Innovation Basin and Harbor Loop with equity context.",
    },
    {
      id: "sdg-prompt-02",
      label: "Explain indicator variance",
      prompt: "Why did the urban cooling canopy indicator slip this week? Include data freshness and steward notes.",
    },
    {
      id: "sdg-prompt-03",
      label: "Community studio recap",
      prompt: "Draft highlights from yesterday's civic studio and map them to SDG targets.",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-prompt-01",
      label: "Executive summary refresh",
      prompt: "Generate a 3-paragraph VLR summary emphasizing SDG 9 and SDG 11 wins.",
    },
    {
      id: "vlr-prompt-02",
      label: "Evidence audit trail",
      prompt: "List remaining evidence packets needing sign-off and the responsible steward.",
    },
    {
      id: "vlr-prompt-03",
      label: "Compliance spotlight",
      prompt: "Explain current assurance flags and recommended remediation actions.",
    },
  ],
  "city-profiling": [
    {
      id: "city-prompt-01",
      label: "Capital choice explainer",
      prompt: "Compare wellbeing lift for Northern Commons vs Harbor Loop including budget notes.",
    },
    {
      id: "city-prompt-02",
      label: "Community briefing",
      prompt: "Draft a resident update for civic Wi-Fi expansion with SDG tie-ins and sentiment signals.",
    },
    {
      id: "city-prompt-03",
      label: "Equity check",
      prompt: "Show how the proposed capital re-sequencing impacts equity coverage.",
    },
  ],
};

export const copilotRecommendations: Record<CopilotScenarioKey, CopilotRecommendation[]> = {
  "sdg-localization": [
    {
      id: "sdg-rec-01",
      title: "Authorize data steward reminders",
      detail: "Automate micro-brief requests for districts with indicators below 0.6 progress index.",
      priority: "high",
      channel: "Localization Desk",
      impact: "Alignment +4% this cycle",
    },
    {
      id: "sdg-rec-02",
      title: "Publish SDG 11 spotlight",
      detail: "Push Innovation Basin success story to mayoral briefing pack.",
      priority: "medium",
      channel: "Policy Office",
      impact: "Stakeholder confidence boost",
    },
    {
      id: "sdg-rec-03",
      title: "Route equity survey refresh",
      detail: "Schedule new community pulse survey for Care Corridor Spine indicators.",
      priority: "medium",
      channel: "Community Voice",
      impact: "Equity coverage validation",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-rec-01",
      title: "Unlock finance handshake",
      detail: "Trigger finance steward to approve SDG 9.1 capital ledger and auto-sync evidence packet.",
      priority: "critical",
      channel: "Compliance Hub",
      impact: "Executive summary unblock",
    },
    {
      id: "vlr-rec-02",
      title: "Narrative polish cycle",
      detail: "Launch AI-human co-edit on SDG 11.7 storyline with multimedia embeds.",
      priority: "high",
      channel: "Narrative Studio",
      impact: "Narrative quality +5%",
    },
    {
      id: "vlr-rec-03",
      title: "Assurance rehearsal",
      detail: "Prep governance trio for tomorrow's UN DESA alignment review.",
      priority: "medium",
      channel: "Governance Desk",
      impact: "Risk exposure ↓ 2 flags",
    },
  ],
  "city-profiling": [
    {
      id: "city-rec-01",
      title: "Re-sequence capital bundle",
      detail: "Advance Northern Commons streetscape package to next council docket.",
      priority: "high",
      channel: "Budget Office",
      impact: "Wellbeing lift +6 pts",
    },
    {
      id: "city-rec-02",
      title: "Fund shoreline access",
      detail: "Lock $4.2M supplemental budget for Harbor resilience corridor accessibility.",
      priority: "critical",
      channel: "Capital Council",
      impact: "Equity coverage parity",
    },
    {
      id: "city-rec-03",
      title: "Community story share",
      detail: "Distribute narrative cards to resident ambassadors with localised metrics.",
      priority: "medium",
      channel: "Community Voice",
      impact: "Sentiment uplift +3%",
    },
  ],
};

export const copilotAuditLog: Record<CopilotScenarioKey, CopilotAuditEntry[]> = {
  "sdg-localization": [
    {
      id: "sdg-audit-01",
      time: "07:22",
      label: "Indicator provenance lock",
      description: "All SDG 11 indicators stamped with steward acknowledgement.",
      category: "governance",
    },
    {
      id: "sdg-audit-02",
      time: "07:27",
      label: "Equity guard validation",
      description: "Equity guard confirmed distributional fairness thresholds.",
      category: "policy",
    },
    {
      id: "sdg-audit-03",
      time: "07:33",
      label: "Community feedback ingest",
      description: "Studio transcripts anonymized and routed to localization store.",
      category: "ops",
    },
    {
      id: "sdg-audit-04",
      time: "07:38",
      label: "Briefing export",
      description: "Council briefing packaged with full evidence manifest.",
      category: "governance",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-audit-01",
      time: "08:56",
      label: "Assurance checkpoint",
      description: "Governance desk approved automation sequence for the VLR pipeline.",
      category: "policy",
    },
    {
      id: "vlr-audit-02",
      time: "09:03",
      label: "Evidence ledger sync",
      description: "Finance steward reconciled SDG 9.1 ledger with automation outputs.",
      category: "ops",
    },
    {
      id: "vlr-audit-03",
      time: "09:10",
      label: "Narrative publication",
      description: "Executive draft issued with AI + human edit provenance trail.",
      category: "governance",
    },
    {
      id: "vlr-audit-04",
      time: "09:14",
      label: "UN DESA compliance log",
      description: "Alignment checklist sealed for quarterly submission.",
      category: "policy",
    },
  ],
  "city-profiling": [
    {
      id: "city-audit-01",
      time: "10:52",
      label: "Scenario ensemble freeze",
      description: "Impact Lab validated the wellbeing uplift ensemble set.",
      category: "ops",
    },
    {
      id: "city-audit-02",
      time: "10:58",
      label: "Budget transparency",
      description: "Budget office logged capital pacing update with equity tags.",
      category: "governance",
    },
    {
      id: "city-audit-03",
      time: "11:03",
      label: "Community story approval",
      description: "Resident ambassadors approved inclusive storytelling pack.",
      category: "policy",
    },
    {
      id: "city-audit-04",
      time: "11:10",
      label: "Decision ledger sync",
      description: "Decision trails published with rationale, trade-offs, and sentiment.",
      category: "governance",
    },
  ],
};
