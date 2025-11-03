export type CopilotScenarioKey = "mobility" | "energy" | "climate" | "safety";

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
    key: "mobility",
    title: "Mobility Orchestra",
    subtitle: "Autonomous congestion relief choreography",
    description:
      "Edge models listen to fare gates, curb sensors, and micromobility docks while the copilot balances throughput, equity, and emissions constraints in real time.",
    metrics: [
      {
        label: "Queue Dissipation",
        value: "12 min",
        delta: "-38%",
        detail: "Projected rush hour clearance",
        tone: "positive",
      },
      {
        label: "Curb Compliance",
        value: "94%",
        delta: "+7%",
        detail: "Freight dwell realignment",
        tone: "positive",
      },
      {
        label: "Equity Guardrail",
        value: "Met",
        delta: "0 drift",
        detail: "Priority lanes in underserved wards",
        tone: "neutral",
      },
    ],
    playbook: [
      "Retune adaptive signals on Skyloop and sync with scooter rebalancing.",
      "Pre-authorize dynamic curb pricing pulse for Innovation Basin micro-freight.",
      "Dispatch digital twin snapshot to exec room for 09:45 mobility briefing.",
    ],
    assurance: {
      label: "Mobility Trust Index",
      score: 92,
      detail: "Explainability anchors validated by operations chief at 08:57.",
    },
  },
  {
    key: "energy",
    title: "Grid Resilience Sentinel",
    subtitle: "Distributed energy orchestration with carbon guardrails",
    description:
      "AI optimizes microgrid choreography and storage dispatch, keeping carbon intensity and substation margins inside policy thresholds without human escalation.",
    metrics: [
      {
        label: "Carbon Intensity",
        value: "268 gCO₂/kWh",
        delta: "-11%",
        detail: "Post battery dispatch forecast",
        tone: "positive",
      },
      {
        label: "Substation Buffer",
        value: "18%",
        delta: "+5 pts",
        detail: "Critical feeders redundancy",
        tone: "positive",
      },
      {
        label: "DER Participation",
        value: "76%",
        delta: "+9%",
        detail: "Community solar enrollment",
        tone: "neutral",
      },
    ],
    playbook: [
      "Stage hospital microgrid for pre-heatwave load with 14% reserve margin.",
      "Trigger demand response SMS for civic buildings exceeding carbon budget.",
      "Simulate 3-node outage to verify black-start readiness within 6 minutes.",
    ],
    assurance: {
      label: "Resilience Certainty",
      score: 95,
      detail: "AI monitors stabilized variance post drift-correction cycle.",
    },
  },
  {
    key: "climate",
    title: "Climate Adaptation Studio",
    subtitle: "Hydrology + heat risk harmonized with social equity",
    description:
      "Digital twin ensembles stress-test coastal surge, pluvial flooding, and heat vulnerability; the copilot surfaces human-centric mitigations before the next stormfront.",
    metrics: [
      {
        label: "Flood Exposure",
        value: "↓ 28%",
        delta: "-9 k residents",
        detail: "Evacuation overlay with SES priority",
        tone: "positive",
      },
      {
        label: "Cooling Network",
        value: "112 pods",
        delta: "+14",
        detail: "Adaptive shade + hydration points",
        tone: "positive",
      },
      {
        label: "Recovery ETA",
        value: "3.4 hr",
        delta: "-22%",
        detail: "Storm surge clearance projection",
        tone: "positive",
      },
    ],
    playbook: [
      "Deploy blue-green buffer simulation along Harbor District in next 30 min.",
      "Coordinate drone lidar sweep to validate levee integrity before 13:00.",
      "Issue multilingual push briefings to prioritize heat-vulnerable residents.",
    ],
    assurance: {
      label: "Climate Confidence",
      score: 89,
      detail: "Scenario ensemble coverage at 94% of policy thresholds.",
    },
  },
  {
    key: "safety",
    title: "Safety Fusion Marshal",
    subtitle: "Crowd, emergency, and sentiment intelligence in one loop",
    description:
      "Computer vision, social listening, and incident queues ground proactive crowd management while maintaining equitable coverage for every district festival.",
    metrics: [
      {
        label: "Response Readiness",
        value: "98%",
        delta: "+4%",
        detail: "Units within 6 min arrival band",
        tone: "positive",
      },
      {
        label: "Crowd Density Alerts",
        value: "2 zones",
        delta: "-1",
        detail: "Active compression watchlists",
        tone: "positive",
      },
      {
        label: "Sentiment Drift",
        value: "Stable",
        delta: "+0.4",
        detail: "Festival chatter confidence",
        tone: "neutral",
      },
    ],
    playbook: [
      "Pre-position rapid response pod near Sector B ingress by 17:10.",
      "Push multi-lingual safety cues to Innovation Basin festival screens.",
      "Sync drone thermal sweep corridor and feed highlights to command wall.",
    ],
    assurance: {
      label: "Safety Assurance",
      score: 93,
      detail: "Joint ops confirmed audit trail at 09:15.",
    },
  },
];

export const copilotModuleIndex = copilotModules.reduce<Record<CopilotScenarioKey, CopilotModule>>((acc, module) => {
  acc[module.key] = module;
  return acc;
}, {} as Record<CopilotScenarioKey, CopilotModule>);

export const copilotThreads: Record<CopilotScenarioKey, CopilotMessage[]> = {
  mobility: [
    {
      id: "mob-msg-01",
      speaker: "Operator",
      time: "09:41",
      body: "Need congestion relief on Skyloop ahead of the council briefing in 10 minutes.",
      tags: ["Mobility Command"],
    },
    {
      id: "mob-msg-02",
      speaker: "Nexus Copilot",
      time: "09:41",
      body:
        "Activating adaptive platooning and staging freight diversion toward Innovation Basin docks. Queue clearance projected in 12 minutes with 4.5 minute operator savings.",
      tags: ["Playbook Ready"],
    },
    {
      id: "mob-msg-03",
      speaker: "Operator",
      time: "09:42",
      body: "Confirm we stay under the emissions pledge if we ramp transit headways.",
    },
    {
      id: "mob-msg-04",
      speaker: "Nexus Copilot",
      time: "09:42",
      body:
        "Yes. Carbon intensity holds 8% below the policy boundary. Rebalancing electric bus charging and scheduling night-cycle regeneration to maintain buffer.",
      tags: ["Carbon Safe"],
    },
    {
      id: "mob-msg-05",
      speaker: "Nexus Copilot",
      time: "09:43",
      body:
        "Dropping an executive-ready twin snapshot to your briefing deck with narrated overlays and a 90-second story reel.",
      tags: ["Briefing Kit"],
    },
  ],
  energy: [
    {
      id: "eng-msg-01",
      speaker: "Operator",
      time: "15:06",
      body: "Innovation Basin microgrid looks unstable. Need contingency before evening peak.",
      tags: ["Grid Watch"],
    },
    {
      id: "eng-msg-02",
      speaker: "Nexus Copilot",
      time: "15:07",
      body:
        "Dispatching thermal storage charge and sequencing DER participation to lift reserve margin to 18%. Triggering low-carbon dispatch so we stay under 270 gCO₂/kWh.",
      tags: ["Reserve Build"],
    },
    {
      id: "eng-msg-03",
      speaker: "Operator",
      time: "15:08",
      body: "Do we notify Harbor District hospitals about potential load shedding?",
    },
    {
      id: "eng-msg-04",
      speaker: "Nexus Copilot",
      time: "15:08",
      body:
        "Not yet. Forecast shows 6% headroom after the charge cycle. I will auto-alert clinical leads if variance exceeds 3% in the next 40 minutes.",
      tags: ["Clinical Priority"],
    },
    {
      id: "eng-msg-05",
      speaker: "Nexus Copilot",
      time: "15:09",
      body:
        "Uploading grid resilience storyboard for the executive committee with carbon savings, outage risk, and recommended comms language.",
      tags: ["Briefing Kit"],
    },
  ],
  climate: [
    {
      id: "cli-msg-01",
      speaker: "Operator",
      time: "06:18",
      body: "Harbor surge models look severe. Need mitigation path for the 09:00 mayor briefing.",
      tags: ["Storm Surge"],
    },
    {
      id: "cli-msg-02",
      speaker: "Nexus Copilot",
      time: "06:18",
      body:
        "Deploying modular flood barriers at Pier 6, extending blue-green buffers to Northern Commons, and opening cooling pods along Innovation Basin. Exposure drops 28%.",
      tags: ["Mitigation Pack"],
    },
    {
      id: "cli-msg-03",
      speaker: "Operator",
      time: "06:19",
      body: "Give me a resident-facing story I can push with push alerts.",
    },
    {
      id: "cli-msg-04",
      speaker: "Nexus Copilot",
      time: "06:19",
      body:
        "Drafting multilingual brief tailored to vulnerable households with shelter routing, transit options, and hydration site capacity.",
      tags: ["Civic Comms"],
    },
    {
      id: "cli-msg-05",
      speaker: "Nexus Copilot",
      time: "06:20",
      body:
        "Filed adaptation task list to the resilience hub with drone lidar schedule, levee scan, and wellness calls for flagged residents.",
      tags: ["Mission Queue"],
    },
  ],
  safety: [
    {
      id: "saf-msg-01",
      speaker: "Operator",
      time: "19:24",
      body: "Festival ingress at Sector B is spiking. Need relief before crowd density exceeds threshold.",
      tags: ["Crowd Watch"],
    },
    {
      id: "saf-msg-02",
      speaker: "Nexus Copilot",
      time: "19:24",
      body:
        "Re-routing pedestrian flow via Waterfront Promenade, activating geo-fenced micromobility drop zones, and signaling mounted units. Density projection back under amber in 6 minutes.",
      tags: ["Flow Plan"],
    },
    {
      id: "saf-msg-03",
      speaker: "Operator",
      time: "19:25",
      body: "Any misinformation spikes we should neutralize?",
    },
    {
      id: "saf-msg-04",
      speaker: "Nexus Copilot",
      time: "19:25",
      body:
        "Yes. Social listening detects rumor about gate closures. Issuing trusted comms package to public information officers and festival channels.",
      tags: ["Sentiment Shield"],
    },
    {
      id: "saf-msg-05",
      speaker: "Nexus Copilot",
      time: "19:26",
      body:
        "Uploading thermal scan overlays for perimeter units and locking audit notes into the safety fusion ledger.",
      tags: ["Audit Trail"],
    },
  ],
};

export const copilotMissionDeck: Record<CopilotScenarioKey, CopilotMission[]> = {
  mobility: [
    {
      id: "mob-mission-01",
      title: "Skyloop adaptive retiming",
      status: "active",
      eta: "09:47",
      owner: "Mobility Ops",
      detail: "Coordinating 11 intersections and micromobility docks to dissipate queues.",
    },
    {
      id: "mob-mission-02",
      title: "Harbor freight diversion routing",
      status: "active",
      eta: "09:52",
      owner: "Logistics AI",
      detail: "Freight convoys steered to Innovation Basin while keeping emissions below pledge.",
    },
    {
      id: "mob-mission-03",
      title: "Equity lane compliance sweep",
      status: "queued",
      eta: "10:05",
      owner: "Mobility Ops",
      detail: "Roadside units verifying priority access for underserved wards.",
    },
    {
      id: "mob-mission-04",
      title: "Executive twin briefing bundle",
      status: "complete",
      eta: "09:38",
      owner: "Narrative Studio",
      detail: "Brief deck compiled with annotated congestion overlays.",
    },
  ],
  energy: [
    {
      id: "eng-mission-01",
      title: "Innovation Basin microgrid buffer",
      status: "active",
      eta: "15:18",
      owner: "Energy Desk",
      detail: "Storage dispatch lifts reserve margin above 16% before evening peak.",
    },
    {
      id: "eng-mission-02",
      title: "Carbon intensity guardrail",
      status: "active",
      eta: "15:25",
      owner: "Carbon Council",
      detail: "Optimizing DER mix to maintain 270 gCO₂/kWh commitment.",
    },
    {
      id: "eng-mission-03",
      title: "Hospital continuity alerts",
      status: "queued",
      eta: "15:40",
      owner: "Clinical Ops",
      detail: "Adaptive messaging ready if variance exceeds 3% threshold.",
    },
    {
      id: "eng-mission-04",
      title: "Grid resilience storyboard",
      status: "complete",
      eta: "14:52",
      owner: "Narrative Studio",
      detail: "Executive-ready pack with savings, risks, and policy notes.",
    },
  ],
  climate: [
    {
      id: "cli-mission-01",
      title: "Pier 6 barrier staging",
      status: "active",
      eta: "06:45",
      owner: "Resilience Hub",
      detail: "Deploying modular flood barrier convoy to coastal frontage.",
    },
    {
      id: "cli-mission-02",
      title: "Cooling pod expansion",
      status: "active",
      eta: "07:05",
      owner: "Wellness Desk",
      detail: "Extending shelter hours and hydration supply for heat wave.",
    },
    {
      id: "cli-mission-03",
      title: "Drone lidar levee scan",
      status: "queued",
      eta: "07:30",
      owner: "Field Robotics",
      detail: "Confirm structural integrity before high tide at 08:20.",
    },
    {
      id: "cli-mission-04",
      title: "Adaptation task ledger",
      status: "complete",
      eta: "06:11",
      owner: "Mission Control",
      detail: "Checklist filed with prioritised climate mitigations.",
    },
  ],
  safety: [
    {
      id: "saf-mission-01",
      title: "Sector B ingress relief",
      status: "active",
      eta: "19:30",
      owner: "Event Ops",
      detail: "Dynamic signage and unit redeployments reduce crowd pressure.",
    },
    {
      id: "saf-mission-02",
      title: "Sentiment stabilization brief",
      status: "active",
      eta: "19:33",
      owner: "Public Information",
      detail: "Counter-rumor messaging distributed across channels.",
    },
    {
      id: "saf-mission-03",
      title: "Thermal sweep corridor",
      status: "queued",
      eta: "19:40",
      owner: "Aerial Ops",
      detail: "Drone path locked to monitor density hotspots.",
    },
    {
      id: "saf-mission-04",
      title: "Safety fusion ledger update",
      status: "complete",
      eta: "19:12",
      owner: "Governance Desk",
      detail: "All interventions logged with equity annotations.",
    },
  ],
};

export const copilotPromptLibrary: Record<CopilotScenarioKey, CopilotPrompt[]> = {
  mobility: [
    {
      id: "mob-prompt-01",
      label: "Brief the council",
      prompt: "Summarize congestion relief outcomes for Skyloop and highlight emission savings for the council briefing.",
    },
    {
      id: "mob-prompt-02",
      label: "Equity audit",
      prompt: "Audit micromobility availability in underserved wards over the last 30 minutes.",
    },
    {
      id: "mob-prompt-03",
      label: "Operator coaching",
      prompt: "Generate play-by-play guidance for on-street ambassadors managing commuter flow.",
    },
  ],
  energy: [
    {
      id: "eng-prompt-01",
      label: "Carbon pledge",
      prompt: "Explain how tonight's dispatch keeps carbon intensity beneath the 270 gCO₂ threshold.",
    },
    {
      id: "eng-prompt-02",
      label: "Microgrid drill",
      prompt: "Simulate a two-node outage and outline recovery sequencing for Innovation Basin.",
    },
    {
      id: "eng-prompt-03",
      label: "Stakeholder update",
      prompt: "Draft a message for hospital administrators covering load stability and contingency plans.",
    },
  ],
  climate: [
    {
      id: "cli-prompt-01",
      label: "Resident alert",
      prompt: "Prepare a bilingual alert for residents in Harbor District about surge barriers and safe corridors.",
    },
    {
      id: "cli-prompt-02",
      label: "Cooling ops",
      prompt: "List actions to expand cooling network capacity before heat index exceeds 34°C.",
    },
    {
      id: "cli-prompt-03",
      label: "Mayor briefing",
      prompt: "Build a briefing for the mayor covering mitigation progress and remaining climate risks.",
    },
  ],
  safety: [
    {
      id: "saf-prompt-01",
      label: "Crowd flow",
      prompt: "Recommend deployments to hold Sector B crowd density under the 85% threshold.",
    },
    {
      id: "saf-prompt-02",
      label: "Misinformation",
      prompt: "Summarize social sentiment anomalies and propose counter-messaging for rumors.",
    },
    {
      id: "saf-prompt-03",
      label: "After-action",
      prompt: "Draft an after-action note for public safety leadership with response metrics and equity highlights.",
    },
  ],
};

export const copilotRecommendations: Record<CopilotScenarioKey, CopilotRecommendation[]> = {
  mobility: [
    {
      id: "mob-rec-01",
      title: "Activate congestion relief burst",
      detail: "Roll adaptive signal retiming and micromobility balancing across Skyloop arterials.",
      priority: "critical",
      channel: "Mobility Ops",
      impact: "Queue length -38% in 12 min",
    },
    {
      id: "mob-rec-02",
      title: "Dynamic curb pricing pulse",
      detail: "Introduce 45-minute surge fee on Harbor Connector freight stalls to unlock flow.",
      priority: "high",
      channel: "Logistics AI",
      impact: "Freight dwell -6.5 min",
    },
    {
      id: "mob-rec-03",
      title: "Accessibility audit ping",
      detail: "Push compliance check for equity lanes and send snapshots to governance desk.",
      priority: "medium",
      channel: "Equity Team",
      impact: "Equity adherence 100%",
    },
  ],
  energy: [
    {
      id: "eng-rec-01",
      title: "Pre-charge storage fleet",
      detail: "Charge Harbor District and Innovation Basin batteries before 18:30 to buffer demand.",
      priority: "critical",
      channel: "Energy Desk",
      impact: "Reserve margin +6 pts",
    },
    {
      id: "eng-rec-02",
      title: "Carbon-friendly dispatch",
      detail: "Blend in community solar and hydrogen micro-turbines to keep pledge intact.",
      priority: "high",
      channel: "Carbon Council",
      impact: "Carbon intensity ↓ 11%",
    },
    {
      id: "eng-rec-03",
      title: "Hospitals readiness packet",
      detail: "Queue contingency brief for critical facilities in case load variance spikes.",
      priority: "medium",
      channel: "Clinical Ops",
      impact: "Continuity risk ↓ 18%",
    },
  ],
  climate: [
    {
      id: "cli-rec-01",
      title: "Deploy surge barrier column",
      detail: "Pre-stage modular barriers at Pier 6 and coordinate logistics support.",
      priority: "critical",
      channel: "Resilience Hub",
      impact: "Flood exposure ↓ 28%",
    },
    {
      id: "cli-rec-02",
      title: "Cooling center expansion",
      detail: "Extend hours and staffing for Innovation Basin pods with hydration drops.",
      priority: "high",
      channel: "Wellness Desk",
      impact: "Shelter capacity +18%",
    },
    {
      id: "cli-rec-03",
      title: "Resident comms cascade",
      detail: "Schedule multilingual push alerts with safe corridors and wellness checks.",
      priority: "medium",
      channel: "Community Voice",
      impact: "At-risk households reached",
    },
  ],
  safety: [
    {
      id: "saf-rec-01",
      title: "Ingress relief maneuver",
      detail: "Redirect flows via Waterfront Promenade and escalate mounted units to Sector B.",
      priority: "critical",
      channel: "Event Ops",
      impact: "Crowd density -22%",
    },
    {
      id: "saf-rec-02",
      title: "Sentiment stabilization blast",
      detail: "Distribute coordinated messaging to counter gate-closure rumors.",
      priority: "high",
      channel: "Public Information",
      impact: "Rumor decay 4 min",
    },
    {
      id: "saf-rec-03",
      title: "Equity patrol rotation",
      detail: "Confirm patrol coverage across vulnerable neighborhoods post festival.",
      priority: "medium",
      channel: "Equity Guard",
      impact: "Coverage parity 1.0",
    },
  ],
};

export const copilotAuditLog: Record<CopilotScenarioKey, CopilotAuditEntry[]> = {
  mobility: [
    {
      id: "mob-audit-01",
      time: "09:36",
      label: "Adaptive signal approval",
      description: "Signed off by mobility director with automated guardrail verification.",
      category: "ops",
    },
    {
      id: "mob-audit-02",
      time: "09:38",
      label: "Equity lane compliance",
      description: "Accessibility review logged for Northern Commons corridor.",
      category: "policy",
    },
    {
      id: "mob-audit-03",
      time: "09:40",
      label: "Emission pledge check",
      description: "Carbon council notified of headroom after adaptive dispatch.",
      category: "governance",
    },
    {
      id: "mob-audit-04",
      time: "09:43",
      label: "Briefing bundle",
      description: "Executive-ready deck synced to mission archive with provenance.",
      category: "governance",
    },
  ],
  energy: [
    {
      id: "eng-audit-01",
      time: "15:01",
      label: "Reservoir readiness",
      description: "Grid resilience sentinel validated storage health before dispatch.",
      category: "ops",
    },
    {
      id: "eng-audit-02",
      time: "15:05",
      label: "Carbon guardrail log",
      description: "Carbon council acknowledgement stored with emission deltas.",
      category: "policy",
    },
    {
      id: "eng-audit-03",
      time: "15:08",
      label: "Clinical notification hold",
      description: "Hospital alert template queued and governance approval recorded.",
      category: "governance",
    },
    {
      id: "eng-audit-04",
      time: "15:12",
      label: "Storyboard archive",
      description: "Narrative studio commit captured with energy KPIs and carbon savings.",
      category: "governance",
    },
  ],
  climate: [
    {
      id: "cli-audit-01",
      time: "06:05",
      label: "Storm surge trigger",
      description: "Emergency ordinance invoked with automated policy citations.",
      category: "policy",
    },
    {
      id: "cli-audit-02",
      time: "06:12",
      label: "Cooling network uplift",
      description: "Equity guard validated resource allocation across heat-prone wards.",
      category: "ops",
    },
    {
      id: "cli-audit-03",
      time: "06:18",
      label: "Resident alert brief",
      description: "Community voice office approved multilingual messaging.",
      category: "governance",
    },
    {
      id: "cli-audit-04",
      time: "06:21",
      label: "Adaptation ledger sync",
      description: "Mission ledger updated with mitigation tasks and accountability chain.",
      category: "governance",
    },
  ],
  safety: [
    {
      id: "saf-audit-01",
      time: "19:18",
      label: "Crowd threshold advisory",
      description: "Safety fusion board logged proactive threshold alert.",
      category: "ops",
    },
    {
      id: "saf-audit-02",
      time: "19:22",
      label: "Equity coverage review",
      description: "Patrol rotation validated for underserved neighborhoods.",
      category: "policy",
    },
    {
      id: "saf-audit-03",
      time: "19:25",
      label: "Rumor counter-programming",
      description: "Public information office approved sentiment stabilization script.",
      category: "governance",
    },
    {
      id: "saf-audit-04",
      time: "19:27",
      label: "Thermal sweep record",
      description: "Aerial ops telemetry attached to crowd safety ledger.",
      category: "governance",
    },
  ],
};

export const copilotConversation = copilotThreads.mobility;
export const copilotMissions = copilotMissionDeck.mobility;
