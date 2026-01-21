/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  images: {
    domains: ['cdn.discordapp.com'],
  },
};

module.exports = nextConfig;
