import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Wand2,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { EditorialFooter } from "@/components/seo/EditorialFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SEO_COLLECTIONS,
  getSeoCollectionBySlug,
  getTemplatesForSeoCollection,
} from "@/lib/seo/collections";
import { SITE_NAME } from "@/lib/seo/siteConfig";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
} from "@/lib/seo/structuredData";
import { formatCategoryBadge } from "@/lib/templates/categories";
import { resolveCardBackdropUrl } from "@/lib/templates/presets";
import { hexToRgba } from "@/lib/utils/colors";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEO_COLLECTIONS.map((col) => ({ slug: col.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getSeoCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Invitation Collection Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = `/invitations/${collection.slug}`;

  return {
    title: collection.metaTitle,
    description: collection.metaDescription,
    keywords: collection.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      siteName: SITE_NAME,
      title: `${collection.metaTitle} | ${SITE_NAME}`,
      description: collection.metaDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${collection.navLabel} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.metaTitle} | ${SITE_NAME}`,
      description: collection.metaDescription,
      images: ["/twitter-image"],
    },
  };
}

export default async function InvitationCollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getSeoCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const templates = getTemplatesForSeoCollection(collection);
  const relatedCollections = collection.relatedSlugs
    .map((relSlug) => getSeoCollectionBySlug(relSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const canonicalPath = `/invitations/${collection.slug}`;
  const jsonLd = [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Invitation Cards", path: "/invitations" },
      { name: collection.navLabel, path: canonicalPath },
    ]),
    buildCollectionPageSchema({
      name: `${collection.metaTitle} | ${SITE_NAME}`,
      description: collection.metaDescription,
      path: canonicalPath,
      templates,
    }),
    buildFaqSchema(collection.faqs),
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg text-stone-900">
      <JsonLd data={jsonLd} />

      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fcfaf7]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandMark
              size="sm"
              rounded="xl"
              decorative
              className="group-hover:scale-105 transition"
            />
            <span className="font-serif text-xl font-semibold tracking-wide">
              Invitovix
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-4"
          >
            <Link
              href="/invitations"
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
            >
              All Templates
            </Link>
            <Link
              href={`/e/demo?template=${encodeURIComponent(collection.featuredDemoPresetId)}`}
              className="hidden sm:inline-flex text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Live Demo
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-stone-800 transition"
            >
              <span>Creator Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-stone-900 transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/invitations"
                className="hover:text-stone-900 transition"
              >
                Invitation Cards
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-stone-900">
              {collection.navLabel}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-amber-50/90 px-3.5 py-1 text-xs font-medium text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Invitovix · {collection.badge}</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-stone-950"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            {collection.h1}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            {collection.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-stone-800 transition"
            >
              <span>Start Designing Free</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
            <Link
              href={`/e/demo?template=${encodeURIComponent(collection.featuredDemoPresetId)}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50 transition"
            >
              <span>Try Live {collection.navLabel} Demo</span>
            </Link>
          </div>
        </section>

        {/* Curated Templates Grid */}
        <section aria-labelledby="templates-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
                Ready-to-Customize Designs
              </p>
              <h2
                id="templates-heading"
                className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                Featured {collection.navLabel} Templates
              </h2>
            </div>
            <Link
              href="/invitations"
              className="text-xs font-semibold text-stone-900 underline underline-offset-4 hover:text-amber-800"
            >
              View all invitation templates →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {templates.map((tpl) => {
              const p = tpl.default_config.theme.palette;
              const sceneUrl = resolveCardBackdropUrl(
                tpl.default_config.theme.cardArt
              );
              const badge = formatCategoryBadge(tpl.category);

              return (
                <Link
                  key={tpl.id}
                  href={`/e/demo?template=${encodeURIComponent(tpl.default_config.theme.presetId)}`}
                  className="group rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs hover:shadow-xl transition flex flex-col"
                >
                  <div
                    className="h-44 w-full p-5 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    style={{ backgroundColor: p.background }}
                  >
                    {sceneUrl && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sceneUrl}
                          alt={`${tpl.title} — ${collection.navLabel} template on Invitovix`}
                          loading="lazy"
                          decoding="async"
                          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-55"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at 50% 48%, ${hexToRgba(p.background, 0.7)}, ${hexToRgba(p.background, 0.24)})`,
                          }}
                        />
                      </>
                    )}
                    <span
                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-white/35"
                      style={{
                        backgroundColor:
                          tpl.default_config.envelope.waxSeal.color,
                      }}
                    >
                      {tpl.default_config.envelope.waxSeal.monogram}
                    </span>
                    <p
                      className="relative z-10 mt-3 text-base font-semibold line-clamp-1"
                      style={{ color: p.primary }}
                    >
                      {tpl.default_config.content.headline}
                    </p>
                    <p
                      className="relative z-10 text-[11px] uppercase tracking-widest mt-1"
                      style={{ color: p.mutedText }}
                    >
                      {badge}
                    </p>
                  </div>
                  <div className="p-4 w-full border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-stone-800 line-clamp-1">
                      {tpl.title}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700 shrink-0 group-hover:underline">
                      Live Demo →
                    </span>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/login"
              className="rounded-3xl border border-dashed border-amber-400/70 bg-gradient-to-br from-[#FAF6EE] to-amber-50/60 overflow-hidden shadow-2xs hover:shadow-xl hover:border-stone-900 transition flex flex-col justify-between group"
            >
              <div className="h-44 w-full p-5 flex flex-col items-center justify-center text-center">
                <span className="w-12 h-12 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                  <Wand2 className="w-5 h-5" />
                </span>
                <p className="mt-3 text-base font-serif font-semibold text-stone-900">
                  Design Your Own
                </p>
                <p className="text-[11px] uppercase tracking-widest mt-1 text-amber-800">
                  Custom {collection.badge}
                </p>
              </div>
              <div className="p-4 w-full border-t border-amber-200/60 bg-white/80 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-stone-800">
                  Open Creator Studio
                </span>
                <span className="text-[10px] font-semibold text-amber-700 shrink-0">
                  Start Free →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Editorial Guide & Features */}
        <section className="rounded-3xl border border-stone-200/90 bg-white/95 p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
              Crafted for Mobile &amp; WhatsApp Sharing
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-stone-950"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              {collection.editorialHeading}
            </h2>
            {collection.editorialParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base text-stone-600 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-stone-200/80 bg-[#fcfaf7] p-6 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
              Included in Every Card
            </h3>
            <ul className="space-y-2.5">
              {collection.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
              Common Questions
            </p>
            <h2
              id="faq-heading"
              className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              {collection.navLabel} FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {collection.faqs.map((faq, idx) => (
              <details
                key={faq.question}
                open={idx === 0}
                className="group rounded-2xl border border-stone-200 bg-white/95 px-6 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-stone-900">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-stone-500 transition-transform group-open:rotate-180 shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Occasions */}
        {relatedCollections.length > 0 && (
          <section aria-labelledby="related-heading" className="space-y-5">
            <h2
              id="related-heading"
              className="text-xl sm:text-2xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Explore Related Digital Invitation Cards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCollections.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/invitations/${rel.slug}`}
                  className="group rounded-2xl border border-stone-200 bg-white/90 p-5 hover:border-amber-300 hover:shadow-md transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-700">
                      {rel.badge}
                    </span>
                    <h3 className="mt-1 text-base font-serif font-semibold text-stone-900 group-hover:text-amber-900">
                      {rel.navLabel}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 group-hover:text-amber-800">
                    <span>Browse cards</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <EditorialFooter />
    </div>
  );
}
