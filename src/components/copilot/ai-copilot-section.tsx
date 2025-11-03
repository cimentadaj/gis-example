"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import {
  copilotMissionDeck,
  copilotModules,
  copilotThreads,
  type CopilotMessage,
  type CopilotMission,
  type CopilotModule,
  type CopilotMetric,
} from "@/data/copilot";

const moduleShadow =
  "shadow-[0_45px_120px_-65px_rgba(56,189,248,0.65)] border border-white/10 bg-surface/80";

export function AiCopilotSection() {
  const defaultKey = copilotModules[0]?.key ?? "sdg-localization";
  const [activeKey, setActiveKey] = useState<CopilotModule["key"]>(defaultKey);

  const activeModule = useMemo(
    () => copilotModules.find((module) => module.key === activeKey) ?? copilotModules[0],
    [activeKey],
  );
  const activeMessages = copilotThreads[activeKey] ?? copilotThreads[defaultKey] ?? [];
  const activeMissions = copilotMissionDeck[activeKey] ?? copilotMissionDeck[defaultKey] ?? [];

  return (
    <Section id="copilot" className="pt-12">
      <Container className="space-y-12">
        <Reveal offset={32} className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">
            <Bot className="h-3.5 w-3.5" />
            AI Copilot
          </span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Your digital chief of staff synchronizing every smart-city playbook.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            Automate SDG localization, VLR submissions, and city profiling through a conversational copilot that
            respects governance guardrails and delivers executive-ready storytelling on command.
          </p>
        </Reveal>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Reveal offset={28} className="h-full">
            <ModuleBoard
              modules={copilotModules}
              activeKey={activeModule?.key}
              onModuleChange={setActiveKey}
              activeModule={activeModule}
            />
          </Reveal>

          <div className="grid gap-6">
            <Reveal offset={28} delay={0.08}>
              <ChatPanel messages={activeMessages} />
            </Reveal>
            <Reveal offset={28} delay={0.16}>
              <MissionDeck missions={activeMissions} assurance={activeModule?.assurance} />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ModuleBoard({
  modules,
  activeKey,
  onModuleChange,
  activeModule,
}: {
  modules: CopilotModule[];
  activeKey: CopilotModule["key"] | undefined;
  onModuleChange: (key: CopilotModule["key"]) => void;
  activeModule?: CopilotModule;
}) {
  return (
    <div
      className={cn(
        "glass-panel relative flex h-full flex-col gap-6 rounded-[2rem] p-6 sm:p-7",
        moduleShadow,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary-200">Orchestration Modes</p>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">Choose a mission focus</h3>
          <p className="text-sm leading-6 text-foreground/70">
            Every module blends geospatial telemetry with policy guardrails and equity heuristics. Tap a mode to
            explore how the copilot stages interventions.
          </p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/15 via-accent-500/15 to-sky-500/15 text-primary-200 shadow-inner">
          <Target className="h-6 w-6" />
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {modules.map((module) => {
          const isActive = module.key === activeKey;
          return (
            <button
              key={module.key}
              type="button"
              onClick={() => onModuleChange(module.key)}
              className={cn(
                "group relative flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition duration-300",
                "hover:border-primary-400/40 hover:bg-primary-500/10 hover:shadow-[0_25px_90px_-45px_rgba(56,189,248,0.75)]",
                isActive
                  ? "border-primary-400/50 bg-primary-500/15 text-primary-100 shadow-[0_35px_110px_-45px_rgba(56,189,248,0.85)]"
                  : "border-white/10 bg-white/5 text-foreground/70",
              )}
            >
              <span className="text-[10px] uppercase tracking-[0.35em]">{module.subtitle}</span>
              <span className="text-base font-semibold text-white">{module.title}</span>
              <span className="text-xs leading-5 text-foreground/60">{module.assurance.detail}</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 15% 15%, rgba(14,165,233,0.25), transparent 60%), radial-gradient(circle at 80% 30%, rgba(124,58,237,0.2), transparent 65%)",
                }}
              />
            </button>
          );
        })}
      </div>

      {activeModule ? (
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-foreground/70">
          <p className="text-[10px] uppercase tracking-[0.35em] text-primary-200">Copilot Narrative</p>
          <p className="text-base leading-6 text-foreground/80">{activeModule.description}</p>

          <div className="flex flex-wrap gap-3">
            {activeModule.metrics.map((metric) => (
              <MetricPill key={metric.label} metric={metric} />
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">Playbook Steps</p>
            <ul className="space-y-2">
              {activeModule.playbook.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6">
                  <Sparkles className="mt-1 h-4 w-4 text-primary-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetricPill({ metric }: { metric: CopilotMetric }) {
  const toneStyles: Record<CopilotMetric["tone"], string> = {
    positive: "border-primary-400/60 bg-primary-500/10 text-primary-100",
    warning: "border-warning-500/50 bg-warning-500/10 text-amber-100",
    neutral: "border-white/10 bg-white/5 text-foreground/70",
  };

  return (
    <span
      className={cn(
        "inline-flex flex-col rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.3em]",
        toneStyles[metric.tone],
      )}
    >
      <span className="text-[10px] text-foreground/60">{metric.label}</span>
      <span className="mt-1 text-lg font-semibold tracking-[0.2em] text-white">{metric.value}</span>
      <span className="mt-1 text-[10px] text-foreground/60">
        {metric.delta} • {metric.detail}
      </span>
    </span>
  );
}

function ChatPanel({ messages }: { messages: CopilotMessage[] }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[2rem] border border-white/10 bg-surface/80 p-6 text-sm text-foreground/80",
        "shadow-[0_45px_120px_-65px_rgba(124,58,237,0.65)] sm:p-7",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary-200">Conversational Ops</p>
          <h3 className="text-lg font-semibold text-white">Brief your AI chief of staff</h3>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-200 shadow-inner">
          <MessageSquare className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {messages.map((message) => {
          const isAi = message.speaker !== "Operator";
          return (
            <div key={message.id} className={cn("flex", isAi ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "relative max-w-lg rounded-3xl border px-5 py-4 shadow-lg backdrop-blur-xl transition",
                  isAi
                    ? "border-primary-400/50 bg-primary-500/15 text-primary-100 shadow-[0_20px_65px_-30px_rgba(56,189,248,0.8)]"
                    : "border-white/10 bg-white/10 text-foreground/80 shadow-[0_20px_65px_-30px_rgba(148,163,184,0.55)]",
                )}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-foreground/50">
                  <span className={cn(isAi ? "text-primary-100" : "text-foreground/60")}>{message.speaker}</span>
                  <span>{message.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6">{message.body}</p>
                {message.tags ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.35em]">
                    {message.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1",
                          isAi ? "border-primary-400/50 text-primary-100" : "border-white/15 text-foreground/60",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                {isAi ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 80% 20%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(circle at 15% 80%, rgba(124,58,237,0.25), transparent 65%)",
                    }}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const statusMeta: Record<
  CopilotMission["status"],
  {
    label: string;
    Icon: typeof Activity;
    chipClass: string;
  }
> = {
  active: {
    label: "Active now",
    Icon: Activity,
    chipClass: "border-primary-400/60 bg-primary-500/15 text-primary-100",
  },
  queued: {
    label: "Queued next",
    Icon: Timer,
    chipClass: "border-accent-500/55 bg-accent-500/15 text-accent-100",
  },
  complete: {
    label: "Recently complete",
    Icon: CheckCircle2,
    chipClass: "border-emerald-500/55 bg-emerald-500/15 text-emerald-100",
  },
};

function MissionDeck({
  missions,
  assurance,
}: {
  missions: CopilotMission[];
  assurance?: CopilotModule["assurance"];
}) {
  const grouped = useMemo(
    () =>
      missions.reduce<Record<CopilotMission["status"], CopilotMission[]>>(
        (acc, mission) => {
          acc[mission.status].push(mission);
          return acc;
        },
        { active: [], queued: [], complete: [] },
      ),
    [missions],
  );

  return (
    <div
      className={cn(
        "glass-panel rounded-[2rem] border border-white/10 bg-surface/80 p-6 text-sm text-foreground/70",
        "shadow-[0_45px_120px_-65px_rgba(56,189,248,0.6)] sm:p-7",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary-200">Mission Console</p>
          <h3 className="text-lg font-semibold text-white">Live orchestration status</h3>
        </div>

        {assurance ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right text-xs uppercase tracking-[0.3em] text-foreground/50">
            <p>{assurance.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[0.2em] text-white">
              {assurance.score}
              <span className="ml-1 text-xs text-foreground/60">/100</span>
            </p>
            <p className="mt-2 text-[10px] leading-4 text-foreground/60">{assurance.detail}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {(Object.keys(statusMeta) as CopilotMission["status"][]).map((status) => {
          const missionsForStatus = grouped[status];
          const { label, Icon, chipClass } = statusMeta[status];
          return (
            <div key={status} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]", chipClass)}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>

              <div className="mt-4 space-y-3">
                {missionsForStatus.map((mission) => (
                  <div
                    key={mission.id}
                    className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 text-foreground/80 shadow-[0_18px_45px_-35px_rgba(59,130,246,0.55)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{mission.owner}</p>
                    <p className="mt-2 text-base font-medium text-white">{mission.title}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-foreground/50">
                      {status === "complete" ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" /> : <Timer className="h-3.5 w-3.5 text-primary-200" />}
                      <span>{status === "complete" ? "Verified" : `ETA ${mission.eta}`}</span>
                    </div>
                  </div>
                ))}

                {missionsForStatus.length === 0 ? (
                  <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">No missions</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
