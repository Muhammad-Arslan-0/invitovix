import { STARTER_TEMPLATES, getTemplatesByDomain } from "@/lib/templates/presets";
import { InvitationDomainId, TemplateRecord } from "@/types/invitation";
import { SeoFaqItem } from "./siteConfig";

export interface SeoCollectionConfig {
  slug: string;
  navLabel: string;
  badge: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  editorialHeading: string;
  editorialParagraphs: string[];
  highlights: string[];
  keywords: string[];
  domainId?: InvitationDomainId;
  matchCategories?: string[];
  matchPresetIds?: string[];
  featuredDemoPresetId: string;
  faqs: SeoFaqItem[];
  relatedSlugs: string[];
}

export const SEO_COLLECTIONS: SeoCollectionConfig[] = [
  {
    slug: "live-invitation-card",
    navLabel: "Live Invitation Cards",
    badge: "Interactive Wax-Seal Cards",
    metaTitle: "Live Invitation Card Maker — Interactive Digital Invites",
    metaDescription:
      "Design a live invitation card online with Invitovix. Embossed wax-seal envelope reveals, custom background music, Google Maps directions, QR codes & live RSVPs.",
    h1: "Live Invitation Cards That Guests Unseal in Real Time",
    heroSubtitle:
      "Go beyond static PDFs and flat images. Build an interactive live invitation card with a tactile wax-seal reveal, soundtrack audio, countdown timer, venue map pin, and instant RSVP tracking.",
    editorialHeading: "Why Hosts Choose Invitovix Live Invitation Cards",
    editorialParagraphs: [
      "A live invitation card turns a simple link into a memorable opening moment. When your guests tap your Invitovix link on WhatsApp, iMessage, or email, they experience a tailored envelope sealed with your custom monogram wax seal. Tapping to unseal gently unlocks your chosen soundtrack and reveals every ceremony detail.",
      "Because your invitation is live on the web, any schedule adjustment, venue map update, or attire note updates immediately for every guest — no resending revised PDFs. Meanwhile, your host dashboard collects live attending headcounts, party sizes, and personal wishes automatically.",
    ],
    highlights: [
      "Interactive wax-seal envelope animation on mobile & desktop",
      "Browser-safe background music with custom MP3 support",
      "Live RSVP headcount hub with instant CSV guest export",
      "One-tap Google Calendar, Apple .ics & Google Maps directions",
      "Rich WhatsApp & social link previews + print-ready QR code",
      "Multi-language support including English, Urdu, Arabic & Hindi",
    ],
    keywords: [
      "live invitation card",
      "live digital invitation",
      "interactive invitation card",
      "animated invitation card online",
      "wax seal invitation card",
      "online invitation card maker",
      "Invitovix live invitation",
    ],
    featuredDemoPresetId: "noor-emerald",
    faqs: [
      {
        question: "How is a live invitation card different from a regular e-card?",
        answer:
          "A regular e-card is a static JPEG or PDF. A live invitation card on Invitovix is an interactive web experience with an animated wax-seal envelope, background music, live countdown, interactive map directions, calendar sync, and real-time RSVP submission.",
      },
      {
        question: "Can I update details after sharing my live invitation card link?",
        answer:
          "Yes. Any edit you save in Invitovix Creator Studio — such as ceremony timings, venue coordinates, or portraits — reflects instantly on your live /e/your-event link without changing the URL.",
      },
      {
        question: "Do guests need to install an app to open an Invitovix live card?",
        answer:
          "No app is required. Invitovix live invitation cards open smoothly inside any mobile or desktop browser including Safari, Chrome, and WhatsApp's in-app browser.",
      },
    ],
    relatedSlugs: ["wedding", "nikah", "birthday", "baby-shower"],
  },
  {
    slug: "wedding",
    navLabel: "Wedding Invitation Cards",
    badge: "Wedding Collection",
    metaTitle: "Wedding Invitation Cards Online — Live Digital Wedding Invites",
    metaDescription:
      "Create luxury digital wedding invitation cards online with Invitovix. 15+ interactive templates for Nikah, Mehndi, Baraat, Valima, Engagement & destination weddings.",
    h1: "Digital Wedding Invitation Cards for Every Ceremony",
    heroSubtitle:
      "Craft heirloom-grade live wedding invitation cards for Nikah, Mehndi, Baraat, Valima, Anand Karaj, Hindu Vivah, and modern black-tie receptions — complete with wax seals, multi-event schedules, and live RSVPs.",
    editorialHeading: "Modern Wedding Stationery Without Printing Delays",
    editorialParagraphs: [
      "Invitovix brings fine bespoke wedding stationery to the digital era. Choose from 15 signature wedding card aesthetics — from Royal Emerald Nikah courtyards and Rajputana Jharokha gold to French Rococo Blue, Tuscan Terracotta, and Old Money Quiet Luxury.",
      "Hosting multiple wedding events? Organize your entire celebration itinerary in one interactive card, share tiered guest links for specific days, add couple portraits and sacred blessings, and track exact guest counts effortlessly from your dashboard.",
    ],
    highlights: [
      "15 curated luxury wedding invitation card templates",
      "Dedicated suites for Nikah, Mehndi, Baraat, Valima & Engagement",
      "Multi-day itinerary with guest-specific event access links",
      "Optional Arabic/Islamic blessings & Urdu Nastaleeq translation",
      "Couple portraits, countdown clock, photo gallery & venue map",
      "WhatsApp-ready preview card and matching print QR code",
    ],
    keywords: [
      "wedding invitation card",
      "digital wedding invitation",
      "live wedding invitation card",
      "online wedding invitation maker",
      "shaadi card online",
      "interactive wedding invite",
      "WhatsApp wedding card",
    ],
    domainId: "wedding",
    featuredDemoPresetId: "noor-emerald",
    faqs: [
      {
        question: "Can I include multiple wedding events on one digital invitation card?",
        answer:
          "Yes. You can list your full multi-day itinerary (such as Mehndi, Nikah, Baraat, and Valima) inside a single live wedding invitation card and even share tailored links for guests invited to specific ceremonies.",
      },
      {
        question: "Are South Asian, Islamic, Sikh, and Western wedding styles supported?",
        answer:
          "Yes. Our catalog includes dedicated designs for Royal Nikah, Marigold Mehndi, Shahi Baraat, Moonlit Valima, Rajputana Heritage, Kanjeevaram Muhurtham, Anand Karaj, Blush Peony, Tuscan Villa, and Quiet Luxury Minimalist weddings.",
      },
      {
        question: "Can guests get Google Maps directions to the wedding venue?",
        answer:
          "Yes. Drop your exact venue pin in Creator Studio so guests see an interactive map preview and launch turn-by-turn Google Maps navigation in one tap.",
      },
    ],
    relatedSlugs: ["nikah", "mehndi", "baraat", "valima"],
  },
  {
    slug: "nikah",
    navLabel: "Nikah Invitation Cards",
    badge: "Nikah & Islamic Weddings",
    metaTitle: "Nikah Invitation Cards — Live Islamic Digital Nikah Invites",
    metaDescription:
      "Design elegant digital Nikah invitation cards with Bismillah calligraphy, emerald & gold wax seals, Urdu & Arabic support, venue maps & live RSVPs on Invitovix.",
    h1: "Royal Digital Nikah Invitation Cards with Calligraphy & Wax Seals",
    heroSubtitle:
      "Honor your sacred Nikah with luminous emerald, ivory, and gold foil live invitation cards featuring traditional Islamic blessing headers, serene audio, and effortless WhatsApp sharing.",
    editorialHeading: "Authentic Nikah Cards Crafted for Tradition & Convenience",
    editorialParagraphs: [
      "Every detail of an Invitovix Nikah invitation card is designed with reverence and elegance. Toggle traditional Bismillah and Quranic blessing calligraphy headers, customize bride and groom family lines, and pair deep emerald or midnight indigo paper textures with embossed gold wax seals.",
      "With native Urdu Nastaleeq and Arabic language support, elder relatives and overseas family members can read your Nikah ceremony time, masjid or banquet venue directions, and RSVP directly from their phone.",
    ],
    highlights: [
      "Built-in Islamic blessing & Bismillah calligraphy headers",
      "Royal Emerald, Dawat-e-Ishq Sufi & Minimalist luxury presets",
      "Native Urdu Nastaleeq & Arabic typography support",
      "Exact masjid or banquet venue pin with Google Maps directions",
      "Private couple photo options — show portraits or keep floral-only",
      "Instant WhatsApp preview card and live family headcount tracking",
    ],
    keywords: [
      "nikah invitation card",
      "digital nikah card",
      "islamic wedding invitation card",
      "online nikah invitation maker",
      "muslim wedding digital invite",
      "live nikah card",
    ],
    matchPresetIds: [
      "noor-emerald",
      "dawat-e-ishq",
      "quiet-luxury-minimalist",
      "champagne-silk",
    ],
    featuredDemoPresetId: "noor-emerald",
    faqs: [
      {
        question: "Can I add Bismillah calligraphy to my Nikah invitation card?",
        answer:
          "Yes. Invitovix includes a dedicated Blessing Header option in Creator Studio so you can display authentic Arabic Bismillah and wedding duas beautifully at the top of your Nikah card.",
      },
      {
        question: "Can I make a Nikah invitation card without couple photos?",
        answer:
          "Absolutely. Couple portraits are completely optional and can be toggled off with one switch, keeping your Nikah card purely botanical, architectural, and typographic.",
      },
    ],
    relatedSlugs: ["wedding", "mehndi", "baraat", "valima"],
  },
  {
    slug: "mehndi",
    navLabel: "Mehndi & Sangeet Cards",
    badge: "Mehndi · Dholki · Sangeet",
    metaTitle: "Mehndi & Sangeet Invitation Cards — Animated Dholki Invites",
    metaDescription:
      "Create vibrant Mehndi, Dholki & Sangeet live invitation cards online. Marigold florals, Boho Sunset themes, festive music, itinerary schedules & instant RSVPs.",
    h1: "Vibrant Mehndi, Dholki & Sangeet Live Invitation Cards",
    heroSubtitle:
      "Set the festive mood before the first dhol beat. Customize marigold-draped and sunset-terracotta animated Mehndi invitation cards with custom music, dress-code notes, and live RSVPs.",
    editorialHeading: "Bring Marigold Energy to Your Digital Mehndi Invite",
    editorialParagraphs: [
      "Your Mehndi or Sangeet night deserves an invitation bursting with warmth and rhythm. Invitovix pairs luminous saffron, marigold, and terracotta artwork with festive acoustic audio or your own custom MP3 song that fades in smoothly when guests break the wax seal.",
      "Highlight Rasm-e-Heena timings, dhol entrances, bangles bars, and dress-code palettes right inside your interactive itinerary so friends and family arrive ready to celebrate.",
    ],
    highlights: [
      "Marigold Mehndi Courtyard & Boho Sunset Sangeet designs",
      "Upload your favorite Mehndi or Sangeet MP3 soundtrack",
      "Timeline cards for Rasm-e-Heena, Dholki & dance performances",
      "One-tap Google Maps directions and live friend RSVP tracking",
    ],
    keywords: [
      "mehndi invitation card",
      "dholki invitation card",
      "sangeet invitation card",
      "digital mehndi invite",
      "animated mehndi card online",
      "mehndi ceremony invitation",
    ],
    matchCategories: ["mehndi"],
    matchPresetIds: ["marigold-mehndi", "boho-sunset-sangeet", "rajputana-heritage"],
    featuredDemoPresetId: "marigold-mehndi",
    faqs: [
      {
        question: "Can I add custom Mehndi or Sangeet music to the invitation card?",
        answer:
          "Yes. Choose one of our built-in festive tracks or upload your own MP3 song inside Creator Studio — it plays smoothly the moment guests tap the wax seal.",
      },
      {
        question: "Can I include dress code and event schedule on my Mehndi invite?",
        answer:
          "Yes. Use the Story and Itinerary sections to share yellow/green dress-code guidance, Rasm-e-Heena timings, and banquet locations.",
      },
    ],
    relatedSlugs: ["wedding", "nikah", "baraat", "valima"],
  },
  {
    slug: "baraat",
    navLabel: "Baraat Invitation Cards",
    badge: "Royal Baraat Suite",
    metaTitle: "Baraat Invitation Cards — Royal Digital Baraat Invites",
    metaDescription:
      "Design royal crimson & gold Baraat invitation cards online with Invitovix. Interactive wax seals, Istiqbal-e-Baraat timelines, venue map pins & live guest RSVPs.",
    h1: "Royal Baraat Digital Invitation Cards in Crimson & Zari Gold",
    heroSubtitle:
      "Announce your grand wedding procession with palatial crimson, champagne, and gold foil live Baraat invitation cards featuring ceremonial schedules and seamless family RSVP management.",
    editorialHeading: "Grand Wedding Processions Deserve a Grand Entrance",
    editorialParagraphs: [
      "Inspired by royal chandeliers, zari borders, and heritage arches, Invitovix Baraat invitation cards deliver unmistakable prestige from the very first tap. Customize Istiqbal-e-Baraat arrival times, Nikah or Varmala schedules, and Shahi Dastarkhwan dining details with precision.",
      "Easily distribute your invitation via WhatsApp to hundreds of guests while tracking exact seating counts in your real-time RSVP dashboard.",
    ],
    highlights: [
      "Shahi Baraat Crimson & Zari and Rajputana Heritage suites",
      "Clear schedule cards for Baraat arrival, Nikah & dinner",
      "Interactive map pin for banquet halls and farmhouse venues",
      "Export confirmed family headcounts to CSV for catering teams",
    ],
    keywords: [
      "baraat invitation card",
      "royal baraat digital invite",
      "wedding baraat card online",
      "shahi baraat invitation",
      "live baraat card",
    ],
    matchCategories: ["baraat"],
    matchPresetIds: ["shahi-baraat", "rajputana-heritage", "kanjeevaram-temple"],
    featuredDemoPresetId: "shahi-baraat",
    faqs: [
      {
        question: "Can I customize Baraat timings and venue pin for catering planning?",
        answer:
          "Yes. Add exact arrival and dinner timings, pin your banquet hall on the interactive map, and track exact confirmed guest counts in real time for your caterer.",
      },
    ],
    relatedSlugs: ["wedding", "nikah", "mehndi", "valima"],
  },
  {
    slug: "valima",
    navLabel: "Valima & Walima Cards",
    badge: "Valima · Reception",
    metaTitle: "Valima & Walima Invitation Cards — Reception Digital Invites",
    metaDescription:
      "Create refined digital Valima (Walima) & wedding reception invitation cards online. Midnight pearl & French Rococo suites with music, maps & live RSVP tracking.",
    h1: "Elegant Valima & Wedding Reception Live Invitation Cards",
    heroSubtitle:
      "Invite loved ones to your Valima banquet with moonlit pearl, rococo blue, and champagne silk interactive invitation cards built for effortless sharing and live attendance tracking.",
    editorialHeading: "Evening Reception Elegance, Instantly Shareable",
    editorialParagraphs: [
      "Our Valima (Walima) invitation collection captures the serene glamour of an evening reception — blending midnight navy, soft pearl, French gilt accents, and graceful calligraphy.",
      "Invitovix automatically harmonizes your ceremony subtitle for Valima receptions, supports optional Islamic blessings and Urdu typography, and gives guests one-tap calendar reminders and venue navigation.",
    ],
    highlights: [
      "Moonlit Valima Midnight Pearl & Château Rococo Blue presets",
      "Automatic Walima / Valima ceremony phrasing & itinerary cards",
      "One-tap Apple & Google Calendar save-the-date integration",
      "Live RSVP headcount analytics with party size & dietary notes",
    ],
    keywords: [
      "valima invitation card",
      "walima invitation card",
      "wedding reception digital invite",
      "online walima card maker",
      "live valima invitation",
    ],
    matchCategories: ["valima"],
    matchPresetIds: ["moonlit-valima", "chateau-rococo-blue", "champagne-silk"],
    featuredDemoPresetId: "moonlit-valima",
    faqs: [
      {
        question: "Does Invitovix support both Valima and Walima spelling?",
        answer:
          "Yes. Every headline, subtitle, and itinerary card is 100% editable in Creator Studio, so you can write Valima, Walima, or Wedding Reception in English, Urdu, or Arabic.",
      },
    ],
    relatedSlugs: ["wedding", "nikah", "baraat", "engagement"],
  },
  {
    slug: "engagement",
    navLabel: "Engagement Cards",
    badge: "Engagement · Rasm-e-Nisbat",
    metaTitle: "Engagement Invitation Cards — Digital Ring Ceremony Invites",
    metaDescription:
      "Design romantic digital engagement & ring ceremony invitation cards online with Invitovix. Floral magnolia suites, wax-seal reveals, couple portraits & live RSVPs.",
    h1: "Romantic Engagement & Ring Ceremony Live Invitation Cards",
    heroSubtitle:
      "Announce your yes in timeless style. Customize botanical magnolia, blush peony, and silk digital engagement invitation cards with couple portraits, story notes, and live RSVPs.",
    editorialHeading: "Celebrate Your New Chapter with Interactive Stationery",
    editorialParagraphs: [
      "Whether you are planning an intimate Rasm-e-Nisbat, garden aperitif, or grand ring ceremony dinner, Invitovix engagement invitation cards blend watercolor florals, delicate script typography, and embossed wax seals.",
      "Share your love story, showcase engagement portraits in bespoke frames, and collect instant RSVPs through a single memorable link.",
    ],
    highlights: [
      "Ivory Magnolia & Rose Engagement and Blush Peony designs",
      "Customizable couple portraits and love-story countdown scene",
      "Schedule cards for ring exchange, portraits & dinner",
      "Share instantly on WhatsApp with rich preview artwork",
    ],
    keywords: [
      "engagement invitation card",
      "ring ceremony invitation card",
      "rasm-e-nisbat invitation card",
      "digital engagement invite",
      "online engagement card maker",
    ],
    matchCategories: ["engagement"],
    matchPresetIds: ["ivory-engagement", "blush-peony", "tuscan-terracotta"],
    featuredDemoPresetId: "ivory-engagement",
    faqs: [
      {
        question: "Can I add our engagement photos to the digital card?",
        answer:
          "Yes. Upload couple portraits and a photo gallery right in Creator Studio with built-in cropping and instant optimization.",
      },
    ],
    relatedSlugs: ["wedding", "nikah", "anniversary", "live-invitation-card"],
  },
  {
    slug: "birthday",
    navLabel: "Birthday Invitation Cards",
    badge: "Birthday Collection",
    metaTitle: "Birthday Invitation Cards — Live Animated Birthday Invites",
    metaDescription:
      "Create stylish live birthday invitation cards online with Invitovix. Milestone 18th, 21st, 30th, 50th & dinner party templates with music, maps & live RSVP tracking.",
    h1: "Live Birthday Invitation Cards for Milestone Celebrations",
    heroSubtitle:
      "Turn every birthday into an editorial event. Customize animated wax-seal birthday invitation cards for rooftop toasts, milestone dinners, and surprise parties with real-time RSVPs.",
    editorialHeading: "Editorial Birthday Invites Built for Modern Celebrations",
    editorialParagraphs: [
      "Skip cluttered generic e-cards. Invitovix offers dedicated birthday suites — from warm coral Confetti Atelier and Sunburst Soiree to sleek Midnight Velvet candlelit dinners — tailored specifically for solo honoree spotlights and party schedules.",
      "Guests tap to unseal your birthday card, hear your party vibe soundtrack, pin the venue on Google Maps, and confirm their attendance in seconds.",
    ],
    highlights: [
      "Dedicated Birthday Star spotlight and solo honoree layouts",
      "Confetti Atelier, Sunburst Soiree & Midnight Velvet themes",
      "Party schedule for cocktails, cake toasts & DJ sets",
      "Track confirmed friends, plus-ones & dietary notes live",
    ],
    keywords: [
      "birthday invitation card",
      "live birthday invitation card",
      "digital birthday invite",
      "online birthday invitation maker",
      "milestone birthday card online",
      "animated birthday invitation",
    ],
    domainId: "birthday",
    featuredDemoPresetId: "confetti-atelier",
    faqs: [
      {
        question: "Does Invitovix work for 1st, 18th, 30th, and 50th birthday parties?",
        answer:
          "Yes. Our birthday templates adapt to any age or vibe — from playful colorful confetti soirées to refined candlelit milestone birthday dinners.",
      },
      {
        question: "Can guests RSVP with their plus-ones or friends?",
        answer:
          "Yes. Guests select their attendance status and party size directly inside the live birthday invitation card, updating your host dashboard immediately.",
      },
    ],
    relatedSlugs: ["live-invitation-card", "baby-shower", "graduation", "anniversary"],
  },
  {
    slug: "baby-shower",
    navLabel: "Baby Shower Cards",
    badge: "Baby & Bridal Showers",
    metaTitle: "Baby Shower Invitation Cards — Digital Shower Invites Online",
    metaDescription:
      "Create sweet, interactive baby shower invitation cards online with Invitovix. Botanical meadow themes, honoree spotlight, gift & brunch schedule & live RSVP tracking.",
    h1: "Interactive Baby Shower Digital Invitation Cards",
    heroSubtitle:
      "Welcome little joy with gentle sage, cloud-ivory, and floral live baby shower invitation cards — featuring interactive wax seals, afternoon tea timelines, and effortless guest RSVPs.",
    editorialHeading: "Warm, Keepsake-Quality Baby Shower Invitations",
    editorialParagraphs: [
      "Designed for moms-to-be, parents-to-be, and shower hosts, Invitovix baby shower invitation cards pair soft botanical watercolors with a clean guest experience that works effortlessly on any phone.",
      "Share your brunch schedule, games & wishes timeline, venue directions, and collect guest headcounts without chasing group-chat replies.",
    ],
    highlights: [
      "Little Cloud Meadow botanical suite & floral presets",
      "Dedicated Guest of Honor / Mom-to-Be spotlight layout",
      "Afternoon tea, games & brunch itinerary blocks",
      "Instant WhatsApp sharing and real-time RSVP tracking",
    ],
    keywords: [
      "baby shower invitation card",
      "digital baby shower invite",
      "online baby shower card maker",
      "live baby shower invitation",
      "bridal shower invitation card",
    ],
    matchCategories: ["baby-shower", "bridal-shower"],
    matchPresetIds: ["baby-shower-cloud", "blush-peony", "ivory-engagement"],
    featuredDemoPresetId: "baby-shower-cloud",
    faqs: [
      {
        question: "Can I use Invitovix for a bridal shower as well as a baby shower?",
        answer:
          "Yes. Creator Studio supports both Baby Shower and Bridal Shower layouts with tailored labels, honoree spotlights, and soft floral aesthetics.",
      },
    ],
    relatedSlugs: ["birthday", "anniversary", "graduation", "live-invitation-card"],
  },
  {
    slug: "anniversary",
    navLabel: "Anniversary Cards",
    badge: "Milestone Anniversaries",
    metaTitle: "Anniversary Invitation Cards — 25th & Golden Jubilee Invites",
    metaDescription:
      "Design timeless digital anniversary invitation cards online with Invitovix. Silver Jubilee, 50th Golden Anniversary & vow renewal suites with music, photos & live RSVPs.",
    h1: "Timeless Digital Anniversary Invitation Cards & Jubilee Suites",
    heroSubtitle:
      "Celebrate decades of love with refined silver, champagne, and gold live anniversary invitation cards featuring cherished photo galleries, tribute schedules, and real-time family RSVPs.",
    editorialHeading: "Honor Milestone Years with Heirloom Digital Stationery",
    editorialParagraphs: [
      "From 1st anniversaries to 25th Silver Jubilees and 50th Golden Anniversaries, Invitovix lets families craft dignified interactive invitations that showcase milestone portraits and stories.",
      "Relatives near and far can unseal the card, browse your family memory gallery, save the celebration date to their calendar, and RSVP with heartfelt wishes.",
    ],
    highlights: [
      "Silver Jubilee 25th Anniversary & Quiet Luxury suites",
      "Milestone couple spotlight and family photo gallery",
      "Easy mobile reading with large typography & multi-language option",
      "Live RSVP headcount & guest message collection",
    ],
    keywords: [
      "anniversary invitation card",
      "25th anniversary invitation card",
      "silver jubilee digital invite",
      "golden anniversary invitation online",
      "wedding anniversary card maker",
    ],
    matchCategories: ["anniversary"],
    matchPresetIds: ["silver-anniversary", "quiet-luxury-minimalist", "champagne-silk"],
    featuredDemoPresetId: "silver-anniversary",
    faqs: [
      {
        question: "Can children or family members host and manage RSVPs for parents' anniversary?",
        answer:
          "Yes. Hosts can manage the entire invitation, update dinner details, and export the confirmed guest list from the Invitovix Dashboard.",
      },
    ],
    relatedSlugs: ["wedding", "birthday", "gala-corporate", "live-invitation-card"],
  },
  {
    slug: "graduation",
    navLabel: "Graduation Cards",
    badge: "Graduation & Honors",
    metaTitle: "Graduation Invitation Cards — Digital Class Milestone Invites",
    metaDescription:
      "Create proud digital graduation invitation cards online with Invitovix. Honor Laurel designs, graduate spotlight, reception schedule, venue maps & instant RSVPs.",
    h1: "Digital Graduation Invitation Cards & Milestone Announcements",
    heroSubtitle:
      "Celebrate years of dedication with classic Honor Laurel live graduation invitation cards featuring graduate portraits, degree honors, reception schedules, and instant family RSVPs.",
    editorialHeading: "Announce Academic Honors in Signature Style",
    editorialParagraphs: [
      "Whether celebrating a high school milestone, university honours degree, or doctoral hooding reception, Invitovix graduation invitation cards showcase the graduate with dignity and polish.",
      "Include campus lawn or dinner venue directions, share the link across family chats and email, and keep exact track of who is attending.",
    ],
    highlights: [
      "Honor Laurel graduation suite with olive wreath & champagne accents",
      "Dedicated Graduate portrait & degree honors spotlight",
      "Reception schedule, map pin & one-tap calendar sync",
      "Print-ready QR code for keepsake announcements",
    ],
    keywords: [
      "graduation invitation card",
      "digital graduation invite",
      "graduation party invitation online",
      "online graduation announcement maker",
      "class of 2027 invitation card",
    ],
    matchCategories: ["graduation"],
    matchPresetIds: ["graduation-laurel", "executive-summit", "quiet-luxury-minimalist"],
    featuredDemoPresetId: "graduation-laurel",
    faqs: [
      {
        question: "Can I add the graduate's school, degree, and honors on the invitation?",
        answer:
          "Yes. Customize the graduate headline, degree honors subtitle, portrait bio, and reception schedule directly inside Invitovix Creator Studio.",
      },
    ],
    relatedSlugs: ["birthday", "gala-corporate", "baby-shower", "live-invitation-card"],
  },
  {
    slug: "gala-corporate",
    navLabel: "Galas & Corporate",
    badge: "Black-Tie & Executive",
    metaTitle: "Gala & Corporate Event Invitations — Executive Digital Folios",
    metaDescription:
      "Design black-tie charity gala, keynote summit & executive dinner digital invitations online. Obsidian & gold wax seals, program agendas, maps & live RSVP tracking.",
    h1: "Black-Tie Gala & Executive Corporate Digital Invitations",
    heroSubtitle:
      "Command attention for charity galas, founders summits, leadership dinners, and awards evenings with obsidian-and-champagne live invitation folios and executive RSVP analytics.",
    editorialHeading: "Elevated Event Invitations for Brands, Patrons & Leaders",
    editorialParagraphs: [
      "Standard calendar invites fade into crowded inboxes. Invitovix gives event planners and corporate teams bespoke digital folios featuring embossed crest wax seals, keynote speaker spotlights, formal evening agendas, and venue directions.",
      "Monitor confirmed VIP attendance, track guest counts and dietary preferences in real time, and export clean CSV attendee rosters for check-in desks.",
    ],
    highlights: [
      "Noir & Champagne Black-Tie Gala and Atelier Crest Summit suites",
      "Keynote Speaker, Patron & Event Chair portrait spotlights",
      "Formal program agenda with reception, keynote & dinner blocks",
      "Real-time attendee dashboard with one-click CSV export",
    ],
    keywords: [
      "gala invitation",
      "black-tie gala invitation card",
      "corporate event digital invitation",
      "executive summit invitation",
      "formal dinner digital invite",
      "VIP event invitation maker",
    ],
    domainId: "gala",
    featuredDemoPresetId: "noir-gala",
    faqs: [
      {
        question: "Can corporate hosts export confirmed RSVPs for event check-in?",
        answer:
          "Yes. Every Invitovix event includes a live RSVP Hub where organizers view attending guests, party sizes, and dietary notes and export the full list to CSV.",
      },
    ],
    relatedSlugs: ["live-invitation-card", "anniversary", "graduation", "wedding"],
  },
];

export function getSeoCollectionBySlug(
  slug: string
): SeoCollectionConfig | undefined {
  return SEO_COLLECTIONS.find((c) => c.slug === slug);
}

export function getTemplatesForSeoCollection(
  collection: SeoCollectionConfig
): TemplateRecord[] {
  if (collection.matchPresetIds && collection.matchPresetIds.length > 0) {
    const byPreset = collection.matchPresetIds
      .map((presetId) =>
        STARTER_TEMPLATES.find(
          (tpl) => tpl.default_config.theme.presetId === presetId
        )
      )
      .filter((tpl): tpl is TemplateRecord => Boolean(tpl));
    if (byPreset.length > 0) {
      return byPreset;
    }
  }

  if (collection.matchCategories && collection.matchCategories.length > 0) {
    const catSet = new Set(collection.matchCategories.map((c) => c.toLowerCase()));
    const byCat = STARTER_TEMPLATES.filter((tpl) =>
      catSet.has(tpl.category.toLowerCase())
    );
    if (byCat.length > 0) {
      return byCat;
    }
  }

  if (collection.domainId) {
    return getTemplatesByDomain(STARTER_TEMPLATES, collection.domainId);
  }

  // Flagship "live-invitation-card" showcase: curated cross-category highlight set
  const flagshipPresetIds = [
    "noor-emerald",
    "blush-peony",
    "marigold-mehndi",
    "shahi-baraat",
    "moonlit-valima",
    "confetti-atelier",
    "noir-gala",
    "baby-shower-cloud",
    "silver-anniversary",
    "graduation-laurel",
    "quiet-luxury-minimalist",
    "rajputana-heritage",
  ];
  return flagshipPresetIds
    .map((id) =>
      STARTER_TEMPLATES.find((tpl) => tpl.default_config.theme.presetId === id)
    )
    .filter((tpl): tpl is TemplateRecord => Boolean(tpl));
}
