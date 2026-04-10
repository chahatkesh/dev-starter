import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  turbopack: {},
  output: "standalone", // For Docker production builds
};

export default nextConfig;
