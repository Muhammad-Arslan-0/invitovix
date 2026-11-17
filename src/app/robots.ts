import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/seo/siteConfig";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/invitations", "/invitations/", "/e/demo"],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/studio",
          "/studio/",
          "/api/",
          "/auth/",
          "/login",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
