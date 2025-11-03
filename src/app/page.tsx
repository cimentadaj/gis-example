import { AnchorButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
  heroContent,
  platformPillars,
  signalBadges,
  narrativeSections,
  successStories,
  credibilitySignals,
} from "@/data/content";
import {
  defaultScenarioKey,
  getScenarioConfig,
  type ScenarioDefinition,
  type ScenarioSignal,
} from "@/lib/scenarios";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Globe2,
  MapPinned,
  Radar,
} from "lucide-react";

export default function Home() {
  const defaultScenario = getScenarioConfig(defaultScenarioKey);

  if (!defaultScenario) {
    throw new Error(`Scenario configuration missing for key: ${defaultScenarioKey}`);
  }

  return (
    <div className="space-y-6 pb-12">
      <HeroSection hero={heroContent} scenario={defaultScenario} />
      <SignalsMarquee badges={signalBadges} />
      <PillarsSection pillars={platformPillars} />
      <NarrativeFlowSection narrative={narrativeSections} />
      <ImpactStoriesSection stories={successStories} />
      <CredibilitySection credibility={credibilitySignals} />
    </div>
  );
}

type HeroContent = typeof heroContent;

function HeroSection({ hero, scenario }: { hero: HeroContent; scenario: ScenarioDefinition }) {
  return (
    <Section className="pt-32" id="platform">
      <Container className="relative grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-xl space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">
            {hero.eyebrow}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>

          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="text-base leading-7 text-foreground/70 sm:text-lg">{hero.subheadline}</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <AnchorButton href={hero.primaryCta.href} className="w-full sm:w-auto">
              {hero.primaryCta.label}
            </AnchorButton>
            <AnchorButton href={hero.secondaryCta.href} variant="secondary" className="w-full sm:w-auto">
              {hero.secondaryCta.label}
            </AnchorButton>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-[0.25em] text-foreground/60">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-semibold text-white">{stat.value}</dd>
                <p className="text-xs text-foreground/60">{stat.detail}</p>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_45px_120px_-50px_rgba(14,165,233,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.25),transparent_65%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,118,110,0.15),transparent_45%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              <div>
                <CitySignalCard scenario={scenario} />
              </div>
              <div className="grid gap-4">
                <InsightChip
                  icon={MapPinned}
                  title="Mobility density heatmaps refresh every 60s"
                  tone="primary"
                />
                <InsightChip
                  icon={Radar}
                  title="Edge sensors flag anomaly clusters in near real time"
                  tone="accent"
                />
                <InsightChip icon={Activity} title="Predictive load balancing keeps energy resilient" tone="glow" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 hidden w-[85%] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0 py-3 text-center text-xs font-medium uppercase tracking-[0.35em] text-primary-200 shadow-[0_30px_90px_-45px_rgba(59,130,246,0.7)] sm:block">
            Trusted by digital twin taskforces across 12 global metros
          </div>
        </div>
      </Container>
    </Section>
  );
}

function SignalsMarquee({ badges }: { badges: string[] }) {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-[marquee_18s_linear_infinite] gap-6 whitespace-nowrap border-y border-white/5 bg-white/5 py-4 text-xs uppercase tracking-[0.35em] text-foreground/60">
        {[...badges, ...badges].map((signal, index) => (
          <span key={`${signal}-${index}`} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-400" />
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}

function PillarsSection({ pillars }: { pillars: typeof platformPillars }) {
  return (
    <Section id="platform-architecture">
      <Container className="grid gap-12 lg:grid-cols-[0.75fr_1fr] lg:gap-16">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.45em] text-primary-200">Platform Stack</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Built for orchestration, explainability, and measurable city outcomes.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            From edge sensors to policy command rooms, every layer is stitched together. Each module exposes
            open APIs, transparent models, and governance-ready audit trails.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-foreground/50">
            <span className="rounded-full border border-white/10 px-4 py-2">Interoperable Twins</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Explainable AI</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Mission Control</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface/70 p-6 shadow-[0_35px_80px_-45px_rgba(15,118,110,0.45)] transition hover:-translate-y-1 hover:border-primary-400/40 hover:bg-surface/90"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/15 via-transparent to-accent-500/15" />
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary-200">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/70">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

type NarrativeBlock = (typeof narrativeSections)[number];

function NarrativeFlowSection({ narrative }: { narrative: typeof narrativeSections }) {
  return (
    <Section id="ai-insights" className="pt-10">
      <Container className="space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">
            <BrainCircuit className="h-3.5 w-3.5" />
            AI Narrative Engine
          </span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Explainable intelligence orchestrates every layer of the digital twin.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            Our scenario playbooks walk operations, planners, and executives through the same shared source of
            truth. Each storyline blends live telemetry, simulations, and policy guardrails so decisions stay
            transparent and defensible.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {narrative.map((block, index) => (
            <NarrativeCard key={block.headline} block={block} step={index + 1} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function NarrativeCard({ block, step }: { block: NarrativeBlock; step: number }) {
  return (
    <article className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-surface/80 p-6 text-sm text-foreground/80 shadow-[0_45px_120px_-60px_rgba(56,189,248,0.65)] transition duration-500 hover:-translate-y-1 hover:border-primary-400/40">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 via-transparent to-accent-500/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em]">
        <span className="inline-flex items-center gap-2 text-primary-200">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-white">
            {String(step).padStart(2, "0")}
          </span>
          {block.eyebrow}
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] tracking-[0.35em] text-foreground/50">
          Scenario Playbook
        </span>
      </div>
      <div className="relative space-y-3">
        <h3 className="text-lg font-semibold text-white">{block.headline}</h3>
        <p className="leading-6 text-foreground/70">{block.body}</p>
      </div>
      <ul className="relative grid gap-2 text-sm leading-6">
        {block.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <span className="text-foreground/70">{highlight}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

type SuccessStory = (typeof successStories)[number];

function ImpactStoriesSection({ stories }: { stories: typeof successStories }) {
  const highlightPoints = [
    "Deployable in under six weeks with turnkey data onboarding and governance baselines.",
    "Scenario twins mix mobility, climate, and grid levers into one briefing-ready canvas.",
    "AI co-pilots coach field teams with explainable actions and compliance safeguards.",
  ];

  return (
    <Section id="use-cases" className="pt-10">
      <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-accent-200">
            <Globe2 className="h-3.5 w-3.5" />
            City Impact Library
          </span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Proven across waterfronts, innovation corridors, and resilient districts.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            Every deployment blends live operations with predictive simulations so leadership can orchestrate
            mobility, energy, and climate decisions in lockstep. Here is how urban innovators are already scaling
            the playbooks.
          </p>
          <ul className="grid gap-3 text-sm text-foreground/70">
            {highlightPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-accent-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {stories.map((story, index) => (
            <SuccessStoryCard key={story.city} story={story} accentIndex={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function SuccessStoryCard({ story, accentIndex }: { story: SuccessStory; accentIndex: number }) {
  const accentPalette = [
    "from-primary-400/40 to-primary-500/10",
    "from-emerald-400/35 to-teal-500/10",
    "from-fuchsia-400/35 to-purple-500/10",
  ];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface/75 p-6 shadow-[0_45px_120px_-50px_rgba(168,85,247,0.45)] transition duration-500 hover:-translate-y-1 hover:border-accent-500/40">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40" />
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${accentPalette[accentIndex % accentPalette.length]}`} />
      <div className="relative flex flex-col gap-4 text-sm text-foreground/75">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
            {story.city}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-primary-200">{story.metric}</span>
        </div>
        <p className="text-base font-semibold leading-6 text-white">{story.outcome}</p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Impact Vector</p>
          <p className="mt-2 text-sm font-medium text-foreground/80">{story.impact}</p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Digital Twin in Action</p>
        <p className="text-sm leading-6 text-foreground/70">
          Coordinated AI copilots, map intelligence, and command room workflows to keep stakeholders aligned in
          minutes.
        </p>
      </div>
    </article>
  );
}

type Credibility = typeof credibilitySignals;

function CredibilitySection({ credibility }: { credibility: Credibility }) {
  const { badges, partners } = credibility;

  return (
    <Section id="why-us" className="pt-10">
      <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/60">
            Mission-Grade Assurance
          </span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Built for civic trust, regulatory confidence, and operational resilience.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            Every rollout is hardened with privacy-by-design, AI governance accelerators, and cybersecurity
            playbooks so you can scale innovation without compromising compliance.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge} className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground/70">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500/15 text-primary-200">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span>{badge}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <AnchorButton href="#contact" variant="primary">
              Engage the Taskforce
            </AnchorButton>
            <AnchorButton href="#demo" variant="secondary">
              Download Capabilities Deck
            </AnchorButton>
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-[0_45px_120px_-50px_rgba(59,130,246,0.55)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/15" />
          <div className="relative space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground/50">Strategic Alliances</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {partners.map(({ name, logo: Logo }) => (
                <div key={name} className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-center text-xs text-foreground/60 transition hover:border-primary-400/30 hover:bg-primary-400/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary-200">
                    <Logo className="h-6 w-6" />
                  </span>
                  <span className="uppercase tracking-[0.25em]">{name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-foreground/70">
              We collaborate with innovation labs, utilities, and global standards bodies to ensure every feature
              aligns with smart city mandates and ethical AI frameworks.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CitySignalCard({ scenario }: { scenario: ScenarioDefinition }) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-6 text-sm text-foreground/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 fill=%22none%22%3E%3Cpath d=%22M40 0H0V40%22 stroke=%22rgba(255,255,255,0.08)%22/%3E%3C/svg%3E')] opacity-30" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary-200">Live Signals</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{scenario.name}</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-foreground/60">
          AI-Co-Pilot
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        {scenario.liveSignals.map((signal) => (
          <SignalRow key={signal.label} signal={signal} />
        ))}
      </div>
    </div>
  );
}

function SignalRow({ signal }: { signal: ScenarioSignal }) {
  const deltaClasses = cn(
    "rounded-full px-3 py-1 text-[11px] font-medium",
    signal.tone === "positive" && "bg-success-500/15 text-success-500",
    signal.tone === "warning" && "bg-warning-500/15 text-warning-500",
    signal.tone === "neutral" && "bg-white/10 text-foreground/70",
  );

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">{signal.label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{signal.value}</p>
      </div>
      <span className={deltaClasses}>{signal.delta}</span>
    </div>
  );
}

function InsightChip({
  icon: Icon,
  title,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  tone: "primary" | "accent" | "glow";
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary-400/20 to-primary-500/10"
      : tone === "accent"
        ? "from-accent-400/20 to-accent-500/10"
        : "from-emerald-400/20 to-emerald-500/10";

  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r p-4", toneClass)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-primary-100">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm leading-6 text-foreground/80">{title}</p>
    </div>
  );
}
