"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ActivitySquare,
  ArrowUpRight,
  BrainCircuit,
  Gauge,
  Sparkles,
  Zap,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import {
  anomalyClusters,
  demandForecast,
  explainabilitySnippets,
  modelPerformanceStats,
  resilienceForecast,
  riskCells,
  scenarioComparisons,
  type ExplainabilitySnippet,
  type ModelPerformanceStat,
  type RiskCell,
  type ScenarioComparison,
} from "@/data/metrics";
import { cn } from "@/lib/utils";

type ForecastPointShape = {
  label: string;
  ai: number;
  baseline: number;
};

type ResiliencePointShape = {
  label: string;
  ai: number;
  baseline: number;
};

type AnomalyPointShape = {
  cluster: string;
  severityScore: number;
  assets: number;
};

export function AiAnalyticsSection() {
  const demandSeries = useMemo<ForecastPointShape[]>(() => {
    const timeFormatter = new Intl.DateTimeFormat("en", { hour: "numeric", hour12: true });
    return demandForecast.points.map((point, index) => {
      const timestamp = new Date(point.timestamp);
      const baseline = Math.max(0.28, point.value - 0.14 + (index % 2 === 0 ? 0.03 : -0.01));
      return {
        label: timeFormatter.format(timestamp),
        ai: Number(point.value.toFixed(2)),
        baseline: Number(baseline.toFixed(2)),
      };
    });
  }, []);

  const resilienceSeries = useMemo<ResiliencePointShape[]>(() => {
    const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
    return resilienceForecast.points.map((point, index) => {
      const date = new Date(point.timestamp);
      const baseline = Math.max(22, point.value - 3.2 + (index % 3 === 0 ? 1.4 : -0.6));
      return {
        label: dateFormatter.format(date),
        ai: Number(point.value.toFixed(1)),
        baseline: Number(baseline.toFixed(1)),
      };
    });
  }, []);

  const anomalySeries = useMemo<AnomalyPointShape[]>(() => {
    const severityWeight = {
      low: 48,
      moderate: 68,
      high: 90,
    } satisfies Record<AnomalyClusterSeverity, number>;

    return anomalyClusters.map((cluster) => ({
      cluster: cluster.cluster,
      severityScore: severityWeight[cluster.severity],
      assets: cluster.affectedAssets,
    }));
  }, []);

  return (
    <Section id="ai-insights" className="pt-10">
      <Container className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">
            <BrainCircuit className="h-3.5 w-3.5" />
            AI Analytics Studio
          </span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Visual intelligence that lets urban teams feel the AI heartbeat.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            Forecasts, anomaly radars, and risk heatmaps converge into an interactive cockpit. Every insight
            is explainable, governance-ready, and tuned for mission-critical city operations.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <ForecastCard className="lg:col-span-7" data={demandSeries} horizon={demandForecast.horizon} />
          <AnomalyRadarCard className="lg:col-span-5" data={anomalySeries} />
          <ResilienceCard
            className="lg:col-span-5"
            data={resilienceSeries}
            stats={modelPerformanceStats}
            horizon={resilienceForecast.horizon}
          />
          <RiskHeatmapCard className="lg:col-span-4" cells={riskCells} />
          <ExplainabilityCard className="lg:col-span-3" snippets={explainabilitySnippets} />
          <ScenarioSimulatorCard className="lg:col-span-12" comparisons={scenarioComparisons} />
        </div>
      </Container>
    </Section>
  );
}

function ForecastCard({
  data,
  horizon,
  className,
}: {
  data: ForecastPointShape[];
  horizon: string;
  className?: string;
}) {
  const latest = data.at(-1);
  const improvement =
    latest && latest.baseline > 0 ? ((latest.ai - latest.baseline) / latest.baseline) * 100 : 0;

  const tooltipStyle: CSSProperties = {
    backgroundColor: "rgba(8, 15, 32, 0.9)",
    borderRadius: "1rem",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "0.75rem 1rem",
  };

  return (
    <CardShell className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
            <Sparkles className="h-3.5 w-3.5 text-primary-200" />
            Demand Forecast
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">Mobility corridor orchestration</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-foreground/50">{horizon}</p>
        </div>
        <div className="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-primary-100">
          <p>AI Lift</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {improvement > 0 ? "+" : ""}
            {improvement.toFixed(1)}%
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground/70">
        Adaptive routing predicts corridor load shifts 90 minutes ahead of the grid and rebalances fleets before
        commuters feel the friction.
      </p>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="aiForecastGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(14,165,233,0.65)" />
                <stop offset="100%" stopColor="rgba(14,165,233,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.35)" tickLine={false} />
            <YAxis
              stroke="rgba(255,255,255,0.35)"
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              tickLine={false}
              width={48}
            />
            <Tooltip
              cursor={{ stroke: "rgba(56,189,248,0.35)", strokeWidth: 1.5 }}
              contentStyle={tooltipStyle}
              formatter={(value: number, name: string) => {
                const label = name === "ai" ? "AI Orchestrated" : "Baseline";
                return [`${(value * 100).toFixed(0)}%`, label];
              }}
            />
            <Area type="monotone" dataKey="ai" stroke="rgba(56,189,248,0.95)" strokeWidth={3} fill="url(#aiForecastGradient)" />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="rgba(148,163,184,0.8)"
              strokeWidth={2}
              strokeDasharray="5 6"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

function AnomalyRadarCard({ data, className }: { data: AnomalyPointShape[]; className?: string }) {
  return (
    <CardShell className={className} backgroundGlow="radial-gradient(circle at 20% 20%, rgba(124,58,237,0.25), transparent 60%)">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
            <ActivitySquare className="h-3.5 w-3.5 text-accent-200" />
            Anomaly Radar
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">Sensor fusion severity lens</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
          Updated 2m ago
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground/70">
        High-signal clusters bubble to the top so response teams can redeploy assets before thresholds are breached.
      </p>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="cluster" tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: "rgba(124,58,237,0.15)" }}
              contentStyle={{
                backgroundColor: "rgba(8, 15, 32, 0.92)",
                borderRadius: "1rem",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "0.75rem 1rem",
              }}
              formatter={(value: number, name: string) => {
                if (name === "severityScore") {
                  return [`${value.toFixed(0)} / 100`, "Severity Index"];
                }
                return [value.toString(), "Assets Impacted"];
              }}
            />
            <Radar
              name="Severity"
              dataKey="severityScore"
              stroke="rgba(168,85,247,0.85)"
              fill="rgba(168,85,247,0.35)"
              strokeWidth={2}
            />
            <Radar
              name="Assets"
              dataKey="assets"
              stroke="rgba(14,165,233,0.9)"
              fill="rgba(14,165,233,0.25)"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

function ResilienceCard({
  data,
  stats,
  horizon,
  className,
}: {
  data: ResiliencePointShape[];
  stats: ModelPerformanceStat[];
  horizon: string;
  className?: string;
}) {
  const tooltipStyle: CSSProperties = {
    backgroundColor: "rgba(6, 18, 36, 0.92)",
    borderRadius: "1rem",
    border: "1px solid rgba(20,184,166,0.25)",
    padding: "0.75rem 1rem",
  };

  return (
    <CardShell className={className} backgroundGlow="radial-gradient(circle at 80% -10%, rgba(20,184,166,0.25), transparent 65%)">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
              <Gauge className="h-3.5 w-3.5 text-emerald-200" />
              Resilience Forecast
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Heat stress outlook</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-foreground/50">{horizon}</p>
          </div>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-emerald-100">
            Confidence 93%
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-4 py-2 text-[10px] uppercase tracking-[0.3em]",
                stat.tone === "up"
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-primary-100",
              )}
            >
              <Zap className="h-3 w-3" />
              <span>{stat.metric}</span>
              <span className="font-semibold text-white">{stat.value}</span>
              <span className="text-foreground/60">{stat.change}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="resilienceGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(16,185,129,0.6)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.05)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.35)" tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.35)" width={40} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number, name: string) => {
                const label = name === "ai" ? "AI Forecast" : "Legacy Trend";
                return [`${value.toFixed(1)}°C`, label];
              }}
            />
            <Area
              type="monotone"
              dataKey="ai"
              stroke="rgba(16,185,129,0.95)"
              strokeWidth={3}
              fill="url(#resilienceGradient)"
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="rgba(94,234,212,0.6)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs leading-5 text-foreground/60">
        Digital twin ensembles stress-test grid and climate scenarios every hour. AI recommends pre-cooling
        schedules and community alerts while keeping carbon intensity compliant.
      </p>
    </CardShell>
  );
}

function RiskHeatmapCard({ cells, className }: { cells: RiskCell[]; className?: string }) {
  return (
    <CardShell className={className}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
          <Sparkles className="h-3.5 w-3.5 text-primary-200" />
          Risk Heatmap
        </p>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
          Composite AI Score
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-foreground/70">
        District-by-district readiness index blends mobility, energy, climate, and safety signals into one glance.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {cells.map((cell) => (
          <div key={cell.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-foreground/70">
            <div
              aria-hidden
              className="absolute inset-0 opacity-80"
              style={{ background: scoreToGradient(cell.score, cell.quadrant) }}
            />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/60">{cell.quadrant}</p>
              <p className="mt-1 text-sm font-semibold text-white">{cell.district}</p>
              <p className="mt-4 text-3xl font-semibold text-white">
                {Math.round(cell.score * 100)}
                <span className="ml-1 text-sm text-primary-100">pts</span>
              </p>
              <p className="mt-1 text-xs text-foreground/70">{cell.driver}</p>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function ExplainabilityCard({
  snippets,
  className,
}: {
  snippets: ExplainabilitySnippet[];
  className?: string;
}) {
  return (
    <CardShell className={className} backgroundGlow="radial-gradient(circle at 10% 90%, rgba(59,130,246,0.28), transparent 65%)">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
        <ArrowUpRight className="h-3.5 w-3.5 text-primary-200" />
        Explainability Stack
      </p>
      <h3 className="mt-3 text-lg font-semibold text-white">Transparent AI guardrails</h3>
      <p className="mt-2 text-sm leading-6 text-foreground/70">
        Analysts inspect every recommendation with human-readable rationale and policy context.
      </p>

      <ul className="mt-5 space-y-4 text-sm leading-6 text-foreground/70">
        {snippets.map((snippet) => (
          <li key={snippet.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">{snippet.title}</p>
            <p className="mt-2 text-xs text-foreground/60">{snippet.detail}</p>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

function ScenarioSimulatorCard({
  comparisons,
  className,
}: {
  comparisons: ScenarioComparison[];
  className?: string;
}) {
  const [adoption, setAdoption] = useState(68);

  const computed = useMemo(() => {
    return comparisons.map((scenario) => {
      const lift = scenario.optimized - scenario.baseline;
      const projected = scenario.baseline + (lift * adoption) / 100;
      return {
        ...scenario,
        lift,
        projected,
        delta: projected - scenario.baseline,
      };
    });
  }, [adoption, comparisons]);

  const averageLift =
    computed.reduce((sum, scenario) => sum + scenario.delta, 0) / Math.max(1, computed.length);

  const topScenario = computed.reduce((best, scenario) => {
    if (!best || scenario.projected > best.projected) {
      return scenario;
    }
    return best;
  }, computed[0]);

  const gradientStyle = useMemo<CSSProperties>(
    () => ({
      background: `linear-gradient(90deg, rgba(56,189,248,0.55) 0%, rgba(168,85,247,0.65) ${adoption}%, rgba(15,23,42,0.55) ${adoption}%, rgba(15,23,42,0.4) 100%)`,
    }),
    [adoption],
  );

  return (
    <CardShell className={className} backgroundGlow="radial-gradient(circle at 50% -20%, rgba(59,130,246,0.25), transparent 70%)">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
            <Sparkles className="h-3.5 w-3.5 text-primary-200" />
            What-if Scenario Lab
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Compare AI-assisted operations with baseline playbooks
          </h3>
        </div>
        <span className="rounded-full border border-primary-400/40 bg-primary-500/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-primary-100">
          AI Rollout {adoption}%
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground/70">
        Drag the slider to preview gains as agencies embrace AI copilots across mission domains.
      </p>

      <div className="relative mt-6">
        <input
          type="range"
          min={40}
          max={100}
          value={adoption}
          onChange={(event) => setAdoption(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface/90"
          style={gradientStyle}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 h-6 w-6 -translate-x-1/2 rounded-full border border-white/40 bg-gradient-to-r from-primary-400 to-accent-500 shadow-[0_15px_35px_-18px_rgba(56,189,248,0.95)]"
          style={{ left: `${adoption}%` }}
        />
        <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-between px-1 text-[10px] uppercase tracking-[0.35em] text-foreground/40">
          <span>Pilot</span>
          <span>Full Scale</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {computed.map((scenario) => {
          const isTop = topScenario?.id === scenario.id;
          return (
            <div
              key={scenario.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-white/5 p-5 text-sm text-foreground/70 transition",
                isTop
                  ? "border-primary-400/50 shadow-[0_35px_90px_-45px_rgba(59,130,246,0.75)]"
                  : "border-white/10",
              )}
            >
              {isTop ? (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-primary-100">
                  Leader
                </span>
              ) : null}
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">{scenario.scenario}</p>
              <p className="mt-2 text-lg font-semibold text-white">{scenario.narrative}</p>
              <div className="mt-4 space-y-2 text-xs uppercase tracking-[0.3em] text-foreground/50">
                <div className="flex items-center justify-between text-foreground/60">
                  <span>Baseline</span>
                  <span>{scenario.baseline.toFixed(0)} pts</span>
                </div>
                <div className="flex items-center justify-between text-primary-100">
                  <span>Projected</span>
                  <span>{scenario.projected.toFixed(1)} pts</span>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-primary-100">
                Gain {scenario.delta >= 0 ? "+" : ""}
                {scenario.delta.toFixed(1)} pts
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.35em] text-foreground/60">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <Sparkles className="h-3 w-3 text-primary-200" />
          Citywide Lift {averageLift >= 0 ? "+" : ""}
          {averageLift.toFixed(1)} pts
        </div>
        {topScenario ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <ArrowUpRight className="h-3 w-3 text-primary-200" />
            Highest ROI {topScenario.scenario}
          </div>
        ) : null}
      </div>
    </CardShell>
  );
}

function CardShell({
  children,
  className,
  backgroundGlow,
}: {
  children: React.ReactNode;
  className?: string;
  backgroundGlow?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel group relative overflow-hidden rounded-3xl border border-white/10 bg-surface/80 p-6 text-sm text-foreground/80 shadow-[0_45px_120px_-65px_rgba(59,130,246,0.65)] transition duration-500 hover:-translate-y-0.5",
        className,
      )}
    >
      {backgroundGlow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: backgroundGlow }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

type AnomalyClusterSeverity = (typeof anomalyClusters)[number]["severity"];

function scoreToGradient(score: number, quadrant: RiskCell["quadrant"]) {
  const palette: Record<RiskCell["quadrant"], [string, string]> = {
    Mobility: ["rgba(56,189,248,0.55)", "rgba(56,189,248,0.15)"],
    Energy: ["rgba(16,185,129,0.6)", "rgba(16,185,129,0.12)"],
    Climate: ["rgba(168,85,247,0.55)", "rgba(168,85,247,0.15)"],
    Safety: ["rgba(244,114,182,0.55)", "rgba(244,114,182,0.18)"],
  };

  const [start, end] = palette[quadrant];
  const intensity = Math.min(1, Math.max(0.35, score));
  return `linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0)), radial-gradient(circle at 25% 25%, ${start}, transparent ${Math.round(
    intensity * 90,
  )}%) , radial-gradient(circle at 80% 80%, ${end}, transparent 75%)`;
}
