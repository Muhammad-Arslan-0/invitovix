import type { Metadata } from "next";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Invitovix — Interactive Wax-Seal Digital Invitations for Weddings, Birthdays, Galas & Parties",
    template: "%s | Invitovix",
  },
  description:
    "Design and share interactive wax-seal invitations across strictly curated categories — Weddings (Nikah, Mehndi, Baraat, Valima), Birthdays, Black-Tie Galas, Baby Showers, Anniversaries, and Graduations — with music, calendar sync, map pin selection, and live RSVP tracking.",
};

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#fcfaf7] text-stone-900 antialiased selection:bg-amber-200 selection:text-stone-950"
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
