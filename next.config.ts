/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      // add any other external domains you use
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

export default nextConfig;
