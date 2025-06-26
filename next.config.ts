import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Increase body size limit for Server Actions
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Also configure for API routes
  // api: {
  //   bodyParser: {
  //     sizeLimit: '10mb',
  //   },
  // },
  // Image optimization settings if you're handling images
  images: {
    domains: ['api.dicebear.com', 'localhost'], // Add any image domains you use
    unoptimized: false,
  },
};

export default nextConfig;