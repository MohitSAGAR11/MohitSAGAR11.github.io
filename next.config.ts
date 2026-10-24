import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files in out/, served by GitHub Pages. No server needed.
  output: "export",
  // Pages can't run Next's image optimizer, so images in public/ ship pre-sized
  // (see scripts/grade_portrait.py).
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
