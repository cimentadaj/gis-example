declare module "maplibre-gl/dist/maplibre-gl-csp-worker" {
  const MapLibreWorker: new (...args: unknown[]) => Worker;
  export default MapLibreWorker;
}
