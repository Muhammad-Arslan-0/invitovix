import { EventRecord, TemplateRecord } from "@/types/invitation";
import {
  SITE_ALTERNATE_NAMES,
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  SeoFaqItem,
  absoluteUrl,
} from "./siteConfig";

export type JsonLdObject = Record<string, unknown>;

export function buildOrganizationSchema(): JsonLdObject {
  const siteUrl = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/invitovix-icon.png"),
      width: 512,
      height: 512,
    },
    description: SITE_DEFAULT_DESCRIPTION,
  };
}

export function buildWebsiteSchema(): JsonLdObject {
  const siteUrl = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: siteUrl,
    description: SITE_DEFAULT_DESCRIPTION,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-US",
  };
}

export function buildWebApplicationSchema(): JsonLdObject {
  const siteUrl = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}/#webapp`,
    name: `${SITE_NAME} — Live Digital Invitation Card Maker`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works on iOS, Android, and desktop browsers.",
    url: siteUrl,
    image: absoluteUrl("/opengraph-image"),
    description: SITE_DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Interactive wax-seal digital envelope reveal",
      "Luxury Wedding, Nikah, Mehndi, Baraat, Valima & Engagement templates",
      "Birthday, Baby Shower, Anniversary, Graduation & Gala suites",
      "Browser-safe background soundtrack & custom MP3 audio",
      "Interactive venue map pin & Google Maps directions",
      "One-tap Google Calendar & Apple .ics save-the-date",
      "Real-time RSVP guest tracking & CSV export",
      "WhatsApp-ready Open Graph link previews & print QR codes",
      "Multi-language invitation translations including Urdu Nastaleeq & Arabic",
    ],
    creator: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function buildFaqSchema(faqs: SeoFaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildCollectionPageSchema(options: {
  name: string;
  description: string;
  path: string;
  templates: TemplateRecord[];
}): JsonLdObject {
  const url = absoluteUrl(options.path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: options.name,
    description: options.description,
    url,
    isPartOf: {
      "@id": `${absoluteUrl("/")}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: options.templates.length,
      itemListElement: options.templates.map((tpl, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: tpl.title,
        url: absoluteUrl(
          `/e/demo?template=${encodeURIComponent(tpl.default_config.theme.presetId)}`
        ),
      })),
    },
  };
}

export function buildEventSchema(event: EventRecord): JsonLdObject {
  const url = absoluteUrl(`/e/${event.slug}`);
  const imageUrl =
    event.design_data.content.heroImageUrl ||
    event.design_data.content.couple.brideImageUrl ||
    absoluteUrl("/opengraph-image");

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.design_data.content.headline || event.title,
    description:
      event.design_data.content.subtitle ||
      `Interactive live digital invitation on ${SITE_NAME}`,
    startDate: event.event_date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url,
    image: imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl),
    location: {
      "@type": "Place",
      name: event.venue_name,
      address: event.venue_address || event.venue_name,
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}
