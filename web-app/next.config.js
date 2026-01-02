/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google Auth images
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // For GitHub Auth images
      },
    ],
  },
};

module.exports = nextConfig;
