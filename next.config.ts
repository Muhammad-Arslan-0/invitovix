import type { NextConfig } from "next";

export default function createNextConfig(phase: string): NextConfig {
  return {
    // Isolate dev artifacts ("phase-development-server") so `next build` never breaks a live `next dev` server.
    // Use the string literal directly (not runtime `import` from "next/constants") to avoid Next 15's TS-config require-hook deleting `.mjs` extensions on Node 22.
    distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
    compress: true,
    poweredByHeader: false,
    images: {
      formats: ["image/avif", "image/webp"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**.supabase.co",
          pathname: "/storage/v1/object/public/**",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "origin-when-cross-origin" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ],
        },
      ];
    },
  };
}

