import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable standalone output for Docker deployment
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    // Rewrites removed — all /api/* routes now use Next.js API route handlers
    // which inject the X-Gateway-Secret header server-side
};

export default nextConfig;
