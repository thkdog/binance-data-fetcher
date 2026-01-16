/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Cloudflare Pages deployment with @cloudflare/next-on-pages
  // Note: Do NOT set output to 'export' as this app has API routes
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
