import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: "C:/Users/stanf/Documents/coding/repos/mood-tracker",
  },
};

export default withPWA(nextConfig);
