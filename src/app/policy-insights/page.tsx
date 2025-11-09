"use client";

import { TopBar } from "@/components/layout/top-bar";
import { PolicyInsightsExperience } from "@/components/policy-insights/policy-insights-experience";

export default function PolicyInsightsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <PolicyInsightsExperience variant="standalone" />
      </main>
    </div>
  );
}
