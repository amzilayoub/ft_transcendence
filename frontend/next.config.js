/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // all these domains are temporary, for testing purposes.
    domains: [
      "localhost",
      "cdn.intra.42.fr",
      "images.unsplash.com",
      "martinfowler.com",
      "variety.com",
      "img.freepik.com",
      "images.saymedia-content.com",
      "encrypted-tbn0.gstatic.com",
      "miro.medium.com",
    ],
  },
};

module.exports = nextConfig;
