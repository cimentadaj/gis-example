import type { FeatureCollection } from "@/data/geo/types";

type IndicatorSiteProperties = {
  id: string;
  indicator: string;
  sdgTarget: string;
  status: "On Track" | "Watch" | "Delayed";
  progressIndex: number;
  refreshMinutesAgo: number;
  district: string;
};

export const indicatorSites: FeatureCollection<"Point", IndicatorSiteProperties> = {
  type: "FeatureCollection",
  name: "IndicatorSites",
  features: [
    {
      type: "Feature",
      properties: {
        id: "SDG-204",
        indicator: "Affordable Housing Access",
        sdgTarget: "SDG 11.1",
        status: "On Track",
        progressIndex: 0.82,
        refreshMinutesAgo: 4,
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
        id: "SDG-441",
        indicator: "Green Schoolyards Coverage",
        sdgTarget: "SDG 3.4",
        status: "Watch",
        progressIndex: 0.63,
        refreshMinutesAgo: 2,
        district: "Harbor Resilience Loop",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.006, 40.715],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "SDG-109",
        indicator: "Clean Energy Retrofits",
        sdgTarget: "SDG 7.2",
        status: "On Track",
        progressIndex: 0.74,
        refreshMinutesAgo: 1,
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
        id: "SDG-512",
        indicator: "Community Health Access",
        sdgTarget: "SDG 3.8",
        status: "Delayed",
        progressIndex: 0.41,
        refreshMinutesAgo: 17,
        district: "Care Corridor Spine",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.981, 40.758],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "SDG-317",
        indicator: "Urban Cooling Canopies",
        sdgTarget: "SDG 13.1",
        status: "Watch",
        progressIndex: 0.58,
        refreshMinutesAgo: 3,
        district: "Innovation Basin Studio",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.973, 40.743],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "SDG-204B",
        indicator: "Resilient Infrastructure Upgrades",
        sdgTarget: "SDG 9.1",
        status: "Watch",
        progressIndex: 0.69,
        refreshMinutesAgo: 6,
        district: "Harbor Resilience Loop",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.01, 40.706],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "SDG-626",
        indicator: "Civic Wi-Fi Coverage",
        sdgTarget: "SDG 9.c",
        status: "On Track",
        progressIndex: 0.77,
        refreshMinutesAgo: 5,
        district: "Civic Learning Spine",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.948, 40.772],
      },
    },
  ],
};
