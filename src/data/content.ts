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

export const heroContent = {
  eyebrow: "City-Scale AI",
  headline: "The intelligence layer cities trust to choreograph the future.",
  subheadline:
    "AetherCity fuses GIS, machine learning, and digital twins into a single pane of glass. Anticipate disruptions, orchestrate multi-agency response, and optimize urban systems before issues surface.",
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
