/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "martinfowler.com", "localhost"],
  },
};

module.exports = nextConfig;
