# Zeya UGC Portfolio (InfluencerPortfolio-P1)

A minimal, fast portfolio for a UGC creator in Skin & Hair Care. Built with Next.js (App Router), Tailwind CSS, and Framer Motion. Designed to feel calm, modern, and mobile‑first while supporting image and video posts, lightbox viewing, sharing, and basic engagement (likes).

- Repo: [zebwoy/InfluencerPortfolio-P1](https://github.com/zebwoy/InfluencerPortfolio-P1)
- Live (GitHub Pages): https://zebwoy.github.io/InfluencerPortfolio-P1/


## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Icons


## Core Features
- Portfolio Grid (images/videos) with smooth reveal animations
- Lightbox modal for focused viewing with type badge and metadata
- Share button generates direct links (opens a specific item using `?item=ID`)
- Video UX (desktop): hover to play, mouse leave to pause; protected controls (no download, disabled PiP, context menu disabled)
- Likes (local CSV storage) via API endpoints for GET/POST (local/serverful only)
- Admin section (login + uploader) to manage items and view basic analytics


## Timeline of Changes (High‑Level)
- Phase 1: Admin Login
  - Added password visibility toggle (eye icon)
  - Implemented minimal auth endpoint and cookie
- Phase 2: Admin UI Refresh
  - Full dark theme makeover for admin login and uploader
  - Drag & drop uploads, progress, basic analytics table
- Phase 3: Portfolio Page Enhancements
  - Stats component responsiveness; kept horizontal layout with better spacing
  - Implemented lightbox (Framer Motion) for focused viewing
  - Share button logic: generated `?item=ID` links; handles open‑on‑load
  - Fixed mobile lightbox sizing and close button ergonomics
  - Fixed action button clicks (stopPropagation) to avoid accidental modal open
- Phase 4: Video UX
  - Hover play on enter, pause on leave (desktop)
  - Protected videos: `controlsList="nodownload noremoteplayback"`, disabled PiP, blocked context menu
- Phase 5: Branding Watermark
  - Added dynamic watermark sourced from brand; later removed per feedback
- Phase 6: Deployment
  - Configured static export for GitHub Pages with `basePath: "/InfluencerPortfolio-P1"`
  - GitHub Actions workflow to export static site and deploy to Pages


## Local Development
Requirements: Node.js 18+

```bash
# install deps
npm ci

# run dev server
npm run dev

# lint
npm run lint

# production build (SSR build)
npm run build

# static export (what Pages uses)
npm run export
# output in ./out
```

Open http://localhost:3000 during development.


## Admin Panel (Local/Serverful Only)
- Admin login (default credentials use environment variables or fallbacks)
- Upload images/videos → saved into `public/uploads/`
- Portfolio data stored in `src/data/portfolio.json`
- Likes stored in `src/data/likes.csv`

Note: API routes live under `src/app/api/**` and require a serverful runtime (Node). They are not executed on GitHub Pages.


## Deployment: GitHub Pages
This repository is configured to deploy a static export of the site to GitHub Pages.

- `next.config.ts`
  - `output: 'export'`
  - `basePath: '/InfluencerPortfolio-P1'` in production
  - `images.unoptimized = true` (no Image Optimization on Pages)
- `.github/workflows/deploy.yml`
  - CI removes `src/app/api` during build (serverful routes are incompatible with static export)
  - Runs `npm run export`, adds `out/.nojekyll`, and deploys `out` to Pages

Steps to enable Pages:
1. Push to `main` (already configured)
2. In GitHub → Repository → Settings → Pages → Source: select “GitHub Actions”
3. Watch the Actions tab for the “Deploy to GitHub Pages” workflow to complete
4. Your site is available at: https://zebwoy.github.io/InfluencerPortfolio-P1/


## Hosting the APIs (Optional)
For likes, uploads, and admin auth to work in production, deploy the API routes to a serverful, free host (e.g. Render, Railway, Fly.io). Then point the client to that base URL:
- `src/app/portfolio/ClientPortfolio.tsx` → fetch portfolio items
- `src/app/portfolio/PortfolioGrid.tsx` → GET/POST likes per item

Example (pseudo):
```ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';
await fetch(`${API_BASE}/api/portfolio`);
await fetch(`${API_BASE}/api/portfolio/${itemId}/likes`, { method: 'POST', ... });
```


## Project Structure (excerpt)
```
src/
  app/
    about/
    admin/
    api/               # serverful-only, stripped during Pages build
    contact/
    portfolio/
  components/
  data/
  hooks/
  lib/
```


## Known Notes
- GitHub Pages build is static; API features won’t run there. They are preserved in the repo for local/serverful deployments.
- Direct item links use `?item=ID` and open in the lightbox on load.
- Videos are “hard to download” but not DRM‑protected (screen recording is still possible).


## License
MIT (or your preferred license).
