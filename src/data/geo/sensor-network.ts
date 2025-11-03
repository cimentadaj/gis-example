import type { FeatureCollection } from "@/data/geo/types";

type SensorProperties = {
  id: string;
  type: "AirQuality" | "Traffic" | "Power";
  health: "Nominal" | "At Risk" | "Offline";
  lastReadingMinutesAgo: number;
  anomalyScore: number;
};

export const sensorNetwork: FeatureCollection<"Point", SensorProperties> = {
  type: "FeatureCollection",
  name: "SensorNetwork",
  features: [
    {
      type: "Feature",
      properties: {
        id: "AQ-204",
        type: "AirQuality",
        health: "Nominal",
        lastReadingMinutesAgo: 4,
        anomalyScore: 0.18,
      },
      geometry: {
        type: "Point",
        coordinates: [-73.995, 40.734],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "TR-441",
        type: "Traffic",
        health: "At Risk",
        lastReadingMinutesAgo: 2,
        anomalyScore: 0.63,
      },
      geometry: {
        type: "Point",
        coordinates: [-74.006, 40.715],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "PW-109",
        type: "Power",
        health: "Nominal",
        lastReadingMinutesAgo: 1,
        anomalyScore: 0.12,
      },
      geometry: {
        type: "Point",
        coordinates: [-73.958, 40.79],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "TR-512",
        type: "Traffic",
        health: "Offline",
        lastReadingMinutesAgo: 17,
        anomalyScore: 0.82,
      },
      geometry: {
        type: "Point",
        coordinates: [-73.981, 40.758],
      },
    },
  ],
};
