import { InvitationDomainId } from "@/types/invitation";

export interface InvitationDomainSubCategory {
  id: string;
  label: string;
  soloDefault?: boolean;
}

export interface InvitationDomainConfig {
  id: InvitationDomainId;
  label: string;
  shortLabel: string;
  templateLabel: string;
  subLabel: string;
  collectionEyebrow: string;
  collectionTitle: string;
  collectionSubtitle: string;
  createModalSubtitle: string;
  sceneSectionHeading: string;
  subCategories: InvitationDomainSubCategory[];
}

export const INVITATION_DOMAINS: InvitationDomainConfig[] = [
  {
    id: "wedding",
    label: "Weddings",
    shortLabel: "Weddings",
    templateLabel: "Wedding",
    subLabel: "Nikah · Mehndi · Baraat · Valima",
    collectionEyebrow: "Wedding Collection",
    collectionTitle: "Wedding cards for every ceremony",
    collectionSubtitle:
      "Bespoke stationery exclusively crafted for Nikah, Mehndi, Baraat, Valima, and Engagement ceremonies.",
    createModalSubtitle:
      "Pick a starter Wedding template and enter your ceremony details.",
    sceneSectionHeading: "Marriage Scenes & Card Background",
    subCategories: [
      { id: "wedding", label: "Wedding / Nikah" },
      { id: "mehndi", label: "Mehndi / Dholki" },
      { id: "baraat", label: "Baraat" },
      { id: "valima", label: "Valima" },
      { id: "engagement", label: "Engagement" },
    ],
  },
  {
    id: "birthday",
    label: "Birthdays",
    shortLabel: "Birthdays",
    templateLabel: "Birthday",
    subLabel: "Milestones · Soirees · Dinners",
    collectionEyebrow: "Birthday Collection",
    collectionTitle: "Signature invitations for milestone birthdays",
    collectionSubtitle:
      "Editorial birthday suites for rooftop toasts, studio nights, and intimate candlelit dinners.",
    createModalSubtitle:
      "Pick a Birthday invitation style and customize the honoree & party details.",
    sceneSectionHeading: "Birthday Scenes & Card Background",
    subCategories: [{ id: "birthday", label: "Birthday Celebration", soloDefault: true }],
  },
  {
    id: "gala",
    label: "Galas & Corporate",
    shortLabel: "Galas",
    templateLabel: "Gala & Corporate",
    subLabel: "Black-Tie · Summits · Honors",
    collectionEyebrow: "Gala & Corporate Collection",
    collectionTitle: "Black-tie galas & executive event folios",
    collectionSubtitle:
      "Refined invitations for charity galas, keynote summits, leadership dinners, and formal honors.",
    createModalSubtitle:
      "Pick a Gala or Executive design and enter your venue & program details.",
    sceneSectionHeading: "Editorial Scenes & Card Background",
    subCategories: [
      { id: "gala", label: "Black-Tie Gala" },
      { id: "corporate", label: "Executive / Summit" },
    ],
  },
  {
    id: "party",
    label: "Parties & Showers",
    shortLabel: "Parties",
    templateLabel: "Party & Shower",
    subLabel: "Baby Shower · Anniversary · Grad",
    collectionEyebrow: "Parties & Showers Collection",
    collectionTitle: "Celebration suites for showers, anniversaries & honors",
    collectionSubtitle:
      "Dedicated templates for baby showers, silver & golden anniversaries, graduations, and social gatherings.",
    createModalSubtitle:
      "Pick a celebration template for Baby Showers, Anniversaries, or Graduations.",
    sceneSectionHeading: "Celebration Scenes & Card Background",
    subCategories: [
      { id: "baby-shower", label: "Baby Shower", soloDefault: true },
      { id: "anniversary", label: "Anniversary" },
      { id: "graduation", label: "Graduation", soloDefault: true },
      { id: "party", label: "Celebration Party" },
    ],
  },
];

const WEDDING_CATEGORY_SET = new Set([
  "wedding",
  "nikah",
  "mehndi",
  "baraat",
  "valima",
  "walima",
  "engagement",
  "reception",
  "sangeet",
  "rukhsati",
]);

const BIRTHDAY_CATEGORY_SET = new Set(["birthday", "bday", "sweet-sixteen"]);
const GALA_CATEGORY_SET = new Set([
  "gala",
  "corporate",
  "summit",
  "conference",
  "keynote",
]);
const PARTY_CATEGORY_SET = new Set([
  "party",
  "baby-shower",
  "bridal-shower",
  "anniversary",
  "graduation",
  "Dinner",
  "dinner",
]);

export function getDomainForCategory(
  category: string | null | undefined
): InvitationDomainId {
  const normalized = (category ?? "").trim().toLowerCase();
  if (!normalized || WEDDING_CATEGORY_SET.has(normalized)) return "wedding";
  if (BIRTHDAY_CATEGORY_SET.has(normalized)) return "birthday";
  if (GALA_CATEGORY_SET.has(normalized)) return "gala";
  if (PARTY_CATEGORY_SET.has(normalized)) return "party";
  return "party";
}

export function getDomainConfig(
  domainId: InvitationDomainId
): InvitationDomainConfig {
  return (
    INVITATION_DOMAINS.find((d) => d.id === domainId) ?? INVITATION_DOMAINS[0]
  );
}

const CATEGORY_BADGE_MAP: Record<string, string> = {
  wedding: "Wedding",
  nikah: "Nikah",
  mehndi: "Mehndi",
  baraat: "Baraat",
  valima: "Valima",
  walima: "Valima",
  engagement: "Engagement",
  reception: "Reception",
  sangeet: "Sangeet",
  birthday: "Birthday",
  gala: "Black-Tie Gala",
  corporate: "Corporate Summit",
  "baby-shower": "Baby Shower",
  "bridal-shower": "Bridal Shower",
  anniversary: "Anniversary",
  graduation: "Graduation",
  party: "Celebration",
};

export function formatCategoryBadge(
  category: string | null | undefined
): string {
  const normalized = (category ?? "wedding").trim().toLowerCase();
  if (CATEGORY_BADGE_MAP[normalized]) {
    return CATEGORY_BADGE_MAP[normalized];
  }
  return normalized
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export interface InvitationTypeMeta {
  domain: InvitationDomainId;
  normalizedCategory: string;
  isSoloDefault: boolean;
  heroPillLabel: string;
  eyebrow: string;
  sectionHeading: string;
  itineraryEyebrow: string;
  itineraryHeading: string;
  spotlightSectionLabel: string;
  spotlightToggleLabel: string;
  person1ShortLabel: string;
  person1BadgeLabel: string;
  person1CardTitle: string;
  person1UploadLabel: string;
  person1ReplaceLabel: string;
  person1NamePlaceholder: string;
  person1RolePlaceholder: string;
  person2ShortLabel: string;
  person2BadgeLabel: string;
  person2CardTitle: string;
  person2UploadLabel: string;
  person2ReplaceLabel: string;
  person2NamePlaceholder: string;
  person2RolePlaceholder: string;
  addPerson2Label: string;
  bottomNavSpotlightLabel: "Couple" | "Honoree" | "Hosts";
  createHeadlineLabel: string;
  createHeadlinePlaceholder: string;
  createSlugPlaceholder: string;
  createVenuePlaceholder: string;
  galleryEmptyHint: string;
  rsvpNamePlaceholder: string;
}

export function getInvitationTypeMeta(
  eventType: string | null | undefined
): InvitationTypeMeta {
  const normalized = (eventType ?? "wedding").trim().toLowerCase();
  const domain = getDomainForCategory(normalized);

  if (domain === "birthday") {
    return {
      domain: "birthday",
      normalizedCategory: normalized,
      isSoloDefault: true,
      heroPillLabel: "Birthday Celebration",
      eyebrow: "Time To Celebrate",
      sectionHeading: "Birthday Star",
      itineraryEyebrow: "Celebration Flow",
      itineraryHeading: "Party Schedule",
      spotlightSectionLabel: "Honoree Portrait & Bio",
      spotlightToggleLabel: "Birthday Honoree Spotlight",
      person1ShortLabel: "Birthday Star",
      person1BadgeLabel: "Honoree",
      person1CardTitle: "Honoree Details & Portrait",
      person1UploadLabel: "Upload Honoree Photo",
      person1ReplaceLabel: "Replace Honoree Photo",
      person1NamePlaceholder: "e.g., Maya Siddiqui",
      person1RolePlaceholder: "e.g., Turning 30 · Dreamer & Traveler",
      person2ShortLabel: "Co-Host",
      person2BadgeLabel: "Co-Host",
      person2CardTitle: "Co-Host Details & Photo",
      person2UploadLabel: "Upload Co-Host Photo",
      person2ReplaceLabel: "Replace Co-Host Photo",
      person2NamePlaceholder: "Co-Host Name",
      person2RolePlaceholder: "e.g., Party Host",
      addPerson2Label: "+ Add Co-Host",
      bottomNavSpotlightLabel: "Honoree",
      createHeadlineLabel: "Honoree / Party Headline *",
      createHeadlinePlaceholder: "e.g., Maya Turns 30",
      createSlugPlaceholder: "maya-turns-30",
      createVenuePlaceholder: "e.g., The Terrace Conservatoire",
      galleryEmptyHint:
        "Photo Gallery is enabled — add birthday moments or milestone snapshots in Content.",
      rsvpNamePlaceholder: "e.g., Zara & Friends",
    };
  }

  if (domain === "gala") {
    const isCorporate = normalized === "corporate" || normalized === "summit" || normalized === "conference";
    return {
      domain: "gala",
      normalizedCategory: normalized,
      isSoloDefault: false,
      heroPillLabel: isCorporate ? "Executive Summit" : "Black-Tie Invitation",
      eyebrow: isCorporate ? "Keynote & Chairs" : "Distinguished Patrons",
      sectionHeading: isCorporate ? "Speakers & Hosts" : "Hosts & Honorees",
      itineraryEyebrow: "Evening Program",
      itineraryHeading: "Program Agenda",
      spotlightSectionLabel: "Patron & Host Portraits",
      spotlightToggleLabel: "Hosts & Keynote Spotlight",
      person1ShortLabel: isCorporate ? "Keynote Speaker" : "Keynote Patron",
      person1BadgeLabel: isCorporate ? "Keynote" : "Patron",
      person1CardTitle: isCorporate ? "Keynote Speaker Details" : "Patron Details & Portrait",
      person1UploadLabel: "Upload Speaker / Patron Photo",
      person1ReplaceLabel: "Replace Speaker Photo",
      person1NamePlaceholder: "e.g., Dr. Tariq Mahmood",
      person1RolePlaceholder: "e.g., Keynote Patron · Creative Arts",
      person2ShortLabel: "Event Chair",
      person2BadgeLabel: "Chair",
      person2CardTitle: "Host / Chair Details",
      person2UploadLabel: "Upload Chair Photo",
      person2ReplaceLabel: "Replace Chair Photo",
      person2NamePlaceholder: "e.g., Zara Mansoor",
      person2RolePlaceholder: "e.g., Evening Gala Chair",
      addPerson2Label: "+ Add Chair / Co-Host",
      bottomNavSpotlightLabel: "Hosts",
      createHeadlineLabel: isCorporate ? "Summit / Event Headline *" : "Gala / Event Headline *",
      createHeadlinePlaceholder: isCorporate ? "e.g., Horizon Founders Summit" : "e.g., The Lumiere Gala",
      createSlugPlaceholder: isCorporate ? "horizon-summit-2027" : "lumiere-gala-2027",
      createVenuePlaceholder: "e.g., Grand Symphony Hall",
      galleryEmptyHint:
        "Photo Gallery is enabled — add venue highlights or archive moments in Content.",
      rsvpNamePlaceholder: "e.g., Dr. Bilal Ahmed",
    };
  }

  if (domain === "party") {
    if (normalized === "baby-shower" || normalized === "bridal-shower") {
      const isBridal = normalized === "bridal-shower";
      return {
        domain: "party",
        normalizedCategory: normalized,
        isSoloDefault: true,
        heroPillLabel: isBridal ? "Bridal Shower" : "Baby Shower",
        eyebrow: isBridal ? "Showering With Love" : "Welcoming Little Joy",
        sectionHeading: "Guest of Honor",
        itineraryEyebrow: "Afternoon Flow",
        itineraryHeading: "Shower Moments",
        spotlightSectionLabel: "Honoree Portrait & Note",
        spotlightToggleLabel: "Guest of Honor Spotlight",
        person1ShortLabel: isBridal ? "Bride-to-Be" : "Mom-to-Be",
        person1BadgeLabel: "Honoree",
        person1CardTitle: "Guest of Honor Details",
        person1UploadLabel: "Upload Honoree Photo",
        person1ReplaceLabel: "Replace Honoree Photo",
        person1NamePlaceholder: "e.g., Sara Bilal",
        person1RolePlaceholder: "e.g., Expecting Spring 2027",
        person2ShortLabel: "Co-Host",
        person2BadgeLabel: "Partner",
        person2CardTitle: "Partner / Co-Host Details",
        person2UploadLabel: "Upload Co-Host Photo",
        person2ReplaceLabel: "Replace Co-Host Photo",
        person2NamePlaceholder: "Partner or Host Name",
        person2RolePlaceholder: "e.g., Parents-to-Be",
        addPerson2Label: "+ Add Partner / Host",
        bottomNavSpotlightLabel: "Honoree",
        createHeadlineLabel: "Shower Headline *",
        createHeadlinePlaceholder: "e.g., Oh Baby! Celebrating Sara",
        createSlugPlaceholder: "celebrating-sara-shower",
        createVenuePlaceholder: "e.g., Magnolia Tea Conservatory",
        galleryEmptyHint:
          "Photo Gallery is enabled — add shower portraits or keepsake photos in Content.",
        rsvpNamePlaceholder: "e.g., Nadia & Amina",
      };
    }

    if (normalized === "graduation") {
      return {
        domain: "party",
        normalizedCategory: normalized,
        isSoloDefault: true,
        heroPillLabel: "Graduation Celebration",
        eyebrow: "Honors & Milestones",
        sectionHeading: "The Graduate",
        itineraryEyebrow: "Celebration Flow",
        itineraryHeading: "Celebration Program",
        spotlightSectionLabel: "Graduate Portrait & Honors",
        spotlightToggleLabel: "Graduate Spotlight",
        person1ShortLabel: "Class Honoree",
        person1BadgeLabel: "Graduate",
        person1CardTitle: "Graduate Details & Photo",
        person1UploadLabel: "Upload Graduate Photo",
        person1ReplaceLabel: "Replace Graduate Photo",
        person1NamePlaceholder: "e.g., Ayaan Karim",
        person1RolePlaceholder: "e.g., Class of 2027 · Magna Cum Laude",
        person2ShortLabel: "Host",
        person2BadgeLabel: "Hosted By",
        person2CardTitle: "Family Host Details",
        person2UploadLabel: "Upload Host Photo",
        person2ReplaceLabel: "Replace Host Photo",
        person2NamePlaceholder: "Host Name",
        person2RolePlaceholder: "e.g., Proud Parents",
        addPerson2Label: "+ Add Co-Host",
        bottomNavSpotlightLabel: "Honoree",
        createHeadlineLabel: "Graduate / Celebration Headline *",
        createHeadlinePlaceholder: "e.g., Ayaan Karim Class of 2027",
        createSlugPlaceholder: "ayaan-graduation-2027",
        createVenuePlaceholder: "e.g., Dean's Olive Lawn",
        galleryEmptyHint:
          "Photo Gallery is enabled — add campus portraits or milestone photos in Content.",
        rsvpNamePlaceholder: "e.g., Prof. & Mrs. Tariq",
      };
    }

    const isAnniversary = normalized === "anniversary";
    return {
      domain: "party",
      normalizedCategory: normalized,
      isSoloDefault: false,
      heroPillLabel: isAnniversary ? "Milestone Anniversary" : "Special Celebration",
      eyebrow: isAnniversary ? "Years Of Love" : "Celebrate Together",
      sectionHeading: isAnniversary ? "The Honored Pair" : "Hosts & Guests of Honor",
      itineraryEyebrow: "Order of Events",
      itineraryHeading: isAnniversary ? "Evening Schedule" : "Party Schedule",
      spotlightSectionLabel: isAnniversary
        ? "Milestone Couple Portraits"
        : "Host & Honoree Portraits",
      spotlightToggleLabel: isAnniversary
        ? "Honored Pair Spotlight"
        : "Host Spotlight",
      person1ShortLabel: isAnniversary ? "Honoree" : "Host",
      person1BadgeLabel: isAnniversary ? "Honoree" : "Host",
      person1CardTitle: isAnniversary ? "First Partner Details" : "Primary Host Details",
      person1UploadLabel: "Upload Portrait Photo",
      person1ReplaceLabel: "Replace Portrait Photo",
      person1NamePlaceholder: "e.g., Samina Waqar",
      person1RolePlaceholder: isAnniversary ? "e.g., 25 Years of Grace" : "e.g., Evening Host",
      person2ShortLabel: "Partner",
      person2BadgeLabel: isAnniversary ? "Partner" : "Co-Host",
      person2CardTitle: isAnniversary ? "Second Partner Details" : "Co-Host Details",
      person2UploadLabel: "Upload Second Photo",
      person2ReplaceLabel: "Replace Second Photo",
      person2NamePlaceholder: "e.g., Waqar Ahmed",
      person2RolePlaceholder: isAnniversary ? "e.g., Forever & Always" : "e.g., Co-Host",
      addPerson2Label: "+ Add Second Honoree",
      bottomNavSpotlightLabel: "Hosts",
      createHeadlineLabel: isAnniversary ? "Anniversary Headline *" : "Celebration Headline *",
      createHeadlinePlaceholder: isAnniversary ? "e.g., Samina & Waqar 25th" : "e.g., Summer Garden Soiree",
      createSlugPlaceholder: isAnniversary ? "samina-waqar-25th" : "summer-garden-soiree",
      createVenuePlaceholder: "e.g., Palm Conservatory",
      galleryEmptyHint:
        "Photo Gallery is enabled — add cherished photos or venue snapshots in Content.",
      rsvpNamePlaceholder: "e.g., Bilal & Family",
    };
  }

  // Default: Weddings (Nikah, Mehndi, Baraat, Valima, Engagement)
  return {
    domain: "wedding",
    normalizedCategory: normalized,
    isSoloDefault: false,
    heroPillLabel: "Cordially Invited",
    eyebrow: "With Blessings & Love",
    sectionHeading: "Bride & Groom",
    itineraryEyebrow: "Order of Events",
    itineraryHeading: "Evening Schedule",
    spotlightSectionLabel: "Bride & Groom Portraits",
    spotlightToggleLabel: "Bride & Groom Spotlight",
    person1ShortLabel: "The Bride",
    person1BadgeLabel: "Bride",
    person1CardTitle: "Bride Details & Picture",
    person1UploadLabel: "Upload Bride Photo",
    person1ReplaceLabel: "Replace Bride Photo",
    person1NamePlaceholder: "Bride Name",
    person1RolePlaceholder: "Daughter of...",
    person2ShortLabel: "The Groom",
    person2BadgeLabel: "Groom",
    person2CardTitle: "Groom Details & Picture",
    person2UploadLabel: "Upload Groom Photo",
    person2ReplaceLabel: "Replace Groom Photo",
    person2NamePlaceholder: "Groom Name",
    person2RolePlaceholder: "Son of...",
    addPerson2Label: "+ Add Groom / Partner",
    bottomNavSpotlightLabel: "Couple",
    createHeadlineLabel: "Couple / Wedding Headline *",
    createHeadlinePlaceholder: "e.g., Zara & Bilal Nikah",
    createSlugPlaceholder: "zara-bilal-nikah",
    createVenuePlaceholder: "e.g., Royal Palm Conservatory",
    galleryEmptyHint:
      "Photo Gallery section is enabled — add couple or venue photos in the Content panel.",
    rsvpNamePlaceholder: "e.g., Zara & Bilal Ahmed",
  };
}

