/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Cloudflare Pages deployment
  output: 'export',
  // Disable image optimization for Cloudflare Pages
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
