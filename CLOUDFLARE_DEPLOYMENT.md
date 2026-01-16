# Cloudflare Pages Deployment Guide

## Prerequisites
- Node.js >= 18
- Cloudflare account
- Wrangler CLI installed

## Deployment Steps

### Option 1: Using Wrangler CLI Directly

1. Install dependencies:
```bash
npm install
```

2. Build for Cloudflare Pages:
```bash
npm run pages:build
```

3. Deploy to Cloudflare Pages:
```bash
npm run pages:deploy
```

### Option 2: Using Cloudflare Pages Dashboard

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (leave as default)

3. Add environment variables (if needed):
   - `BASIC_AUTH_USER`: Your basic auth username
   - `BASIC_AUTH_PASS`: Your basic auth password

### Configuration Files

- `wrangler.jsonc`: Cloudflare Pages configuration
- `next.config.js`: Next.js configuration optimized for Cloudflare
- `package.json`: Updated with Cloudflare build scripts

### Troubleshooting

If you encounter font loading issues during build:
- The build process requires internet access to fetch Google Fonts
- Ensure your build environment has proper internet connectivity
- Alternatively, consider using system fonts or locally hosted fonts

### Local Development with Cloudflare

To test locally with Cloudflare Pages environment:
```bash
npm run pages:dev
```

## Notes

- This project uses `@cloudflare/next-on-pages` to adapt Next.js for Cloudflare Pages
- The wrangler configuration specifies the build output directory
- Static assets and API routes are handled by Cloudflare Workers
