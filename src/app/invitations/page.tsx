import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { EditorialFooter } from "@/components/seo/EditorialFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { SEO_COLLECTIONS } from "@/lib/seo/collections";
import { HOMEPAGE_FAQS, SITE_NAME } from "@/lib/seo/siteConfig";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
} from "@/lib/seo/structuredData";
import {
  STARTER_TEMPLATES,
  resolveCardBackdropUrl,
} from "@/lib/templates/presets";
import { formatCategoryBadge } from "@/lib/templates/categories";
import { hexToRgba } from "@/lib/utils/colors";

export const metadata: Metadata = {
  title: "Live Digital Invitation Cards & Templates",
  description:
    "Browse all 23+ interactive wax-seal digital invitation card templates on Invitovix — Weddings, Nikah, Mehndi, Baraat, Valima, Birthdays, Baby Showers, Anniversaries & Galas.",
  alternates: {
    canonical: "/invitations",
  },
  openGraph: {
    title: `Live Digital Invitation Cards & Templates | ${SITE_NAME}`,
    description:
      "Explore interactive wax-seal invitation cards with background music, Google Maps directions, QR codes, and real-time RSVP tracking.",
    url: "/invitations",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `Live Digital Invitation Cards & Templates | ${SITE_NAME}`,
    description:
      "Explore interactive wax-seal invitation cards with music, maps, and live RSVP tracking.",
    images: ["/twitter-image"],
  },
};

export default function InvitationsHubPage() {
  const jsonLd = [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Invitation Cards", path: "/invitations" },
    ]),
    buildCollectionPageSchema({
      name: "Invitovix Live Digital Invitation Cards & Templates",
      description:
        "Complete catalog of interactive wax-seal digital invitation cards across Weddings, Birthdays, Showers, Graduations, Anniversaries, and Galas.",
      path: "/invitations",
      templates: STARTER_TEMPLATES,
    }),
    buildFaqSchema(HOMEPAGE_FAQS),
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
              href="/invitations/live-invitation-card"
              className="hidden sm:inline-flex text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Live Cards
            </Link>
            <Link
              href="/e/demo"
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
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
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-stone-900 transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-stone-900">Invitation Cards</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-amber-50/90 px-3.5 py-1 text-xs font-medium text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Invitovix Live Invitation Card Gallery</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-stone-950"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Live Digital Invitation Cards for Every Occasion
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Explore every interactive wax-seal invitation card collection on
            Invitovix. Customize colors, paper textures, portraits, music,
            venue maps, and live RSVPs in minutes — then share via WhatsApp,
            link, or QR code.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-stone-800 transition"
            >
              <span>Create Your Invitation Free</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
            <Link
              href="/e/demo"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50 transition"
            >
              <span>Preview Interactive Demo</span>
            </Link>
          </div>
        </section>

        {/* Occasion Directory Grid */}
        <section aria-labelledby="categories-heading" className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
              Browse by Occasion
            </p>
            <h2
              id="categories-heading"
              className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Dedicated Invitation Card Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEO_COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                href={`/invitations/${col.slug}`}
                className="group rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-2xs hover:shadow-lg hover:border-amber-300 transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                    {col.badge}
                  </span>
                  <h3 className="text-lg font-serif font-semibold text-stone-950 group-hover:text-amber-900 transition">
                    {col.navLabel}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {col.metaDescription}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 group-hover:text-amber-800">
                  <span>Explore {col.navLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Full Template Gallery */}
        <section aria-labelledby="all-templates-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
                Complete Catalog
              </p>
              <h2
                id="all-templates-heading"
                className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                All {STARTER_TEMPLATES.length} Signature Live Invitation Card
                Templates
              </h2>
            </div>
            <Link
              href="/login"
              className="text-xs font-semibold text-stone-900 underline underline-offset-4 hover:text-amber-800"
            >
              Customize any template in Studio →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STARTER_TEMPLATES.map((tpl) => {
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
                          alt={`${tpl.title} — ${badge} live digital invitation card template`}
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
                  Custom Live Card Studio
                </p>
              </div>
              <div className="p-4 w-full border-t border-amber-200/60 bg-white/80 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-stone-800">
                  Upload Backdrop &amp; Music
                </span>
                <span className="text-[10px] font-semibold text-amber-700 shrink-0">
                  Studio →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="rounded-3xl border border-stone-200/90 bg-white/90 p-7 sm:p-10 space-y-6">
          <h2
            className="text-2xl font-semibold text-stone-950"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Built-In Features Across Every Invitovix Digital Invitation Card
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Embossed wax-seal envelope opening animation",
              "Curated soundtrack & custom MP3 audio playback",
              "Real-time guest RSVP tracker with CSV export",
              "Interactive map pin & Google Maps directions",
              "Google Calendar & Apple .ics save-the-date sync",
              "Multi-language cards (English, Urdu, Arabic, Hindi & more)",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2.5 text-sm text-stone-700"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <EditorialFooter />
    </div>
  );
}
