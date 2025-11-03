import type { FeatureCollection } from "@/data/geo/types";

type BuildingProperties = {
  name: string;
  height: number;
};

export const nycBuildings: FeatureCollection<"Polygon", BuildingProperties> = {
  type: "FeatureCollection",
  name: "SampleMidtownBuildings",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Emerald Plaza",
        height: 220,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9873, 40.7556],
            [-73.9865, 40.7556],
            [-73.9865, 40.7563],
            [-73.9873, 40.7563],
            [-73.9873, 40.7556],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Hudson Innovation Tower",
        height: 280,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9908, 40.7528],
            [-73.9898, 40.7528],
            [-73.9898, 40.7537],
            [-73.9908, 40.7537],
            [-73.9908, 40.7528],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Skyline Exchange",
        height: 190,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9814, 40.7602],
            [-73.9807, 40.7602],
            [-73.9807, 40.761],
            [-73.9814, 40.761],
            [-73.9814, 40.7602],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Civic Data Commons",
        height: 205,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9746, 40.7588],
            [-73.9739, 40.7588],
            [-73.9739, 40.7596],
            [-73.9746, 40.7596],
            [-73.9746, 40.7588],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Innovation Observatory",
        height: 230,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.9824, 40.7476],
            [-73.9816, 40.7476],
            [-73.9816, 40.7483],
            [-73.9824, 40.7483],
            [-73.9824, 40.7476],
          ],
        ],
      },
    },
  ],
};
