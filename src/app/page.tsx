"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeatureCollection as GeoJSONFeatureCollection } from "geojson";
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
  Map as MapIcon,
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
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line as RechartsLine,
  LineChart as RechartsLineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar as RechartsRadar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  anomalyClusters,
  citywideKpis,
  demandForecast,
  explainabilitySnippets,
  modelPerformanceStats,
  resilienceForecast,
  riskCells,
  type AnomalyCluster,
  type SystemKpi,
} from "@/data/metrics";
import {
  dataAutomations,
  dataConnectors,
  dataFabricMetrics,
  dataQualityAlerts,
  type DataAutomationStatus,
  type DataConnectorStatus,
  type DataFabricMetric,
  type DataQualityAlertSeverity,
} from "@/data/integration";
import {
  copilotAuditLog,
  copilotMissionDeck,
  copilotModuleIndex,
  copilotPromptLibrary,
  copilotRecommendations,
  copilotThreads,
  type CopilotScenarioKey,
  type CopilotModule,
  type CopilotMission,
  type CopilotRecommendation,
  type CopilotAuditEntry,
  type CopilotPrompt,
  type CopilotMessage,
} from "@/data/copilot";
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
import { CommandCenterMap, type SpatialHighlight } from "@/components/command-center/command-center-map";
import { CopilotDockContent, type CopilotDockView } from "@/components/copilot/copilot-dock";
import { cn } from "@/lib/utils";

const moduleNavigation = [
  {
    id: "digital-twin",
    label: "Digital Twin Canvas",
    description: "See SDG progress and hotspots on the map.",
    icon: MapIcon,
    accent: "from-sky-400/40 via-transparent to-sky-500/20",
  },
  {
    id: "vlr-workbench",
    label: "VLR Automation",
    description: "Follow the AI-driven VLR workflow.",
    icon: Workflow,
    accent: "from-violet-400/35 via-transparent to-violet-500/15",
  },
  {
    id: "analytics",
    label: "AI Pipelines",
    description: "Review forecasts and model health.",
    icon: LineChart,
    accent: "from-emerald-400/35 via-transparent to-emerald-500/15",
  },
  {
    id: "copilot",
    label: "Data Fabric",
    description: "Check connectors and automations.",
    icon: Layers,
    accent: "from-slate-400/35 via-transparent to-slate-500/15",
  },
];

type AnalyticsViewId = "forecast" | "resilience" | "anomalies" | "risk" | "explainability";

const analyticsViews: Array<{
  id: AnalyticsViewId;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}> = [
  {
    id: "forecast",
    label: "Indicator Momentum",
    description: "Compare SDG forecasts against actuals.",
    icon: LineChart,
    accent: "from-sky-500/25 via-sky-400/10 to-sky-500/0",
  },
  {
    id: "resilience",
    label: "Wellbeing Outlook",
    description: "Project service and capital outcomes.",
    icon: ActivitySquare,
    accent: "from-emerald-500/25 via-emerald-400/10 to-emerald-500/0",
  },
  {
    id: "anomalies",
    label: "Evidence Radar",
    description: "Track open evidence issues.",
    icon: AlertTriangle,
    accent: "from-amber-500/25 via-amber-400/10 to-amber-500/0",
  },
  {
    id: "risk",
    label: "Readiness Quadrants",
    description: "Spot SDG, VLR, equity, and capital gaps.",
    icon: ShieldCheck,
    accent: "from-indigo-500/25 via-indigo-400/10 to-indigo-500/0",
  },
  {
    id: "explainability",
    label: "Transparency Lab",
    description: "Surface governance and explainability cues.",
    icon: Sparkles,
    accent: "from-rose-500/25 via-rose-400/10 to-rose-500/0",
  },
];

const forecastScopeOptions = [
  { id: "metro", label: "Citywide Portfolio" },
  { id: "harbor", label: "Harbor Resilience Loop" },
  { id: "innovation", label: "Innovation Basin Studio" },
] as const;

type ForecastScope = (typeof forecastScopeOptions)[number]["id"];

const forecastScopeMultiplier: Record<ForecastScope, number> = {
  metro: 1,
  harbor: 0.88,
  innovation: 0.94,
};

type ResilienceMode = "heat" | "grid";

const resilienceModes: Array<{ id: ResilienceMode; label: string }> = [
  { id: "heat", label: "Community Services" },
  { id: "grid", label: "Capital Delivery" },
];

const anomalySeverityBadgeTone: Record<AnomalyCluster["severity"], string> = {
  low: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  moderate: "border-amber-400/25 bg-amber-400/10 text-amber-100",
  high: "border-rose-400/35 bg-rose-500/15 text-rose-100",
};

const anomalySeverityLabel: Record<AnomalyCluster["severity"], string> = {
  low: "Low",
  moderate: "Elevated",
  high: "Critical",
};

const anomalySeverityWeight: Record<AnomalyCluster["severity"], number> = {
  low: 48,
  moderate: 68,
  high: 90,
};

type ScenarioInsightsPayload = {
  signals: ScenarioDefinition["liveSignals"];
  aiInsights: ScenarioDefinition["aiInsights"];
  kpis: ScenarioDefinition["kpis"];
  actions: ScenarioDefinition["actions"];
};

const resiliencePlaybooks: Record<ScenarioKey, string[]> = {
  "sdg-localization": [
    "Ping stewards for districts drifting under target.",
    "Share SDG wins and needs in tomorrow's mayoral brief.",
  ],
  "vlr-automation": [
    "Clear evidence packets waiting on finance.",
    "Publish the executive draft once checks pass.",
  ],
  "city-profiling": [
    "Compare wellbeing lift versus spend for top districts.",
    "Log the decision trail for council review.",
  ],
};

const explainabilityHeadline: Record<ScenarioKey, string> = {
  "sdg-localization": "Every SDG insight links straight back to its source.",
  "vlr-automation": "Stakeholders see why each VLR step is approved.",
  "city-profiling": "Capital choices show the wellbeing lift and trade-offs.",
};

export default function Home() {
  const [activeScenarioKey, setActiveScenarioKey] = useState<ScenarioKey>(defaultScenarioKey);
  const [focus, setFocus] = useState(52);
  const [activeModule, setActiveModule] = useState("digital-twin");
  const [copilotDockOpen, setCopilotDockOpen] = useState(true);
  const [copilotDockView, setCopilotDockView] = useState<CopilotDockView>("threads");
  const [copilotOverlayOpen, setCopilotOverlayOpen] = useState(false);

  const scenario = getScenarioConfig(activeScenarioKey);
  const scenarioSummaries = useMemo(() => listScenarioSummaries(), []);
  const scenarioInsights = useMemo<ScenarioInsightsPayload>(() => {
    const insights = listScenarioInsights(activeScenarioKey);
    if (Array.isArray(insights)) {
      return {
        signals: [] as ScenarioInsightsPayload["signals"],
        aiInsights: [] as ScenarioInsightsPayload["aiInsights"],
        kpis: [] as ScenarioInsightsPayload["kpis"],
        actions: [] as ScenarioInsightsPayload["actions"],
      };
    }
    return insights as ScenarioInsightsPayload;
  }, [activeScenarioKey]);

  if (!scenario) {
    throw new Error(`Scenario configuration missing for key: ${activeScenarioKey}`);
  }

  const copilotScenarioKey = activeScenarioKey as CopilotScenarioKey;

  const copilotModule = copilotModuleIndex[copilotScenarioKey];
  const copilotConversation = copilotThreads[copilotScenarioKey];
  const copilotPrompts = copilotPromptLibrary[copilotScenarioKey];
  const copilotMissionsForScenario = copilotMissionDeck[copilotScenarioKey];
  const copilotRecommendationsForScenario = copilotRecommendations[copilotScenarioKey];
  const copilotAuditTrail = copilotAuditLog[copilotScenarioKey];

  const syncTimestamp = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date());

  const activeModuleMeta =
    moduleNavigation.find((module) => module.id === activeModule) ?? moduleNavigation[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeModule]);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopBar
        scenarioKey={activeScenarioKey}
        scenarioSummaries={scenarioSummaries}
        onScenarioChange={setActiveScenarioKey}
        syncTimestamp={syncTimestamp}
        onCopilotSummon={() => setCopilotOverlayOpen(true)}
        onCopilotToggle={() => setCopilotDockOpen((prev) => !prev)}
        isCopilotRailOpen={copilotDockOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar activeModule={activeModule} onModuleChange={setActiveModule} />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 pb-16">
              <ModuleSwitcher
                activeModule={activeModule}
                onModuleChange={setActiveModule}
                modules={moduleNavigation}
                activeModuleMeta={activeModuleMeta}
              />

              {activeModule === "digital-twin" ? (
                <>
                  <section
                    id="digital-twin"
                    className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.18)] md:p-8"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Citywide KPI Pulse</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">Live operations benchmark</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Signals from live feeds and AI uplift versus last period.
                        </p>
                      </div>
                      <div className="hidden text-right text-xs uppercase tracking-[0.3em] text-slate-400 sm:block">
                        Updated with scenario focus &middot; {syncTimestamp}
                      </div>
                    </div>
                    <div className="mt-5">
                      <KpiPulseStrip kpis={citywideKpis} />
                    </div>
                  </section>

                  <section
                    aria-label="Digital twin module"
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.2)] md:p-8"
                  >
                    <DigitalTwinPanel
                      scenario={scenario}
                      focus={focus}
                      onFocusChange={setFocus}
                      insights={scenarioInsights}
                    />
                  </section>
                </>
              ) : null}

              {activeModule === "vlr-workbench" ? (
                <section
                  id="vlr-workbench"
                  aria-label="VLR automation module"
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.2)] md:p-8"
                >
                  <VlrPreviewPanel />
                </section>
              ) : null}

              {activeModule === "analytics" ? (
                <section
                  id="analytics"
                  aria-label="Analytics module"
                  className="analytics-panel rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.2)] md:p-8"
                >
                  <AnalyticsPreviewPanel scenario={scenario} />
                </section>
              ) : null}

              {activeModule === "copilot" ? (
                <section
                  id="copilot"
                  aria-label="Copilot module"
                  className="copilot-panel rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.2)] md:p-8"
                >
                  <CopilotPreviewPanel
                    scenario={scenario}
                    module={copilotModule}
                    onSummonDock={() => setCopilotOverlayOpen(true)}
                    onToggleRail={() => setCopilotDockOpen((prev) => !prev)}
                    isRailOpen={copilotDockOpen}
                  />
                </section>
              ) : null}
            </div>
          </main>

          <CopilotRail
            open={copilotDockOpen}
            scenario={scenario}
            module={copilotModule}
            conversation={copilotConversation}
            prompts={copilotPrompts}
            missions={copilotMissionsForScenario}
            recommendations={copilotRecommendationsForScenario}
            auditLog={copilotAuditTrail}
            scenarioActions={scenario.actions}
            activeView={copilotDockView}
            onToggle={() => setCopilotDockOpen((prev) => !prev)}
            onViewChange={setCopilotDockView}
          />
        </div>
      </div>

      {copilotOverlayOpen ? (
        <CopilotOverlay
          scenario={scenario}
          module={copilotModule}
          conversation={copilotConversation}
          quickPrompts={copilotPrompts}
          missions={copilotMissionsForScenario}
          recommendations={copilotRecommendationsForScenario}
          auditLog={copilotAuditTrail}
          scenarioActions={scenario.actions}
          activeView={copilotDockView}
          onClose={() => setCopilotOverlayOpen(false)}
          onViewChange={setCopilotDockView}
        />
      ) : null}
    </div>
  );
}

type DashboardTopBarProps = {
  scenarioKey: ScenarioKey;
  scenarioSummaries: ReturnType<typeof listScenarioSummaries>;
  onScenarioChange: (key: ScenarioKey) => void;
  syncTimestamp: string;
  onCopilotSummon: () => void;
  onCopilotToggle: () => void;
  isCopilotRailOpen: boolean;
};

function DashboardTopBar({
  scenarioKey,
  scenarioSummaries,
  onScenarioChange,
  syncTimestamp,
  onCopilotSummon,
  onCopilotToggle,
  isCopilotRailOpen,
}: DashboardTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-1.5 px-5 py-2 sm:px-8 sm:py-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 shadow-[0_10px_28px_-20px_rgba(59,130,246,0.35)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Nexus Consulting</p>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">City Digital Twin Command</h1>
            <p className="text-[11px] text-slate-500">Live smart city control for Nexus Consulting</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <nav className="flex flex-wrap gap-1.5 rounded-[999px] border border-slate-200/80 bg-[rgb(var(--surface-soft))] p-1.5">
            {scenarioSummaries.map((scenario) => (
              <button
                key={scenario.key}
                type="button"
                onClick={() => onScenarioChange(scenario.key)}
                className={cn(
                  "min-w-[120px] rounded-[999px] px-3 py-1.5 text-left text-[11px] font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200",
                  scenario.key === scenarioKey
                    ? "bg-white text-slate-900 shadow-[0_12px_30px_-25px_rgba(14,165,233,0.35)]"
                    : "text-slate-600 hover:bg-white hover:text-slate-900",
                )}
              >
                <span
                  className={cn(
                    "block text-[9px] uppercase tracking-[0.35em]",
                    scenario.key === scenarioKey ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  Scenario
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-sm leading-tight",
                    scenario.key === scenarioKey ? "text-slate-900" : "text-slate-600",
                  )}
                >
                  {scenario.name}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] text-slate-500 shadow-[0_16px_40px_-28px_rgba(14,165,233,0.22)]">
            <MapPinned className="h-4 w-4 text-sky-500" />
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.32em]">Metro Focus</span>
              <span className="mt-0.5 text-sm font-semibold text-slate-900">Aurora District Twin</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] text-slate-500 shadow-[0_16px_40px_-28px_rgba(79,70,229,0.2)]">
            <Clock8 className="h-4 w-4 text-violet-500" />
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.32em]">Sync Checkpoint</span>
              <span className="mt-0.5 text-sm font-semibold text-slate-900">{syncTimestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onCopilotToggle}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-sky-200 hover:text-slate-900 xl:inline-flex"
            >
              <Bot className="h-4 w-4 text-sky-500" />
              {isCopilotRailOpen ? "Hide Copilot Dock" : "Show Copilot Dock"}
            </button>
            <button
              type="button"
              onClick={onCopilotSummon}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 xl:hidden"
            >
              <Bot className="h-4 w-4" />
              Launch Copilot
            </button>
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
    <aside className="hidden w-[240px] border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-[10px] uppercase tracking-[0.32em] text-slate-500 shadow-[0_16px_45px_-30px_rgba(14,165,233,0.22)]">
          <p className="flex items-center gap-2 text-slate-500">
            <GaugeCircle className="h-4 w-4 text-sky-500" />
            Mission Status
          </p>
          <span className="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-slate-900">
            92%
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-sky-500">Operational</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {moduleNavigation.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={activeModule === item.id}
              onClick={() => onModuleChange(item.id)}
              className={cn(
                "group rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-left transition-colors duration-200 hover:border-sky-200 hover:bg-sky-50/60",
                activeModule === item.id
                  ? "border-sky-200 bg-sky-50 shadow-[0_12px_32px_-24px_rgba(59,130,246,0.3)]"
                  : "text-slate-600",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-[18px] border text-sky-600 transition-all duration-200",
                      activeModule === item.id
                        ? "border-sky-200 bg-white"
                        : "border-slate-200 bg-sky-50",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-100 via-violet-100 to-rose-100 p-4 text-[10px] text-slate-600 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.15)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">
            <BrainCircuit className="h-4 w-4" />
            AI Warden
          </p>
          <p className="mt-2 text-sm text-slate-700">Telemetry healthy. Three interventions queued in Copilot.</p>
        </div>
      </div>
    </aside>
  );
}

type ModuleSwitcherProps = {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  modules: typeof moduleNavigation;
  activeModuleMeta: (typeof moduleNavigation)[number];
};

function ModuleSwitcher({ activeModule, onModuleChange, modules, activeModuleMeta }: ModuleSwitcherProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.16)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Module Suite</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">{activeModuleMeta.label}</h2>
          <p className="mt-1 text-sm text-slate-600">{activeModuleMeta.description}</p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Module navigation"
        className="mt-4 flex flex-wrap gap-1.5 rounded-[999px] border border-slate-200 bg-[rgb(var(--surface-soft))] p-1.5"
      >
        {modules.map((module) => {
          const isActive = module.id === activeModule;

          return (
            <button
              key={module.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "group relative flex items-center gap-2 rounded-[999px] px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200",
                isActive
                  ? "bg-white text-slate-900 shadow-[0_12px_32px_-24px_rgba(59,130,246,0.28)]"
                  : "text-slate-600 hover:bg-white hover:text-slate-900",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 rounded-[999px] bg-gradient-to-r opacity-0 transition-opacity duration-300",
                  module.accent ?? "",
                  isActive ? "opacity-50" : "group-hover:opacity-40",
                )}
              />
              <span className="relative flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-xs transition-colors duration-200",
                    isActive ? "border-sky-200 bg-sky-50 text-sky-600" : "text-slate-500",
                  )}
                >
                  <module.icon className="h-4 w-4" />
                </span>
                {module.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type CopilotRailProps = {
  open: boolean;
  scenario: ScenarioDefinition;
  module?: CopilotModule;
  conversation: CopilotMessage[];
  prompts: CopilotPrompt[];
  missions: CopilotMission[];
  recommendations: CopilotRecommendation[];
  auditLog: CopilotAuditEntry[];
  scenarioActions: string[];
  activeView: CopilotDockView;
  onToggle: () => void;
  onViewChange: (view: CopilotDockView) => void;
};

function CopilotRail({
  open,
  scenario,
  module,
  conversation,
  prompts,
  missions,
  recommendations,
  auditLog,
  scenarioActions,
  activeView,
  onToggle,
  onViewChange,
}: CopilotRailProps) {
  return (
    <div className="relative hidden h-full xl:flex">
      <aside
        className={cn(
          "flex h-full flex-col border-l border-slate-200/80 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-out",
          open ? "w-[380px]" : "w-[84px]",
        )}
      >
        {open ? (
          <div className="copilot-panel flex h-full flex-col overflow-hidden px-6 py-7">
            <CopilotDockContent
              scenario={scenario}
              module={module}
              conversation={conversation}
              quickPrompts={prompts}
              missions={missions}
              recommendations={recommendations}
              auditLog={auditLog}
              scenarioActions={scenarioActions}
              activeView={activeView}
              onViewChange={onViewChange}
              onClose={onToggle}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-l-[32px] border-l border-slate-200 bg-[rgb(var(--surface-soft))] text-[10px] uppercase tracking-[0.4em] text-foreground/60 transition hover:border-sky-200 hover:text-slate-900"
          >
            <Bot className="h-6 w-6 text-sky-600 transition group-hover:scale-105" />
            <span className="px-3 text-center">Copilot Dock</span>
            <span className="sr-only">Expand copilot dock</span>
          </button>
        )}
      </aside>
    </div>
  );
}

type CopilotOverlayProps = {
  scenario: ScenarioDefinition;
  module?: CopilotModule;
  conversation: CopilotMessage[];
  quickPrompts: CopilotPrompt[];
  missions: CopilotMission[];
  recommendations: CopilotRecommendation[];
  auditLog: CopilotAuditEntry[];
  scenarioActions: string[];
  activeView: CopilotDockView;
  onClose: () => void;
  onViewChange: (view: CopilotDockView) => void;
};

function CopilotOverlay({
  scenario,
  module,
  conversation,
  quickPrompts,
  missions,
  recommendations,
  auditLog,
  scenarioActions,
  activeView,
  onClose,
  onViewChange,
}: CopilotOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm xl:hidden">
      <div role="presentation" className="flex-1" onClick={onClose} />
      <div className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[36px] border-t border-slate-200 bg-white px-5 py-6 shadow-[0_-20px_60px_rgba(15,23,42,0.25)] sm:px-6">
        <div className="mx-auto h-full max-w-[540px] overflow-y-auto pb-6">
          <CopilotDockContent
            scenario={scenario}
            module={module}
            conversation={conversation}
            quickPrompts={quickPrompts}
            missions={missions}
            recommendations={recommendations}
            auditLog={auditLog}
            scenarioActions={scenarioActions}
            activeView={activeView}
            onViewChange={onViewChange}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function KpiPulseStrip({ kpis }: { kpis: SystemKpi[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.slice(0, 4).map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: SystemKpi }) {
  const tone = kpi.change.direction === "up" ? "text-success-500" : "text-danger-500";
  const arrow = kpi.change.direction === "up" ? "▲" : "▼";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_42px_-30px_rgba(15,23,42,0.18)]">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">{kpi.label}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold text-slate-900">
          {kpi.value.toLocaleString()} <span className="text-sm text-slate-500">{kpi.unit}</span>
        </span>
        <span className={cn("text-xs font-semibold", tone)}>
          {arrow} {kpi.change.percentage}%
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">vs last {kpi.change.period}</p>
    </div>
  );
}

type DigitalTwinPanelProps = {
  scenario: ScenarioDefinition;
  focus: number;
  onFocusChange: (value: number) => void;
  insights: ScenarioInsightsPayload;
};

function DigitalTwinPanel({ scenario, focus, onFocusChange, insights }: DigitalTwinPanelProps) {
  const focusMinutes = Math.round((focus / 100) * 60);
  const topSignals = insights.signals.slice(0, 3);
  const topKpis = scenario.kpis.slice(0, 2);
  const priorityActions = insights.actions.slice(0, 3);
  const spatialHighlights = useMemo<SpatialHighlight[]>(() => {
    const pointLayers = scenario.layers.filter((layer) => layer.visualization === "point");
    const highlights: SpatialHighlight[] = [];

    pointLayers.forEach((layer) => {
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
        const progressIndex =
          typeof properties.progressIndex === "number"
            ? properties.progressIndex
            : typeof properties.anomalyScore === "number"
              ? 1 - Number(properties.anomalyScore)
              : 0.5;
        const attentionScore = Math.min(1, Math.max(0, 1 - progressIndex));
        const indicatorLabel =
          typeof properties.indicator === "string" ? (properties.indicator as string) : (layer.label as string);
        const sdgTarget = typeof properties.sdgTarget === "string" ? (properties.sdgTarget as string) : null;
        const sensorType = sdgTarget ? `${indicatorLabel} · ${sdgTarget}` : indicatorLabel;
        const status = typeof properties.status === "string" ? (properties.status as string) : null;
        const refreshMinutes =
          typeof properties.refreshMinutesAgo === "number"
            ? (properties.refreshMinutesAgo as number)
            : typeof properties.lastReadingMinutesAgo === "number"
              ? (properties.lastReadingMinutesAgo as number)
              : null;

        highlights.push({
          id: String(properties.id ?? feature.id ?? `${layer.id}-${index}`),
          sensorId: typeof properties.id === "string" ? properties.id : `Node-${index + 1}`,
          sensorType,
          layerLabel: layer.label,
          district: typeof properties.district === "string" ? properties.district : null,
          health: status,
          anomalyScore: attentionScore,
          lastReadingMinutes: refreshMinutes,
          coordinates: [lng, lat],
        });
      });
    });

    return highlights;
  }, [scenario]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-sky-600">Digital Twin Command</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{scenario.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{scenario.tagline}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-500 shadow-[0_10px_28px_-20px_rgba(15,23,42,0.18)]">
            <Radar className="h-4 w-4 text-sky-500" />
            {scenario.command}
          </div>
        </div>

        <div className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.2)] sm:w-auto">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Focus Horizon</span>
            <span className="text-base font-semibold text-slate-900">{focusMinutes} min</span>
          </div>
          <input
            type="range"
            value={focus}
            onChange={(event) => onFocusChange(Number(event.target.value))}
            min={0}
            max={100}
            className="mt-3 h-2 w-full appearance-none rounded-full bg-slate-200 accent-sky-500"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-slate-400">
            <span>Now</span>
            <span>+60m</span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-[0_18px_55px_-40px_rgba(15,23,42,0.2)]">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-sky-600">
          <ActivitySquare className="h-4 w-4" />
          Operational Narrative
        </p>
        <p className="mt-3 text-slate-700">{scenario.narrative}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.18)]">
            <CommandCenterMap scenario={scenario} focus={focus} highlights={spatialHighlights} />
            <MapHud scenario={scenario} insights={insights} focus={focus} />
          </div>

          <MapSpotlightList scenario={scenario} />

          <LayerLegend layers={scenario.layers} focus={focus} />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topSignals.map((signal) => (
              <SignalBadge key={signal.label} signal={signal} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_-38px_rgba(15,23,42,0.18)]">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-sky-600">
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
            {topKpis.map((kpi) => (
              <div
                key={kpi.id}
                className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-[0_16px_48px_-32px_rgba(15,23,42,0.18)]"
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {kpi.value} <span className="text-sm text-slate-500">{kpi.unit}</span>
                </p>
                <p className="mt-1 text-[11px] text-sky-600">
                  Δ {kpi.change.percentage}% {kpi.change.direction === "up" ? "improvement" : "reduction"}
                </p>
              </div>
            ))}
          </div>

          <ActionQueueCard actions={priorityActions} />
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
  insights: ScenarioInsightsPayload;
  focus: number;
}) {
  const focusMinutes = Math.round((focus / 100) * 60);
  const primaryInsight = insights.aiInsights[0];
  const primaryAction = insights.actions[0];
  const confidence = primaryInsight ? Math.round(primaryInsight.confidence * 100) : null;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/75 px-4 py-2 text-xs text-slate-600 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.22)] backdrop-blur-sm">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="text-left">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-500">Scenario</p>
            <p className="text-sm font-semibold text-slate-900">{scenario.name}</p>
          </div>
        </div>

        {primaryInsight ? (
          <div className="pointer-events-auto max-w-xs rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-[0_16px_40px_-26px_rgba(59,130,246,0.28)] backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.28em] text-sky-600">
              AI Note{confidence !== null ? ` · ${confidence}%` : ""}
            </p>
            <p className="mt-2 font-medium leading-5 text-slate-900">{primaryInsight.title}</p>
            {primaryInsight.detail ? (
              <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{primaryInsight.detail}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        {primaryAction ? (
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-3 text-sm text-slate-600 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.22)] backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Next step</p>
            <p className="mt-2 text-sm leading-5 text-slate-700">{primaryAction}</p>
          </div>
        ) : null}

        <div className="flex gap-2">
          <div className="pointer-events-auto rounded-full border border-slate-200/70 bg-white/75 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-slate-500 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.2)] backdrop-blur-sm">
            <p>Focus</p>
            <p className="mt-1 text-lg font-semibold tracking-normal text-slate-900">{focusMinutes}m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapSpotlightList({ scenario }: { scenario: ScenarioDefinition }) {
  const pointLayers = scenario.layers.filter((layer) => layer.visualization === "point");

  const spotlightCandidates = pointLayers.flatMap((layer) => {
    const dataset = layer.dataset as GeoJSONFeatureCollection;
    return dataset.features
      .filter((feature) => feature.geometry?.type === "Point")
      .map((feature) => {
        const properties = (feature.properties ?? {}) as Record<string, unknown>;
        const progressIndex =
          typeof properties.progressIndex === "number"
            ? properties.progressIndex
            : typeof properties.anomalyScore === "number"
              ? 1 - Number(properties.anomalyScore)
              : 0.5;
        const attentionScore = Math.min(1, Math.max(0, 1 - progressIndex));
        const status = typeof properties.status === "string" ? (properties.status as string) : null;
        const indicator =
          typeof properties.indicator === "string" ? (properties.indicator as string) : layer.label;
        const sdgTarget = typeof properties.sdgTarget === "string" ? (properties.sdgTarget as string) : null;
        const district = typeof properties.district === "string" ? properties.district : null;
        const id = typeof properties.id === "string" ? properties.id : layer.id;

        return {
          id,
          layerLabel: layer.label,
          attentionScore,
          progressIndex,
          status,
          district,
          indicator,
          sdgTarget,
        };
      });
  });

  if (!spotlightCandidates.length) {
    return null;
  }

  const topSpots = [...spotlightCandidates]
    .sort((a, b) => (b.attentionScore ?? 0) - (a.attentionScore ?? 0))
    .slice(0, 3);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_-40px_rgba(15,23,42,0.18)]">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-sky-600">
        <Crosshair className="h-3.5 w-3.5" />
        Spatial Spotlight
      </p>
      <div className="mt-4 space-y-3">
        {topSpots.map((spot) => {
          const statusClass =
            spot.status === "Delayed"
              ? "bg-rose-50 text-rose-600 border-rose-200"
              : spot.status === "Watch"
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-emerald-50 text-emerald-600 border-emerald-200";
          const narrative =
            spot.status === "Delayed"
              ? "Immediate steward action recommended."
              : spot.status === "Watch"
                ? "Monitor steward notes; AI flags emerging variance."
                : "Indicator performing on plan.";

          return (
            <div
              key={`${spot.id}-${spot.layerLabel}`}
              className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {spot.indicator}
                  {spot.sdgTarget ? ` · ${spot.sdgTarget}` : ""}
                </p>
                <p className="text-xs text-slate-500">
                  {spot.layerLabel}
                  {spot.district ? ` · ${spot.district}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-500">{narrative}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold text-sky-600">
                  {(spot.progressIndex * 100).toFixed(0)}% progress
                </span>
                <span className={cn("rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em]", statusClass)}>
                  {spot.status ?? "On Track"}
                </span>
              </div>
            </div>
          );
        })}
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
            className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.18)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
              style={{ background: gradientBackground }}
            />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sky-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-900">{layer.label}</p>
                </div>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                {focusBoost}% focus
              </span>
            </div>

            <p className="relative mt-3 text-xs leading-relaxed text-slate-500">{layer.legend}</p>
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

function SignalBadge({ signal }: { signal: ScenarioInsightsPayload["signals"][number] }) {
  const tone =
    signal.tone === "positive"
      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
      : signal.tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-600"
        : "border-slate-200 bg-white text-slate-600";

  return (
    <div
      className={cn(
        "rounded-[24px] border px-5 py-4 text-sm shadow-[0_14px_36px_-28px_rgba(15,23,42,0.18)]",
        tone,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{signal.label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{signal.value}</p>
      <p className="text-[11px] text-slate-500">Δ {signal.delta}</p>
    </div>
  );
}

function InsightCard({
  insight,
  index,
}: {
  insight: ScenarioInsightsPayload["aiInsights"][number];
  index: number;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.18)]">
      <p className="text-xs font-semibold text-slate-900">{insight.title}</p>
      <p className="mt-2 text-sm text-slate-600">{insight.detail}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-sky-600">
        {Math.round(insight.confidence * 100)}% confidence · Insight #{index + 1}
      </p>
    </div>
  );
}

function ActionQueueCard({ actions }: { actions: string[] }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-[0_18px_55px_-40px_rgba(15,23,42,0.18)]">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-sky-600">
        <Workflow className="h-4 w-4" />
        Orchestration Queue
      </p>
      <ul className="mt-3 space-y-2">
        {actions.map((action, index) => (
          <li key={action} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm text-slate-600">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-600">
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
  const processSignals = vlrProcessSignals.slice(0, 3);
  const headlineAlerts = vlrAlerts.slice(0, 3);
  const stageArtifacts = (selectedStage.artifacts ?? []).slice(0, 3);
  const stageAuditTrail = (selectedStage.auditTrail ?? []).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">
            Nexus Consulting · VLR Automation
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Voluntary Local Review Mission Board
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            AI keeps the VLR pipeline moving with clean evidence, clear owners, and explainable scoring.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {processSignals.map((signal) => (
            <span
              key={signal}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] text-slate-500 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.22)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              {signal}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.22)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Pipeline Status</p>
            <div className="mt-4 space-y-3">
              {vlrStages.map((stage, index) => {
                const isActive = stage.id === selectedStageId;
                return (
                  <button
                    type="button"
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={cn(
                      "w-full rounded-[24px] border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:border-sky-200 hover:bg-sky-50/60",
                      isActive && "border-sky-300 bg-sky-50 shadow-[0_20px_65px_-48px_rgba(59,130,246,0.35)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <StageStatusIcon status={stage.status} isActive={isActive} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Stage {index + 1}</p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">{stage.title}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        {stage.status === "active" && <span>ETA {stage.etaMinutes}m</span>}
                        {stage.status === "pending" && <span>{stage.completion}% primed</span>}
                        {stage.status === "complete" && <span>Ready</span>}
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          stage.status === "complete" && "bg-emerald-400",
                          stage.status === "active" && "bg-violet-400",
                          stage.status === "pending" && "bg-slate-300"
                        )}
                        style={{ width: `${Math.max(stage.completion, stage.status === "pending" ? 18 : 6)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Latest Export</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{vlrPdfPreview.period}</p>
              </div>
              <FileText className="h-8 w-8 text-sky-500" />
            </div>
            <p className="mt-3 text-sm text-slate-600">{vlrPdfPreview.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {vlrPdfPreview.chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="text-slate-600">{chapter.label}</span>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                      chapter.status === "ready" && "border-emerald-200 bg-emerald-50 text-emerald-600",
                      chapter.status === "in-review" && "border-amber-200 bg-amber-50 text-amber-600",
                      chapter.status === "draft" && "border-rose-200 bg-rose-50 text-rose-600"
                    )}
                  >
                    {chapter.status.replace("-", " ")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{vlrPdfPreview.filename}</span>
              <span>{vlrPdfPreview.size}</span>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
            >
              Download VLR package
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.22)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  Stage {selectedIndex + 1} · {getStageStatusLabel(selectedStage.status)}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{selectedStage.title}</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-[0_12px_28px_-24px_rgba(14,165,233,0.18)]">
                <StageStatusIcon status={selectedStage.status} isActive />
                {selectedStage.status === "active"
                  ? `ETA ${selectedStage.etaMinutes} minutes`
                  : `Completion ${selectedStage.completion}%`}
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{selectedStage.summary}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {selectedStage.insights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-[22px] border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3 text-sm text-slate-600"
                >
                  <Sparkles className="mb-2 h-4 w-4 text-sky-500" />
                  {insight}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {selectedStage.kpis.map((kpi) => (
                <div
                  key={kpi.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-4"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-semibold uppercase tracking-[0.3em]",
                      kpi.direction === "up" ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {kpi.deltaLabel}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">{kpi.narrative}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.2)]">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
                <ShieldCheck className="h-4 w-4 text-sky-500" />
                Compliance & Guardrails
              </p>
              <div className="mt-4 space-y-3">
                {selectedStage.compliance.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-slate-200 bg-[rgb(var(--surface-soft))] p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                          complianceBadgeTone(item.status).badge
                        )}
                      >
                        {complianceBadgeTone(item.status).label}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Artifacts ready</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {stageArtifacts.map((artifact) => (
                    <li key={artifact.id} className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 text-sky-500" />
                      <div>
                        <p className="font-medium text-slate-900">{artifact.label}</p>
                        <p className="text-slate-500">{artifact.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-55px_rgba(15,23,42,0.2)]">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  <ActivitySquare className="h-4 w-4 text-sky-500" />
                  Audit Trail
                </p>
                <ul className="mt-4 space-y-3">
                  {stageAuditTrail.map((event) => (
                    <li
                      key={`${event.timestamp}-${event.actor}`}
                      className="flex gap-3 rounded-[22px] border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3 text-sm text-slate-600"
                    >
                      <span className="flex h-8 w-16 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700">
                        {event.timestamp}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{event.actor}</p>
                        <p className="text-slate-500">{event.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-[rgb(var(--surface-soft))] p-5">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  <AlertTriangle className="h-4 w-4" />
                  Policy & Action Alerts
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {headlineAlerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3"
                    >
                      <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", alertSeverityTone(alert.severity))} />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{alert.message}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-slate-500">
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
    return <CheckCircle2 className={cn("h-5 w-5 text-emerald-500", !isActive && "text-emerald-400")} />;
  }

  if (status === "active") {
    return <Loader2 className="h-5 w-5 animate-spin text-violet-500" />;
  }

  return <CircleDashed className="h-5 w-5 text-slate-400" />;
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
      return { label: "Pass", badge: "border border-emerald-200 bg-emerald-50 text-emerald-600" };
    case "attention":
      return { label: "Attention", badge: "border border-amber-200 bg-amber-50 text-amber-600" };
    default:
      return { label: "Review", badge: "border border-rose-200 bg-rose-50 text-rose-600" };
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

function AnalyticsPreviewPanel({ scenario }: { scenario: ScenarioDefinition }) {
  const [activeView, setActiveView] = useState<AnalyticsViewId>("forecast");
  const [forecastScope, setForecastScope] = useState<ForecastScope>("metro");
  const [resilienceMode, setResilienceMode] = useState<ResilienceMode>("heat");

  const activeViewConfig = useMemo(
    () => analyticsViews.find((view) => view.id === activeView) ?? analyticsViews[0],
    [activeView],
  );

  const forecastSeries = useMemo(() => {
    const multiplier = forecastScopeMultiplier[forecastScope];
    const formatter = new Intl.DateTimeFormat("en", { hour: "numeric", hour12: true });

    return demandForecast.points.map((point, index) => {
      const timestamp = new Date(point.timestamp);
      const aiValue = Number((point.value * multiplier).toFixed(2));
      const baselineValue = aiValue - 0.12 + (index % 2 === 0 ? 0.05 : -0.03);
      const baseline = Number(Math.max(0.28, baselineValue).toFixed(2));

      return {
        hour: formatter.format(timestamp),
        ai: aiValue,
        baseline,
      };
    });
  }, [forecastScope]);

  const latestForecast = forecastSeries.at(-1);
  const forecastLift =
    latestForecast && latestForecast.baseline > 0
      ? ((latestForecast.ai - latestForecast.baseline) / latestForecast.baseline) * 100
      : 0;

  const resilienceSeries = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
    return resilienceForecast.points.map((point, index) => {
      const label = formatter.format(new Date(point.timestamp));

      if (resilienceMode === "heat") {
        const aiValue = Number(point.value.toFixed(1));
        const baseline = Number((aiValue + 3.1 - (index % 2 === 0 ? 1.4 : -0.7)).toFixed(1));
        return { label, ai: aiValue, baseline };
      }

      const baseline = 78 - index * 2 + (index % 2 === 0 ? 2.5 : -3.5);
      const aiValue = baseline + 6.2 + (index % 3 === 0 ? 1.4 : -0.6);
      return {
        label,
        ai: Number(aiValue.toFixed(1)),
        baseline: Number(baseline.toFixed(1)),
      };
    });
  }, [resilienceMode]);

  const resilienceLift =
    resilienceSeries.length > 0
      ? (resilienceSeries.at(-1)!.ai - resilienceSeries.at(-1)!.baseline).toFixed(1)
      : "0.0";

  const anomalyRadarSeries = useMemo(
    () =>
      anomalyClusters.map((cluster) => ({
        cluster: cluster.cluster,
        severity: anomalySeverityWeight[cluster.severity],
        triage: Math.max(15, 100 - cluster.expectedResolutionMinutes),
      })),
    [],
  );

  const highestSeverityCluster = useMemo(() => {
    if (anomalyClusters.length === 0) {
      return null;
    }

    return anomalyClusters.reduce((prev, current) => {
      const prevWeight = anomalySeverityWeight[prev.severity];
      const currentWeight = anomalySeverityWeight[current.severity];
      if (currentWeight === prevWeight) {
        return current.affectedAssets > prev.affectedAssets ? current : prev;
      }
      return currentWeight > prevWeight ? current : prev;
    }, anomalyClusters[0]);
  }, []);

  const riskQuadrantSeries = useMemo(() => {
    const aggregate = new Map<
      (typeof riskCells)[number]["quadrant"],
      { quadrant: (typeof riskCells)[number]["quadrant"]; total: number; count: number }
    >();

    riskCells.forEach((cell) => {
      const record = aggregate.get(cell.quadrant) ?? { quadrant: cell.quadrant, total: 0, count: 0 };
      record.total += cell.score;
      record.count += 1;
      aggregate.set(cell.quadrant, record);
    });

    return Array.from(aggregate.values()).map((entry) => ({
      quadrant: entry.quadrant,
      score: Number((entry.total / entry.count).toFixed(2)),
    }));
  }, []);

  const topRiskCells = useMemo(
    () => [...riskCells].sort((a, b) => b.score - a.score).slice(0, 4),
    [],
  );
  const explainabilityStories = explainabilitySnippets.slice(0, 4);

  if (!activeViewConfig) {
    return null;
  }

  const scopeLabel = forecastScopeOptions.find((option) => option.id === forecastScope)?.label ?? "Metro Network";
  const resilienceModeLabel =
    resilienceModes.find((mode) => mode.id === resilienceMode)?.label ?? "Heat Stress";
  const explainHeadline = explainabilityHeadline[scenario.key];

  const renderActiveView = () => {
    switch (activeView) {
      case "forecast": {
        const aiPercent = latestForecast ? Math.round(latestForecast.ai * 100) : 0;
        const baselinePercent = latestForecast ? Math.round(latestForecast.baseline * 100) : 0;
        const aiGradientId = `forecast-ai-${forecastScope}`;
        const baselineGradientId = `forecast-baseline-${forecastScope}`;

        return (
          <div className="space-y-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.22)] lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{activeViewConfig.label}</p>
                <h3 className="text-lg font-semibold text-slate-900">Hyperlocal demand lift against baseline</h3>
                <p className="text-sm text-foreground/65">
                  Corridor orchestration keeps {scenario.name} on plan while AI exposes the interventions delivering{" "}
                  {forecastLift >= 0 ? "+" : ""}
                  {forecastLift.toFixed(1)}% throughput lift this hour.
                </p>
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
                  {forecastScopeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setForecastScope(option.id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition",
                        forecastScope === option.id
                          ? "bg-sky-50 text-sky-700 shadow-[0_16px_45px_-30px_rgba(59,130,246,0.35)]"
                          : "text-foreground/60 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-sky-600 shadow-[0_16px_50px_-38px_rgba(56,189,248,0.35)]">
                  AI Lift
                  <p className="mt-1 text-2xl font-semibold text-sky-700">
                    {forecastLift >= 0 ? "+" : ""}
                    {forecastLift.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
              <div className="rounded-[26px] border border-slate-200 bg-[rgb(var(--surface-soft))] p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={forecastSeries}>
                    <defs>
                      <linearGradient id={aiGradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="rgba(14,165,233,0.9)" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="rgba(14,165,233,0)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id={baselineGradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="rgba(148,163,184,0.75)" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="rgba(148,163,184,0)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.25)" vertical={false} strokeDasharray="3 6" />
                    <XAxis dataKey="hour" stroke="rgba(71,85,105,0.6)" tickLine={false} />
                    <YAxis
                      stroke="rgba(71,85,105,0.6)"
                      domain={[0.2, 1]}
                      tickFormatter={(value) => `${Math.round((value as number) * 100)}%`}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(14,165,233,0.35)", strokeDasharray: "4 4" }}
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "18px",
                        border: "1px solid rgba(148,163,184,0.35)",
                        color: "rgba(30,41,59,0.92)",
                        padding: "0.75rem 1rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stroke="rgba(148,163,184,0.7)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#${baselineGradientId})`}
                    />
                    <Area
                      type="monotone"
                      dataKey="ai"
                      stroke="rgba(14,165,233,0.95)"
                      strokeWidth={2.4}
                      fillOpacity={1}
                      fill={`url(#${aiGradientId})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Scope</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{scopeLabel}</p>
                  <p className="mt-2 text-sm text-foreground/65">
                    Live indicator feeds, steward notes, and wellbeing sensors explain progress shifts before quarterly reviews.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">Active AI Lift</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{aiPercent}%</p>
                    <p className="text-xs text-sky-600">Localization autoplan · steward alignment</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">Manual Baseline</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{baselinePercent}%</p>
                    <p className="text-xs text-foreground/60">Human-led estimation</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-4 text-sm text-foreground/70">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-sky-600">
                    <Sparkles className="h-4 w-4" />
                    Copilot Insight
                  </p>
                  <p className="mt-2">
                    {scenario.aiInsights[0]?.detail ??
                      "Localization stewards receive nudges the moment indicator confidence drifts below guardrails."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "resilience": {
        const aiGradientId = `resilience-ai-${resilienceMode}`;
        const baselineGradientId = `resilience-baseline-${resilienceMode}`;

        return (
          <div className="space-y-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.22)] lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{activeViewConfig.label}</p>
                <h3 className="text-lg font-semibold text-slate-900">{resilienceModeLabel} wellbeing outlook</h3>
                <p className="text-sm text-foreground/65">{scenario.tagline}</p>
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
                  {resilienceModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setResilienceMode(mode.id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition",
                        resilienceMode === mode.id
                          ? "bg-emerald-50 text-emerald-600 shadow-[0_16px_45px_-30px_rgba(52,211,153,0.35)]"
                          : "text-foreground/60 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-emerald-600 shadow-[0_16px_50px_-38px_rgba(34,197,94,0.35)]">
                  Δ Lift
                  <p className="mt-1 text-2xl font-semibold text-emerald-700">
                    {resilienceLift} pts
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
              <div className="rounded-[26px] border border-slate-200 bg-[rgb(var(--surface-soft))] p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={260}>
                  <RechartsLineChart data={resilienceSeries}>
                    <defs>
                      <linearGradient id={aiGradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="15%" stopColor="rgba(52,211,153,0.9)" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="rgba(52,211,153,0)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id={baselineGradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="15%" stopColor="rgba(148,163,184,0.75)" stopOpacity={0.75} />
                        <stop offset="95%" stopColor="rgba(148,163,184,0)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.25)" strokeDasharray="3 6" />
                    <XAxis dataKey="label" stroke="rgba(71,85,105,0.6)" tickLine={false} />
                    <YAxis
                      stroke="rgba(71,85,105,0.6)"
                      tickLine={false}
                      tickFormatter={(value) =>
                        resilienceMode === "heat" ? `${Number(value).toFixed(0)}°C` : `${Math.round(Number(value))}`
                      }
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(52,211,153,0.35)", strokeDasharray: "4 4" }}
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "18px",
                        border: "1px solid rgba(148,163,184,0.35)",
                        color: "rgba(30,41,59,0.92)",
                        padding: "0.75rem 1rem",
                      }}
                    />
                    <RechartsLine
                      type="monotone"
                      dataKey="baseline"
                      stroke="rgba(148,163,184,0.75)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <RechartsLine
                      type="monotone"
                      dataKey="ai"
                      stroke="rgba(52,211,153,0.9)"
                      strokeWidth={2.4}
                      dot={{ r: 3.5 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 rounded-[26px] border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Scenario Playbooks</p>
                  <ul className="mt-3 space-y-3 text-sm text-foreground/70">
                    {(resiliencePlaybooks[scenario.key] ?? []).map((play, index) => (
                      <li key={play} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-600">
                          {index + 1}
                        </span>
                        {play}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {modelPerformanceStats.slice(0, 2).map((stat) => (
                    <div key={stat.id} className="rounded-[24px] border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">{stat.metric}</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-emerald-600">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "anomalies": {
        return (
          <div className="grid gap-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_-45px_rgba(250,204,21,0.4)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="rounded-[26px] border border-white/10 bg-black/30 p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsRadarChart data={anomalyRadarSeries}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="cluster" tick={{ fill: "rgba(226,232,255,0.65)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: "18px",
                      border: "1px solid rgba(148,163,184,0.35)",
                      color: "rgba(30,41,59,0.92)",
                      padding: "0.75rem 1rem",
                    }}
                  />
                  <RechartsRadar
                    name="Severity"
                    dataKey="severity"
                    stroke="rgba(245,158,11,0.8)"
                    fill="rgba(245,158,11,0.45)"
                    fillOpacity={0.7}
                  />
                  <RechartsRadar
                    name="Triage Velocity"
                    dataKey="triage"
                    stroke="rgba(59,130,246,0.85)"
                    fill="rgba(59,130,246,0.35)"
                    fillOpacity={0.4}
                  />
                </RechartsRadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Incident spotlight</p>
                {highestSeverityCluster ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                          anomalySeverityBadgeTone[highestSeverityCluster.severity],
                        )}
                      >
                        {anomalySeverityLabel[highestSeverityCluster.severity]}
                      </span>
                      <span className="text-sm text-foreground/60">
                        {highestSeverityCluster.expectedResolutionMinutes} min est. resolution
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{highestSeverityCluster.cluster}</p>
                    <p className="text-sm text-foreground/65">
                      AI triage playbooks are sequencing {highestSeverityCluster.affectedAssets} assets and notifying field teams automatically.
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-foreground/65">No active anomaly clusters.</p>
                )}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Cluster queue</p>
                <ul className="mt-3 space-y-3 text-sm text-foreground/70">
                  {anomalyClusters.map((cluster) => (
                    <li key={cluster.id} className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white">{cluster.cluster}</p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
                            anomalySeverityBadgeTone[cluster.severity],
                          )}
                        >
                          {anomalySeverityLabel[cluster.severity]}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                        <span>{cluster.affectedAssets} assets</span>
                        <span className="flex items-center gap-1">
                          <Clock8 className="h-3.5 w-3.5 text-amber-300" />
                          {cluster.expectedResolutionMinutes} min
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-rose-500"
                          style={{ width: `${anomalySeverityWeight[cluster.severity]}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      }
      case "risk": {
        return (
          <div className="grid gap-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.22)] lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div className="rounded-[26px] border border-white/10 bg-black/30 p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={riskQuadrantSeries}>
                  <defs>
                    <linearGradient id="riskScoreGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="rgba(129,140,248,0.9)" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="rgba(129,140,248,0.1)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.25)" vertical={false} />
                  <XAxis dataKey="quadrant" stroke="rgba(71,85,105,0.6)" tickLine={false} />
                  <YAxis
                    stroke="rgba(71,85,105,0.6)"
                    domain={[0.4, 1]}
                    tickFormatter={(value) => `${Math.round((value as number) * 100)}%`}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: "18px",
                      border: "1px solid rgba(148,163,184,0.35)",
                      color: "rgba(30,41,59,0.92)",
                      padding: "0.75rem 1rem",
                    }}
                    formatter={(value: number | string) =>
                      typeof value === "number"
                        ? [`${Math.round(value * 100)}%`, "Risk Score"]
                        : [value, "Risk Score"]
                    }
                  />
                  <Bar dataKey="score" fill="url(#riskScoreGradient)" radius={[14, 14, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">High-signal districts</p>
                <ul className="mt-3 space-y-3 text-sm text-foreground/70">
                  {topRiskCells.map((cell) => (
                    <li key={cell.id} className="rounded-[20px] border border-white/10 bg-black/30 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white">{cell.district}</p>
                        <span className="text-xs uppercase tracking-[0.35em] text-indigo-200">{cell.quadrant}</span>
                      </div>
                      <p className="mt-1 text-xs text-foreground/60">{cell.driver}</p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-500 to-emerald-400"
                          style={{ width: `${Math.round(cell.score * 100)}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-foreground/50">
                        <span>Exposure</span>
                        <span>{Math.round(cell.score * 100)}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4 text-sm text-foreground/70">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-indigo-200">
                  <ShieldCheck className="h-4 w-4" />
                  Governance cue
                </p>
                <p className="mt-2">
                  Mitigation briefs trigger automatically when risk passes 70% and route to {scenario.name} owners.
                </p>
              </div>
            </div>
          </div>
        );
      }
      case "explainability": {
        return (
          <div className="grid gap-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_-45px_rgba(244,114,182,0.45)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4 sm:p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Mission narrative</p>
              <h4 className="mt-2 text-lg font-semibold text-white">{explainHeadline}</h4>
              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                {scenario.aiInsights.map((insight) => (
                  <li key={insight.title} className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-[0.35em] text-primary-200">Confidence</span>
                      <span className="text-xs text-foreground/60">{Math.round(insight.confidence * 100)}%</span>
                    </div>
                    <p className="mt-2 font-semibold text-white">{insight.title}</p>
                    <p className="mt-1 text-sm text-foreground/65">{insight.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Transparency queue</p>
                <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                  {explainabilityStories.map((snippet, index) => (
                    <li key={snippet.id} className="rounded-[20px] border border-white/10 bg-black/30 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-400/40 bg-rose-500/10 text-sm font-semibold text-rose-100">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{snippet.title}</p>
                          <p className="text-xs text-foreground/60">{snippet.detail}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {modelPerformanceStats.map((stat) => (
                  <div key={stat.id} className="rounded-[20px] border border-white/10 bg-black/30 px-3 py-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{stat.metric}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs text-foreground/60">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4 text-sm text-foreground/70">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary-200">
                  <FileText className="h-4 w-4" />
                  Audit trail
                </p>
                <p className="mt-2">
                  Export-ready VLR chapters assemble with provenance for the Nexus team.
                </p>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.4em] text-foreground/50">AI Analytics</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Model telemetry and explainable lifts</h2>
        <p className="mt-3 text-sm text-foreground/70">
          Forecasts, resilience outlooks, anomaly triage, and governance cues stay aligned to the {scenario.name} mission.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white p-2">
        {analyticsViews.map((view) => {
          const isActive = view.id === activeView;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id)}
              className={cn(
                "group flex-1 min-w-[220px] rounded-[24px] px-4 py-3 text-left transition",
                isActive
                  ? "bg-sky-50 text-sky-700 shadow-[0_18px_50px_-35px_rgba(59,130,246,0.25)]"
                  : "bg-transparent text-foreground/65 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] text-slate-600 transition",
                    isActive ? "border-sky-200 bg-white text-sky-600" : "",
                  )}
                >
                  <view.icon className={cn("h-4 w-4", isActive ? "text-sky-600" : "text-foreground/60")} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{view.label}</p>
                  <p className="text-xs text-foreground/55">{view.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {renderActiveView()}
    </div>
  );
}

type CopilotPreviewPanelProps = {
  scenario: ScenarioDefinition;
  module?: CopilotModule;
  onSummonDock: () => void;
  onToggleRail: () => void;
  isRailOpen: boolean;
};

const connectorStatusStyles: Record<DataConnectorStatus, string> = {
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  syncing: "border-sky-200 bg-sky-50 text-sky-700",
  issue: "border-amber-200 bg-amber-50 text-amber-700",
};

const connectorStatusLabels: Record<DataConnectorStatus, string> = {
  healthy: "Healthy",
  syncing: "Syncing",
  issue: "Needs attention",
};

const automationStatusStyles: Record<DataAutomationStatus, string> = {
  "on-time": "border-emerald-200 bg-emerald-50 text-emerald-700",
  attention: "border-amber-200 bg-amber-50 text-amber-700",
  paused: "border-slate-200 bg-slate-50 text-slate-600",
};

const automationStatusLabels: Record<DataAutomationStatus, string> = {
  "on-time": "On time",
  attention: "Check status",
  paused: "Paused",
};

const alertSeverityStyles: Record<DataQualityAlertSeverity, string> = {
  low: "border-sky-200 bg-sky-50 text-sky-700",
  moderate: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
};

const alertSeverityLabels: Record<DataQualityAlertSeverity, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

const trendDescriptors: Record<DataFabricMetric["trend"], { label: string; tone: string }> = {
  up: { label: "Up today", tone: "text-emerald-600" },
  down: { label: "Faster today", tone: "text-emerald-600" },
  steady: { label: "Holding steady", tone: "text-slate-500" },
};

const integrationPlaybooks: Record<ScenarioKey, string[]> = {
  "sdg-localization": [
    "Unify census refreshes, community studios, and IoT feeds into indicator story packs.",
    "Notify localization stewards when equity coverage dips under 0.8 in any district.",
    "Publish SDG-ready datasets with provenance for the weekly council packet.",
  ],
  "vlr-automation": [
    "Reconcile finance ledgers, climate disclosures, and policy notes every cycle.",
    "Auto-assign assurance review whenever evidence lacks narrative context.",
    "Seal compliance-ready exports with citation manifests and governance sign-offs.",
  ],
  "city-profiling": [
    "Blend wellbeing, budget pacing, and sentiment signals into a single investment view.",
    "Flag neighborhoods where impact trajectories lag the capital roadmap.",
    "Serve synchronized datasets to budget, design, and equity teams simultaneously.",
  ],
};

function formatFreshness(minutes: number): string {
  if (minutes < 1) {
    return "<1 min";
  }
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (remainder === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainder}m`;
  }
  return `${minutes} min`;
}

function CopilotPreviewPanel({ scenario, module, onSummonDock, onToggleRail, isRailOpen }: CopilotPreviewPanelProps) {
  const healthyConnectors = dataConnectors.filter((connector) => connector.status === "healthy").length;
  const syncingConnectors = dataConnectors.filter((connector) => connector.status === "syncing").length;
  const issueConnectors = dataConnectors.filter((connector) => connector.status === "issue").length;

  const guardrailSummary = module?.assurance ? `${module.assurance.label} score` : "Automation guardrails";
  const guardrailDetail = module?.assurance ? module.assurance.detail : "Audit trail confirms every automation run.";

  const playbook = integrationPlaybooks[scenario.key] ?? [];
  const metricCards = dataFabricMetrics.slice(0, 3);
  const connectorSummaries = dataConnectors.slice(0, 4);
  const automationShowcase = dataAutomations.slice(0, 3);
  const qualityAlerts = dataQualityAlerts.slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.18)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Data Fabric</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{scenario.name} data fabric</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Clean, synced feeds keep the AI forecasts and VLR outputs for this scenario up to date.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onToggleRail}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-sky-200 hover:text-slate-900 xl:inline-flex"
              >
                <Layers className="h-4 w-4 text-slate-500" />
                {isRailOpen ? "Hide Copilot Rail" : "Pin Copilot Rail"}
              </button>
              <button
                type="button"
                onClick={onSummonDock}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 xl:hidden"
              >
                <Bot className="h-4 w-4" />
                Open Copilot
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metricCards.map((metric) => {
              const descriptor = trendDescriptors[metric.trend];
              return (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3 text-sm text-foreground/70"
                >
                  <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{metric.value}</p>
                  <p className="mt-1 text-xs text-foreground/55">{metric.detail}</p>
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.35em]",
                      descriptor.tone,
                    )}
                  >
                    {descriptor.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3 text-xs uppercase tracking-[0.3em] text-foreground/55">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              {guardrailSummary}: {module?.assurance?.score ?? "Active"}
            </span>
            <span className="normal-case tracking-normal text-foreground/60">{guardrailDetail}</span>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_25px_70px_-48px_rgba(15,23,42,0.16)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            <GaugeCircle className="h-4 w-4 text-slate-500" />
            Connector health
          </p>
          <ul className="mt-4 space-y-3">
            {connectorSummaries.map((connector) => (
              <li
                key={connector.id}
                className="rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3 text-sm text-foreground/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{connector.name}</p>
                    <p className="text-xs text-foreground/55">{connector.department}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.3em]",
                      connectorStatusStyles[connector.status],
                    )}
                  >
                    {connectorStatusLabels[connector.status]}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-foreground/55">{connector.dataScope}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-foreground/60">
                  <span>Freshness {formatFreshness(connector.freshnessMinutes)}</span>
                  <span>{connector.coverage}</span>
                  <span>Steward {connector.steward}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_25px_70px_-48px_rgba(15,23,42,0.16)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            <Workflow className="h-4 w-4 text-slate-500" />
            Automation runbook
          </p>
          <ul className="mt-4 space-y-3">
            {automationShowcase.map((automation) => (
              <li
                key={automation.id}
                className="rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3 text-sm text-foreground/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                    <p className="text-xs text-foreground/55">{automation.owner}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.3em]",
                      automationStatusStyles[automation.status],
                    )}
                  >
                    {automationStatusLabels[automation.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-foreground/60">
                  <span>{automation.cadence}</span>
                  <span>Last {automation.lastRun}</span>
                  <span>Next {automation.nextRun}</span>
                </div>
                <p className="mt-3 text-xs text-foreground/60">{automation.outcome}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_25px_70px_-48px_rgba(15,23,42,0.16)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            <Sparkles className="h-4 w-4 text-slate-500" />
            Assurance & guardrails
          </p>
          <div className="mt-4 grid gap-4 rounded-[24px] border border-slate-200 bg-[rgb(var(--surface-soft))] p-4 text-sm text-foreground/70">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{guardrailSummary}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{module?.assurance?.score ?? "--"}%</p>
              <p className="mt-1 text-xs text-foreground/60">{guardrailDetail}</p>
            </div>
            <div className="grid gap-2 text-xs text-foreground/60 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-600">Healthy</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{healthyConnectors}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-sky-600">Syncing</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{syncingConnectors}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-600">Attention</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{issueConnectors}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onSummonDock}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-sky-200 hover:text-slate-900"
          >
            <MoveRight className="h-4 w-4" />
            View automation log
          </button>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-5 text-sm text-foreground/70 shadow-[0_25px_70px_-48px_rgba(15,23,42,0.16)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            <BrainCircuit className="h-4 w-4 text-slate-500" />
            Integration playbook
          </p>
          <ul className="mt-4 space-y-3">
            {playbook.map((step) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-500" />
                <span className="text-sm leading-6 text-foreground/70">{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-5 text-sm text-foreground/70 shadow-[0_25px_70px_-48px_rgba(15,23,42,0.16)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Data quality watch
          </p>
          <ul className="mt-4 space-y-3">
            {qualityAlerts.map((alert) => (
              <li
                key={alert.id}
                className="rounded-2xl border border-slate-200 bg-[rgb(var(--surface-soft))] px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{alert.topic}</p>
                    <p className="text-xs text-foreground/55">{alert.impact}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.3em]",
                      alertSeverityStyles[alert.severity],
                    )}
                  >
                    {alertSeverityLabels[alert.severity]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground/65">{alert.detail}</p>
                <p className="mt-3 text-xs text-foreground/60">{alert.eta}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
