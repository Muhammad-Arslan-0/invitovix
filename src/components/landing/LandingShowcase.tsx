"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Loader2,
  Music,
  Palette,
  QrCode,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/templates/presets";
import { MiniEnvelopeDemo } from "./MiniEnvelopeDemo";
import { startNavigation } from "@/components/ui/NavigationProgress";

const FEATURES = [
  {
    icon: Palette,
    title: "Live WYSIWYG Studio",
    desc: "Customize palettes, paper textures, scalloped wax-seal emblems, and scene copy with instant mobile preview.",
  },
  {
    icon: Music,
    title: "Browser-Safe Audio",
    desc: "Sound unlocks seamlessly inside the guest's tap-to-open gesture with smooth fade-ins and custom MP3 uploads.",
  },
  {
    icon: CalendarCheck,
    title: "Calendar & Maps Sync",
    desc: "One-tap Google Calendar, Apple .ics download, and direct Google Maps venue directions.",
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
    title: "Choose & Customize",
    desc: "Start with a curated wedding, Valima, birthday, or gala template and tune fonts, photos, and music.",
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
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function go(key: string, href: string) {
    setNavTarget(key);
    startNavigation();
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg text-stone-900">
      {/* Sticky Editorial Navbar */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fcfaf7]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </span>
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
            Design bespoke animated wedding, Valima, birthday, and gala
            invitations in our live visual studio. Guests tap an embossed wax
            seal to unlock music, multi-scene storytelling, calendar sync, and
            instant RSVPs.
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
                <span>Try Guest Experience (/e/demo)</span>
              )}
            </motion.button>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500">
            <span>4 Starter Aesthetics</span>
            <span className="text-amber-600">•</span>
            <span>Mobile-First Reveal</span>
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

      {/* Curated Templates Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-semibold">
              Starter Collection
            </p>
            <h2
              className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Templates for every celebration
            </h2>
          </div>
          <Link
            href="/login"
            className="text-xs font-semibold text-stone-900 underline underline-offset-4 hover:text-amber-800 transition"
          >
            Customize any template in Studio →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STARTER_TEMPLATES.map((tpl, idx) => {
            const p = tpl.default_config.theme.palette;
            const isActiveInHero = selectedIdx === idx;
            return (
              <motion.button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                className={`text-left rounded-3xl border bg-white overflow-hidden shadow-2xs hover:shadow-xl transition-all flex flex-col cursor-pointer ${
                  isActiveInHero
                    ? "border-stone-900 ring-2 ring-amber-400/40"
                    : "border-stone-200"
                }`}
              >
                <div
                  className="h-44 w-full p-5 flex flex-col items-center justify-center text-center relative"
                  style={{ backgroundColor: p.background }}
                >
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-white/35"
                    style={{
                      backgroundColor: tpl.default_config.envelope.waxSeal.color,
                    }}
                  >
                    {tpl.default_config.envelope.waxSeal.monogram}
                  </span>
                  <p
                    className="mt-3 text-base font-semibold"
                    style={{ color: p.primary }}
                  >
                    {tpl.default_config.content.headline}
                  </p>
                  <p
                    className="text-[11px] uppercase tracking-widest mt-1"
                    style={{ color: p.mutedText }}
                  >
                    {tpl.category}
                  </p>
                </div>
                <div className="p-4 w-full border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-800 line-clamp-1">
                    {tpl.title}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 shrink-0">
                    Preview ↑
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-stone-200/80 py-8 text-center text-xs text-stone-500">
        Invitovix · Interactive Event &amp; Wedding Invitation Platform
      </footer>
    </div>
  );
}

