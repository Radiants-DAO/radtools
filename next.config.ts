import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to acknowledge Turbopack is being used
  // This silences the warning about having no turbopack config
  turbopack: {},
};

export default nextConfig;
