import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  fallbacks: {
    document: "/offline.html",
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
  compress: true,
  swcMinify: true,
};

export default withPWA(nextConfig);
