export type CapabilityKind = "ai" | "gis" | "fabric" | "twin";

export type CapabilityPillar = {
  id: string;
  kind: CapabilityKind;
  label: string;
  title: string;
  metric: string;
  metricLabel: string;
  narrative: string;
};

type ScenarioKey = "sdg-localization" | "vlr-automation" | "city-profiling";

export const capabilityPillars: Record<ScenarioKey, CapabilityPillar[]> = {
  "sdg-localization": [
    {
      id: "sdg-ai",
      kind: "ai",
      label: "AI & Forecasting",
      title: "Predictive indicator uplift",
      metric: "+19%",
      metricLabel: "AI lift vs manual sequencing",
      narrative: "Backlog reprioritized every 30 minutes as transformers score SDG drift and community sentiment.",
    },
    {
      id: "sdg-gis",
      kind: "gis",
      label: "GIS Telemetry",
      title: "Indicator observatories online",
      metric: "12 nodes",
      metricLabel: "Live SDG observatories",
      narrative: "District observatories triangulate housing, climate, and health signals to surface bias-free gaps.",
    },
    {
      id: "sdg-fabric",
      kind: "fabric",
      label: "Data Fabric",
      title: "Evidence feeds harmonised",
      metric: "24 / 24",
      metricLabel: "Connectors in sync",
      narrative: "Civic, finance, and IoT connectors land with automated QA so stewards review aligned packets only.",
    },
    {
      id: "sdg-twin",
      kind: "twin",
      label: "Digital Twin",
      title: "Scenario refresh horizon",
      metric: "38 min",
      metricLabel: "Full SDG loop replay",
      narrative: "City twin replays district outcomes on every dataset drop, logging counterfactuals for council briefs.",
    },
  ],
  "vlr-automation": [
    {
      id: "vlr-ai",
      kind: "ai",
      label: "AI & Forecasting",
      title: "Narrative assembly engine",
      metric: "92%",
      metricLabel: "Evidence confidence",
      narrative: "Generative copilots stitch SDG sections with grounded citations and streaming sentiment context.",
    },
    {
      id: "vlr-gis",
      kind: "gis",
      label: "GIS Telemetry",
      title: "Spatial evidence coverage",
      metric: "17 corridors",
      metricLabel: "Spatial programs tracked",
      narrative: "Heatmaps show which borough programs feed the VLR binder and where governance review is pending.",
    },
    {
      id: "vlr-fabric",
      kind: "fabric",
      label: "Data Fabric",
      title: "Automation cadence",
      metric: "18 bots",
      metricLabel: "Pipelines on schedule",
      narrative: "Workflow bots reconcile invoices, policy updates, and assessor notes so analysts approve exceptions only.",
    },
    {
      id: "vlr-twin",
      kind: "twin",
      label: "Digital Twin",
      title: "Submission readiness",
      metric: "7 / 9",
      metricLabel: "Sections drafted",
      narrative: "Digital twin playback previews downstream impact of pending attestations before exporting the PDF.",
    },
  ],
  "city-profiling": [
    {
      id: "profile-ai",
      kind: "ai",
      label: "AI & Forecasting",
      title: "Scenario uplift delta",
      metric: "+6.4 pts",
      metricLabel: "Wellbeing index gain",
      narrative: "Simulation ensemble projects wellbeing lift per capital dollar and flags trade-offs in real time.",
    },
    {
      id: "profile-gis",
      kind: "gis",
      label: "GIS Telemetry",
      title: "District insight mesh",
      metric: "9 districts",
      metricLabel: "Profiles refreshed",
      narrative: "District polygons blend census, permitting, and climate risk for equity-first investment sequencing.",
    },
    {
      id: "profile-fabric",
      kind: "fabric",
      label: "Data Fabric",
      title: "Cross-department sync",
      metric: "15 feeds",
      metricLabel: "Pipelines harmonised",
      narrative: "Data fabric reconciles housing, mobility, and finance ledgers to collapse manual reporting cycles.",
    },
    {
      id: "profile-twin",
      kind: "twin",
      label: "Digital Twin",
      title: "Planning horizon",
      metric: "5 yrs",
      metricLabel: "Scenario forecast",
      narrative: "Digital twin animates multi-year investment pathways with sensitivity bands for policy debate.",
    },
  ],
};
