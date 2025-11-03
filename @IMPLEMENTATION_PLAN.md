# Implementation Plan – Nexus Consulting Smart City Dashboard

## Objectives
- Deliver a production-grade GIS dashboard that convinces smart-city executives Nexus Consulting already operates a full AI/ML command center.
- Keep the experience minimal, Notion-esque, and map-first while highlighting three core capabilities: SDG-aware digital twins, automated VLR workflows, and explainable AI pipelines.
- Work strictly in the frontend, using realistic metrics, layers, and copy that feel grounded in applied city operations.

## Task Backlog (ordered by priority)
1. **Restore GIS Basemap & Spatial Layer Styling** _(✅ Completed)_
   - Resolved the MapLibre raster brightness violation so the base tiles render reliably.
   - Confirmed the digital twin canvas now loads with visible hotspots, flows, and choropleths on first paint.
   - Kept resize and module-switch handling intact so the map fills the primary panel across breakpoints.

2. **Digital Twin Module Refinement** _(✅ Completed)_
   - Stretched the twin map to a hero canvas and moved supporting insight cards to a slimmer rail so the layout stays minimal.
   - Focused the KPI strip on the two SDG-critical numbers and rewrote the side panels (hotspots, playbook, sweep slider) in plain language.
   - Synced hotspot callouts, readiness forecasts, and slider feedback so each highlight tells a clear anomaly/prediction story.

3. **VLR Automation Journey** _(⏳ Pending)_
   - Rebuild stage interactions so clicking each step surfaces concise plots/metrics/text describing the automated evidence pass.
   - Use simple copy and a consistent light aesthetic; avoid clutter while communicating end-to-end automation.

4. **AI Pipelines Snapshot** _(⏳ Pending)_
   - Present the city profiling forecasts, demand trends, and resilience signals with charts that feel production-ready.
   - Keep the module lightweight but ensure every card ties back to actionable urban insights.

5. **QA & Build Validation** _(⏳ Pending)_
   - Smoke-test critical interactions (map load, module switching, slider, stage selection).
   - Run `npm run lint` and `npm run build` to confirm the bundle is clean.
   - Stage commit-ready notes for the client walkthrough.

## Progress Log
- **2025-11-03**: Cleared the MapLibre brightness error, restoring the light basemap and ensuring scenario overlays render immediately when the dashboard loads.
- **2025-11-03**: Rebuilt the digital twin view with a larger map, simplified KPI strip, hotspot rail, and readiness sparkline so the SDG localisation story reads clearly at a glance.
