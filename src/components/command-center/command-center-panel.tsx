"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, Gauge, SlidersHorizontal, Layers3 } from "lucide-react";
import type { ScenarioDefinition, ScenarioKey, ScenarioLayer, ScenarioSignal } from "@/lib/scenarios";
import type { SystemKpi } from "@/data/metrics";

type ScenarioSummary = {
  key: ScenarioKey;
  name: string;
  tagline: string;
  command: string;
};

type ScenarioInsights = {
  signals: ScenarioSignal[];
  aiInsights: ScenarioDefinition["aiInsights"];
  kpis: SystemKpi[];
  actions: ScenarioDefinition["actions"];
};

type CommandCenterPanelProps = {
  scenario: ScenarioDefinition;
  scenarioSummaries: ScenarioSummary[];
  onScenarioSelect: (key: ScenarioKey) => void;
  focus: number;
  onFocusChange: (value: number) => void;
  insights: ScenarioInsights;
};

export function CommandCenterPanel({
  scenario,
  scenarioSummaries,
  onScenarioSelect,
  focus,
  onFocusChange,
  insights,
}: CommandCenterPanelProps) {
  const formattedFocus = useMemo(() => {
    const baseline = ["Now", "+15m", "+30m", "+45m", "+60m"];
    const index = Math.min(baseline.length - 1, Math.round((focus / 100) * (baseline.length - 1)));
    return baseline[index];
  }, [focus]);

  return (
    <div className="glass-panel relative flex h-full w-full flex-col gap-8 rounded-[2rem] border border-white/10 p-8 text-foreground/80 shadow-[0_45px_120px_-65px_rgba(59,130,246,0.75)]">
      <PanelHeader
        scenario={scenario}
        scenarios={scenarioSummaries}
        onScenarioSelect={onScenarioSelect}
      />

      <TimelineScrubber focus={focus} formattedFocus={formattedFocus} onFocusChange={onFocusChange} />

      <KpiDeck kpis={insights.kpis} />

      <SignalsPanel signals={insights.signals} />

      <InsightList aiInsights={insights.aiInsights} actions={insights.actions} layers={scenario.layers} />
    </div>
  );
}

function PanelHeader({
  scenario,
  scenarios,
  onScenarioSelect,
}: {
  scenario: ScenarioDefinition;
  scenarios: ScenarioSummary[];
  onScenarioSelect: (key: ScenarioKey) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary-200">
            Scenario Command Center
          </p>
          <h3 className="mt-3 text-xl font-semibold text-white">{scenario.name}</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/70">{scenario.tagline}</p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-200 shadow-inner">
          <Sparkles className="h-6 w-6" />
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {scenarios.map((summary) => {
          const isActive = summary.key === scenario.key;
          return (
            <button
              key={summary.key}
              type="button"
              onClick={() => onScenarioSelect(summary.key)}
              className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] transition ${
                isActive
                  ? "border-primary-400/70 bg-primary-400/20 text-primary-100 shadow-[0_10px_35px_-18px_rgba(56,189,248,0.9)]"
                  : "border-white/10 bg-white/5 text-foreground/60 hover:border-primary-400/30 hover:text-primary-100"
              }`}
            >
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-accent-500" />
              {summary.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">Mission Objective</p>
        <p className="mt-2 text-sm leading-6 text-foreground/70">{scenario.command}</p>
      </div>
    </div>
  );
}

function TimelineScrubber({ focus, formattedFocus, onFocusChange }: { focus: number; formattedFocus: string; onFocusChange: (value: number) => void }) {
  const gradientStyle = useMemo(
    () => ({
      background: `linear-gradient(90deg, rgba(14,165,233,0.45) 0%, rgba(168,85,247,0.55) ${focus}%, rgba(15,23,42,0.5) ${focus}%, rgba(15,23,42,0.35) 100%)`,
    }),
    [focus],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-foreground/50">
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Time Horizon
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-primary-200">Focus: {formattedFocus}</span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          value={focus}
          onChange={(event) => onFocusChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface/80"
          style={gradientStyle}
        />
        <div
          className="pointer-events-none absolute -top-2 h-6 w-6 -translate-x-1/2 rounded-full border border-white/40 bg-gradient-to-r from-primary-400 to-accent-500 shadow-[0_15px_35px_-18px_rgba(56,189,248,0.95)]"
          style={{ left: `${focus}%` }}
        />
        <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-between px-1 text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          <span>Now</span>
          <span>+60m</span>
        </div>
      </div>
    </div>
  );
}

function KpiDeck({ kpis }: { kpis: SystemKpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {kpis.map((kpi) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/70 p-4 text-xs uppercase tracking-[0.25em] text-foreground/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 via-transparent to-accent-500/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-primary-200" />
              {kpi.label}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-[10px] ${
                kpi.change.direction === "down" ? "bg-success-500/15 text-success-500" : "bg-primary-500/15 text-primary-200"
              }`}
            >
              {kpi.change.direction === "down" ? "-" : "+"}
              {kpi.change.percentage}%
            </span>
          </div>
          <div className="relative mt-3 text-foreground/80">
            <p className="text-lg font-semibold text-white">{kpi.value.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50">{kpi.unit}</p>
            <p className="mt-2 text-[11px] lowercase tracking-wide text-foreground/60">
              vs previous {kpi.change.period}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SignalsPanel({ signals }: { signals: ScenarioSignal[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
        <Activity className="h-3.5 w-3.5" />
        Live Signals
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {signals.map((signal) => (
          <div
            key={signal.label}
            className="rounded-2xl border border-white/5 bg-surface/70 p-3 text-xs uppercase tracking-[0.3em] text-foreground/60"
          >
            <p>{signal.label}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] tracking-[0.26em]">
              <span className="text-white">{signal.value}</span>
              <span
                className={`rounded-full px-2 py-1 ${
                  signal.tone === "positive"
                    ? "bg-success-500/15 text-success-500"
                    : signal.tone === "warning"
                      ? "bg-warning-500/15 text-warning-500"
                      : "bg-white/10 text-foreground/60"
                }`}
              >
                {signal.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightList({
  aiInsights,
  actions,
  layers,
}: {
  aiInsights: ScenarioDefinition["aiInsights"];
  actions: ScenarioDefinition["actions"];
  layers: ScenarioLayer[];
}) {
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
          <Sparkles className="h-3.5 w-3.5" />
          AI Insight Stream
        </p>
        <ul className="mt-4 space-y-4 text-sm leading-6 text-foreground/70">
          {aiInsights.map((insight) => (
            <li key={insight.title} className="rounded-2xl border border-white/10 bg-surface/70 p-4">
              <p className="text-sm font-semibold text-white">{insight.title}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary-200">Confidence {(insight.confidence * 100).toFixed(0)}%</p>
              <p className="mt-2 text-sm leading-6 text-foreground/70">{insight.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/50">
          <Layers3 className="h-3.5 w-3.5" />
          Layer Intelligence
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {layers.map((layer) => (
            <div key={layer.id} className="rounded-2xl border border-white/10 bg-surface/70 p-4 text-xs uppercase tracking-[0.3em] text-foreground/60">
              <p className="flex items-center justify-between text-white">
                <span>{layer.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] lowercase tracking-wide text-foreground/50">
                  {layer.visualization}
                </span>
              </p>
              <p className="mt-2 text-[11px] leading-5 tracking-wide text-foreground/60">{layer.legend}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary-400/40 bg-primary-500/10 p-5 text-sm leading-6 text-primary-100">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em]">
          <Sparkles className="h-3.5 w-3.5" />
          Recommended Actions
        </p>
        <ul className="mt-3 space-y-3 text-sm leading-6">
          {actions.map((action) => (
            <li key={action} className="flex items-start gap-3 rounded-xl border border-primary-400/20 bg-primary-500/5 px-4 py-3 text-primary-100/90">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-primary-400 to-accent-500" />
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
