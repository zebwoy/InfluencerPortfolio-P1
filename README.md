# Client UGC Portfolio (InfluencerPortfolio-P1)

A minimal, fast portfolio for a UGC creator in Skin & Hair Care. Built with Next.js (App Router), Tailwind CSS, and Framer Motion. Designed to feel calm, modern, and mobile‑first while supporting image and video posts, lightbox viewing, sharing, and likes.

- Repo: [zebwoy/InfluencerPortfolio-P1](https://github.com/zebwoy/InfluencerPortfolio-P1)
- Live (Netlify): add your Netlify site URL here


## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Drizzle ORM + Neon Postgres (serverless HTTP driver)
- Cloudinary (media storage)


## Pages Overview (What you’ll find on the site)
- Home (`/`): Intro, portrait, and social links
- About (`/about`): Short philosophy and approach
- Portfolio (`/portfolio`): Grid of image/video posts with lightbox, direct-item share (`?item=ID`), and desktop hover play/pause for videos
- Contact (`/contact`): Instagram, WhatsApp, Email, and a simple form
- Admin (`/admin`): Login + uploader to add images/videos; basic analytics


## Core Features
- Portfolio grid with smooth reveal animations
- Lightbox modal (image/video) with metadata
- Share button generates direct links (`?item=ID`)
- Desktop video UX: hover to play, mouse leave to pause; download/PiP disabled
- Likes backed by Neon Postgres
- Admin uploader stores media in Cloudinary and metadata in Neon


## Deployment: Netlify (Dynamic)
This project runs dynamically on Netlify using the official Next.js plugin.

- `netlify.toml`
  - `@netlify/plugin-nextjs` enables SSR/ISR
- Environment variables (Site settings → Environment variables)
  - ADMIN_USERNAME = your-admin-username
  - ADMIN_PASSWORD = your-strong-password
  - DATABASE_URL = paste the value from `NETLIFY_DATABASE_URL`
  - CLOUDINARY_CLOUD_NAME = your-cloud-name
  - CLOUDINARY_API_KEY = your-api-key
  - CLOUDINARY_API_SECRET = your-api-secret

After setting env vars, trigger a redeploy in Netlify.


## Data & Media Architecture
- Database: Neon Postgres via Drizzle ORM
  - Tables (defined in `src/lib/schema.ts`):
    - `portfolio_items(id, type, src, thumb?, created_at)`
    - `likes(id, item_id, ip_address, user_agent, created_at)`
- Media: Cloudinary
  - Admin uploads go to Cloudinary (folder `portfolio`), returning a public URL stored in DB


## Local Development
Requirements: Node.js 18+

```bash
# install deps
npm ci

# start dev server (reads .env.local)
npm run dev

# lint
npm run lint

# production build
npm run build
```

Create `.env.local` for local dev (do not commit secrets):
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me
DATABASE_URL=postgresql://...neon...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Open http://localhost:3000.


## API Endpoints (serverless)
- `GET /api/portfolio` → list items (from Neon)
- `POST /api/portfolio/upload` → upload media to Cloudinary, insert item in Neon
- `GET /api/portfolio/[id]/likes` → return `{ likeCount, isLiked }`
- `POST /api/portfolio/[id]/likes` → like/unlike by client IP
- `POST /api/admin/login` → cookie-based session using env admin creds


## Project Structure (excerpt)
```
src/
  app/
    about/
    admin/
    api/
      portfolio/
        [id]/likes/route.ts
        upload/route.ts
        route.ts
      admin/
        login/route.ts
    contact/
    portfolio/
  components/
  hooks/
  lib/
    db.ts
    schema.ts
    cloudinary.ts
```


## Notes
- Netlify doesn’t persist local file writes; all persisted data is in Neon, and media is in Cloudinary.
- Direct item links use `?item=ID` and open in the lightbox on load.
- Videos are “hard to download” but not DRM‑protected (screen recording is still possible).


## License
MIT (or your preferred license).
