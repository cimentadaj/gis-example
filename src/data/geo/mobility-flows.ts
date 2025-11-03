import type { FeatureCollection } from "@/data/geo/types";

type MobilityProperties = {
  corridor: string;
  peakLoad: number;
  offPeakLoad: number;
  avgSpeedKph: number;
  modeMix: { transit: number; micromobility: number; freight: number };
};

export const mobilityFlows: FeatureCollection<"LineString", MobilityProperties> = {
  type: "FeatureCollection",
  name: "MobilityFlows",
  features: [
    {
      type: "Feature",
      properties: {
        corridor: "Skyloop Express",
        peakLoad: 0.87,
        offPeakLoad: 0.42,
        avgSpeedKph: 38,
        modeMix: { transit: 0.56, micromobility: 0.28, freight: 0.16 },
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
        corridor: "Harbor Connector",
        peakLoad: 0.74,
        offPeakLoad: 0.31,
        avgSpeedKph: 26,
        modeMix: { transit: 0.41, micromobility: 0.36, freight: 0.23 },
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
        corridor: "North Ridge Arterial",
        peakLoad: 0.63,
        offPeakLoad: 0.29,
        avgSpeedKph: 32,
        modeMix: { transit: 0.48, micromobility: 0.34, freight: 0.18 },
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
