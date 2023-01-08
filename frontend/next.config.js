/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "martinfowler.com",
      "localhost",
      "variety.com",
      "cdn.intra.42.fr",
    ],
  },
};

module.exports = nextConfig;
