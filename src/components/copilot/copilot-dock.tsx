"use client";

import {
  Activity,
  Bot,
  CheckCircle2,
  CircleDashed,
  FileText,
  ListChecks,
  MessageSquare,
  Sparkles,
  Timer,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScenarioDefinition } from "@/lib/scenarios";
import type {
  CopilotAuditEntry,
  CopilotModule,
  CopilotMission,
  CopilotMissionStatus,
  CopilotPrompt,
  CopilotRecommendation,
  CopilotRecommendationPriority,
  CopilotMessage,
} from "@/data/copilot";

export type CopilotDockView = "threads" | "missions" | "actions" | "audit";

type CopilotDockContentProps = {
  scenario: ScenarioDefinition;
  module?: CopilotModule;
  conversation: CopilotMessage[];
  quickPrompts: CopilotPrompt[];
  missions: CopilotMission[];
  recommendations: CopilotRecommendation[];
  auditLog: CopilotAuditEntry[];
  scenarioActions: string[];
  activeView: CopilotDockView;
  onViewChange: (view: CopilotDockView) => void;
  onClose?: () => void;
};

const dockViews: Array<{
  id: CopilotDockView;
  label: string;
  description: string;
  icon: typeof MessageSquare;
}> = [
  {
    id: "threads",
    label: "Threads",
    description: "Live dialogue & quick prompts",
    icon: MessageSquare,
  },
  {
    id: "missions",
    label: "Missions",
    description: "Active playbooks & ETA",
    icon: Workflow,
  },
  {
    id: "actions",
    label: "Actions",
    description: "AI recommendations & checklists",
    icon: ListChecks,
  },
  {
    id: "audit",
    label: "Audit",
    description: "Governance trail & sign-offs",
    icon: FileText,
  },
];

const missionStatusMeta: Record<
  CopilotMissionStatus,
  {
    label: string;
    accent: string;
    chipClass: string;
    Icon: typeof Activity;
  }
> = {
  active: {
    label: "Active now",
    accent: "from-sky-500/25 via-sky-400/10 to-sky-500/0",
    chipClass: "border-sky-400/60 bg-sky-400/10 text-sky-100",
    Icon: Activity,
  },
  queued: {
    label: "Queued next",
    accent: "from-violet-500/25 via-violet-400/10 to-violet-500/0",
    chipClass: "border-violet-400/60 bg-violet-400/10 text-violet-100",
    Icon: Timer,
  },
  complete: {
    label: "Recently complete",
    accent: "from-emerald-500/25 via-emerald-400/10 to-emerald-500/0",
    chipClass: "border-emerald-400/60 bg-emerald-400/10 text-emerald-100",
    Icon: CheckCircle2,
  },
};

const recommendationPriorityMeta: Record<
  CopilotRecommendationPriority,
  { label: string; badgeClass: string }
> = {
  critical: {
    label: "Critical",
    badgeClass: "border-rose-400/60 bg-rose-500/10 text-rose-100",
  },
  high: {
    label: "High",
    badgeClass: "border-amber-400/60 bg-amber-500/10 text-amber-100",
  },
  medium: {
    label: "Medium",
    badgeClass: "border-primary-400/60 bg-primary-500/10 text-primary-100",
  },
};

const auditCategoryMeta = {
  governance: {
    label: "Governance",
    badgeClass: "border-sky-500/50 bg-sky-500/10 text-sky-100",
  },
  ops: {
    label: "Operations",
    badgeClass: "border-emerald-500/50 bg-emerald-500/10 text-emerald-100",
  },
  policy: {
    label: "Policy",
    badgeClass: "border-purple-500/50 bg-purple-500/10 text-purple-100",
  },
} as const;

export function CopilotDockContent({
  scenario,
  module,
  conversation,
  quickPrompts,
  missions,
  recommendations,
  auditLog,
  scenarioActions,
  activeView,
  onViewChange,
  onClose,
}: CopilotDockContentProps) {
  const missionGroups = missions.reduce<Record<CopilotMissionStatus, CopilotMission[]>>(
    (acc, mission) => {
      acc[mission.status].push(mission);
      return acc;
    },
    { active: [], queued: [], complete: [] },
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary-200">
              Nexus Copilot
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">Mission Control</h3>
            <p className="text-xs text-foreground/60">{scenario.name}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-foreground/50 transition hover:border-white/20 hover:text-white"
            >
              <CircleDashed className="h-5 w-5" />
              <span className="sr-only">Collapse copilot dock</span>
            </button>
          ) : null}
        </div>

        {module ? (
          <div className="rounded-[26px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-foreground/70 shadow-[0_25px_80px_-45px_rgba(59,130,246,0.55)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  {module.assurance.label}
                </p>
                <p className="mt-1 text-xs text-foreground/60">{module.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-semibold text-white">
                  {module.assurance.score}
                  <span className="ml-1 text-xs text-foreground/50">/100</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  Confidence
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-foreground/60">{module.assurance.detail}</p>
          </div>
        ) : null}

        {module ? (
          <div className="grid gap-2 sm:grid-cols-3">
            {module.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl"
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/55">{metric.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                <p className="text-[11px] text-foreground/50">
                  {metric.delta} • {metric.detail}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </header>

      <nav className="flex gap-2 rounded-[30px] border border-white/10 bg-white/5 p-1.5">
        {dockViews.map((view) => {
          const isActive = view.id === activeView;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onViewChange(view.id)}
              className={cn(
                "flex-1 rounded-[24px] px-4 py-3 text-left transition",
                isActive
                  ? "bg-white text-slate-900 shadow-[0_18px_50px_-35px_rgba(255,255,255,0.45)]"
                  : "text-foreground/60 hover:bg-white/10 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition",
                    isActive ? "border-transparent bg-slate-900 text-white" : "",
                  )}
                >
                  <view.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-foreground/55")} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{view.label}</p>
                  <p className="text-xs text-foreground/55">{view.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="flex-1 overflow-y-auto pr-1">
        {activeView === "threads" ? (
          <div className="space-y-5 pb-6">
            <div className="space-y-3">
              {conversation.map((message) => {
                const isCopilot = message.speaker !== "Operator";
                return (
                  <div key={message.id} className={cn("flex", isCopilot ? "justify-start" : "justify-end")}>
                    <div
                      className={cn(
                        "relative max-w-[92%] rounded-3xl border px-4 py-3 text-sm leading-6 shadow-lg backdrop-blur-xl transition",
                        isCopilot
                          ? "border-primary-400/50 bg-primary-500/15 text-primary-100 shadow-[0_20px_65px_-30px_rgba(56,189,248,0.8)]"
                          : "border-white/10 bg-white/10 text-foreground/80 shadow-[0_20px_65px_-30px_rgba(148,163,184,0.55)]",
                      )}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                        <span className={cn(isCopilot ? "text-primary-100" : "text-foreground/60")}>{message.speaker}</span>
                        <span>{message.time}</span>
                      </div>
                      <p className="mt-2">{message.body}</p>
                      {message.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.35em]">
                          {message.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1",
                                isCopilot ? "border-primary-400/50 text-primary-100" : "border-white/15 text-foreground/60",
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {quickPrompts.length ? (
              <div className="rounded-[26px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  <Sparkles className="h-3.5 w-3.5 text-primary-200" />
                  Quick prompts
                </p>
                <div className="mt-3 grid gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-foreground/65 transition hover:border-primary-400/40 hover:bg-primary-500/10 hover:text-white"
                    >
                      <span className="block text-xs uppercase tracking-[0.35em] text-foreground/50 group-hover:text-primary-100">
                        {prompt.label}
                      </span>
                      <span className="mt-2 block text-sm leading-6">{prompt.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeView === "missions" ? (
          <div className="space-y-5 pb-6">
            {(Object.keys(missionStatusMeta) as CopilotMissionStatus[]).map((status) => {
              const missionsForStatus = missionGroups[status];
              const { label, accent, chipClass, Icon } = missionStatusMeta[status];
              return (
                <div
                  key={status}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_25px_80px_-55px_rgba(59,130,246,0.6)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/80">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <div
                      aria-hidden
                      className={cn(
                        "h-10 w-10 rounded-2xl border border-white/10 bg-gradient-to-tl opacity-80 blur-[1px]",
                        accent,
                      )}
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    {missionsForStatus.map((mission) => (
                      <div
                        key={mission.id}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground/70"
                      >
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                          <span>{mission.owner}</span>
                          <span>{mission.status === "complete" ? "Verified" : `ETA ${mission.eta}`}</span>
                        </div>
                        <p className="mt-2 text-base font-semibold text-white">{mission.title}</p>
                        <p className="mt-2 text-xs text-foreground/60">{mission.detail}</p>
                      </div>
                    ))}
                    {!missionsForStatus.length ? (
                      <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">No missions in this lane</p>
                    ) : null}
                  </div>

                  <span
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                      chipClass,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {missionsForStatus.length} {missionsForStatus.length === 1 ? "mission" : "missions"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {activeView === "actions" ? (
          <div className="space-y-5 pb-6">
            <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
                <Bot className="h-4 w-4" />
                AI recommendations
              </p>
              {recommendations.map((item) => {
                const { badgeClass, label } = recommendationPriorityMeta[item.priority];
                return (
                  <div
                    key={item.id}
                    className="group rounded-[22px] border border-white/10 bg-black/25 px-4 py-3 transition hover:border-primary-400/40 hover:bg-primary-500/10"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.35em]">
                      <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1", badgeClass)}>
                        {label}
                      </span>
                      <span className="text-foreground/50">{item.channel}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-xs text-foreground/60">{item.detail}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-foreground/55">
                      Impact: {item.impact}
                    </div>
                  </div>
                );
              })}
            </div>

            {module?.playbook?.length ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
                  <Sparkles className="h-4 w-4" />
                  Copilot playbook
                </p>
                <ul className="mt-3 space-y-3 text-sm text-foreground/70">
                  {module.playbook.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                      <Sparkles className="mt-1 h-4 w-4 text-primary-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {scenarioActions.length ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
                  <Workflow className="h-4 w-4" />
                  Scenario checklist
                </p>
                <ul className="mt-3 space-y-3 text-sm text-foreground/70">
                  {scenarioActions.map((action) => (
                    <li key={action} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 px-3 py-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-200" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeView === "audit" ? (
          <div className="space-y-5 pb-6">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary-200">
                <FileText className="h-4 w-4" />
                Accountability ledger
              </p>
              <div className="mt-4 space-y-4 border-l border-white/10 pl-6">
                {auditLog.map((entry, index) => {
                  const categoryMeta = auditCategoryMeta[entry.category];
                  return (
                    <div key={entry.id} className="relative pb-4 last:pb-0">
                      <span className="absolute -left-[9px] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/10 bg-white/20 text-[9px] text-slate-900">
                        {index + 1}
                      </span>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{entry.time}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{entry.label}</p>
                      <p className="mt-1 text-xs text-foreground/60">{entry.description}</p>
                      <span
                        className={cn(
                          "mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                          categoryMeta.badgeClass,
                        )}
                      >
                        {categoryMeta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
