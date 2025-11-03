"use client";

import { useMemo, useState } from "react";
import type { FeatureCollection as GeoJSONFeatureCollection } from "geojson";
import { LineChart, Map as MapIcon, Sparkles, Workflow } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line as RechartsLine,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CommandCenterMap, type SpatialHighlight } from "@/components/command-center/command-center-map";
import { anomalyClusters, citywideKpis, demandForecast, resilienceForecast } from "@/data/metrics";
import { vlrAlerts, vlrStages, type VlrStageStatus } from "@/data/vlr";
import {
  getScenarioConfig,
  listScenarioInsights,
  type ScenarioDefinition,
  type ScenarioKey,
} from "@/lib/scenarios";
import { cn } from "@/lib/utils";

const moduleNavigation = [
  {
    id: "digital-twin",
    label: "Digital Twin",
    description: "City map with SDG signals.",
    icon: MapIcon,
  },
  {
    id: "vlr",
    label: "VLR Automation",
    description: "Track the review workflow.",
    icon: Workflow,
  },
  {
    id: "pipelines",
    label: "AI Pipelines",
    description: "See forecasts and model health.",
    icon: LineChart,
  },
] as const;

type ModuleId = (typeof moduleNavigation)[number]["id"];

const moduleScenarioMap: Record<ModuleId, ScenarioKey> = {
  "digital-twin": "sdg-localization",
  vlr: "vlr-automation",
  pipelines: "city-profiling",
};

type ScenarioInsightsPayload = {
  signals: ScenarioDefinition["liveSignals"];
  aiInsights: ScenarioDefinition["aiInsights"];
  kpis: ScenarioDefinition["kpis"];
  actions: ScenarioDefinition["actions"];
};

const stageLabels: Record<string, string> = {
  ingestion: "Data check",
  classification: "Tag evidence",
  scoring: "Score outcomes",
  narrative: "Draft stories",
};

const alertSeverityStyles = {
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-rose-100 text-rose-700",
  info: "bg-sky-100 text-sky-700",
} as const;

const alertSeverityLabels = {
  warning: "Attention",
  critical: "Urgent",
  info: "Info",
} as const;

type AlertSeverity = keyof typeof alertSeverityStyles;

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleId>("digital-twin");
  const [focus, setFocus] = useState(55);

  const scenarioKey = moduleScenarioMap[activeModule];
  const scenario = getScenarioConfig(scenarioKey);

  if (!scenario) {
    throw new Error(`Scenario not found for key ${scenarioKey}`);
  }

  const rawInsights = listScenarioInsights(scenarioKey);
  const insights: ScenarioInsightsPayload = Array.isArray(rawInsights)
    ? { signals: [], aiInsights: [], kpis: [], actions: [] }
    : rawInsights;

  const mapHighlights = useMemo(() => getSpatialHighlights(scenario), [scenario]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <ModuleRail activeModule={activeModule} onSelect={setActiveModule} />

          <div className="flex-1 space-y-8">
            <OverviewStrip />

            <ModuleTabs activeModule={activeModule} onSelect={setActiveModule} className="lg:hidden" />

            {activeModule === "digital-twin" ? (
              <DigitalTwinView
                scenario={scenario}
                insights={insights}
                focus={focus}
                onFocusChange={setFocus}
                highlights={mapHighlights}
              />
            ) : null}

            {activeModule === "vlr" ? <VlrAutomationView scenario={scenario} /> : null}

            {activeModule === "pipelines" ? <PipelinesView /> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-1 sm:px-6">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Sparkles className="h-3 w-3" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-slate-700">Nexus Consulting</span>
      </div>
    </header>
  );
}

function OverviewStrip() {
  const topKpis = citywideKpis.slice(0, 3);
  return (
    <section className="mb-8 grid gap-3 sm:grid-cols-3">
      {topKpis.map((kpi) => {
        const changeColor = kpi.change.direction === "up" ? "text-emerald-600" : "text-rose-600";
        const changeLabel =
          kpi.changeLabel ??
          `${kpi.change.direction === "up" ? "+" : "−"}${kpi.change.percentage.toFixed(1)}% vs last ${kpi.change.period}`;

        return (
          <article
            key={kpi.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div>
              <h2 className="text-sm font-medium text-slate-600">{kpi.label}</h2>
              <p className="mt-3 flex items-baseline gap-2 text-slate-900">
                <span className="text-3xl font-semibold">{kpi.value}</span>
                <span className="text-sm font-medium text-slate-500">{kpi.unit}</span>
              </p>
            </div>
            <p className={cn("mt-4 text-xs font-medium", changeColor)}>{changeLabel}</p>
          </article>
        );
      })}
    </section>
  );
}

function ModuleTabs({
  activeModule,
  onSelect,
  className,
}: {
  activeModule: ModuleId;
  onSelect: (moduleId: ModuleId) => void;
  className?: string;
}) {
  return (
    <nav className={cn("mb-6 flex flex-wrap gap-2", className)}>
      {moduleNavigation.map((module) => {
        const isActive = activeModule === module.id;

        return (
          <button
            type="button"
            key={module.id}
            onClick={() => onSelect(module.id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm transition-colors",
              isActive
                ? "border-slate-300 bg-white text-slate-900 shadow-sm"
                : "border-transparent bg-slate-100 text-slate-500 hover:border-slate-200 hover:bg-white",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl text-sky-600",
                isActive ? "bg-sky-100" : "bg-slate-200/70",
              )}
            >
              <module.icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{module.label}</span>
              <span className="block text-xs text-slate-400">{module.description}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function ModuleRail({
  activeModule,
  onSelect,
}: {
  activeModule: ModuleId;
  onSelect: (moduleId: ModuleId) => void;
}) {
  return (
    <aside className="hidden shrink-0 lg:block lg:w-60 xl:w-64">
      <nav className="sticky top-24 flex flex-col gap-1 rounded-3xl border border-slate-200 bg-white px-3 py-4 shadow-sm">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Modules</p>
        {moduleNavigation.map((module) => {
          const isActive = activeModule === module.id;
          return (
            <button
              type="button"
              key={module.id}
              onClick={() => onSelect(module.id)}
              className={cn(
                "flex items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                isActive
                  ? "bg-sky-50 text-slate-900 shadow-[0_12px_32px_-24px_rgba(14,165,233,0.65)]"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border text-sky-600",
                  isActive
                    ? "border-sky-200 bg-white"
                    : "border-transparent bg-slate-200/60 text-slate-500",
                )}
              >
                <module.icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{module.label}</span>
                <span className="mt-1 block text-xs text-slate-400">{module.description}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

type DigitalTwinViewProps = {
  scenario: ScenarioDefinition;
  insights: ScenarioInsightsPayload;
  focus: number;
  onFocusChange: (value: number) => void;
  highlights: SpatialHighlight[];
};

function DigitalTwinView({ scenario, insights, focus, onFocusChange, highlights }: DigitalTwinViewProps) {
  const signals = insights.signals.slice(0, 3);
  const aiNote = insights.aiInsights[0];
  const actions = insights.actions.slice(0, 2);
  const scenarioKpis = insights.kpis.slice(0, 2);
  const topHighlights = highlights.slice(0, 3);

  return (
    <section>
      <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{scenario.name}</h2>
            <p className="text-sm text-slate-500">{scenario.tagline}</p>
          </div>
          <p className="text-xs text-slate-400">Brief · {scenario.command}</p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] xl:gap-8">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100/40">
              <CommandCenterMap scenario={scenario} focus={focus} highlights={highlights} />
              <HighlightsPanel highlights={topHighlights} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">Focus window</p>
                <p className="mt-1 text-xs text-slate-400">Move the slider to preview the next sweep.</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">{Math.round((focus / 100) * 60)} min</span>
                  <input
                    type="range"
                    value={focus}
                    onChange={(event) => onFocusChange(Number(event.target.value))}
                    min={0}
                    max={100}
                    className="h-1.5 w-full flex-1 appearance-none rounded-full bg-slate-200 accent-sky-500"
                  />
                </div>
              </article>

              {scenarioKpis.length ? (
                <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">City status</p>
                  <ul className="mt-3 space-y-3">
                    {scenarioKpis.map((kpi) => (
                      <li key={kpi.id}>
                        <p className="text-base font-semibold text-slate-900">
                          {kpi.value}
                          <span className="ml-2 text-sm font-medium text-slate-500">{kpi.unit}</span>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{kpi.label}</p>
                        {kpi.changeLabel ? (
                          <p className="mt-1 text-xs font-medium text-emerald-600">{kpi.changeLabel}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4">
            {signals.length ? (
              <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">Live pulse</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {signals.map((signal) => (
                    <li key={signal.label} className="flex items-baseline justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                      <span className="font-medium text-slate-900">{signal.value}</span>
                      <span className="text-xs text-slate-500">{signal.label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}

            {aiNote ? (
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">AI notice</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{aiNote.title}</p>
                {aiNote.detail ? <p className="mt-2 text-sm text-slate-500">{aiNote.detail}</p> : null}
                <span className="mt-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                  {Math.round(aiNote.confidence * 100)}% confidence
                </span>
              </article>
            ) : null}

            {actions.length ? (
              <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">Next moves</p>
                <ol className="mt-3 space-y-2 text-sm text-slate-600">
                  {actions.map((action, index) => (
                    <li key={action} className="flex gap-2">
                      <span className="font-medium text-sky-500">{index + 1}.</span>
                      <span className="leading-6">{action}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ) : null}
          </aside>
        </div>
      </article>
    </section>
  );
}

function HighlightsPanel({ highlights }: { highlights: SpatialHighlight[] }) {
  if (!highlights.length) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute right-4 top-4 flex max-w-xs flex-col gap-2">
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="pointer-events-auto rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-xs text-slate-600 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.45)] backdrop-blur"
        >
          <p className="text-sm font-semibold text-slate-900">{highlight.sensorType}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            {highlight.district ?? "Citywide"} · {highlight.sensorId}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-1 text-[10px] font-medium text-sky-700">
              {Math.round(highlight.anomalyScore * 100)}% watch
            </span>
            {highlight.lastReadingMinutes !== null ? (
              <span className="text-[10px] text-slate-400">{highlight.lastReadingMinutes}m ago</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function VlrAutomationView({ scenario }: { scenario: ScenarioDefinition }) {
  const [activeStageId, setActiveStageId] = useState(vlrStages[0].id);
  const activeStage = vlrStages.find((stage) => stage.id === activeStageId) ?? vlrStages[0];
  const alerts = vlrAlerts.slice(0, 3);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">VLR automation</h2>
            <p className="text-sm text-slate-500">See which step needs attention.</p>
          </div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Scenario · {scenario.name}</span>
        </header>

        <div className="mt-5 space-y-2">
          {vlrStages.map((stage) => {
            const displayLabel = stageLabels[stage.id] ?? stage.title;
            const isActive = stage.id === activeStageId;

            return (
              <button
                type="button"
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={cn(
                  "w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300",
                  isActive && "border-sky-200 bg-sky-50 shadow-[0_18px_42px_-30px_rgba(14,165,233,0.55)]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{displayLabel}</p>
                    <p className="mt-1 text-xs text-slate-500">{stage.summary}</p>
                  </div>
                  <StageBadge status={stage.status} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 w-full flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        stage.status === "complete" && "bg-emerald-400",
                        stage.status === "active" && "bg-sky-400",
                        stage.status === "pending" && "bg-slate-400",
                      )}
                      style={{ width: `${Math.max(stage.completion, stage.status === "pending" ? 12 : 6)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{stage.etaMinutes}m</span>
                </div>
              </button>
            );
          })}
        </div>
      </article>

      <div className="space-y-5">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold text-slate-700">Stage detail</p>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProgressBadge completion={activeStage.completion} />
            <div className="space-y-2 text-sm text-slate-600">
              <p className="text-sm font-semibold text-slate-900">
                {stageLabels[activeStage.id] ?? activeStage.title}
              </p>
              <p>{activeStage.summary}</p>
              <p className="text-xs text-slate-400">ETA {activeStage.etaMinutes} min</p>
            </div>
          </div>

          {activeStage.kpis.length ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {activeStage.kpis.slice(0, 2).map((kpi) => (
                <li key={kpi.id} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{kpi.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{kpi.narrative}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {activeStage.compliance.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {activeStage.compliance.map((item) => (
                <span
                  key={item.id}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    item.status === "pass"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "attention"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700",
                  )}
                  title={item.description}
                >
                  {item.label}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold text-slate-700">Automation log</p>
          <ul className="mt-3 space-y-2 text-xs text-slate-500">
            {activeStage.auditTrail.map((event) => (
              <li key={`${event.timestamp}-${event.actor}`} className="flex items-start gap-3">
                <span className="font-medium text-slate-400">{event.timestamp}</span>
                <div>
                  <p className="font-medium text-slate-600">{event.actor}</p>
                  <p>{event.message}</p>
                </div>
              </li>
            ))}
          </ul>

          {activeStage.insights.length ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {activeStage.insights.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold text-slate-700">Alerts to clear</p>
          <ul className="mt-3 space-y-3">
            {alerts.map((alert) => {
              const severity = normalizeAlertSeverity(alert.severity);

              return (
                <li key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        alertSeverityStyles[severity],
                      )}
                    >
                      {alertSeverityLabels[severity]}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{alert.suggestedAction}</p>
                </li>
              );
            })}
          </ul>
        </article>
      </div>
    </section>
  );
}

function StageBadge({ status }: { status: VlrStageStatus }) {
  const label =
    status === "complete" ? "Done" : status === "active" ? "In progress" : status === "pending" ? "Queued" : "";
  const styles =
    status === "complete"
      ? "bg-emerald-100 text-emerald-700"
      : status === "active"
        ? "bg-sky-100 text-sky-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", styles)}>
      {label}
    </span>
  );
}

function ProgressBadge({ completion }: { completion: number }) {
  const clamped = Math.min(100, Math.max(0, Math.round(completion)));
  const arc = clamped * 3.6;
  const stroke = `conic-gradient(#0ea5e9 ${arc}deg, rgba(14,165,233,0.12) ${arc}deg)`;

  return (
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 rounded-full" style={{ backgroundImage: stroke }} />
      <div className="absolute inset-2 flex items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm">
        {clamped}%
      </div>
    </div>
  );
}

function PipelinesView() {
  const demandData = demandForecast.points.map((point) => ({
    ...point,
    hourLabel: formatShortTime(point.timestamp),
    percentage: Number((point.value * 100).toFixed(1)),
  }));

  const resilienceData = resilienceForecast.points.map((point) => ({
    ...point,
    weekLabel: formatDayLabel(point.timestamp),
  }));

  const hotspots = anomalyClusters.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">SDG lift forecast</h2>
              <p className="text-sm text-slate-500">{demandForecast.horizon}</p>
            </div>
            <span className="text-xs text-slate-400">Scenario · {demandForecast.metric}</span>
          </header>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hourLabel" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e2e8f0",
                    backgroundColor: "white",
                    boxShadow: "0 20px 40px -32px rgba(15,23,42,0.24)",
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Impact uplift"]}
                  labelFormatter={(label) => `Hour ${label}`}
                />
                <RechartsLine
                  type="monotone"
                  dataKey="percentage"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <header>
            <h2 className="text-xl font-semibold text-slate-900">Wellbeing outlook</h2>
            <p className="text-sm text-slate-500">{resilienceForecast.horizon}</p>
          </header>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resilienceData}>
                <defs>
                  <linearGradient id="resilienceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="weekLabel" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e2e8f0",
                    backgroundColor: "white",
                    boxShadow: "0 20px 40px -32px rgba(15,23,42,0.24)",
                  }}
                  formatter={(value: number) => [`${value.toFixed(0)} index`, "Wellbeing"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#resilienceGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">AI hotspots</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {hotspots.map((cluster) => (
            <li
              key={cluster.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            >
              <p className="text-sm font-semibold text-slate-900">{cluster.cluster}</p>
              <p className="mt-2 text-xs text-slate-500">
                {cluster.affectedAssets} packets · clears in {cluster.expectedResolutionMinutes} min
              </p>
              <span
                className={cn(
                  "mt-3 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  cluster.severity === "high"
                    ? "bg-rose-100 text-rose-700"
                    : cluster.severity === "moderate"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-sky-100 text-sky-700",
                )}
              >
                {cluster.severity === "high"
                  ? "High"
                  : cluster.severity === "moderate"
                    ? "Moderate"
                    : "Low"}{" "}
                attention
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function formatShortTime(timestamp: string) {
  return new Intl.DateTimeFormat("en", { hour: "numeric" }).format(new Date(timestamp));
}

function formatDayLabel(timestamp: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(timestamp));
}

function normalizeAlertSeverity(severity: string): AlertSeverity {
  if (severity === "warning" || severity === "critical" || severity === "info") {
    return severity;
  }
  return "info";
}

function getSpatialHighlights(scenario: ScenarioDefinition): SpatialHighlight[] {
  const highlights: SpatialHighlight[] = [];

  scenario.layers
    .filter((layer) => layer.visualization === "point")
    .forEach((layer) => {
      const dataset = layer.dataset as GeoJSONFeatureCollection;

      dataset.features.forEach((feature, index) => {
        if (feature.geometry?.type !== "Point") {
          return;
        }

        const coordinates = feature.geometry.coordinates;

        if (!Array.isArray(coordinates) || coordinates.length < 2) {
          return;
        }

        const [lng, lat] = coordinates;
        if (typeof lng !== "number" || typeof lat !== "number") {
          return;
        }

        const properties = (feature.properties ?? {}) as Record<string, unknown>;
        const progressIndex = typeof properties.progressIndex === "number" ? properties.progressIndex : null;
        const anomalyScore =
          typeof properties.anomalyScore === "number"
            ? properties.anomalyScore
            : progressIndex !== null
              ? 1 - Math.min(Math.max(progressIndex, 0), 1)
              : 0.45;

        highlights.push({
          id: String(properties.id ?? feature.id ?? `${layer.id}-${index}`),
          sensorId: typeof properties.id === "string" ? properties.id : `Node-${index + 1}`,
          sensorType:
            typeof properties.indicator === "string" ? (properties.indicator as string) : (layer.label as string),
          layerLabel: layer.label,
          district: typeof properties.district === "string" ? (properties.district as string) : null,
          health: typeof properties.status === "string" ? (properties.status as string) : null,
          anomalyScore: Math.min(Math.max(anomalyScore, 0), 1),
          lastReadingMinutes:
            typeof properties.refreshMinutesAgo === "number"
              ? (properties.refreshMinutesAgo as number)
              : typeof properties.lastReadingMinutesAgo === "number"
                ? (properties.lastReadingMinutesAgo as number)
                : null,
          coordinates: [lng, lat],
        });
      });
    });

  return highlights.slice(0, 6);
}
