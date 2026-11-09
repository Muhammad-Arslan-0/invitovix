import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Music,
  Palette,
  Sparkles,
  Users,
} from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/templates/presets";
import { MiniEnvelopeDemo } from "@/components/landing/MiniEnvelopeDemo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] text-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fcfaf7]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-wide">
              Invitovix
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/e/demo"
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Live Demo
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-stone-800 transition"
            >
              <span>Creator Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-amber-50 px-3.5 py-1 text-xs font-medium text-amber-900">
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
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-medium text-white shadow-lg hover:bg-stone-800 transition"
            >
              <span>Start Designing Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/e/demo"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-medium text-stone-800 hover:bg-stone-50 transition"
            >
              <span>Try Guest Experience (/e/demo)</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <MiniEnvelopeDemo />
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="border-y border-stone-200 bg-white py-16">
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
            {[
              {
                icon: Palette,
                title: "Live WYSIWYG Studio",
                desc: "Customize palettes, paper textures, wax-seal emblems, and scene copy with instant mobile preview.",
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
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl border border-stone-200 bg-[#fcfaf7] p-6"
                >
                  <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
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
            className="text-xs font-semibold text-stone-900 underline underline-offset-4"
          >
            Customize any template in Studio →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STARTER_TEMPLATES.map((tpl) => {
            const p = tpl.default_config.theme.palette;
            return (
              <div
                key={tpl.id}
                className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs flex flex-col"
              >
                <div
                  className="h-44 p-5 flex flex-col items-center justify-center text-center"
                  style={{ backgroundColor: p.background }}
                >
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
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
                <div className="p-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-800 line-clamp-1">
                    {tpl.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-500">
        Invitovix · Interactive Event &amp; Wedding Invitation Platform
      </footer>
    </div>
  );
}

