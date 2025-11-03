import type { FeatureCollection } from "@/data/geo/types";

type SensorProperties = {
  id: string;
  type: "AirQuality" | "Traffic" | "Power";
  health: "Nominal" | "At Risk" | "Offline";
  lastReadingMinutesAgo: number;
  anomalyScore: number;
  district: string;
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
        district: "Aurora District",
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
        district: "Harbor Connector",
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
        district: "Aurora Medical Campus",
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
        district: "Theater Spine",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.981, 40.758],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "AQ-317",
        type: "AirQuality",
        health: "At Risk",
        lastReadingMinutesAgo: 3,
        anomalyScore: 0.58,
        district: "Innovation Basin",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.973, 40.743],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "PW-204",
        type: "Power",
        health: "At Risk",
        lastReadingMinutesAgo: 6,
        anomalyScore: 0.45,
        district: "Harbor District",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.01, 40.706],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "TR-626",
        type: "Traffic",
        health: "Nominal",
        lastReadingMinutesAgo: 5,
        anomalyScore: 0.27,
        district: "Civic Loop",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.948, 40.772],
      },
    },
  ],
};
