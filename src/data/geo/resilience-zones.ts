import type { FeatureCollection } from "@/data/geo/types";

type ResilienceProperties = {
  zone: string;
  resilienceScore: number;
  primaryRisk: "Flood" | "Heat" | "Power";
  population: number;
  adaptationPriority: "Immediate" | "Planned" | "Monitoring";
};

export const resilienceZones: FeatureCollection<"Polygon", ResilienceProperties> = {
  type: "FeatureCollection",
  name: "ResilienceZones",
  features: [
    {
      type: "Feature",
      properties: {
        zone: "Harbor District",
        resilienceScore: 0.82,
        primaryRisk: "Flood",
        population: 186000,
        adaptationPriority: "Immediate",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.018, 40.699],
            [-74.002, 40.712],
            [-73.996, 40.706],
            [-74.01, 40.693],
            [-74.018, 40.699],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone: "Innovation Basin",
        resilienceScore: 0.67,
        primaryRisk: "Power",
        population: 94000,
        adaptationPriority: "Planned",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.999, 40.741],
            [-73.985, 40.748],
            [-73.973, 40.739],
            [-73.988, 40.733],
            [-73.999, 40.741],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone: "Northern Commons",
        resilienceScore: 0.9,
        primaryRisk: "Heat",
        population: 158000,
        adaptationPriority: "Monitoring",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.972, 40.795],
            [-73.958, 40.803],
            [-73.946, 40.792],
            [-73.96, 40.784],
            [-73.972, 40.795],
          ],
        ],
      },
    },
  ],
};
