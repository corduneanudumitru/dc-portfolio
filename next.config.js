/** @type {import('next').NextConfig} */
const nextConfig = {
  // This review branch is deliberately isolated, including Git-triggered previews.
  env: {NEXT_PUBLIC_SANITY_PROJECT_ID:'x1g6b84l', NEXT_PUBLIC_SANITY_DATASET:'redesign-preview', NEXT_PUBLIC_SITE_PREVIEW:'true'},
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

module.exports = nextConfig;
