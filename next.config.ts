import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  reloadOnOnline: true,
  fallbacks: {
    document: "/offline.html",
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
  compress: true,
};

export default withPWA(nextConfig);
