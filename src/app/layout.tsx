import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Invitovix — Interactive Animated Event & Wedding Invitations",
    template: "%s | Invitovix",
  },
  description:
    "Design and share interactive wax-seal event and wedding invitations with custom music, choreographed animations, calendar sync, and live RSVP tracking.",
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
        {children}
      </body>
    </html>
  );
}
