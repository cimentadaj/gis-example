export type CopilotMetricTone = "positive" | "warning" | "neutral";

export type CopilotMetric = {
  label: string;
  value: string;
  delta: string;
  detail: string;
  tone: CopilotMetricTone;
};

export type CopilotModule = {
  key: "mobility" | "energy" | "climate";
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
      "Retune adaptive signals on Skyloop and sync with scooter rebalancing",
      "Pre-authorize dynamic curb pricing pulse for Innovation Basin micro-freight",
      "Dispatch digital twin snapshot to exec room for 09:45 mobility briefing",
    ],
    assurance: {
      label: "Mobility Trust Index",
      score: 92,
      detail: "Explainability anchors validated by operations chief at 08:57",
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
      "Stage hospital microgrid for pre-heatwave load with 14% reserve margin",
      "Trigger demand response SMS for civic buildings exceeding carbon budget",
      "Simulate 3-node outage to verify black-start readiness within 6 minutes",
    ],
    assurance: {
      label: "Resilience Certainty",
      score: 95,
      detail: "AI monitors stabilized variance post drift-correction cycle",
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
      "Deploy blue-green buffer simulation along Harbor District in next 30 min",
      "Coordinate drone lidar sweep to validate levee integrity before 13:00",
      "Issue multilingual push briefings to prioritize heat-vulnerable residents",
    ],
    assurance: {
      label: "Climate Confidence",
      score: 89,
      detail: "Scenario ensemble coverage at 94% of policy thresholds",
    },
  },
];

export type CopilotMessage = {
  id: string;
  speaker: "Operator" | "AetherCity AI";
  time: string;
  body: string;
  tags?: string[];
};

export const copilotConversation: CopilotMessage[] = [
  {
    id: "msg-01",
    speaker: "Operator",
    time: "09:41",
    body: "Need a congestion mitigation plan for Skyloop before the council briefing in 10 minutes.",
    tags: ["Mobility Command"],
  },
  {
    id: "msg-02",
    speaker: "AetherCity AI",
    time: "09:41",
    body:
      "Activating adaptive platooning and staging freight diversion toward Innovation Basin docks. Projected queue clearance in 12 minutes with 4.5 minute operator savings.",
    tags: ["Playbook Ready"],
  },
  {
    id: "msg-03",
    speaker: "Operator",
    time: "09:42",
    body: "Do we stay inside the emissions pledge if we ramp transit headways?",
  },
  {
    id: "msg-04",
    speaker: "AetherCity AI",
    time: "09:42",
    body:
      "Yes. Carbon intensity remains 8% below the policy boundary. I will rebalance electric bus charging and schedule night-cycle regeneration to maintain buffer.",
    tags: ["Carbon Safe"],
  },
  {
    id: "msg-05",
    speaker: "AetherCity AI",
    time: "09:43",
    body:
      "Dispatching an executive-ready twin snapshot to your briefing deck with narrated overlays and a 90-second story reel.",
    tags: ["Briefing Kit"],
  },
];

export type CopilotMission = {
  id: string;
  title: string;
  status: "active" | "queued" | "complete";
  eta: string;
  owner: string;
};

export const copilotMissions: CopilotMission[] = [
  {
    id: "mission-01",
    title: "Skyloop adaptive retiming",
    status: "active",
    eta: "09:47",
    owner: "Mobility Ops",
  },
  {
    id: "mission-02",
    title: "Harbor freight diversion routing",
    status: "active",
    eta: "09:52",
    owner: "Logistics AI",
  },
  {
    id: "mission-03",
    title: "Microgrid pre-charge directive",
    status: "queued",
    eta: "10:05",
    owner: "Energy Desk",
  },
  {
    id: "mission-04",
    title: "Storm surge evacuation rehearsal",
    status: "queued",
    eta: "11:20",
    owner: "Resilience Hub",
  },
  {
    id: "mission-05",
    title: "Executive twin briefing bundle",
    status: "complete",
    eta: "09:38",
    owner: "Narrative Studio",
  },
];
