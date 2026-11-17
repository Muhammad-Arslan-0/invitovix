import type { Metadata } from "next";
import { LandingShowcase } from "@/components/landing/LandingShowcase";
import { AuthRedirectHandler } from "@/components/auth/AuthRedirectHandler";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  HOMEPAGE_FAQS,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
} from "@/lib/seo/siteConfig";
import {
  buildFaqSchema,
  buildWebApplicationSchema,
} from "@/lib/seo/structuredData";

export const metadata: Metadata = {
  title: {
    absolute: SITE_DEFAULT_TITLE,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[buildWebApplicationSchema(), buildFaqSchema(HOMEPAGE_FAQS)]}
      />
      <AuthRedirectHandler />
      <LandingShowcase />
    </>
  );
}
