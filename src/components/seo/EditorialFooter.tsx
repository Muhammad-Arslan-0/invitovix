import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { SEO_COLLECTIONS } from "@/lib/seo/collections";

const WEDDING_SLUGS = new Set([
  "wedding",
  "nikah",
  "mehndi",
  "baraat",
  "valima",
  "engagement",
]);

const CELEBRATION_SLUGS = new Set([
  "live-invitation-card",
  "birthday",
  "baby-shower",
  "anniversary",
  "graduation",
  "gala-corporate",
]);

export function EditorialFooter() {
  const weddingCollections = SEO_COLLECTIONS.filter((c) =>
    WEDDING_SLUGS.has(c.slug)
  );
  const celebrationCollections = SEO_COLLECTIONS.filter((c) =>
    CELEBRATION_SLUGS.has(c.slug)
  );

  return (
    <footer className="border-t border-stone-200/80 bg-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <BrandMark size="sm" rounded="xl" decorative />
            <span className="font-serif text-lg font-semibold tracking-wide text-stone-900">
              Invitovix
            </span>
          </Link>
          <p className="text-xs text-stone-600 leading-relaxed">
            Interactive wax-seal live digital invitation cards for Weddings,
            Nikah, Mehndi, Baraat, Valima, Birthdays, Baby Showers,
            Anniversaries, Graduations, and Black-Tie Galas.
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800 mb-3">
            Wedding Cards
          </h2>
          <ul className="space-y-2 text-xs text-stone-600">
            {weddingCollections.map((col) => (
              <li key={col.slug}>
                <Link
                  href={`/invitations/${col.slug}`}
                  className="hover:text-stone-950 hover:underline underline-offset-4 transition"
                >
                  {col.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800 mb-3">
            Live &amp; Party Cards
          </h2>
          <ul className="space-y-2 text-xs text-stone-600">
            {celebrationCollections.map((col) => (
              <li key={col.slug}>
                <Link
                  href={`/invitations/${col.slug}`}
                  className="hover:text-stone-950 hover:underline underline-offset-4 transition"
                >
                  {col.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800 mb-3">
            Explore Invitovix
          </h2>
          <ul className="space-y-2 text-xs text-stone-600">
            <li>
              <Link
                href="/invitations"
                className="hover:text-stone-950 hover:underline underline-offset-4 transition"
              >
                All Invitation Card Templates
              </Link>
            </li>
            <li>
              <Link
                href="/e/demo"
                className="hover:text-stone-950 hover:underline underline-offset-4 transition"
              >
                Interactive Live Card Demo
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:text-stone-950 hover:underline underline-offset-4 transition"
              >
                Open Creator Studio Free
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200/70 py-5 px-4 text-center text-xs text-stone-500">
        <span className="inline-flex items-center justify-center gap-2">
          <BrandMark size="2xs" rounded="md" decorative />
          <span>
            © {new Date().getFullYear()} Invitovix · Live Digital Invitation
            Cards &amp; Online RSVP Studio
          </span>
        </span>
      </div>
    </footer>
  );
}
