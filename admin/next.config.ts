import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/app",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
