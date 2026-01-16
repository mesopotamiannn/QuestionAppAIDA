import type { NextConfig } from "next";

const isCloudflarePages = process.env.CF_PAGES === "1";

const nextConfig: NextConfig = {
  output: "export",
};

// PWAはローカル/通常運用だけON、CloudflareビルドではOFF
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: isCloudflarePages || process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);
