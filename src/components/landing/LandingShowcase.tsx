"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Cake,
  CalendarCheck,
  Heart,
  Loader2,
  Music,
  Palette,
  PartyPopper,
  QrCode,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { InvitationDomainId } from "@/types/invitation";
import {
  INVITATION_DOMAINS,
  formatCategoryBadge,
  getDomainConfig,
} from "@/lib/templates/categories";
import {
  STARTER_TEMPLATES,
  WEDDING_STARTER_TEMPLATES,
  getTemplatesByDomain,
  resolveCardBackdropUrl,
} from "@/lib/templates/presets";
import { hexToRgba } from "@/lib/utils/colors";
import { MiniEnvelopeDemo } from "./MiniEnvelopeDemo";
import { BrandMark } from "@/components/ui/BrandMark";
import { startNavigation } from "@/components/ui/NavigationProgress";

const DOMAIN_ICONS: Record<InvitationDomainId, typeof Heart> = {
  wedding: Heart,
  birthday: Cake,
  gala: Award,
  party: PartyPopper,
};

const FEATURES = [
  {
    icon: Palette,
    title: "Real-Time Design Studio",
    desc: "Customize palettes, paper textures, scalloped wax-seal emblems, and scene copy tailored to each celebration category.",
  },
  {
    icon: Music,
    title: "Browser-Safe Audio",
    desc: "Sound unlocks seamlessly inside the guest's tap-to-open gesture with smooth fade-ins and custom MP3 uploads.",
  },
  {
    icon: CalendarCheck,
    title: "Calendar & Maps Sync",
    desc: "One-tap Google Calendar, Apple .ics download, interactive map pin selection, and direct Google Maps venue directions.",
  },
  {
    icon: Users,
    title: "Real-Time RSVP Hub",
    desc: "Track attending headcounts, party sizes, dietary notes, and export guest lists to CSV.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    icon: Wand2,
    title: "Pick Your Category & Style",
    desc: "Choose a dedicated Wedding, Birthday, Gala, or Party & Shower template, then tune portraits, scenes, and music in Studio.",
  },
  {
    step: "02",
    icon: QrCode,
    title: "Publish Link & QR",
    desc: "Generate a clean `/e/your-event` link and print-ready QR code with rich WhatsApp link previews.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Guests Unseal & RSVP",
    desc: "Invitees tap your embossed wax seal, hear soundtrack music, save the date, and confirm in seconds.",
  },
];

export function LandingShowcase() {
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeDomain, setActiveDomain] =
    useState<InvitationDomainId>("wedding");
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function go(key: string, href: string) {
    setNavTarget(key);
    startNavigation();
    startTransition(() => {
      router.push(href);
    });
  }

  const activeDomainConfig = getDomainConfig(activeDomain);
  const visibleTemplates = getTemplatesByDomain(STARTER_TEMPLATES, activeDomain);

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg text-stone-900">
      {/* Sticky Editorial Navbar */}
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

          <nav className="flex items-center gap-3">
            <button
              type="button"
              onMouseEnter={() => router.prefetch("/e/demo")}
              onClick={() => go("nav-demo", "/e/demo")}
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition cursor-pointer inline-flex items-center gap-1.5"
            >
              {isPending && navTarget === "nav-demo" && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Live Demo</span>
            </button>
            <button
              type="button"
              onMouseEnter={() => router.prefetch("/login")}
              onClick={() => go("nav-studio", "/login")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-stone-800 transition cursor-pointer"
            >
              {isPending && navTarget === "nav-studio" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <span>Creator Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-amber-50/90 px-3.5 py-1 text-xs font-medium text-amber-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Wax-Seal Digital Invitations</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-stone-950"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Unseal moments that feel unforgettable.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
            Design bespoke animated invitations across strictly curated categories
            — Weddings (Nikah, Mehndi, Baraat, Valima), Birthdays, Black-Tie
            Galas, Baby Showers, and Graduations — each with its own tailored
            Creator Studio workflow.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => router.prefetch("/login")}
              onClick={() => go("hero-start", "/login")}
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-stone-900/15 hover:bg-stone-800 transition cursor-pointer"
            >
              {isPending && navTarget === "hero-start" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Opening Studio...</span>
                </>
              ) : (
                <>
                  <span>Start Designing Free</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => router.prefetch("/e/demo")}
              onClick={() => go("hero-demo", "/e/demo")}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-medium text-stone-800 shadow-2xs hover:bg-stone-50 transition cursor-pointer"
            >
              {isPending && navTarget === "hero-demo" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                  <span>Unsealing Demo...</span>
                </>
              ) : (
                <span>Try Guest Experience</span>
              )}
            </motion.button>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500">
            <span>
              {WEDDING_STARTER_TEMPLATES.length} Weddings Starter Aesthetics
            </span>
            <span className="text-amber-600">•</span>
            <span>Birthdays, Galas &amp; Showers</span>
            <span className="text-amber-600">•</span>
            <span>Real-Time RSVP Analytics</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <MiniEnvelopeDemo
            selectedIdx={selectedIdx}
            onSelectIdx={setSelectedIdx}
          />
        </motion.div>
      </section>

      {/* Feature Pillars */}
      <section className="border-y border-stone-200/80 bg-white/90 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
              Built for Hosts &amp; Guests
            </p>
            <h2
              className="mt-2 text-2xl sm:text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Every detail choreographed for mobile and desktop
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-stone-200 bg-[#fcfaf7] p-6 shadow-2xs hover:shadow-lg hover:border-amber-300/80 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-Step Celebration Flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-4">
        <div className="rounded-3xl border border-stone-200/80 bg-white/85 p-7 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WORKFLOW_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-2xl border border-amber-300/70 bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-700">
                      Step {item.step}
                    </p>
                    <h3 className="mt-1 text-base font-serif font-semibold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strictly Separated Category Collections Showcase */}
      <section id="templates" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
              {activeDomainConfig.collectionEyebrow}
            </p>
            <h2
              className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              {activeDomainConfig.collectionTitle}
            </h2>
            <p className="mt-1.5 text-sm text-stone-600 max-w-2xl">
              {activeDomainConfig.collectionSubtitle}
            </p>
          </div>
          <Link
            href="/login"
            className="text-xs font-semibold text-stone-900 underline underline-offset-4 hover:text-amber-800 transition shrink-0"
          >
            Customize any template in Studio →
          </Link>
        </div>

        {/* Separated Domain Collection Switcher */}
        <div
          role="tablist"
          aria-label="Browse invitation collections by category"
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          {INVITATION_DOMAINS.map((domain) => {
            const active = domain.id === activeDomain;
            const Icon = DOMAIN_ICONS[domain.id];
            const count = getTemplatesByDomain(
              STARTER_TEMPLATES,
              domain.id
            ).length;
            return (
              <button
                key={domain.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveDomain(domain.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition cursor-pointer ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active ? "text-amber-300" : "text-amber-700"
                  }`}
                />
                <span>{domain.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    active
                      ? "bg-white/15 text-amber-200"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div
          data-testid="landing-collection-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {visibleTemplates.map((tpl, idx) => {
            const p = tpl.default_config.theme.palette;
            const sceneUrl = resolveCardBackdropUrl(
              tpl.default_config.theme.cardArt
            );
            const weddingIdx = WEDDING_STARTER_TEMPLATES.findIndex(
              (w) => w.id === tpl.id
            );
            const isActiveInHero =
              activeDomain === "wedding" &&
              weddingIdx >= 0 &&
              selectedIdx === weddingIdx;

            const cardBody = (
              <>
                <div
                  className="h-44 w-full p-5 flex flex-col items-center justify-center text-center relative overflow-hidden"
                  style={{ backgroundColor: p.background }}
                >
                  {sceneUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sceneUrl}
                        alt=""
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
                      backgroundColor: tpl.default_config.envelope.waxSeal.color,
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
                    {formatCategoryBadge(tpl.category)}
                  </p>
                </div>
                <div className="p-4 w-full border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-800 line-clamp-1">
                    {tpl.title}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 shrink-0">
                    {activeDomain === "wedding" ? "Preview ↑" : "Live Demo →"}
                  </span>
                </div>
              </>
            );

            if (activeDomain === "wedding") {
              return (
                <motion.button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedIdx(weddingIdx >= 0 ? weddingIdx : idx);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -4 }}
                  className={`text-left rounded-3xl border bg-white overflow-hidden shadow-2xs hover:shadow-xl transition-all flex flex-col cursor-pointer ${
                    isActiveInHero
                      ? "border-stone-900 ring-2 ring-amber-400/40"
                      : "border-stone-200"
                  }`}
                >
                  {cardBody}
                </motion.button>
              );
            }

            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs hover:shadow-xl transition-all flex flex-col"
              >
                <Link
                  href={`/e/demo?template=${encodeURIComponent(tpl.default_config.theme.presetId)}`}
                  className="flex flex-col flex-1 text-left"
                >
                  {cardBody}
                </Link>
              </motion.div>
            );
          })}

          {/* Symmetrical Custom Studio Tile */}
          <Link
            href="/login"
            className="text-left rounded-3xl border border-dashed border-amber-400/70 bg-gradient-to-br from-[#FAF6EE] to-amber-50/60 overflow-hidden shadow-2xs hover:shadow-xl hover:border-stone-900 transition-all flex flex-col justify-between group"
          >
            <div className="h-44 w-full p-5 flex flex-col items-center justify-center text-center">
              <span className="w-12 h-12 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <Wand2 className="w-5 h-5" />
              </span>
              <p className="mt-3 text-base font-serif font-semibold text-stone-900">
                Design Your Own
              </p>
              <p className="text-[11px] uppercase tracking-widest mt-1 text-amber-800">
                Custom {activeDomainConfig.templateLabel} Scenes
              </p>
            </div>
            <div className="p-4 w-full border-t border-amber-200/60 bg-white/80 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-stone-800">
                Upload Backdrop &amp; Photos
              </span>
              <span className="text-[10px] font-semibold text-amber-700 shrink-0">
                Studio →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-200/80 py-8 text-center text-xs text-stone-500">
        <span className="inline-flex items-center justify-center gap-2">
          <BrandMark size="2xs" rounded="md" decorative />
          <span>
            Invitovix · Luxury Digital Invitations for Weddings, Birthdays, Galas
            &amp; Celebrations
          </span>
        </span>
      </footer>
    </div>
  );
}
