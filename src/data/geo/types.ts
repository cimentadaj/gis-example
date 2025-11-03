export type GeometryType = "Polygon" | "LineString" | "Point";

type GeometryCoordinates<T extends GeometryType> = T extends "Polygon"
  ? number[][][]
  : T extends "LineString"
    ? number[][]
    : number[];

export type Feature<Geometry extends GeometryType, Properties extends Record<string, unknown>> = {
  type: "Feature";
  geometry: {
    type: Geometry;
    coordinates: GeometryCoordinates<Geometry>;
  };
  properties: Properties;
};

export type FeatureCollection<
  Geometry extends GeometryType,
  Properties extends Record<string, unknown>,
> = {
  type: "FeatureCollection";
  name: string;
  features: Array<Feature<Geometry, Properties>>;
};
