import type { MetadataRoute } from "next";
import { SEO_COLLECTIONS } from "@/lib/seo/collections";
import { absoluteUrl } from "@/lib/seo/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const collectionEntries: MetadataRoute.Sitemap = SEO_COLLECTIONS.map(
    (collection) => ({
      url: absoluteUrl(`/invitations/${collection.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: collection.slug === "live-invitation-card" || collection.slug === "wedding" ? 0.95 : 0.9,
    })
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/invitations"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...collectionEntries,
    {
      url: absoluteUrl("/e/demo"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];
}
