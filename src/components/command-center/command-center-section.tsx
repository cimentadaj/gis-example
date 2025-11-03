"use client";

import { useMemo, useState } from "react";
import { ActivitySquare, MoveRight, Radar, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import {
  defaultScenarioKey,
  getScenarioConfig,
  listScenarioInsights,
  listScenarioSummaries,
  type ScenarioDefinition,
  type ScenarioKey,
} from "@/lib/scenarios";
import { CommandCenterPanel } from "@/components/command-center/command-center-panel";
import { CommandCenterMap } from "@/components/command-center/command-center-map";

type ScenarioInsights = {
  signals: ScenarioDefinition["liveSignals"];
  aiInsights: ScenarioDefinition["aiInsights"];
  kpis: ScenarioDefinition["kpis"];
  actions: ScenarioDefinition["actions"];
};

export function CommandCenterSection() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>(defaultScenarioKey);
  const [focus, setFocus] = useState(45);

  const scenarioSummaries = useMemo(() => listScenarioSummaries(), []);
  const scenario = getScenarioConfig(selectedScenario);
  const insights = useMemo<ScenarioInsights>(() => {
    const result = listScenarioInsights(selectedScenario);
    if (Array.isArray(result)) {
      return {
        signals: [] as ScenarioInsights["signals"],
        aiInsights: [] as ScenarioInsights["aiInsights"],
        kpis: [] as ScenarioInsights["kpis"],
        actions: [] as ScenarioInsights["actions"],
      };
    }
    return result as ScenarioInsights;
  }, [selectedScenario]);

  if (!scenario) {
    return null;
  }

  return (
    <Section id="command-center" className="pt-16">
      <Container className="space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-200">
            <Radar className="h-3.5 w-3.5" />
            Command Console
          </span>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            Immersive GIS fused with AI copilots for mission-grade city operations.
          </h2>
          <p className="text-base leading-7 text-foreground/70">
            Dive into a live command environment where GIS City Analysis, predictive forecasts, and anomaly monitors
            converge. Toggle between mobility, energy, climate, and safety scenarios while orchestration logic keeps
            every agency aligned.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
          <CommandCenterPanel
            scenario={scenario}
            scenarioSummaries={scenarioSummaries}
            onScenarioSelect={setSelectedScenario}
            focus={focus}
            onFocusChange={setFocus}
            insights={insights}
          />

          <div className="relative">
            <CommandCenterMap scenario={scenario} focus={focus} />
            <MapOverlays scenarioName={scenario.name} focus={focus} insights={insights} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function MapOverlays({
  scenarioName,
  focus,
  insights,
}: {
  scenarioName: string;
  focus: number;
  insights: ScenarioInsights;
}) {
  const primaryInsight = insights.aiInsights[0];
  const primaryAction = insights.actions[0];
  const confidence = primaryInsight ? Math.round(primaryInsight.confidence * 100) : 0;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="rounded-3xl border border-white/10 bg-surface/70 px-5 py-4 text-xs uppercase tracking-[0.3em] text-foreground/50 shadow-[0_35px_90px_-40px_rgba(59,130,246,0.68)] backdrop-blur-xl">
          <p className="flex items-center gap-2 text-foreground/60">
            <Sparkles className="h-3.5 w-3.5 text-primary-200" />
            Scenario
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.18em] text-white">{scenarioName}</p>
        </div>

        {primaryInsight ? (
          <div className="max-w-sm rounded-3xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-foreground/70 shadow-[0_25px_80px_-50px_rgba(124,58,237,0.6)] backdrop-blur-xl">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary-200">
              <ActivitySquare className="h-3.5 w-3.5" />
              Insight Pulse
            </p>
            <p className="mt-2 text-foreground/80">{primaryInsight.title}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.35em] text-primary-200/80">
              Confidence {confidence}%
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="rounded-3xl border border-white/5 bg-black/40 px-5 py-4 text-sm text-primary-100 shadow-[0_25px_80px_-40px_rgba(14,165,233,0.6)] backdrop-blur-lg">
          <p className="text-[10px] uppercase tracking-[0.35em] text-primary-200">Action Queue</p>
          <div className="mt-2 flex items-start gap-3 text-left">
            <MoveRight className="mt-0.5 h-5 w-5" />
            <span className="text-sm leading-6">{primaryAction ?? "Awaiting next orchestration directive."}</span>
          </div>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-6 py-4 text-right text-xs uppercase tracking-[0.35em] text-foreground/60 shadow-[0_25px_80px_-45px_rgba(59,130,246,0.55)]">
          <p>Focus Horizon</p>
          <p className="mt-1 text-2xl font-semibold tracking-[0.2em] text-white">
            {Math.round((focus / 100) * 60)}m
          </p>
        </div>
      </div>
    </div>
  );
}
