import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/app",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
