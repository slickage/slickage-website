/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slickage-website.s3.us-west-2.amazonaws.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
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
