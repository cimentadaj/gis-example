import type { FeatureCollection } from "@/data/geo/types";

type DistrictSnapshotProperties = {
  district: string;
  sdgComposite: number;
  leadTheme: "Climate Adaptation" | "Housing Inclusion" | "Skills & Jobs";
  householdsReached: number;
  priority: "Accelerate" | "Stabilize" | "Monitor";
};

export const districtSnapshots: FeatureCollection<"Polygon", DistrictSnapshotProperties> = {
  type: "FeatureCollection",
  name: "DistrictSnapshots",
  features: [
    {
      type: "Feature",
      properties: {
        district: "Harbor Resilience Loop",
        sdgComposite: 0.86,
        leadTheme: "Climate Adaptation",
        householdsReached: 186000,
        priority: "Accelerate",
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
        district: "Innovation Basin Studio",
        sdgComposite: 0.72,
        leadTheme: "Skills & Jobs",
        householdsReached: 94000,
        priority: "Stabilize",
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
        district: "Northern Commons Network",
        sdgComposite: 0.9,
        leadTheme: "Housing Inclusion",
        householdsReached: 158000,
        priority: "Monitor",
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
