import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  rules: {
    "no-console": "off", // Example: Disable `no-console` rule
    "react/no-unescaped-entities": "off", // Disable warning for unescaped entities
    // Add or modify rules as needed
  },
};

export default nextConfig;
