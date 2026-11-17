import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  SEO_COLLECTIONS,
  getSeoCollectionBySlug,
  getTemplatesForSeoCollection,
} from "@/lib/seo/collections";
import {
  HOMEPAGE_FAQS,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_NAME,
} from "@/lib/seo/siteConfig";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildEventSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebApplicationSchema,
  buildWebsiteSchema,
} from "@/lib/seo/structuredData";
import { DEMO_EVENT, STARTER_TEMPLATES } from "@/lib/templates/presets";
import { LandingShowcase } from "@/components/landing/LandingShowcase";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Invitovix Technical & On-Page SEO Suite", () => {
  it("generates crawl-safe robots.txt blocking private app routes and advertising sitemap", () => {
    const config = robots();
    expect(config.sitemap).toMatch(/\/sitemap\.xml$/);

    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    expect(rules.length).toBeGreaterThan(0);
    const mainRule = rules[0];
    expect(mainRule.userAgent).toBe("*");

    const disallowList = Array.isArray(mainRule.disallow)
      ? mainRule.disallow
      : [mainRule.disallow];
    expect(disallowList).toContain("/dashboard");
    expect(disallowList).toContain("/studio");
    expect(disallowList).toContain("/api/");
    expect(disallowList).toContain("/login");
  });

  it("generates complete sitemap.xml covering homepage, hub, all 12 keyword collections, and live demo", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls.some((u) => /\/invitations$/.test(u))).toBe(true);
    expect(urls.some((u) => /\/e\/demo$/.test(u))).toBe(true);
    for (const col of SEO_COLLECTIONS) {
      expect(urls.some((u) => u.endsWith(`/invitations/${col.slug}`))).toBe(true);
    }

    // Never leak private/auth routes into sitemap
    expect(urls.some((u) => u.includes("/dashboard"))).toBe(false);
    expect(urls.some((u) => u.includes("/studio"))).toBe(false);
    expect(urls.some((u) => u.includes("/login"))).toBe(false);
  });

  it("maintains crisp SERP-safe metadata lengths and valid templates for every SEO collection", () => {
    expect(SITE_DEFAULT_TITLE.length).toBeLessThanOrEqual(68);
    expect(SITE_DEFAULT_DESCRIPTION.length).toBeLessThanOrEqual(195);

    const slugs = SEO_COLLECTIONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain("live-invitation-card");
    expect(slugs).toContain("wedding");
    expect(slugs).toContain("nikah");
    expect(slugs).toContain("mehndi");
    expect(slugs).toContain("birthday");

    for (const col of SEO_COLLECTIONS) {
      expect(col.metaTitle.length).toBeLessThanOrEqual(65);
      expect(col.metaDescription.length).toBeGreaterThanOrEqual(100);
      expect(col.metaDescription.length).toBeLessThanOrEqual(170);
      expect(col.faqs.length).toBeGreaterThanOrEqual(1);

      const templates = getTemplatesForSeoCollection(col);
      expect(templates.length).toBeGreaterThan(0);

      for (const rel of col.relatedSlugs) {
        expect(getSeoCollectionBySlug(rel)).toBeDefined();
      }
    }
  });

  it("builds valid Schema.org JSON-LD graphs for brand, app, FAQs, breadcrumbs, collections, and demo event", () => {
    const org = buildOrganizationSchema();
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe(SITE_NAME);

    const web = buildWebsiteSchema();
    expect(web["@type"]).toBe("WebSite");
    expect(web.name).toBe(SITE_NAME);

    const app = buildWebApplicationSchema();
    expect(app["@type"]).toBe("WebApplication");
    expect(Array.isArray(app.featureList)).toBe(true);

    const faq = buildFaqSchema(HOMEPAGE_FAQS);
    expect(faq["@type"]).toBe("FAQPage");
    expect((faq.mainEntity as unknown[]).length).toBe(HOMEPAGE_FAQS.length);

    const crumbs = buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Invitation Cards", path: "/invitations" },
    ]);
    expect(crumbs["@type"]).toBe("BreadcrumbList");

    const collection = buildCollectionPageSchema({
      name: "Wedding Cards",
      description: "Digital wedding cards",
      path: "/invitations/wedding",
      templates: STARTER_TEMPLATES.slice(0, 3),
    });
    expect(collection["@type"]).toBe("CollectionPage");

    const eventLd = buildEventSchema(DEMO_EVENT);
    expect(eventLd["@type"]).toBe("Event");
    expect(eventLd.name).toBeTruthy();
  });

  it("renders crawlable semantic HTML on homepage with primary keywords, occasion links, and FAQs", () => {
    const html = renderToString(<LandingShowcase />);

    expect(html).toContain("<main>");
    expect(html).toContain("<h1");
    expect(html).toContain("Live Digital Invitation Cards");
    expect(html).toContain('href="/invitations"');
    expect(html).toContain('href="/invitations/live-invitation-card"');
    expect(html).toContain('href="/invitations/wedding"');
    expect(html).toContain('href="/invitations/nikah"');
    expect(html).toContain('href="/invitations/birthday"');
    expect(html).toContain('href="/e/demo"');
    expect(html).toContain('href="/login"');
    expect(html).toContain("live digital invitation card template");
    expect(html).toContain(HOMEPAGE_FAQS[0].question);
  });
});
