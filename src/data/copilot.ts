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
    subtitle: "Keeps district indicators honest.",
    description:
      "Copilot maintains SDG stories, refreshes evidence, and calls out districts that fall behind.",
    metrics: [
      {
        label: "Alignment",
        value: "94%",
        delta: "+6%",
        detail: "Indicators with active steward sign-off.",
        tone: "positive",
      },
      {
        label: "Equity coverage",
        value: "0.87",
        delta: "+0.05",
        detail: "Households covered by the current plan.",
        tone: "positive",
      },
      {
        label: "Data freshness",
        value: "98%",
        delta: "+3%",
        detail: "Feeds refreshed in the last 24 hours.",
        tone: "positive",
      },
    ],
    playbook: [
      "Send micro-briefs to districts slipping under target.",
      "Share quick wins with the mayoral briefing team.",
    ],
    assurance: {
      label: "Localization assurance",
      score: 93,
      detail: "Equity and provenance checks cleared at 07:42.",
    },
  },
  {
    key: "vlr-automation",
    title: "VLR Automation Orchestrator",
    subtitle: "Keeps the VLR pipeline moving.",
    description: "Evidence packets, narratives, and compliance notes stay synced without leaving gaps.",
    metrics: [
      {
        label: "Sections ready",
        value: "78%",
        delta: "+12%",
        detail: "Chapters pre-approved for the executive draft.",
        tone: "positive",
      },
      {
        label: "Evidence cleared",
        value: "0.92",
        delta: "+0.04",
        detail: "Packets with dual-source verification.",
        tone: "positive",
      },
      {
        label: "Assurance flags",
        value: "3 open",
        delta: "-2",
        detail: "Items still waiting for sign-off.",
        tone: "neutral",
      },
    ],
    playbook: [
      "Confirm finance evidence for SDG 9.",
      "Push the SDG 11 storyline once quotes arrive.",
    ],
    assurance: {
      label: "Compliance ledger health",
      score: 96,
      detail: "UN DESA checklist confirmed 09:12.",
    },
  },
  {
    key: "city-profiling",
    title: "City Profiling Strategist",
    subtitle: "Shows where money moves wellbeing.",
    description:
      "Scenario analysis compares wellbeing lift, capital pacing, and resident sentiment in one view.",
    metrics: [
      {
        label: "Wellbeing lift",
        value: "+6 pts",
        delta: "+2",
        detail: "Projected uplift in priority districts.",
        tone: "positive",
      },
      {
        label: "Capital on track",
        value: "81%",
        delta: "-3%",
        detail: "Projects funded vs. plan.",
        tone: "warning",
      },
      {
        label: "Sentiment",
        value: "Optimistic",
        delta: "+2%",
        detail: "Signals from forums and hotline alerts.",
        tone: "positive",
      },
    ],
    playbook: [
      "Compare Northern Commons and Harbor Loop funding cases.",
      "Prep resident talking points for next council vote.",
    ],
    assurance: {
      label: "Profile governance index",
      score: 91,
      detail: "Budget and equity teams confirmed at 08:26.",
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
      body: "Need a short SDG 11 update for Innovation Basin.",
      tags: ["SDG brief"],
    },
    {
      id: "sdg-msg-02",
      speaker: "Nexus Copilot",
      time: "07:34",
      body: "Drafting now with training pod metrics and public space notes.",
      tags: ["Narrative draft"],
    },
    {
      id: "sdg-msg-03",
      speaker: "Operator",
      time: "07:35",
      body: "Flag indicators still waiting on steward comments.",
    },
    {
      id: "sdg-msg-04",
      speaker: "Nexus Copilot",
      time: "07:35",
      body: "Three remain. Reminders sent and snapshot ready to share.",
      tags: ["Follow-up"],
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-msg-01",
      speaker: "Operator",
      time: "09:18",
      body: "Executive team wants the VLR summary before lunch.",
      tags: ["Executive brief"],
    },
    {
      id: "vlr-msg-02",
      speaker: "Nexus Copilot",
      time: "09:18",
      body: "All packets reconciled except the SDG 9 invoice evidence.",
      tags: ["Citation"],
    },
    {
      id: "vlr-msg-03",
      speaker: "Operator",
      time: "09:19",
      body: "Queue compliance and let me know when cleared.",
    },
    {
      id: "vlr-msg-04",
      speaker: "Nexus Copilot",
      time: "09:19",
      body: "On it. Steward ETA 16 minutes. Export will refresh automatically.",
      tags: ["Assurance"],
    },
  ],
  "city-profiling": [
    {
      id: "city-msg-01",
      speaker: "Operator",
      time: "11:06",
      body: "Compare Northern Commons vs Harbor Loop for next quarter.",
      tags: ["Capital planning"],
    },
    {
      id: "city-msg-02",
      speaker: "Nexus Copilot",
      time: "11:06",
      body: "Northern Commons delivers +6 points per $10M; Harbor needs shoreline budget to match.",
      tags: ["Scenario"],
    },
    {
      id: "city-msg-03",
      speaker: "Operator",
      time: "11:07",
      body: "Send a resident-friendly summary with equity notes.",
    },
    {
      id: "city-msg-04",
      speaker: "Nexus Copilot",
      time: "11:07",
      body: "Draft ready with housing, public space, and climate talking points.",
      tags: ["Storyline"],
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
      owner: "Localization desk",
      detail: "Collect commentary from Innovation Basin and Harbor Loop.",
    },
    {
      id: "sdg-mission-02",
      title: "SDG 11 micro-brief",
      status: "active",
      eta: "07:55",
      owner: "Narrative studio",
      detail: "Auto-generate brief with latest evidence links.",
    },
    {
      id: "sdg-mission-03",
      title: "Equity data refresh",
      status: "queued",
      eta: "08:20",
      owner: "Equity guard",
      detail: "Pull new community feedback into the indicator store.",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-mission-01",
      title: "Evidence reconciliation",
      status: "active",
      eta: "09:26",
      owner: "Compliance hub",
      detail: "Resolve ledger variance for SDG 9 spend.",
    },
    {
      id: "vlr-mission-02",
      title: "Narrative polish",
      status: "active",
      eta: "09:31",
      owner: "Narrative studio",
      detail: "Add citizen quotes to the SDG 11 storyline.",
    },
    {
      id: "vlr-mission-03",
      title: "Assurance sign-offs",
      status: "queued",
      eta: "09:44",
      owner: "Governance desk",
      detail: "Confirm policy guardrails for open indicators.",
    },
  ],
  "city-profiling": [
    {
      id: "city-mission-01",
      title: "Wellbeing scenario run",
      status: "active",
      eta: "11:18",
      owner: "Impact lab",
      detail: "Model wellbeing impact for the next capital bundle.",
    },
    {
      id: "city-mission-02",
      title: "Capital pacing review",
      status: "active",
      eta: "11:24",
      owner: "Budget office",
      detail: "Flag projects drifting behind plan.",
    },
    {
      id: "city-mission-03",
      title: "Community brief",
      status: "queued",
      eta: "11:36",
      owner: "Community voice",
      detail: "Curate testimonies for the council packet.",
    },
  ],
};

export const copilotPromptLibrary: Record<CopilotScenarioKey, CopilotPrompt[]> = {
  "sdg-localization": [
    {
      id: "sdg-prompt-01",
      label: "Steering brief",
      prompt: "Summarise SDG 11 progress for Innovation Basin and Harbor Loop.",
    },
    {
      id: "sdg-prompt-02",
      label: "Variance check",
      prompt: "Explain why the cooling canopy indicator slipped this week.",
    },
    {
      id: "sdg-prompt-03",
      label: "Community recap",
      prompt: "Highlight yesterday's civic studio takeaways and linked SDG targets.",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-prompt-01",
      label: "Executive summary",
      prompt: "Draft a short VLR update focused on SDG 9 and SDG 11.",
    },
    {
      id: "vlr-prompt-02",
      label: "Evidence queue",
      prompt: "List evidence packets still needing sign-off and the owner.",
    },
    {
      id: "vlr-prompt-03",
      label: "Assurance overview",
      prompt: "Describe open assurance flags and the next action.",
    },
  ],
  "city-profiling": [
    {
      id: "city-prompt-01",
      label: "Capital choice",
      prompt: "Compare wellbeing lift for Northern Commons vs Harbor Loop with cost notes.",
    },
    {
      id: "city-prompt-02",
      label: "Resident briefing",
      prompt: "Write a resident update on the funding plan with equity talking points.",
    },
    {
      id: "city-prompt-03",
      label: "Equity view",
      prompt: "Show how the capital re-sequencing impacts equity coverage.",
    },
  ],
};

export const copilotRecommendations: Record<CopilotScenarioKey, CopilotRecommendation[]> = {
  "sdg-localization": [
    {
      id: "sdg-rec-01",
      title: "Automate reminders",
      detail: "Send micro-brief requests to districts under 0.6 progress.",
      priority: "high",
      channel: "Localization desk",
      impact: "Alignment +4% this cycle",
    },
    {
      id: "sdg-rec-02",
      title: "Publish SDG 11 win",
      detail: "Share Innovation Basin story in the mayoral brief.",
      priority: "medium",
      channel: "Policy office",
      impact: "Stakeholder confidence boost",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-rec-01",
      title: "Unlock finance approval",
      detail: "Trigger the finance steward to clear SDG 9 evidence.",
      priority: "critical",
      channel: "Compliance hub",
      impact: "Executive summary unblock",
    },
    {
      id: "vlr-rec-02",
      title: "Narrative polish",
      detail: "Co-edit the SDG 11 storyline with the comms team.",
      priority: "high",
      channel: "Narrative studio",
      impact: "Narrative quality +5%",
    },
  ],
  "city-profiling": [
    {
      id: "city-rec-01",
      title: "Advance Northern Commons",
      detail: "Move the streetscape package to the next council docket.",
      priority: "high",
      channel: "Budget office",
      impact: "Wellbeing lift +6 pts",
    },
    {
      id: "city-rec-02",
      title: "Fund shoreline access",
      detail: "Lock supplemental budget for Harbor resilience upgrades.",
      priority: "critical",
      channel: "Capital council",
      impact: "Equity coverage parity",
    },
  ],
};

export const copilotAuditLog: Record<CopilotScenarioKey, CopilotAuditEntry[]> = {
  "sdg-localization": [
    {
      id: "sdg-audit-01",
      time: "07:22",
      label: "Indicator provenance lock",
      description: "SDG 11 indicators stamped with steward approval.",
      category: "governance",
    },
    {
      id: "sdg-audit-02",
      time: "07:27",
      label: "Equity guard validation",
      description: "Equity guard confirmed distribution thresholds.",
      category: "policy",
    },
    {
      id: "sdg-audit-03",
      time: "07:33",
      label: "Community feedback ingest",
      description: "Transcripts anonymised and stored for localisation.",
      category: "ops",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-audit-01",
      time: "08:56",
      label: "Assurance checkpoint",
      description: "Governance desk approved the automation sequence.",
      category: "policy",
    },
    {
      id: "vlr-audit-02",
      time: "09:03",
      label: "Evidence ledger sync",
      description: "Finance steward reconciled SDG 9 ledger entries.",
      category: "ops",
    },
    {
      id: "vlr-audit-03",
      time: "09:10",
      label: "Narrative publication",
      description: "Executive draft issued with provenance trail.",
      category: "governance",
    },
  ],
  "city-profiling": [
    {
      id: "city-audit-01",
      time: "10:52",
      label: "Scenario freeze",
      description: "Impact lab validated the wellbeing uplift ensemble.",
      category: "ops",
    },
    {
      id: "city-audit-02",
      time: "10:58",
      label: "Budget transparency",
      description: "Budget office logged the capital pacing update.",
      category: "governance",
    },
    {
      id: "city-audit-03",
      time: "11:03",
      label: "Community story approval",
      description: "Resident ambassadors approved the outreach pack.",
      category: "policy",
    },
  ],
};
