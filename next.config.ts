import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required to allow raw body parsing for Stripe webhooks
  experimental: {},
};

export default nextConfig;
