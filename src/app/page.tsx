"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  FileText,
  GaugeCircle,
  Layers,
  LineChart,
  Loader2,
  Map as MapIcon,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
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
  low: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  moderate: "border border-amber-200 bg-amber-50 text-amber-700",
  high: "border border-rose-200 bg-rose-50 text-rose-700",
};

const anomalySeverityLabel: Record<AnomalyCluster["severity"], string> = {
  low: "Low",
  moderate: "Elevated",
  high: "Critical",
};

type ScenarioInsightsPayload = {
  signals: ScenarioDefinition["liveSignals"];
  aiInsights: ScenarioDefinition["aiInsights"];
  kpis: ScenarioDefinition["kpis"];
  actions: ScenarioDefinition["actions"];
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

type StatusChipProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function StatusChip({ icon, label, value }: StatusChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-[11px] text-slate-500">
      <span aria-hidden className="text-slate-500">
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      </div>
    </div>
  );
}

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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:flex-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Nexus Consulting</p>
              <h1 className="text-sm font-semibold text-slate-900 sm:text-base">City Digital Twin Command</h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-stretch gap-1 rounded-full border border-slate-200/70 bg-white/80 p-1 sm:ml-3 sm:flex-1 sm:max-w-[520px]">
            {scenarioSummaries.map((scenario) => {
              const isActive = scenario.key === scenarioKey;

              return (
                <button
                  key={scenario.key}
                  type="button"
                  onClick={() => onScenarioChange(scenario.key)}
                  className={cn(
                    "flex min-w-[108px] flex-col justify-center rounded-full px-3 py-1.5 text-left text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200",
                    isActive
                      ? "bg-white text-slate-900 shadow-[0_8px_22px_-18px_rgba(14,165,233,0.32)]"
                      : "text-slate-600 hover:bg-white hover:text-slate-900",
                  )}
                >
                  <span
                    className={cn(
                      "text-[9px] uppercase tracking-[0.24em]",
                      isActive ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Scenario
                  </span>
                  <span className="mt-0.5 text-sm leading-tight">{scenario.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <StatusChip
            icon={<MapPinned className="h-4 w-4 text-sky-500" />}
            label="Focus"
            value="Aurora District Twin"
          />
          <StatusChip icon={<Clock8 className="h-4 w-4 text-violet-500" />} label="Sync" value={syncTimestamp} />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onCopilotToggle}
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 transition hover:border-sky-200 hover:text-slate-900 xl:inline-flex"
            >
              <Bot className="h-4 w-4 text-sky-500" />
              {isCopilotRailOpen ? "Hide Copilot Dock" : "Show Copilot Dock"}
            </button>
            <button
              type="button"
              onClick={onCopilotSummon}
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 xl:hidden"
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
    <section className="rounded-[22px] border border-slate-200 bg-white px-5 py-6 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.14)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Module Suite</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">{activeModuleMeta.label}</h2>
          <p className="mt-1 text-sm text-slate-600">{activeModuleMeta.description}</p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Module navigation"
        className="mt-4 flex flex-wrap gap-1 rounded-[18px] border border-slate-200/80 bg-white/80 p-1"
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
                "group flex items-center gap-2 rounded-[14px] px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200",
                isActive
                  ? "bg-white text-slate-900 shadow-[0_8px_20px_-16px_rgba(59,130,246,0.28)]"
                  : "text-slate-600 hover:bg-white hover:text-slate-900",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs transition-colors",
                  isActive
                    ? "border-sky-200 text-sky-600"
                    : "text-slate-500 group-hover:border-sky-100 group-hover:text-slate-700",
                )}
              >
                <module.icon className="h-4 w-4" />
              </span>
              <span className="leading-tight">{module.label}</span>
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
  const liveSignals = insights.signals.slice(0, 3);
  const aiNotes = insights.aiInsights.slice(0, 2);
  const priorityActions = insights.actions.slice(0, 3);
  const scenarioKpis = scenario.kpis.slice(0, 2);
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Scenario view</p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{scenario.name}</h2>
          <p className="text-sm text-slate-600">{scenario.tagline}</p>
          <p className="text-sm text-slate-500">{scenario.command}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.18)] sm:min-w-[280px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-500">Focus window</span>
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
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-400">
            <span>Now</span>
            <span>+60m</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.16)]">
            <CommandCenterMap scenario={scenario} focus={focus} highlights={spatialHighlights} />
            <MapHud scenario={scenario} insights={insights} focus={focus} />
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_48px_-32px_rgba(15,23,42,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Live indicators</p>
            <div className="mt-4 space-y-4">
              {liveSignals.map((signal) => (
                <SignalBadge key={signal.label} signal={signal} />
              ))}
            </div>
            {scenarioKpis.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {scenarioKpis.map((kpi) => (
                  <div
                    key={kpi.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{kpi.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {kpi.value.toLocaleString()} <span className="text-sm text-slate-500">{kpi.unit}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {kpi.change.direction === "up" ? "Improved" : "Down"} {kpi.change.percentage}% vs last{" "}
                      {kpi.change.period}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          {aiNotes.length ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_48px_-32px_rgba(15,23,42,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">AI notes</p>
              <div className="mt-4 space-y-3">
                {aiNotes.map((insight, index) => (
                  <InsightCard key={insight.title} insight={insight} index={index} />
                ))}
              </div>
            </div>
          ) : null}

          {priorityActions.length ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_48px_-32px_rgba(15,23,42,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Next steps</p>
              <ul className="mt-4 space-y-3">
                {priorityActions.map((action, index) => (
                  <li key={action} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-sky-600">
                      {index + 1}
                    </span>
                    <span className="leading-6">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
      <div className="flex flex-wrap gap-3">
        <div className="pointer-events-auto rounded-full border border-slate-200/70 bg-white/85 px-4 py-2 text-xs text-slate-600 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.18)] backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Scenario</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{scenario.name}</p>
        </div>
        <div className="pointer-events-auto rounded-full border border-slate-200/70 bg-white/85 px-4 py-2 text-xs text-slate-600 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.18)] backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Focus</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{focusMinutes}m</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {primaryInsight ? (
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.22)] backdrop-blur-sm">
            <p className="text-xs font-medium text-slate-500">
              AI note{confidence !== null ? ` · ${confidence}% confidence` : ""}
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-900">{primaryInsight.title}</p>
            {primaryInsight.detail ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{primaryInsight.detail}</p>
            ) : null}
          </div>
        ) : null}

        {primaryAction ? (
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.22)] backdrop-blur-sm">
            <p className="text-xs font-medium text-slate-500">Next step</p>
            <p className="mt-1 leading-5 text-slate-700">{primaryAction}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SignalBadge({ signal }: { signal: ScenarioInsightsPayload["signals"][number] }) {
  const deltaTone =
    signal.tone === "positive"
      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
      : signal.tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-600"
        : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{signal.label}</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{signal.value}</p>
      </div>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          deltaTone,
        )}
      >
        {signal.delta}
      </span>
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
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
      {insight.detail ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.detail}</p> : null}
      <p className="mt-2 text-xs text-slate-500">
        Insight #{index + 1} · {Math.round(insight.confidence * 100)}% model confidence
      </p>
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
  const [forecastScope, setForecastScope] = useState<ForecastScope>("metro");
  const [resilienceMode, setResilienceMode] = useState<ResilienceMode>("heat");

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
  const aiPercent = latestForecast ? Math.round(latestForecast.ai * 100) : 0;
  const baselinePercent = latestForecast ? Math.round(latestForecast.baseline * 100) : 0;
  const forecastDelta = aiPercent - baselinePercent;

  const scopeLabel =
    forecastScopeOptions.find((option) => option.id === forecastScope)?.label ?? "Citywide portfolio";

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

  const lastResilience = resilienceSeries.at(-1);
  const resilienceModeLabel =
    resilienceModes.find((mode) => mode.id === resilienceMode)?.label ?? "Community Services";
  const resilienceAi = lastResilience ? lastResilience.ai : 0;
  const resilienceBaseline = lastResilience ? lastResilience.baseline : 0;
  const resilienceDelta = (resilienceAi - resilienceBaseline).toFixed(1);

  const topAnomalies = useMemo(() => anomalyClusters.slice(0, 3), []);
  const riskFocus = useMemo(
    () => [...riskCells].sort((a, b) => b.score - a.score).slice(0, 3),
    [],
  );
  const explainabilityStories = useMemo(() => explainabilitySnippets.slice(0, 3), []);

  return (
    <div className="space-y-7">
      <header className="max-w-3xl space-y-2">
        <p className="text-sm font-medium text-slate-500">AI pipeline view</p>
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Runway checks for {scenario.name}</h2>
        <p className="text-sm text-slate-600">
          Forecasts, wellbeing trends, and evidence cues stay grounded in live city data so teams can act without juggling dashboards.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">24-hour service forecast</h3>
              <p className="text-sm text-slate-600">Focus: {scopeLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">AI vs. baseline</p>
              <p className="text-2xl font-semibold text-slate-900">{aiPercent}%</p>
              <p className="text-xs text-slate-500">Baseline {baselinePercent}%</p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-sm font-medium",
                  forecastDelta >= 0 ? "text-emerald-600" : "text-rose-600",
                )}
              >
                {forecastDelta >= 0 ? "+" : ""}
                {forecastDelta} pts
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {forecastScopeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setForecastScope(option.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  forecastScope === option.id
                    ? "bg-sky-100 text-sky-700 shadow-[0_16px_45px_-30px_rgba(59,130,246,0.25)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastSeries}>
                <defs>
                  <linearGradient id="aiForecastGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="rgba(14,165,233,0.6)" />
                    <stop offset="95%" stopColor="rgba(14,165,233,0)" />
                  </linearGradient>
                  <linearGradient id="baselineForecastGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="rgba(148,163,184,0.45)" />
                    <stop offset="95%" stopColor="rgba(148,163,184,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.35)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="hour" stroke="rgba(100,116,139,0.75)" tickLine={false} />
                <YAxis
                  stroke="rgba(100,116,139,0.75)"
                  tickLine={false}
                  tickFormatter={(value) => `${Math.round((value as number) * 100)}%`}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(14,165,233,0.25)", strokeWidth: 2 }}
                  contentStyle={{
                    borderRadius: "18px",
                    border: "1px solid rgba(148,163,184,0.35)",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    color: "rgba(30,41,59,0.92)",
                    padding: "0.75rem 1rem",
                  }}
                  formatter={(value: number | string, name) =>
                    typeof value === "number" ? [`${Math.round(value * 100)}%`, name] : [value, name]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="ai"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fill="url(#aiForecastGradient)"
                  name="AI"
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="url(#baselineForecastGradient)"
                  name="Baseline"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Wellbeing outlook</h3>
                <p className="text-sm text-slate-600">{resilienceModeLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">AI reading</p>
                <p className="text-lg font-semibold text-slate-900">{resilienceAi.toFixed(1)}</p>
                <p className="text-xs text-slate-500">Gap {resilienceDelta} pts</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {resilienceModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setResilienceMode(mode.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition",
                    resilienceMode === mode.id
                      ? "bg-emerald-100 text-emerald-700 shadow-[0_16px_45px_-30px_rgba(16,185,129,0.25)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <div className="mt-5 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={resilienceSeries}>
                  <CartesianGrid stroke="rgba(148,163,184,0.3)" strokeDasharray="3 6" />
                  <XAxis dataKey="label" stroke="rgba(100,116,139,0.75)" tickLine={false} />
                  <YAxis stroke="rgba(100,116,139,0.75)" tickLine={false} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{
                      borderRadius: "18px",
                      border: "1px solid rgba(148,163,184,0.35)",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      color: "rgba(30,41,59,0.92)",
                      padding: "0.75rem 1rem",
                    }}
                    formatter={(value: number | string, name) =>
                      typeof value === "number" ? [`${Number(value).toFixed(1)}`, name] : [value, name]
                    }
                  />
                  <RechartsLine type="monotone" dataKey="ai" stroke="#10b981" strokeWidth={2.5} dot={false} name="AI" />
                  <RechartsLine
                    type="monotone"
                    dataKey="baseline"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 6"
                    dot={false}
                    name="Baseline"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
            <h3 className="text-lg font-semibold text-slate-900">Model checks</h3>
            <ul className="mt-4 space-y-3">
              {modelPerformanceStats.map((stat) => (
                <li
                  key={stat.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{stat.metric}</p>
                    <p className="text-xs text-slate-500">vs last run</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        stat.tone === "up" ? "text-emerald-600" : stat.tone === "down" ? "text-emerald-600" : "text-slate-500",
                      )}
                    >
                      {stat.change}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
          <h3 className="text-lg font-semibold text-slate-900">Evidence follow-ups</h3>
          <ul className="mt-4 space-y-3">
            {topAnomalies.map((cluster) => (
              <li key={cluster.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">{cluster.cluster}</p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
                      anomalySeverityBadgeTone[cluster.severity],
                    )}
                  >
                    {anomalySeverityLabel[cluster.severity]}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{cluster.affectedAssets} items</span>
                  <span>{cluster.expectedResolutionMinutes} min target</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
          <h3 className="text-lg font-semibold text-slate-900">District focus</h3>
          <ul className="mt-4 space-y-3">
            {riskFocus.map((cell) => (
              <li key={cell.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-900">{cell.district}</p>
                <p className="mt-1 text-xs text-slate-500">{cell.driver}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Score</span>
                  <span>{Math.round(cell.score * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.round(cell.score * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
          <h3 className="text-lg font-semibold text-slate-900">Explainable AI notes</h3>
          <ul className="mt-4 space-y-3">
            {explainabilityStories.map((story) => (
              <li key={story.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-900">{story.title}</p>
                <p className="mt-1 text-sm text-slate-600">{story.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
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

const integrationPlaybooks: Record<ScenarioKey, string[]> = {
  "sdg-localization": [
    "Refresh census, IoT, and steward notes each morning.",
    "Alert district leads when SDG coverage drops below 80%.",
    "Publish a clean SDG packet every Friday with sources.",
  ],
  "vlr-automation": [
    "Match finance, climate, and policy data before drafting.",
    "Ask reviewers to explain any evidence gaps the AI flags.",
    "Export the VLR packet with citations once checks pass.",
  ],
  "city-profiling": [
    "Blend wellbeing, budget, and sentiment feeds into one view.",
    "Highlight districts where impact lags planned investment.",
    "Share the twin snapshot with budget, design, and equity teams.",
  ],
};









function CopilotPreviewPanel({ scenario, module, onSummonDock, onToggleRail, isRailOpen }: CopilotPreviewPanelProps) {
  const healthyConnectors = dataConnectors.filter((connector) => connector.status === "healthy").length;
  const syncingConnectors = dataConnectors.filter((connector) => connector.status === "syncing").length;
  const issueConnectors = dataConnectors.filter((connector) => connector.status === "issue").length;

  const metricCards = dataFabricMetrics.slice(0, 3);
  const connectorSummaries = dataConnectors.slice(0, 4);
  const automationShowcase = dataAutomations.slice(0, 3);
  const qualityAlerts = dataQualityAlerts.slice(0, 3);
  const playbook = integrationPlaybooks[scenario.key] ?? [];

  const assuranceLabel = module?.assurance?.label ?? "Guardrail score";
  const assuranceScore = module?.assurance?.score ?? "On track";
  const assuranceDetail = module?.assurance?.detail ?? "Audit trail confirms every run.";

  return (
    <div className="space-y-7">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Data fabric for {scenario.name}</h2>
            <p className="text-sm text-slate-600">
              Connectors and automations keep the AI dashboards current without manual prep.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleRail}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-slate-900 xl:inline-flex"
            >
              <Layers className="h-4 w-4 text-slate-500" />
              {isRailOpen ? "Hide Copilot rail" : "Pin Copilot rail"}
            </button>
            <button
              type="button"
              onClick={onSummonDock}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-medium text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 xl:hidden"
            >
              <Bot className="h-4 w-4" />
              Open Copilot
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="font-medium text-slate-900">{assuranceLabel}</span>
          <span>· {assuranceScore}</span>
          <span className="text-slate-500">{assuranceDetail}</span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Connectors</h3>
              <p className="text-sm text-slate-600">Feeds refresh every 15 minutes with steward sign-off.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                {healthyConnectors} healthy
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
                {syncingConnectors} syncing
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                {issueConnectors} needs attention
              </span>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {connectorSummaries.map((connector) => (
              <li key={connector.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{connector.name}</p>
                    <p className="text-xs text-slate-500">{connector.dataScope}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      connectorStatusStyles[connector.status],
                    )}
                  >
                    {connectorStatusLabels[connector.status]}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{connector.department}</span>
                  <span>{connector.coverage}</span>
                  <span>Refresh {connector.freshnessMinutes} min</span>
                  <span>Steward {connector.steward}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Automation runs</h3>
              <p className="text-sm text-slate-600">Pipelines keep SDG and VLR packets current.</p>
            </div>
          </div>
          <ul className="mt-5 space-y-3">
            {automationShowcase.map((automation) => (
              <li key={automation.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{automation.title}</p>
                    <p className="text-xs text-slate-500">{automation.cadence} · Owner {automation.owner}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      automationStatusStyles[automation.status],
                    )}
                  >
                    {automationStatusLabels[automation.status]}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Last {automation.lastRun}</span>
                  <span>Next {automation.nextRun}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{automation.outcome}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p>The copilot keeps a narrative log so stewards can review each automation change.</p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
          <h3 className="text-lg font-semibold text-slate-900">Pipeline metrics</h3>
          <ul className="mt-4 space-y-3">
            {metricCards.map((metric) => (
              <li key={metric.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{metric.label}</p>
                  <span className="text-sm font-semibold text-slate-900">{metric.value}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
          <h3 className="text-lg font-semibold text-slate-900">Quality alerts</h3>
          <ul className="mt-4 space-y-3">
            {qualityAlerts.map((alert) => (
              <li key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{alert.topic}</p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      alertSeverityStyles[alert.severity],
                    )}
                  >
                    {alertSeverityLabels[alert.severity]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{alert.detail}</p>
                <p className="mt-1 text-xs text-slate-500">{alert.impact}</p>
                <p className="mt-2 text-xs text-slate-500">{alert.eta}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-50px_rgba(15,23,42,0.18)]">
          <h3 className="text-lg font-semibold text-slate-900">Playbook actions</h3>
          <ul className="mt-4 space-y-3">
            {playbook.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onSummonDock}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-slate-900"
          >
            <Bot className="h-4 w-4 text-sky-500" />
            Ask Copilot to brief the team
          </button>
        </section>
      </div>
    </div>
  );
}
