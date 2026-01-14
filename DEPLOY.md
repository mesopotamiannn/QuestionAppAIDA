# Deployment Guide (Cloudflare Pages)

## Prerequisites
- Cloudflare Account
- GitHub Repository (linked to this project)

## Setup Steps

1. **Push to GitHub**
   Ensure your code is pushed to your GitHub repository.

2. **Create Project on Cloudflare Pages**
   - Go to Cloudflare Dashboard > Pages > Create a project > Connect to git
   - Select your repository

3. **Build Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run pages:build`
   - **Build Output Directory**: `.vercel/output/static` (or `.vercel/output` depending on adapter version, usually defaults are fine with the preset)
   
   *Note: Using `@cloudflare/next-on-pages` allows us to run server-side logic on Cloudflare Workers.*

4. **Environment Variables**
   - If you have any secrets, add them in Settings > Environment variables.
   - For this project (Phase 6), no special env vars are required yet unless you added authentication.

5. **Deploy**
   - Click "Save and Deploy".

## Troubleshooting
- If the build fails on `next-pwa` errors, ensure the build command uses the correct flag or env vars.
- `NODE_VERSION`: You might need to set this to `20` or higher in Environment variables if default is old.

## Local Preview
To preview the Cloudflare build locally:
```bash
npm run pages:build
npx wrangler pages dev .vercel/output/static
```
