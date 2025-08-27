import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizePackageImports: ['motion', 'lucide-react'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slickage-website.s3.us-west-2.amazonaws.com',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    qualities: [85],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,
  poweredByHeader: false,

  allowedDevOrigins: ['us.posthog.com', 'us.i.posthog.com', 'us-assets.i.posthog.com'],

  // Reverse proxy for PostHog to bypass ad blockers and improve data collection
  async rewrites() {
    return [
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
    ];
  },
};

export default nextConfig;
