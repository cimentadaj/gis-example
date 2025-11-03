import type { FeatureCollection } from "@/data/geo/types";

type ImpactCorridorProperties = {
  program: string;
  sdgTarget: string;
  impactScore: number;
  stage: "Scaling" | "Pilot" | "Discovery";
  leadAgency: string;
};

export const impactCorridors: FeatureCollection<"LineString", ImpactCorridorProperties> = {
  type: "FeatureCollection",
  name: "ImpactCorridors",
  features: [
    {
      type: "Feature",
      properties: {
        program: "Civic Learning Spine",
        sdgTarget: "SDG 4.3 – Lifelong Learning Access",
        impactScore: 0.91,
        stage: "Scaling",
        leadAgency: "Department of Learning Innovation",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.012, 40.704],
          [-74.002, 40.716],
          [-73.989, 40.73],
          [-73.977, 40.744],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        program: "Coastal Resilience Walk",
        sdgTarget: "SDG 13.1 – Climate Preparedness",
        impactScore: 0.84,
        stage: "Pilot",
        leadAgency: "Urban Coast Office",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.018, 40.708],
          [-74.009, 40.721],
          [-73.995, 40.732],
          [-73.984, 40.741],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        program: "Innovation Commons Stroll",
        sdgTarget: "SDG 11.7 – Public Space Equity",
        impactScore: 0.79,
        stage: "Discovery",
        leadAgency: "Civic Commons Lab",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.982, 40.768],
          [-73.971, 40.778],
          [-73.959, 40.785],
          [-73.947, 40.793],
        ],
      },
    },
  ],
};
