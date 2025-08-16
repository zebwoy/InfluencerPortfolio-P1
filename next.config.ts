import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];

const nextConfig: NextConfig = {
  // Removed static export to enable dynamic API routes
  images: { unoptimized: true },
  // If deploying to GitHub Pages under a subpath, set basePath and assetPrefix
  ...(process.env.NEXT_PUBLIC_BASE_PATH || repo
    ? {
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || `/${repo}`,
        assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || `/${repo}/`,
      }
    : {}),
};

export default nextConfig;
