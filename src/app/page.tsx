"use client";

import { useMemo, useState } from "react";
import {
  ActivitySquare,
  AlertTriangle,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock8,
  CircleDashed,
  Crosshair,
  FileText,
  GaugeCircle,
  Layers,
  LineChart,
  Loader2,
  Map,
  MapPinned,
  MoveRight,
  Radar,
  ShieldCheck,
  Sparkles,
  Waves,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  citywideKpis,
  demandForecast,
  modelPerformanceStats,
  resilienceForecast,
  type SystemKpi,
} from "@/data/metrics";
import {
  vlrAlerts,
  vlrPdfPreview,
  vlrProcessSignals,
  vlrStages,
  type VlrComplianceBadge,
  type VlrStageStatus,
} from "@/data/vlr";
import {
  defaultScenarioKey,
  getScenarioConfig,
  listScenarioInsights,
  listScenarioSummaries,
  type ScenarioDefinition,
  type ScenarioLayer,
  type ScenarioKey,
} from "@/lib/scenarios";
import { CommandCenterMap } from "@/components/command-center/command-center-map";
import { cn } from "@/lib/utils";

const moduleNavigation = [
  {
    id: "digital-twin",
    label: "Digital Twin Canvas",
    description: "Live city operations and anomaly scanning in the spatial twin.",
    icon: Map,
  },
  {
    id: "vlr-workbench",
    label: "VLR Automation",
    description: "AI-automated voluntary local review pipelines and compliance scoring.",
    icon: Workflow,
  },
  {
    id: "analytics",
    label: "AI Analytics",
    description: "Forecasts, risk posture, and performance lifts across scenarios.",
    icon: LineChart,
  },
  {
    id: "copilot",
    label: "Copilot Orchestration",
    description: "Conversational mission control and coordinated action queues.",
    icon: Bot,
  },
];

export default function Home() {
  const [activeScenarioKey, setActiveScenarioKey] = useState<ScenarioKey>(defaultScenarioKey);
  const [focus, setFocus] = useState(52);
  const [activeModule, setActiveModule] = useState("digital-twin");

  const scenario = getScenarioConfig(activeScenarioKey);
  const scenarioSummaries = useMemo(() => listScenarioSummaries(), []);
  const scenarioInsights = useMemo(() => listScenarioInsights(activeScenarioKey), [activeScenarioKey]);

  if (!scenario) {
    throw new Error(`Scenario configuration missing for key: ${activeScenarioKey}`);
  }

  const syncTimestamp = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date());

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopBar
        scenarioKey={activeScenarioKey}
        scenarioSummaries={scenarioSummaries}
        onScenarioChange={setActiveScenarioKey}
        syncTimestamp={syncTimestamp}
      />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar activeModule={activeModule} onModuleChange={setActiveModule} />

        <main className="flex-1 overflow-y-auto px-6 py-10 sm:px-10">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10 pb-16">
            <KpiPulseStrip kpis={citywideKpis} />

            <section
              id="digital-twin"
              className="scroll-mt-24 rounded-[32px] border border-white/10 bg-surface/70 p-6 shadow-[0_25px_80px_-40px_rgba(59,130,246,0.55)] backdrop-blur-3xl md:p-8"
            >
              <DigitalTwinPanel
                scenario={scenario}
                focus={focus}
                onFocusChange={setFocus}
                insights={scenarioInsights}
              />
            </section>

            <section
              id="vlr-workbench"
              className="scroll-mt-24 rounded-[32px] border border-white/10 bg-surface/60 p-6 shadow-[0_25px_80px_-45px_rgba(124,58,237,0.45)] backdrop-blur-3xl md:p-8"
            >
              <VlrPreviewPanel />
            </section>

            <section
              id="analytics"
              className="scroll-mt-24 rounded-[32px] border border-white/10 bg-surface/65 p-6 shadow-[0_25px_80px_-45px_rgba(14,165,233,0.48)] backdrop-blur-3xl md:p-8"
            >
              <AnalyticsPreviewPanel />
            </section>

            <section
              id="copilot"
              className="scroll-mt-24 rounded-[32px] border border-white/10 bg-surface/65 p-6 shadow-[0_25px_80px_-45px_rgba(236,72,153,0.42)] backdrop-blur-3xl md:p-8"
            >
              <CopilotPreviewPanel scenarioName={scenario.name} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

type DashboardTopBarProps = {
  scenarioKey: ScenarioKey;
  scenarioSummaries: ReturnType<typeof listScenarioSummaries>;
  onScenarioChange: (key: ScenarioKey) => void;
  syncTimestamp: string;
};

function DashboardTopBar({ scenarioKey, scenarioSummaries, onScenarioChange, syncTimestamp }: DashboardTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,16,38,0.88)]">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-6 py-5 sm:px-10 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-accent-500 to-indigo-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.45)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Nexus Consulting</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">City Digital Twin Command</h1>
            <p className="text-xs text-foreground/60">Automated VLR intelligence for Metropolitan Nexus</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
          <nav className="flex flex-wrap gap-2 rounded-[999px] border border-white/10 bg-white/5 p-1.5">
            {scenarioSummaries.map((scenario) => (
              <button
                key={scenario.key}
                type="button"
                onClick={() => onScenarioChange(scenario.key)}
                className={cn(
                  "min-w-[150px] rounded-[999px] px-4 py-2 text-left text-xs font-medium transition-all",
                  scenario.key === scenarioKey
                    ? "bg-primary-500/80 text-white shadow-[0_15px_40px_-25px_rgba(14,165,233,0.85)]"
                    : "text-foreground/60 hover:bg-white/10 hover:text-foreground",
                )}
              >
                <span className="block text-[10px] uppercase tracking-[0.35em] text-white/60">Scenario</span>
                <span className="mt-0.5 block text-sm leading-tight">{scenario.name}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground/60">
            <MapPinned className="h-4 w-4 text-primary-200" />
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.35em]">Metro Focus</span>
              <span className="mt-0.5 text-sm font-semibold text-white">Aurora District Twin</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground/60">
            <Clock8 className="h-4 w-4 text-accent-400" />
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.35em]">Sync Checkpoint</span>
              <span className="mt-0.5 text-sm font-semibold text-white">{syncTimestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

type DashboardSidebarProps = {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
};

function DashboardSidebar({ activeModule, onModuleChange }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-[280px] border-r border-white/10 bg-[rgba(6,12,28,0.88)] px-5 py-8 lg:block">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-xs uppercase tracking-[0.35em] text-foreground/60 shadow-[0_18px_50px_-35px_rgba(59,130,246,0.65)]">
          <p className="flex items-center gap-2 text-foreground/60">
            <GaugeCircle className="h-4 w-4 text-primary-300" />
            Mission Status
          </p>
          <span className="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-white">
            92%
            <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary-200">Operational</span>
          </span>
        </div>

        <nav className="flex flex-col gap-2">
          {moduleNavigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onModuleChange(item.id)}
              className={cn(
                "group rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-all duration-200 hover:border-white/20 hover:bg-white/10",
                activeModule === item.id ? "border-primary-400 bg-primary-500/15" : "text-foreground/70",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-foreground/60">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/50 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </nav>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-rose-500/10 p-5 text-xs text-foreground/60">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary-200">
            <BrainCircuit className="h-4 w-4" />
            AI Warden
          </p>
          <p className="mt-3 text-sm text-white">
            Digital twin telemetry is clean. 3 proactive interventions queued with Nexus Copilot.
          </p>
        </div>
      </div>
    </aside>
  );
}

function KpiPulseStrip({ kpis }: { kpis: SystemKpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: SystemKpi }) {
  const tone = kpi.change.direction === "up" ? "text-success-500" : "text-danger-500";
  const arrow = kpi.change.direction === "up" ? "▲" : "▼";

  return (
    <div className="rounded-3xl border border-white/8 bg-white/5 p-5 shadow-[0_18px_60px_-50px_rgba(14,165,233,0.65)]">
      <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{kpi.label}</p>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold text-white">
          {kpi.value.toLocaleString()} <span className="text-sm text-foreground/50">{kpi.unit}</span>
        </span>
        <span className={cn("text-xs font-semibold", tone)}>
          {arrow} {kpi.change.percentage}%
        </span>
      </div>
      <p className="mt-2 text-[11px] text-foreground/60">vs. last {kpi.change.period}</p>
    </div>
  );
}

type DigitalTwinPanelProps = {
  scenario: ScenarioDefinition;
  focus: number;
  onFocusChange: (value: number) => void;
  insights: ReturnType<typeof listScenarioInsights>;
};

function DigitalTwinPanel({ scenario, focus, onFocusChange, insights }: DigitalTwinPanelProps) {
  const focusMinutes = Math.round((focus / 100) * 60);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary-200">Digital Twin Command</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{scenario.name}</h2>
          <p className="mt-2 text-sm text-foreground/70">{scenario.tagline}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-foreground/60">
            <Radar className="h-4 w-4 text-primary-200" />
            {scenario.command}
          </div>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-foreground/70 sm:w-auto">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">Focus Horizon</span>
            <span className="text-base font-semibold text-white">{focusMinutes} min</span>
          </div>
          <input
            type="range"
            value={focus}
            onChange={(event) => onFocusChange(Number(event.target.value))}
            min={0}
            max={100}
            className="mt-3 h-2 w-full appearance-none rounded-full bg-white/10 accent-primary-400"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-foreground/40">
            <span>Now</span>
            <span>+60m</span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/8 px-5 py-4 text-sm leading-6 text-foreground/70 shadow-[0_20px_65px_-45px_rgba(59,130,246,0.55)]">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
          <ActivitySquare className="h-4 w-4" />
          Operational Narrative
        </p>
        <p className="mt-3">{scenario.narrative}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_25px_80px_-45px_rgba(59,130,246,0.55)]">
            <CommandCenterMap scenario={scenario} focus={focus} />
            <MapHud scenario={scenario} insights={insights} focus={focus} />
          </div>

          <LayerLegend layers={scenario.layers} focus={focus} />

          <div className="grid gap-4 sm:grid-cols-3">
            {insights.signals.map((signal) => (
              <SignalBadge key={signal.label} signal={signal} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-[0_25px_80px_-45px_rgba(14,165,233,0.55)]">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
              <Sparkles className="h-4 w-4" />
              AI Insight Pulse
            </p>
            <div className="mt-4 space-y-4">
              {insights.aiInsights.map((insight, index) => (
                <InsightCard key={insight.title} insight={insight} index={index} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {scenario.kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-foreground/70"
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {kpi.value} <span className="text-sm text-foreground/50">{kpi.unit}</span>
                </p>
                <p className="mt-1 text-[11px] text-primary-200">
                  Δ {kpi.change.percentage}% {kpi.change.direction === "up" ? "improvement" : "reduction"}
                </p>
              </div>
            ))}
          </div>

          <ActionQueueCard actions={insights.actions} />
        </div>
      </div>
    </div>
  );
}

function MapHud({
  scenario,
  insights,
  focus,
}: {
  scenario: ScenarioDefinition;
  insights: ReturnType<typeof listScenarioInsights>;
  focus: number;
}) {
  const focusMinutes = Math.round((focus / 100) * 60);
  const primaryInsight = insights.aiInsights[0];
  const primaryAction = insights.actions[0];
  const confidence = primaryInsight ? Math.round(primaryInsight.confidence * 100) : null;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="rounded-3xl border border-white/10 bg-black/45 px-5 py-4 text-xs uppercase tracking-[0.32em] text-foreground/60 shadow-[0_30px_90px_-45px_rgba(59,130,246,0.75)] backdrop-blur-xl">
          <p className="flex items-center gap-2 text-foreground/70">
            <Sparkles className="h-3.5 w-3.5 text-primary-200" />
            Scenario
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.18em] text-white">{scenario.name}</p>
          <p className="mt-1 text-[11px] normal-case tracking-wide text-foreground/70">{scenario.tagline}</p>
        </div>

        {primaryInsight ? (
          <div className="max-w-sm rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm leading-6 text-foreground/80 shadow-[0_25px_80px_-45px_rgba(124,58,237,0.65)] backdrop-blur-xl">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-primary-200">
              <ActivitySquare className="h-3.5 w-3.5" />
              Insight Pulse{confidence !== null ? ` · ${confidence}%` : ""}
            </p>
            <p className="mt-2 font-medium text-white">{primaryInsight.title}</p>
            <p className="mt-1 text-xs text-foreground/70">{primaryInsight.detail}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        {primaryAction ? (
          <div className="max-w-xl rounded-3xl border border-white/10 bg-black/45 px-5 py-4 text-sm text-foreground/70 shadow-[0_30px_90px_-45px_rgba(14,165,233,0.65)] backdrop-blur-xl">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-primary-200">
              <MoveRight className="h-3.5 w-3.5" />
              Next Orchestration
            </p>
            <p className="mt-2 leading-6">{primaryAction}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-end gap-3">
          <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-right text-xs uppercase tracking-[0.35em] text-foreground/50">
            <p>Focus Horizon</p>
            <p className="mt-1 text-2xl font-semibold tracking-[0.2em] text-white">{focusMinutes}m</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-right text-xs uppercase tracking-[0.35em] text-foreground/50">
            <p>Active Layers</p>
            <p className="mt-1 text-2xl font-semibold tracking-[0.2em] text-white">{scenario.layers.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerLegend({ layers, focus }: { layers: ScenarioLayer[]; focus: number }) {
  if (!layers.length) {
    return null;
  }

  const focusFactor = 0.55 + (focus / 100) * 0.55;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {layers.map((layer) => {
        const { label, Icon } = getVisualizationMeta(layer.visualization);
        const gradientBackground = layer.style.secondaryColor
          ? `linear-gradient(135deg, ${layer.style.color} 0%, ${layer.style.secondaryColor} 100%)`
          : `linear-gradient(135deg, ${layer.style.color} 0%, rgba(15, 23, 42, 0.65) 100%)`;
        const amplified = Math.min(1.25, layer.style.intensity * focusFactor);
        const focusBoost = Math.round((amplified / 1.25) * 100);

        return (
          <div
            key={layer.id}
            className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-foreground/70 shadow-[0_25px_70px_-50px_rgba(14,165,233,0.55)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
              style={{ background: gradientBackground }}
            />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-primary-100">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{label}</p>
                  <p className="text-sm font-semibold text-white">{layer.label}</p>
                </div>
              </div>
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/80">
                {focusBoost}% focus
              </span>
            </div>

            <p className="relative mt-3 text-xs leading-relaxed text-foreground/60">{layer.legend}</p>
          </div>
        );
      })}
    </div>
  );
}

function getVisualizationMeta(type: ScenarioLayer["visualization"]): { label: string; Icon: LucideIcon } {
  switch (type) {
    case "flow":
      return { label: "Flow Field", Icon: Waves };
    case "choropleth":
      return { label: "Resilience Mesh", Icon: Layers };
    case "point":
    default:
      return { label: "Sensor Pulse", Icon: Crosshair };
  }
}

function SignalBadge({ signal }: { signal: ReturnType<typeof listScenarioInsights>["signals"][number] }) {
  const tone =
    signal.tone === "positive"
      ? "border-primary-400/40 bg-primary-500/10 text-primary-100"
      : signal.tone === "warning"
        ? "border-warning-500/40 bg-warning-500/10 text-warning-500"
        : "border-white/10 bg-white/5 text-foreground/70";

  return (
    <div
      className={cn(
        "rounded-[24px] border px-5 py-4 text-sm shadow-[0_18px_60px_-50px_rgba(59,130,246,0.55)]",
        tone,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{signal.label}</p>
      <p className="mt-2 text-lg font-semibold">{signal.value}</p>
      <p className="text-[11px] text-foreground/60">Δ {signal.delta}</p>
    </div>
  );
}

function InsightCard({
  insight,
  index,
}: {
  insight: ReturnType<typeof listScenarioInsights>["aiInsights"][number];
  index: number;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/30 px-4 py-3">
      <p className="text-xs font-semibold text-white">{insight.title}</p>
      <p className="mt-2 text-sm text-foreground/70">{insight.detail}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-primary-200">
        {Math.round(insight.confidence * 100)}% confidence · Insight #{index + 1}
      </p>
    </div>
  );
}

function ActionQueueCard({ actions }: { actions: string[] }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-black/40 p-5 text-sm text-foreground/70">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
        <Workflow className="h-4 w-4" />
        Orchestration Queue
      </p>
      <ul className="mt-3 space-y-2">
        {actions.map((action, index) => (
          <li key={action} className="flex gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left text-sm text-foreground/80">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/10 text-xs font-semibold text-primary-200">
              {index + 1}
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VlrPreviewPanel() {
  const [selectedStageId, setSelectedStageId] = useState<string>(() => {
    const activeStage = vlrStages.find((stage) => stage.status === "active");
    return activeStage?.id ?? vlrStages[0].id;
  });

  const selectedStage = vlrStages.find((stage) => stage.id === selectedStageId) ?? vlrStages[0];
  const selectedIndex = Math.max(vlrStages.findIndex((stage) => stage.id === selectedStageId), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-foreground/50">Nexus Consulting · VLR Automation</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Voluntary Local Review Mission Board</h2>
          <p className="mt-3 text-sm text-foreground/70">
            Nexus orchestrates the entire VLR pipeline with AI guardrails—every chapter is grounded in live digital twin
            evidence, policy compliance, and explainable scoring.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {vlrProcessSignals.map((signal) => (
            <span
              key={signal}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-foreground/60"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-200" />
              {signal}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">Pipeline Status</p>
            <div className="mt-4 space-y-3">
              {vlrStages.map((stage, index) => {
                const isActive = stage.id === selectedStageId;
                return (
                  <button
                    type="button"
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={cn(
                      "w-full rounded-[24px] border border-white/8 bg-black/20 p-4 text-left transition-all duration-200 hover:border-white/20 hover:bg-black/25",
                      isActive && "border-primary-400/60 bg-primary-500/15 shadow-[0_20px_65px_-45px_rgba(124,58,237,0.75)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <StageStatusIcon status={stage.status} isActive={isActive} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/40">Stage {index + 1}</p>
                        <p className="mt-1 truncate text-sm font-semibold text-white">{stage.title}</p>
                      </div>
                      <div className="text-right text-xs text-foreground/60">
                        {stage.status === "active" && <span>ETA {stage.etaMinutes}m</span>}
                        {stage.status === "pending" && <span>{stage.completion}% primed</span>}
                        {stage.status === "complete" && <span>Ready</span>}
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          stage.status === "complete" && "bg-primary-300/70",
                          stage.status === "active" && "bg-accent-300/80",
                          stage.status === "pending" && "bg-white/25"
                        )}
                        style={{ width: `${Math.max(stage.completion, stage.status === "pending" ? 18 : 6)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">Latest Export</p>
                <p className="mt-2 text-sm font-semibold text-white">{vlrPdfPreview.period}</p>
              </div>
              <FileText className="h-8 w-8 text-primary-200" />
            </div>
            <p className="mt-3 text-sm text-foreground/70">{vlrPdfPreview.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              {vlrPdfPreview.chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-3 py-2"
                >
                  <span className="text-foreground/70">{chapter.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                      chapter.status === "ready" && "bg-emerald-400/15 text-emerald-200",
                      chapter.status === "in-review" && "bg-amber-400/15 text-amber-200",
                      chapter.status === "draft" && "bg-rose-400/15 text-rose-200"
                    )}
                  >
                    {chapter.status.replace("-", " ")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between text-xs text-foreground/50">
              <span>{vlrPdfPreview.filename}</span>
              <span>{vlrPdfPreview.size}</span>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500/80 to-accent-500/80 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
            >
              Download AI-authored VLR
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-white/10 bg-black/35 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  Stage {selectedIndex + 1} · {getStageStatusLabel(selectedStage.status)}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{selectedStage.title}</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-foreground/60">
                <StageStatusIcon status={selectedStage.status} isActive />
                {selectedStage.status === "active"
                  ? `ETA ${selectedStage.etaMinutes} minutes`
                  : `Completion ${selectedStage.completion}%`}
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/70">{selectedStage.summary}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {selectedStage.insights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground/70"
                >
                  <Sparkles className="mb-2 h-4 w-4 text-primary-200" />
                  {insight}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {selectedStage.kpis.map((kpi) => (
                <div
                  key={kpi.id}
                  className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-semibold uppercase tracking-[0.3em]",
                      kpi.direction === "up" ? "text-emerald-200" : "text-rose-200"
                    )}
                  >
                    {kpi.deltaLabel}
                  </p>
                  <p className="mt-3 text-sm text-foreground/70">{kpi.narrative}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[30px] border border-white/10 bg-white/6 p-5">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                <ShieldCheck className="h-4 w-4 text-primary-200" />
                Compliance & Guardrails
              </p>
              <div className="mt-4 space-y-3">
                {selectedStage.compliance.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                          complianceBadgeTone(item.status).badge
                        )}
                      >
                        {complianceBadgeTone(item.status).label}
                      </span>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                    </div>
                    <p className="mt-3 text-sm text-foreground/70">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">Artifacts ready</p>
                <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                  {selectedStage.artifacts.map((artifact) => (
                    <li key={artifact.id} className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 text-primary-200" />
                      <div>
                        <p className="font-medium text-white">{artifact.label}</p>
                        <p className="text-foreground/60">{artifact.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-[30px] border border-white/10 bg-black/30 p-5">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  <ActivitySquare className="h-4 w-4 text-primary-200" />
                  Audit Trail
                </p>
                <ul className="mt-4 space-y-3">
                  {selectedStage.auditTrail.map((event) => (
                    <li
                      key={`${event.timestamp}-${event.actor}`}
                      className="flex gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground/70"
                    >
                      <span className="flex h-8 w-16 items-center justify-center rounded-full bg-primary-500/15 text-[11px] font-semibold text-white">
                        {event.timestamp}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{event.actor}</p>
                        <p className="text-foreground/60">{event.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/8 p-5">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
                  <AlertTriangle className="h-4 w-4" />
                  Policy & Action Alerts
                </p>
                <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                  {vlrAlerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex gap-3 rounded-[22px] border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <span className={cn("mt-1 h-2 w-2 rounded-full", alertSeverityTone(alert.severity))} />
                      <div className="min-w-0">
                        <p className="font-medium text-white">{alert.message}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-foreground/50">
                          {alert.suggestedAction}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageStatusIcon({ status, isActive = false }: { status: VlrStageStatus; isActive?: boolean }) {
  if (status === "complete") {
    return <CheckCircle2 className={cn("h-5 w-5 text-emerald-300", !isActive && "text-emerald-300/70")} />;
  }

  if (status === "active") {
    return <Loader2 className="h-5 w-5 animate-spin text-accent-200" />;
  }

  return <CircleDashed className="h-5 w-5 text-foreground/35" />;
}

function getStageStatusLabel(status: VlrStageStatus) {
  switch (status) {
    case "complete":
      return "Completed";
    case "active":
      return "In progress";
    default:
      return "Queued";
  }
}

function complianceBadgeTone(status: VlrComplianceBadge["status"]) {
  switch (status) {
    case "pass":
      return { label: "Pass", badge: "bg-emerald-400/15 text-emerald-200 border border-emerald-400/20" };
    case "attention":
      return { label: "Attention", badge: "bg-amber-400/15 text-amber-200 border border-amber-400/20" };
    default:
      return { label: "Review", badge: "bg-rose-400/15 text-rose-200 border border-rose-400/20" };
  }
}

function alertSeverityTone(severity: (typeof vlrAlerts)[number]["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-rose-400";
    case "warning":
      return "bg-amber-300";
    default:
      return "bg-primary-200";
  }
}

function AnalyticsPreviewPanel() {
  const mobilityLift = demandForecast.points.at(-1)?.value ?? 0;
  const resilienceLift = resilienceForecast.points.at(-1)?.value ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.4em] text-foreground/50">AI Analytics</p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Model telemetry and explainable lifts</h2>
        <p className="mt-3 text-sm text-foreground/70">
          Forecast corridors, climate resilience trajectories, and model governance metrics align to the active
          scenario. Nexus dashboards blend data-science fidelity with executive storytelling.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">Mobility Forecast Horizon</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Adaptive signal retiming + curb balancing</h3>
            </div>
            <div className="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-primary-100">
              AI Lift
              <p className="mt-1 text-2xl font-semibold text-white">{Math.round(mobilityLift * 100)}%</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-foreground/70">
            Nexus models project corridor efficiency staying above 90% during the evening peak by orchestrating freight
            staging, micromobility swaps, and signal retiming simultaneously.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {modelPerformanceStats.map((stat) => (
              <div key={stat.id} className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">{stat.metric}</p>
                <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                <p className="text-[11px] text-primary-200">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/35 p-5 text-sm text-foreground/70">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
            <BrainCircuit className="h-4 w-4" />
            Resilience Trajectory
          </p>
          <p className="mt-2 text-xl font-semibold text-white">Heat index leveling after 7-day surge</p>
          <p className="mt-3">
            Automated cooling center activation and microgrid dispatch should keep heat index below {resilienceLift}°C
            by end of week while maintaining hospital uptime.
          </p>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.35em] text-foreground/50">
            Scenario Insights
          </div>

          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-200" />
              Dynamic cooling center routing reduced emergency calls by 18% in the last 24 hours.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-accent-400" />
              DER flex alert keeps carbon intensity under 280 gCO₂/kWh through peak load events.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
              Environmental sensors flagged two coastal clusters for rapid flood barrier deployment.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CopilotPreviewPanel({ scenarioName }: { scenarioName: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
        <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">Nexus Copilot</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Mission threads aligned to {scenarioName}</h3>
        <p className="mt-3 text-sm text-foreground/70">
          Operators can investigate anomalies, request forecasts, and deploy field actions through a secure copilot
          interface. Every recommendation is grounded in digital twin evidence.
        </p>

        <div className="mt-5 space-y-3 text-sm">
          <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-200">Live Prompt</p>
            <p className="mt-2 text-foreground/80">
              “Summarize the top three climate resilience risks for Harbor District and prep a briefing for emergency
              services.”
            </p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-foreground/70">
            Copilot cross-checks energy, mobility, and sentiment feeds before suggesting actions and writes the
            executive-ready response in under 8 seconds.
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/35 p-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
          <Bot className="h-4 w-4" />
          Recommended Actions
        </p>
        <ul className="mt-4 space-y-3 text-sm text-foreground/70">
          <li className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
            Dispatch “Cooling Surge Kit” to Innovation Basin shelters and notify resilience desk.
          </li>
          <li className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
            Trigger congestion-aware freight reprioritization along Harbor Connector for next 45 minutes.
          </li>
          <li className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
            Publish governance log to City Council portal summarizing AI interventions in last 24 hours.
          </li>
        </ul>

        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.35em] text-foreground/50">
          Audit Trail
        </div>

        <ul className="mt-3 space-y-2 text-xs text-foreground/60">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-300" />
            16:42 · Mobility anomaly explanation archived for compliance.
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            16:40 · Nexus Copilot posted VLR chapter summary to mission channel.
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            16:37 · Edge sensor escalation resolved via automated script.
          </li>
        </ul>
      </div>
    </div>
  );
}
