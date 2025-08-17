# Zeya UGC Portfolio (InfluencerPortfolio-P1)

A minimal, fast portfolio for a UGC creator in Skin & Hair Care. Built with Next.js (App Router), Tailwind CSS, and Framer Motion. Designed to feel calm, modern, and mobile‑first while supporting image and video posts, lightbox viewing, sharing, and basic engagement (likes).

- Repo: [zebwoy/InfluencerPortfolio-P1](https://github.com/zebwoy/InfluencerPortfolio-P1)
- Live (GitHub Pages): https://zebwoy.github.io/InfluencerPortfolio-P1/


## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Icons


## Pages Overview (What you’ll find on the site)
- Home (`/`)
  - A short intro with a portrait, a simple headline, and quick links to social profiles.
  - Clean, centered layout with subtle motion so visitors instantly understand who this is for.

- About (`/about`)
  - A concise description of the creator’s philosophy: real, minimal, practical content.
  - Gentle animations make it feel alive without distraction.

- Portfolio (`/portfolio`)
  - The heart of the site. A grid of image and video posts with smooth reveal animations.
  - Click any item to open a lightbox (fullscreen view) with type tags and date.
  - Share button creates a direct link to the specific item (opens with `?item=ID`).
  - Video posts (desktop): hover to play, move mouse away to pause. Download options and PiP are disabled to discourage casual saving.
  - A lightweight stats strip shows total items, how many images, and how many videos.

- Contact (`/contact`)
  - Direct links to Instagram, WhatsApp, and Email.
  - A simple contact form with name, email, and message to get in touch quickly.

- Admin (`/admin`) — for local/serverful use
  - Sign in screen with a neat dark theme.
  - Uploader to add images/videos (saved to `public/uploads/`) and basic analytics.
  - Note: This requires serverful APIs, so it’s intended for local use or a server host (not GitHub Pages).


## Core Features
- Portfolio Grid (images/videos) with smooth reveal animations
- Lightbox modal for focused viewing with type badge and metadata
- Share button generates direct links (opens a specific item using `?item=ID`)
- Video UX (desktop): hover to play, mouse leave to pause; protected controls (no download, disabled PiP, context menu disabled)
- Likes (local CSV storage) via API endpoints for GET/POST (local/serverful only)
- Admin section (login + uploader) to manage items and view basic analytics


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
