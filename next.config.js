/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
      },
      {
        hostname: "images.pexels.com",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
