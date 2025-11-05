import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "gis-example";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
  output: "export",
};

export default nextConfig;
