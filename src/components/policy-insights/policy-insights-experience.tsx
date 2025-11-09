"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarRange, Clock3, Gavel, Layers, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { citywideKpis } from "@/data/metrics";
import { policyInsights, policyThemes } from "@/data/policy-insights";
import { cn } from "@/lib/utils";

const contextualKpiIds = ["sdg-progress", "vlr-ready"] as const;
const defaultThemeId = "green-industry";
const defaultInsightId = "industrial-supply-taskforce";

const decisionTypeDescriptors: Record<
  (typeof policyInsights)[number]["decisionType"],
  { icon: LucideIcon }
> = {
  "executive directive": { icon: Zap },
  "budget decision": { icon: CalendarRange },
  "legislative pact": { icon: Gavel },
};

const priorityDescriptors: Record<
  (typeof policyThemes)[number]["priorityLevel"],
  { label: string; icon: LucideIcon; accent: string }
> = {
  immediate: { label: "Immediate", icon: Zap, accent: "text-amber-500" },
  "near-term": { label: "Near term", icon: Clock3, accent: "text-sky-500" },
  "mid-term": { label: "Mid term", icon: CalendarRange, accent: "text-indigo-500" },
};

type PolicyInsightsExperienceProps = {
  variant?: "standalone" | "embedded";
};

export function PolicyInsightsExperience({ variant = "standalone" }: PolicyInsightsExperienceProps) {
  const resolvedDefaultThemeId =
    policyThemes.find((theme) => theme.id === defaultThemeId)?.id ?? policyThemes[0]?.id ?? "";
  const resolvedDefaultInsightId = (() => {
    const defaultInsight = policyInsights.find(
      (insight) => insight.id === defaultInsightId && insight.themeId === resolvedDefaultThemeId,
    );
    if (defaultInsight) {
      return defaultInsight.id;
    }
    const fallback = policyInsights.find((insight) => insight.themeId === resolvedDefaultThemeId);
    return fallback?.id ?? "";
  })();

  const [activeThemeId, setActiveThemeId] = useState(resolvedDefaultThemeId);
  const insightsForTheme = useMemo(
    () => policyInsights.filter((insight) => insight.themeId === activeThemeId),
    [activeThemeId],
  );
  const [activeInsightId, setActiveInsightId] = useState(resolvedDefaultInsightId);

  useEffect(() => {
    if (insightsForTheme.length === 0) {
      return;
    }
    const hasSelected = insightsForTheme.some((insight) => insight.id === activeInsightId);
    if (!hasSelected) {
      const preferred = insightsForTheme.find((insight) => insight.id === defaultInsightId);
      setActiveInsightId(preferred?.id ?? insightsForTheme[0].id);
    }
  }, [insightsForTheme, activeInsightId]);

  const theme = policyThemes.find((item) => item.id === activeThemeId) ?? policyThemes[0];
  const activeInsight = insightsForTheme.find((insight) => insight.id === activeInsightId) ?? insightsForTheme[0];
  const kpiLookup = useMemo(() => Object.fromEntries(citywideKpis.map((kpi) => [kpi.id, kpi])), []);
  const contextualKpis = contextualKpiIds
    .map((id) => kpiLookup[id])
    .filter((kpi): kpi is (typeof citywideKpis)[number] => Boolean(kpi));

  return (
    <div className="space-y-10">
      <HeroSection kpis={contextualKpis} variant={variant} />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Policy themes</p>
            <h2 className="text-2xl font-semibold text-slate-900">Choose a strategic lane</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-slate-500 lg:block">
            Each lane bundles SDG targets, VLR stage owners, and the districts currently driving the narrative.
          </p>
        </div>
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {policyThemes.map((policyTheme) => {
            const priority = priorityDescriptors[policyTheme.priorityLevel];
            return (
              <button
                key={policyTheme.id}
                type="button"
                onClick={() => setActiveThemeId(policyTheme.id)}
                className={cn(
                  "flex min-w-[16rem] snap-start flex-col rounded-2xl border p-4 text-left transition",
                  "bg-white shadow-sm",
                  policyTheme.id === activeThemeId
                    ? "border-sky-400 ring-2 ring-sky-200"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100", priority.accent)}>
                    <priority.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-slate-500">{priority.label}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-900">{policyTheme.vlrStages.join(" → ")}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-900">{policyTheme.title}</p>
                <p className="mt-2 text-sm text-slate-600">{policyTheme.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {policyTheme.sdgAlignment.map((sdg) => (
                    <span key={sdg} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {sdg}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Focus: {policyTheme.focusAreas.join(", ")}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <header>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Insights</p>
            <h2 className="text-2xl font-semibold text-slate-900">High-level policy paths</h2>
            {theme ? <p className="mt-1 text-sm text-slate-600">{theme.summary}</p> : null}
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            {insightsForTheme.map((insight) => {
              const descriptor = decisionTypeDescriptors[insight.decisionType] ?? { icon: Layers };
              const isActive = activeInsight?.id === insight.id;
              return (
                <button
                  key={insight.id}
                  type="button"
                  onClick={() => setActiveInsightId(insight.id)}
                  className={cn(
                    "flex h-full flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition",
                    isActive ? "border-slate-900 ring-2 ring-slate-200" : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border",
                        isActive ? "border-sky-200 bg-sky-500 text-white" : "border-slate-200 bg-slate-100 text-slate-500",
                      )}
                    >
                      <descriptor.icon className="h-4 w-4" />
                    </span>
                    <span className="text-slate-500">{insight.decisionType}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{insight.vlrStageRef} stage</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{insight.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{insight.signalSummary}</p>
                  <div className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-900">
                    <Target className="h-4 w-4 text-sky-500" />
                    <span>{insight.expectedImpact.delta}</span>
                    <span className="text-slate-400">•</span>
                    <span>{insight.expectedImpact.horizon}</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                    View brief <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {activeInsight ? (
            <InsightDetail insight={activeInsight} kpiLabel={kpiLookup[activeInsight.expectedImpact.metricId]?.label} />
          ) : (
            <div className="space-y-2 text-sm text-slate-500">
              <p>Select a policy insight to see the narrative, dependencies, and expected impact.</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function HeroSection({
  kpis,
  variant,
}: {
  kpis: (typeof citywideKpis)[number][];
  variant: "standalone" | "embedded";
}) {
  const baseClass =
    variant === "embedded"
      ? "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      : "rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl sm:p-10";
  const textClass = variant === "embedded" ? "text-slate-900" : "text-white";
  const bodyClass = variant === "embedded" ? "text-slate-600" : "text-slate-200";

  return (
    <section className={baseClass}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className={cn("text-sm font-semibold uppercase tracking-wide", variant === "embedded" ? "text-sky-600" : "text-sky-200")}>Policy Insights Lab</p>
          <h1 className={cn("text-3xl font-semibold leading-tight sm:text-4xl", textClass)}>
            High-level policy moves aligned with the current VLR and SDG storyline.
          </h1>
          <p className={cn("text-base", bodyClass)}>
            Each recommendation synthesizes live GIS signals, VLR workflow data, and SDG targets so leaders can issue
            directives, compacts, or budget decisions without waiting on another study.
          </p>
        </div>
        {variant === "embedded" ? (
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-md">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className={cn(
                  "rounded-2xl border border-white/20 p-4",
                  variant === "embedded" ? "border-slate-200 bg-white" : "bg-white/5",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{kpi.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{kpi.value}</p>
                <div className="mt-1 text-sm text-slate-600">
                  <span>{kpi.unit}</span>
                  <span className="px-2 text-slate-500">•</span>
                  <span>
                    {kpi.changeLabel ?? `${kpi.change.direction === "up" ? "+" : "−"}${kpi.change.percentage}% vs last ${kpi.change.period}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InsightDetail({
  insight,
  kpiLabel,
}: {
  insight: (typeof policyInsights)[number];
  kpiLabel?: string;
}) {
  const confidencePercent = Math.round((insight.confidence ?? 0) * 100);

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Briefing</p>
        <h3 className="mt-1 text-2xl font-semibold text-slate-900">{insight.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{insight.narrative}</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommendation</p>
        <p className="mt-2 text-sm text-slate-900">{insight.recommendation}</p>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="rounded-2xl border border-slate-100 p-3">
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Layers className="h-4 w-4 text-slate-400" />
            Alignment
          </dt>
          <dd className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
            {insight.sdgTargets.map((sdg) => (
              <span key={sdg} className="rounded-full bg-slate-100 px-3 py-1">
                {sdg}
              </span>
            ))}
            <span className="rounded-full bg-slate-100 px-3 py-1 capitalize">{insight.vlrStageRef} stage</span>
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-100 p-3">
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Target className="h-4 w-4 text-slate-400" />
            Expected impact
          </dt>
          <dd className="mt-2 text-slate-900">
            <p className="text-sm font-semibold">{insight.expectedImpact.delta}</p>
            <p className="text-xs text-slate-500">
              {kpiLabel ?? "KPI"} · {insight.expectedImpact.horizon}
            </p>
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-100 p-3">
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Gavel className="h-4 w-4 text-slate-400" />
            Decision window
          </dt>
          <dd className="mt-2 text-slate-900">
            <p className="text-sm font-semibold">{insight.readinessWindow}</p>
            <p className="text-xs text-slate-500">Confidence {confidencePercent}%</p>
          </dd>
        </div>
      </dl>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dependencies</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          {insight.dependencies.map((dependency) => (
            <li key={dependency} className="flex items-start gap-2">
              <Zap className="mt-0.5 h-4 w-4 text-slate-400" />
              <span>{dependency}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
