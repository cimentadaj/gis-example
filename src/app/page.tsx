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
import { CommandCenterMap } from "@/components/command-center/command-center-map";
import { CopilotDockContent, type CopilotDockView } from "@/components/copilot/copilot-dock";
import { cn } from "@/lib/utils";

const moduleNavigation = [
  {
    id: "digital-twin",
    label: "Digital Twin Canvas",
    description: "Live city operations and anomaly scanning in the spatial twin.",
    icon: MapIcon,
    accent: "from-sky-400/40 via-transparent to-sky-500/20",
  },
  {
    id: "vlr-workbench",
    label: "VLR Automation",
    description: "AI-automated voluntary local review pipelines and compliance scoring.",
    icon: Workflow,
    accent: "from-violet-400/35 via-transparent to-violet-500/15",
  },
  {
    id: "analytics",
    label: "AI Analytics",
    description: "Forecasts, risk posture, and performance lifts across scenarios.",
    icon: LineChart,
    accent: "from-emerald-400/35 via-transparent to-emerald-500/15",
  },
  {
    id: "copilot",
    label: "Copilot Orchestration",
    description: "Conversational mission control and coordinated action queues.",
    icon: Bot,
    accent: "from-rose-400/35 via-transparent to-rose-500/15",
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
    label: "Predictive Flow",
    description: "AI vs baseline demand and throughput.",
    icon: LineChart,
    accent: "from-sky-500/25 via-sky-400/10 to-sky-500/0",
  },
  {
    id: "resilience",
    label: "Resilience Outlook",
    description: "Climate and grid stability projections.",
    icon: ActivitySquare,
    accent: "from-emerald-500/25 via-emerald-400/10 to-emerald-500/0",
  },
  {
    id: "anomalies",
    label: "Anomaly Radar",
    description: "Cluster severity & triage velocity.",
    icon: AlertTriangle,
    accent: "from-amber-500/25 via-amber-400/10 to-amber-500/0",
  },
  {
    id: "risk",
    label: "Risk Posture",
    description: "District-level exposure scores.",
    icon: ShieldCheck,
    accent: "from-indigo-500/25 via-indigo-400/10 to-indigo-500/0",
  },
  {
    id: "explainability",
    label: "Explainability Lab",
    description: "Narratives & governance tracking.",
    icon: Sparkles,
    accent: "from-rose-500/25 via-rose-400/10 to-rose-500/0",
  },
];

const forecastScopeOptions = [
  { id: "metro", label: "Metro Network" },
  { id: "harbor", label: "Harbor District" },
  { id: "innovation", label: "Innovation Basin" },
] as const;

type ForecastScope = (typeof forecastScopeOptions)[number]["id"];

const forecastScopeMultiplier: Record<ForecastScope, number> = {
  metro: 1,
  harbor: 0.88,
  innovation: 0.94,
};

type ResilienceMode = "heat" | "grid";

const resilienceModes: Array<{ id: ResilienceMode; label: string }> = [
  { id: "heat", label: "Heat Stress" },
  { id: "grid", label: "Grid Stability" },
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
  mobility: [
    "Adaptive signal retiming holds corridor saturation under 88% through peak commute.",
    "Fleet reprioritization reserves 14% battery buffer for multimodal feeders.",
    "Dynamic curb pricing keeps freight dwell time beneath 6 minutes.",
  ],
  energy: [
    "DER pre-charge builds a 23 MWh buffer before the evening surge.",
    "Carbon-aware dispatch holds intensity below 280 gCO₂/kWh automatically.",
    "Transformer stress triggers automated thermal relief sequencing.",
  ],
  climate: [
    "Storm surge barriers are staged across Harbor District piers within 3 hours.",
    "Cooling center expansion increases safe capacity by 18% for vulnerable zones.",
    "Hydro sensors feed automated evacuation overlays for coastal wards.",
  ],
  safety: [
    "Crowd density monitors pre-empt festival overflow by 12 minutes.",
    "Incident auto-plans hold emergency arrival times below 6 minutes.",
    "Sentiment triage flags civic events requiring proactive outreach.",
  ],
};

const explainabilityHeadline: Record<ScenarioKey, string> = {
  mobility: "Explainable AI keeps operators confident in multimodal moves.",
  energy: "Transparency on load drivers maintains grid governance trust.",
  climate: "Climate intelligence narrates why the twin escalates barriers.",
  safety: "Safety mission threads show how AI reaches every field unit.",
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

  const copilotScenarioKey = (
    ["mobility", "energy", "climate", "safety"].includes(activeScenarioKey)
      ? activeScenarioKey
      : "mobility"
  ) as CopilotScenarioKey;

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
                    className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_35px_90px_-65px_rgba(59,130,246,0.65)] backdrop-blur-2xl md:p-8"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/55">Citywide KPI Pulse</p>
                        <h3 className="mt-1 text-lg font-semibold text-white">Live operations benchmark</h3>
                        <p className="mt-1 text-sm text-foreground/60">
                          Signals derived from Nexus telemetry and ML uplift vs baseline.
                        </p>
                      </div>
                      <div className="hidden text-right text-xs uppercase tracking-[0.3em] text-foreground/45 sm:block">
                        Updated with scenario focus &middot; {syncTimestamp}
                      </div>
                    </div>
                    <div className="mt-5">
                      <KpiPulseStrip kpis={citywideKpis} />
                    </div>
                  </section>

                  <section
                    aria-label="Digital twin module"
                    className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_45px_120px_-75px_rgba(79,70,229,0.65)] backdrop-blur-2xl md:p-8"
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
                  className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_45px_120px_-80px_rgba(168,85,247,0.6)] backdrop-blur-2xl md:p-8"
                >
                  <VlrPreviewPanel />
                </section>
              ) : null}

              {activeModule === "analytics" ? (
                <section
                  id="analytics"
                  aria-label="Analytics module"
                  className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_45px_120px_-80px_rgba(45,212,191,0.55)] backdrop-blur-2xl md:p-8"
                >
                  <AnalyticsPreviewPanel scenario={scenario} />
                </section>
              ) : null}

              {activeModule === "copilot" ? (
                <section
                  id="copilot"
                  aria-label="Copilot module"
                  className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_45px_120px_-80px_rgba(251,113,133,0.58)] backdrop-blur-2xl md:p-8"
                >
                  <CopilotPreviewPanel
                    scenario={scenario}
                    module={copilotModule}
                    quickPrompts={copilotPrompts}
                    recommendations={copilotRecommendationsForScenario}
                    missions={copilotMissionsForScenario}
                    auditLog={copilotAuditTrail}
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,14,26,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-2.5 px-5 py-3 sm:px-8 sm:py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_12px_32px_-18px_rgba(59,130,246,0.65)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/50">Nexus Consulting</p>
            <h1 className="text-base font-semibold text-white sm:text-lg">City Digital Twin Command</h1>
            <p className="text-[10px] text-foreground/60">Automated VLR intelligence for Metropolitan Nexus</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2.5">
          <nav className="flex flex-wrap gap-1.5 rounded-[999px] border border-white/12 bg-white/[0.06] p-1.5">
            {scenarioSummaries.map((scenario) => (
              <button
                key={scenario.key}
                type="button"
                onClick={() => onScenarioChange(scenario.key)}
                className={cn(
                  "min-w-[120px] rounded-[999px] px-3 py-1.5 text-left text-[11px] font-medium transition-all",
                  scenario.key === scenarioKey
                    ? "bg-white text-slate-900 shadow-[0_18px_45px_-28px_rgba(14,165,233,0.65)]"
                    : "text-foreground/60 hover:bg-white/12 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "block text-[9px] uppercase tracking-[0.35em]",
                    scenario.key === scenarioKey ? "text-slate-500" : "text-foreground/50",
                  )}
                >
                  Scenario
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-sm leading-tight",
                    scenario.key === scenarioKey ? "text-slate-900" : "text-foreground/65",
                  )}
                >
                  {scenario.name}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[10px] text-foreground/55">
            <MapPinned className="h-4 w-4 text-primary-200" />
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.32em]">Metro Focus</span>
              <span className="mt-0.5 text-sm font-semibold text-white">Aurora District Twin</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[10px] text-foreground/55">
            <Clock8 className="h-4 w-4 text-accent-400" />
            <div className="flex flex-col">
              <span className="uppercase tracking-[0.32em]">Sync Checkpoint</span>
              <span className="mt-0.5 text-sm font-semibold text-white">{syncTimestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onCopilotToggle}
              className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground/60 transition hover:border-white/20 hover:text-white xl:inline-flex"
            >
              <Bot className="h-4 w-4 text-primary-200" />
              {isCopilotRailOpen ? "Hide Copilot Dock" : "Show Copilot Dock"}
            </button>
            <button
              type="button"
              onClick={onCopilotSummon}
              className="inline-flex items-center gap-2 rounded-2xl border border-primary-400/40 bg-primary-500/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary-100 transition hover:border-primary-400/60 hover:bg-primary-500/20 xl:hidden"
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
    <aside className="hidden w-[260px] border-r border-white/10 bg-[rgba(8,14,26,0.78)] px-5 py-5 lg:block">
      <div className="space-y-5">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-4 text-[10px] uppercase tracking-[0.32em] text-foreground/55 shadow-[0_18px_50px_-38px_rgba(59,130,246,0.5)]">
          <p className="flex items-center gap-2 text-foreground/65">
            <GaugeCircle className="h-4 w-4 text-primary-300" />
            Mission Status
          </p>
          <span className="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-white">
            92%
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary-200">Operational</span>
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
                "group rounded-[22px] border border-white/5 bg-white/[0.03] px-4 py-2.5 text-left transition-colors duration-200 hover:border-white/15 hover:bg-white/[0.08]",
                activeModule === item.id
                  ? "border-white/15 bg-white/[0.12] shadow-[0_16px_42px_-32px_rgba(59,130,246,0.5)]"
                  : "text-foreground/70",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-[18px] border border-white/10 text-primary-100 transition-all duration-200",
                      activeModule === item.id ? "bg-white/[0.18]" : "bg-white/[0.08]",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-foreground/55">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/45 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </nav>

        <div className="rounded-[26px] border border-white/10 bg-gradient-to-br from-primary-500/12 via-accent-500/10 to-rose-500/12 p-4 text-[10px] text-foreground/60">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-primary-200">
            <BrainCircuit className="h-4 w-4" />
            AI Warden
          </p>
          <p className="mt-2 text-sm text-white/90">
            Digital twin telemetry is clean. 3 proactive interventions queued with Nexus Copilot.
          </p>
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
    <section className="rounded-[26px] border border-white/8 bg-white/[0.05] p-5 shadow-[0_22px_70px_-60px_rgba(59,130,246,0.55)] backdrop-blur-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/55">Module Suite</p>
          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{activeModuleMeta.label}</h2>
          <p className="mt-1 text-sm text-foreground/60">{activeModuleMeta.description}</p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Module navigation"
        className="mt-4 flex flex-wrap gap-1.5 rounded-[999px] border border-white/10 bg-white/[0.04] p-1.5"
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
                "group relative flex items-center gap-2 rounded-[999px] px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
                isActive
                  ? "bg-white text-slate-900 shadow-[0_16px_40px_-28px_rgba(59,130,246,0.55)]"
                  : "text-foreground/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 rounded-[999px] bg-gradient-to-r opacity-0 transition-opacity duration-300",
                  module.accent ?? "",
                  isActive ? "opacity-60" : "group-hover:opacity-50",
                )}
              />
              <span className="relative flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-[18px] border border-white/12 bg-white/[0.12] text-xs transition-colors duration-200",
                    isActive ? "border-white/80 bg-white text-slate-900" : "text-foreground/70",
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
          "flex h-full flex-col border-l border-white/10 bg-[rgba(6,12,28,0.92)] backdrop-blur-2xl transition-all duration-300 ease-out",
          open ? "w-[380px]" : "w-[84px]",
        )}
      >
        {open ? (
          <div className="flex h-full flex-col overflow-hidden px-6 py-7">
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
            className="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-l-[32px] border-l border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] text-foreground/60 transition hover:border-white/20 hover:text-white"
          >
            <Bot className="h-6 w-6 text-primary-200 transition group-hover:scale-105" />
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
      <div className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[36px] border-t border-white/10 bg-[rgba(6,12,28,0.97)] px-5 py-6 shadow-[0_-25px_80px_rgba(15,23,42,0.65)] sm:px-6">
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
  insights: ScenarioInsightsPayload;
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

          <MapSpotlightList scenario={scenario} />

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
  insights: ScenarioInsightsPayload;
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

function MapSpotlightList({ scenario }: { scenario: ScenarioDefinition }) {
  const pointLayers = scenario.layers.filter((layer) => layer.visualization === "point");

  const spotlightCandidates = pointLayers.flatMap((layer) => {
    const dataset = layer.dataset as GeoJSONFeatureCollection;
    return dataset.features
      .filter((feature) => feature.geometry?.type === "Point")
      .map((feature) => {
        const properties = (feature.properties ?? {}) as Record<string, unknown>;
        const anomalyScore = typeof properties.anomalyScore === "number" ? properties.anomalyScore : 0;
        const health = typeof properties.health === "string" ? properties.health : null;
        const type = typeof properties.type === "string" ? properties.type : "Sensor";
        const district = typeof properties.district === "string" ? properties.district : null;
        const id = typeof properties.id === "string" ? properties.id : layer.id;

        return {
          id,
          layerLabel: layer.label,
          anomalyScore,
          health,
          district,
          type,
        };
      });
  });

  if (!spotlightCandidates.length) {
    return null;
  }

  const topSpots = [...spotlightCandidates]
    .sort((a, b) => (b.anomalyScore ?? 0) - (a.anomalyScore ?? 0))
    .slice(0, 3);

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_25px_70px_-55px_rgba(59,130,246,0.6)] backdrop-blur-2xl">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
        <Crosshair className="h-3.5 w-3.5" />
        Spatial Spotlight
      </p>
      <div className="mt-4 space-y-3">
        {topSpots.map((spot) => {
          const anomalyPercent = Math.round((spot.anomalyScore ?? 0) * 100);
          const statusClass =
            spot.health === "Offline"
              ? "bg-rose-500/15 text-rose-200 border-rose-400/40"
              : spot.health === "At Risk"
                ? "bg-amber-500/15 text-amber-100 border-amber-400/35"
                : "bg-emerald-500/15 text-emerald-200 border-emerald-400/35";
          const narrative =
            spot.health === "Offline"
              ? "Dispatch crew · feed offline in corridor spine"
              : spot.health === "At Risk"
                ? "Edge models escalate drift vs baseline threshold"
                : "Signal steady · AI guardrail holding variance";

          return (
            <div
              key={`${spot.id}-${spot.layerLabel}`}
              className="flex items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-sm text-foreground/70 backdrop-blur-xl"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {spot.id} · {spot.type}
                </p>
                <p className="text-xs text-foreground/55">
                  {spot.layerLabel}
                  {spot.district ? ` • ${spot.district}` : ""} · {narrative}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold text-primary-100">{anomalyPercent}% anomaly</span>
                {spot.health ? (
                  <span className={cn("rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em]", statusClass)}>
                    {spot.health}
                  </span>
                ) : null}
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

function SignalBadge({ signal }: { signal: ScenarioInsightsPayload["signals"][number] }) {
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
  insight: ScenarioInsightsPayload["aiInsights"][number];
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
          <div className="space-y-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_-45px_rgba(59,130,246,0.5)] lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{activeViewConfig.label}</p>
                <h3 className="text-lg font-semibold text-white">Hyperlocal demand lift against baseline</h3>
                <p className="text-sm text-foreground/65">
                  Corridor orchestration keeps {scenario.name} on plan while AI exposes the interventions delivering{" "}
                  {forecastLift >= 0 ? "+" : ""}
                  {forecastLift.toFixed(1)}% throughput lift this hour.
                </p>
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1">
                  {forecastScopeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setForecastScope(option.id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition",
                        forecastScope === option.id
                          ? "bg-white text-slate-900 shadow-[0_16px_45px_-30px_rgba(59,130,246,0.65)]"
                          : "text-foreground/60 hover:text-white",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-primary-100">
                  AI Lift
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {forecastLift >= 0 ? "+" : ""}
                    {forecastLift.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
              <div className="rounded-[26px] border border-white/10 bg-black/30 p-4 sm:p-6">
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
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} strokeDasharray="3 6" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.35)" tickLine={false} />
                    <YAxis
                      stroke="rgba(255,255,255,0.35)"
                      domain={[0.2, 1]}
                      tickFormatter={(value) => `${Math.round((value as number) * 100)}%`}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(255,255,255,0.2)", strokeDasharray: "4 4" }}
                      contentStyle={{
                        backgroundColor: "rgba(6,12,28,0.9)",
                        borderRadius: "18px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(226,232,255,0.92)",
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

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Scope</p>
                  <p className="mt-1 text-lg font-semibold text-white">{scopeLabel}</p>
                  <p className="mt-2 text-sm text-foreground/65">
                    Nexus factors ride-hail feeds, curb sensors, and micromobility staging to stabilise demand.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">Current AI Throughput</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{aiPercent}%</p>
                    <p className="text-xs text-primary-200">Signal retiming + fleet balancing</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">Legacy Baseline</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{baselinePercent}%</p>
                    <p className="text-xs text-foreground/60">Pre-orchestration forecast</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4 text-sm text-foreground/70">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary-200">
                    <Sparkles className="h-4 w-4" />
                    Copilot Insight
                  </p>
                  <p className="mt-2">
                    {scenario.aiInsights[0]?.detail ??
                      "Operators receive proactive nudges when demand begins to drift beyond tolerance bands."}
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
          <div className="space-y-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_-45px_rgba(34,197,94,0.5)] lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{activeViewConfig.label}</p>
                <h3 className="text-lg font-semibold text-white">{resilienceModeLabel} resilience outlook</h3>
                <p className="text-sm text-foreground/65">{scenario.tagline}</p>
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1">
                  {resilienceModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setResilienceMode(mode.id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition",
                        resilienceMode === mode.id
                          ? "bg-white text-slate-900 shadow-[0_16px_45px_-30px_rgba(52,211,153,0.65)]"
                          : "text-foreground/60 hover:text-white",
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-emerald-100">
                  Δ Lift
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {resilienceLift}
                    {resilienceMode === "heat" ? "°C" : " pts"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
              <div className="rounded-[26px] border border-white/10 bg-black/30 p-4 sm:p-6">
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
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.35)" tickLine={false} />
                    <YAxis
                      stroke="rgba(255,255,255,0.35)"
                      tickLine={false}
                      tickFormatter={(value) =>
                        resilienceMode === "heat" ? `${Number(value).toFixed(0)}°C` : `${Math.round(Number(value))}`
                      }
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(255,255,255,0.2)", strokeDasharray: "4 4" }}
                      contentStyle={{
                        backgroundColor: "rgba(6,12,28,0.9)",
                        borderRadius: "18px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(226,232,255,0.92)",
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

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Scenario Playbooks</p>
                  <ul className="mt-3 space-y-3 text-sm text-foreground/70">
                    {(resiliencePlaybooks[scenario.key] ?? []).map((play, index) => (
                      <li key={play} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-[11px] font-semibold text-emerald-100">
                          {index + 1}
                        </span>
                        {play}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {modelPerformanceStats.slice(0, 2).map((stat) => (
                    <div key={stat.id} className="rounded-[24px] border border-white/10 bg-black/30 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-foreground/50">{stat.metric}</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="text-xs text-emerald-200">{stat.change}</p>
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
                      backgroundColor: "rgba(6,12,28,0.9)",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(226,232,255,0.92)",
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
                      Nexus triage playbooks are sequencing {highestSeverityCluster.affectedAssets} assets and notifying
                      field teams automatically.
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
          <div className="grid gap-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_-45px_rgba(79,70,229,0.45)] lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div className="rounded-[26px] border border-white/10 bg-black/30 p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={riskQuadrantSeries}>
                  <defs>
                    <linearGradient id="riskScoreGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="rgba(129,140,248,0.9)" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="rgba(129,140,248,0.1)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="quadrant" stroke="rgba(255,255,255,0.35)" tickLine={false} />
                  <YAxis
                    stroke="rgba(255,255,255,0.35)"
                    domain={[0.4, 1]}
                    tickFormatter={(value) => `${Math.round((value as number) * 100)}%`}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{
                      backgroundColor: "rgba(6,12,28,0.9)",
                      borderRadius: "18px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(226,232,255,0.92)",
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
                  Nexus automatically stages mitigation briefs when risk exceeds 70% and routes them to {scenario.name}{" "}
                  owners.
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
                  {explainabilitySnippets.map((snippet, index) => (
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
                  Export-ready VLR chapters assemble automatically with provenance, ready for Nexus Consulting briefings.
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
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Model telemetry and explainable lifts</h2>
        <p className="mt-3 text-sm text-foreground/70">
          Forecast corridors, resilience trajectories, anomaly triage, and governance insight align live to the{" "}
          {scenario.name} mission.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[28px] border border-white/10 bg-white/5 p-2">
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
                  ? "bg-white text-slate-900 shadow-[0_18px_50px_-35px_rgba(255,255,255,0.45)]"
                  : "bg-transparent text-foreground/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition",
                    isActive ? "border-transparent bg-slate-900 text-white" : "",
                  )}
                >
                  <view.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-foreground/60")} />
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
  quickPrompts: CopilotPrompt[];
  recommendations: CopilotRecommendation[];
  missions: CopilotMission[];
  auditLog: CopilotAuditEntry[];
  onSummonDock: () => void;
  onToggleRail: () => void;
  isRailOpen: boolean;
};

function CopilotPreviewPanel({
  scenario,
  module,
  quickPrompts,
  recommendations,
  missions,
  auditLog,
  onSummonDock,
  onToggleRail,
  isRailOpen,
}: CopilotPreviewPanelProps) {
  const activeMissions = missions.filter((mission) => mission.status === "active");
  const queuedMissions = missions.filter((mission) => mission.status === "queued");
  const completedMissions = missions.filter((mission) => mission.status === "complete");

  const topRecommendations = recommendations.slice(0, 3);
  const highlightedAudit = auditLog.slice(0, 3);
  const topPrompts = quickPrompts.slice(0, 3);

  const missionSummary = [
    {
      label: "Active Threads",
      value: activeMissions.length,
      detail: activeMissions[0]?.title ?? "No live threads",
      accent: "from-sky-500/20 via-sky-400/10 to-sky-500/0",
    },
    {
      label: "Queued Next",
      value: queuedMissions.length,
      detail: queuedMissions[0]?.title ?? "No queued missions",
      accent: "from-violet-500/20 via-violet-400/10 to-violet-500/0",
    },
    {
      label: "Logged & Complete",
      value: completedMissions.length,
      detail: completedMissions[0]?.title ?? "Awaiting closeout",
      accent: "from-emerald-500/20 via-emerald-400/10 to-emerald-500/0",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <div className="rounded-[30px] border border-white/10 bg-white/8 p-5 shadow-[0_25px_80px_-45px_rgba(59,130,246,0.45)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-primary-200">Nexus Copilot</p>
              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Mission orchestration for {scenario.name}
              </h3>
              <p className="mt-2 text-sm text-foreground/65">{scenario.command}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onToggleRail}
                className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/60 transition hover:border-white/20 hover:text-white xl:inline-flex"
              >
                <Bot className="h-4 w-4 text-primary-200" />
                {isRailOpen ? "Collapse Dock" : "Pin Dock"}
              </button>
              <button
                type="button"
                onClick={onSummonDock}
                className="inline-flex items-center gap-2 rounded-2xl border border-primary-400/40 bg-primary-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-100 transition hover:border-primary-400/60 hover:bg-primary-500/25 xl:hidden"
              >
                <Bot className="h-4 w-4" />
                Launch Copilot
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-foreground/65">
            {module?.description ??
              "Conversational AI fuses telemetry, policy guardrails, and equity heuristics to choreograph the next best mission step for Nexus operators."}
          </p>

          {module ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {module.metrics.slice(0, 3).map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground/70"
                >
                  <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{metric.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                  <p className="text-[11px] text-foreground/55">
                    {metric.delta} • {metric.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {topPrompts.length ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_-45px_rgba(124,58,237,0.4)]">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
              <Sparkles className="h-4 w-4" />
              Quick prompts
            </p>
            <div className="mt-4 grid gap-3">
              {topPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground/70 shadow-[0_18px_50px_-40px_rgba(59,130,246,0.55)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{prompt.label}</p>
                  <p className="mt-2">{prompt.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          {missionSummary.map((card) => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-foreground/70"
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-60 blur-[2px]",
                  `bg-gradient-to-br ${card.accent}`,
                )}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-xs text-foreground/60">{card.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

        <div className="space-y-5">
        <div className="rounded-[30px] border border-white/10 bg-black/30 p-5 text-sm text-foreground/70 shadow-[0_25px_80px_-45px_rgba(236,72,153,0.42)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
            <Bot className="h-4 w-4" />
            Recommended actions
          </p>
          <ul className="mt-4 space-y-3">
            {topRecommendations.map((recommendation) => (
              <li
                key={recommendation.id}
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-foreground/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  <span>{recommendation.channel}</span>
                  <span>{recommendation.impact}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">{recommendation.title}</p>
                <p className="mt-2 text-xs text-foreground/60">{recommendation.detail}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.35em] text-foreground/50">
            Peek inside the dock for full mission queue & playbook.
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 text-sm text-foreground/70 shadow-[0_25px_80px_-45px_rgba(125,211,252,0.35)]">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
            <FileText className="h-4 w-4" />
            Audit ledger
          </p>
          <div className="mt-4 space-y-3 border-l border-white/10 pl-5">
            {highlightedAudit.map((entry, index) => (
              <div key={entry.id} className="relative">
                <span className="absolute -left-[11px] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/10 bg-white/20 text-[9px] text-slate-900">
                  {index + 1}
                </span>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{entry.time}</p>
                <p className="mt-1 text-sm font-semibold text-white">{entry.label}</p>
                <p className="mt-1 text-xs text-foreground/60">{entry.description}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onSummonDock}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/55 transition hover:border-white/20 hover:text-white"
          >
            <MoveRight className="h-4 w-4" />
            Review full ledger
          </button>
        </div>
      </div>
    </div>
  );
}
