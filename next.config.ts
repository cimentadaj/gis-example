import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const repoName = "gis-example";

export default function getNextConfig(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    images: {
      unoptimized: true,
    },
    assetPrefix: isDev ? "" : `/${repoName}/`,
    basePath: isDev ? "" : `/${repoName}`,
    output: "export",
  };
}
