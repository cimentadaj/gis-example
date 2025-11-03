import { type ComponentType } from "react";
import { Bot, ChartBarIncreasing, CircleDashed, Map, ShieldCheck, Sparkles } from "lucide-react";

type PillarDescriptor = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type NarrativeSection = {
  eyebrow: string;
  headline: string;
  body: string;
  highlights: string[];
};

type SuccessStory = {
  city: string;
  outcome: string;
  impact: string;
  metric: string;
};

type TestimonialVoice = {
  name: string;
  title: string;
  organization: string;
  quote: string;
  cityFocus: string;
  avatarInitials: string;
};

type CallToActionContent = {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  metrics: {
    label: string;
    value: string;
    detail: string;
  }[];
};

export const heroContent = {
  eyebrow: "City-Scale AI",
  headline: "The intelligence layer cities trust to choreograph the future.",
  subheadline:
    "Nexus Consulting fuses GIS, machine learning, and digital twins into a single pane of glass. Anticipate disruptions, orchestrate multi-agency response, and optimize urban systems before issues surface.",
  primaryCta: {
    label: "Book an Immersive Demo",
    href: "#demo",
  },
  secondaryCta: {
    label: "Explore Live Scenarios",
    href: "#scenarios",
  },
  stats: [
    { label: "Faster Response", value: "42%", detail: "incident mitigation speed" },
    { label: "CO₂ Reduction", value: "28%", detail: "grid emission optimization" },
    { label: "Predictive Accuracy", value: "94%", detail: "mobility demand forecast" },
  ],
};

export const signalBadges = [
  "Dynamic resilience index",
  "Micromobility adoption heat",
  "Hydro-reservoir forecast",
  "AI incident triage",
  "Blue sky compliance drift",
  "Urban canopy vitality",
];

export const platformPillars: PillarDescriptor[] = [
  {
    title: "City Digital Twin",
    description: "Continuously streaming geospatial intelligence across mobility, energy, and climate layers.",
    icon: CircleDashed,
  },
  {
    title: "AI Command Center",
    description: "Edge-to-cloud model stack monitoring anomalies and forecasting outcomes in real time.",
    icon: Bot,
  },
  {
    title: "Decision Studio",
    description: "Scenario planning with explainable insights, collaborative workflows, and risk simulations.",
    icon: ChartBarIncreasing,
  },
  {
    title: "Operational Guardrails",
    description: "Policy, compliance, and resiliency playbooks orchestrated across agencies at scale.",
    icon: ShieldCheck,
  },
];

export const narrativeSections: NarrativeSection[] = [
  {
    eyebrow: "Augmented Operations",
    headline: "Sensor-to-decisions in minutes, not weeks.",
    body:
      "Fuse heterogeneous feeds and let AI prioritize the noise. Adaptive workflows give operations teams model-guided playbooks while maintaining policy guardrails.",
    highlights: [
      "Self-healing map layers contextualize every anomaly alert.",
      "Explainable recommendations translate complex models into actionable guardrails.",
      "Digital twin snapshots capture before/after states for executive briefings.",
    ],
  },
  {
    eyebrow: "Futureproof Mobility",
    headline: "Optimize fleets, corridors, and curb space with predictive demand.",
    body:
      "Blend origin-destination modeling, curb analytics, and micromobility heatmaps to orchestrate multimodal networks without sacrificing equity or sustainability.",
    highlights: [
      "Proactive congestion protocols reduce average incident clearance by 18 minutes.",
      "Shared foresight dashboards align transit authorities, logistics, and emergency services.",
      "Equity compliance scoring ensures underserved districts are prioritized.",
    ],
  },
  {
    eyebrow: "Resilience Engineering",
    headline: "From floodplain simulations to energy black start readiness.",
    body:
      "Scenario libraries quantify cascading risks across water, power, and climate infrastructure while digital humans coach analysts through mitigation playbooks.",
    highlights: [
      "AI-guided response trees triage threats across critical lifelines.",
      "Climate-forward KPIs track carbon, heat island, and grid resilience in one view.",
      "Cross-agency war rooms align tactical response with executive mandates.",
    ],
  },
];

export const successStories: SuccessStory[] = [
  {
    city: "Rotterdam",
    outcome: "Flood-window alerts synchronized port and inland evacuation within 11 minutes.",
    impact: "Downtime reduction",
    metric: "37% faster recovery",
  },
  {
    city: "Singapore",
    outcome: "Dynamic curb orchestration cut last-mile congestion in smart logistics zones.",
    impact: "Mobility uplift",
    metric: "22% throughput gain",
  },
  {
    city: "Austin",
    outcome: "Grid-aware heat stress models guided microgrid activation ahead of demand spikes.",
    impact: "Energy resilience",
    metric: "18% peak load shaved",
  },
];

export const credibilitySignals = {
  badges: [
    "ISO 37120 Certified Insights Partner",
    "UN Smart Cities Innovation Lab Alum",
    "GDPR & FedRAMP-aligned data services",
  ],
  partners: [
    { name: "SkyMetro Mobility Exchange", logo: Sparkles },
    { name: "UrbanFlux Energy Systems", logo: Map },
    { name: "CivicSentinel Trust", logo: ShieldCheck },
  ],
};

export const testimonialVoices: TestimonialVoice[] = [
  {
    name: "Elena Torres",
    title: "Chief Resilience Officer",
    organization: "Ajuntament de Barcelona",
    quote:
      "Nexus Consulting synchronized our flood, heat, and mobility twins into a scenario war room so every agency aligned on the same forecast.",
    cityFocus: "Barcelona Climate Pact",
    avatarInitials: "ET",
  },
  {
    name: "Malik Henderson",
    title: "Director of Urban Systems Lab",
    organization: "Portland Bureau of Planning & Sustainability",
    quote:
      "We compress week-long analytics into live executive briefings with explainable AI guardrails that satisfy both council and chief data officers.",
    cityFocus: "Portland Circular Mobility",
    avatarInitials: "MH",
  },
  {
    name: "Sakura Imai",
    title: "Smart Region Strategist",
    organization: "Tokyo Metropolitan Government",
    quote:
      "Across rail, energy, and emergency services we unlocked a single predictive command center that keeps every operator focused on action.",
    cityFocus: "Tokyo Resilience MetroLab",
    avatarInitials: "SI",
  },
];

export const callToActionContent: CallToActionContent = {
  eyebrow: "Co-design the next resilient metropolis",
  headline: "Ready to orchestrate your city's AI command center?",
  body:
    "Partner with our urban technologists to map the data spine, activate digital twins, and deploy AI co-pilots that accelerate outcomes across your agencies within 90 days.",
  bullets: [
    "Executive vision workshop that translates strategy into an activation backlog.",
    "Data and governance deep dive to ensure compliance, ethics, and interoperability.",
    "Pilot-to-scale playbook with measurable KPIs, training, and change management.",
  ],
  primaryCta: {
    label: "Schedule Executive Briefing",
    href: "#demo",
  },
  secondaryCta: {
    label: "Download Vision Kit",
    href: "#vision",
  },
  metrics: [
    {
      label: "Cities orchestrated",
      value: "24",
      detail: "live urban digital twins under management",
    },
    {
      label: "Time to impact",
      value: "90 days",
      detail: "from discovery to cross-agency activation",
    },
    {
      label: "AI trust index",
      value: "97%",
      detail: "stakeholder confidence in explainable models",
    },
  ],
};
