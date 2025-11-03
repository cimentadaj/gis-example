import { AnchorButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { heroContent, platformPillars, signalBadges } from "@/data/content";
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
    <Section id="ai-insights">
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
