-- Invitovix Trendy Marriage Scenes, Floral/Abstract Art & Bride/Groom Template Upgrade (Idempotent)

insert into public.templates (id, title, category, thumbnail_url, is_active, default_config)
values
(
  '11111111-1111-4111-8111-111111111101',
  'Noor-e-Nikah (Royal Emerald)',
  'wedding',
  '/templates/noor-emerald.svg',
  true,
  '{
    "theme": {
      "presetId": "noor-emerald",
      "palette": {
        "background": "#FAF6EE",
        "surface": "#FFFDF8",
        "primary": "#114232",
        "secondary": "#1B5E47",
        "accent": "#C99A3B",
        "text": "#17261F",
        "mutedText": "#5E6B64"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "linen",
      "cardArt": {
        "motif": "royal-arch",
        "borderStyle": "gold-filigree",
        "backdropPreset": "nikah-courtyard",
        "backdropUrl": null,
        "backdropOpacity": 0.44,
        "heroFrame": "arch"
      }
    },
    "envelope": {
      "style": "royal-flap",
      "envelopeColor": "#114232",
      "linerColor": "#C99A3B",
      "waxSeal": {
        "enabled": true,
        "color": "#B3842B",
        "monogram": "A&Z",
        "emblem": "floral"
      },
      "promptText": "Tap the gold wax seal to unseal your invitation"
    },
    "content": {
      "hostLine": "Together with their beloved families",
      "headline": "Amina & Zayan",
      "subtitle": "Request the honor of your presence at their Nikah & Reception",
      "storyQuote": "Two souls, one timeless promise — surrounded by family, prayer, and celebration.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "arch",
        "crestText": "&",
        "brideName": "Amina Tariq",
        "brideRole": "Daughter of Mr. & Mrs. Tariq",
        "brideImageUrl": null,
        "groomName": "Zayan Mansoor",
        "groomRole": "Son of Mr. & Mrs. Mansoor",
        "groomImageUrl": null
      },
      "dressCode": "Formal Traditional / Emerald & Champagne",
      "itinerary": [
        { "id": "it-1", "title": "Guest Arrival & Rose Sherbet", "time": "6:30 PM", "description": "Courtyard lantern reception and acoustic strings" },
        { "id": "it-2", "title": "Nikah Ceremony", "time": "7:30 PM", "description": "Sacred vows beneath the floral pavilion" },
        { "id": "it-3", "title": "Royal Banquet Dinner", "time": "8:45 PM", "description": "Candlelit feast and family toasts" }
      ],
      "gallery": [],
      "rsvpHeadline": "Kindly Reply",
      "rsvpDeadline": "Two weeks prior to the celebration",
      "maxGuestsPerParty": 6
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "royal-unfold",
      "particles": "gold-dust",
      "lottieAccent": "floral-flourish"
    },
    "audio": {
      "enabled": true,
      "trackId": "ambient-piano",
      "trackTitle": "Velvet Nocturne",
      "customUrl": null,
      "volume": 0.6
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111105',
  'Blush Peony & Champagne Arch',
  'wedding',
  '/art/peony-arch.jpg',
  true,
  '{
    "theme": {
      "presetId": "blush-peony",
      "palette": {
        "background": "#FDF8F5",
        "surface": "#FFFFFF",
        "primary": "#6E2B3E",
        "secondary": "#A65E70",
        "accent": "#C89A52",
        "text": "#2B191E",
        "mutedText": "#7C646B"
      },
      "typography": {
        "displayFont": "cormorant",
        "bodyFont": "jakarta",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "vellum",
      "cardArt": {
        "motif": "floral-bouquet",
        "borderStyle": "arch-frame",
        "backdropPreset": "peony-arch",
        "backdropUrl": null,
        "backdropOpacity": 0.5,
        "heroFrame": "arch"
      }
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#6E2B3E",
      "linerColor": "#E8C794",
      "waxSeal": {
        "enabled": true,
        "color": "#C89A52",
        "monogram": "Z&O",
        "emblem": "floral"
      },
      "promptText": "Tap the floral crest to unseal the celebration"
    },
    "content": {
      "hostLine": "In joyful celebration of their marriage",
      "headline": "Zoya & Omar",
      "subtitle": "Invite you to share an afternoon of blooms, vows & dinner",
      "storyQuote": "Surrounded by spring peonies and the people who mean the world to us.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "arch",
        "crestText": "&",
        "brideName": "Zoya Raza",
        "brideRole": "The Bride",
        "brideImageUrl": null,
        "groomName": "Omar Farooq",
        "groomRole": "The Groom",
        "groomImageUrl": null
      },
      "dressCode": "Garden Couture / Rose, Ivory & Champagne",
      "itinerary": [
        { "id": "it-1", "title": "Botanical Welcome Tea", "time": "5:00 PM", "description": "Rosewater spritz & acoustic strings under the pergola" },
        { "id": "it-2", "title": "Vows Beneath the Floral Arch", "time": "6:15 PM", "description": "Intimate ceremony framed by blush peonies" },
        { "id": "it-3", "title": "Conservatory Candlelight Dinner", "time": "7:45 PM", "description": "Shared tables, speeches, and dessert bar" }
      ],
      "gallery": [],
      "rsvpHeadline": "Celebrate With Us",
      "rsvpDeadline": "Kindly confirm two weeks prior",
      "maxGuestsPerParty": 6
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "cinematic-silk",
      "particles": "petals",
      "lottieAccent": "floral-flourish"
    },
    "audio": {
      "enabled": true,
      "trackId": "celestial-harp",
      "trackTitle": "Moonlight Harp",
      "customUrl": null,
      "volume": 0.6
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111106',
  'Mehndi Marigold & Courtyard',
  'mehndi',
  '/art/marigold-mehndi.jpg',
  true,
  '{
    "theme": {
      "presetId": "marigold-mehndi",
      "palette": {
        "background": "#FFF9EE",
        "surface": "#FFFDF7",
        "primary": "#B44323",
        "secondary": "#D97724",
        "accent": "#E29E21",
        "text": "#2A1B12",
        "mutedText": "#7B6150"
      },
      "typography": {
        "displayFont": "playfair",
        "bodyFont": "dm-sans",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "linen",
      "cardArt": {
        "motif": "marigold-garland",
        "borderStyle": "gold-filigree",
        "backdropPreset": "marigold-mehndi",
        "backdropUrl": null,
        "backdropOpacity": 0.46,
        "heroFrame": "polaroid"
      }
    },
    "envelope": {
      "style": "royal-flap",
      "envelopeColor": "#B44323",
      "linerColor": "#F4C257",
      "waxSeal": {
        "enabled": true,
        "color": "#E29E21",
        "monogram": "H&D",
        "emblem": "floral"
      },
      "promptText": "Unseal the marigold envelope for our Mehndi night"
    },
    "content": {
      "hostLine": "Come dance, laugh & celebrate the Dholki & Mehndi of",
      "headline": "Hira & Daniyal",
      "subtitle": "Marigold garlands, dhol rhythms & starlit courtyard festivities",
      "storyQuote": "Henna, music, and vibrant colors as two families become one.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "scallop",
        "crestText": "&",
        "brideName": "Hira Noor",
        "brideRole": "Team Bride",
        "brideImageUrl": null,
        "groomName": "Daniyal Mir",
        "groomRole": "Team Groom",
        "groomImageUrl": null
      },
      "dressCode": "Festive Desi / Mustard, Sage, Coral & Emerald",
      "itinerary": [
        { "id": "it-1", "title": "Mogra Welcome & Bangles Bar", "time": "7:00 PM", "description": "Fresh jasmine bracelets & artisan henna corner" },
        { "id": "it-2", "title": "Rasm-e-Heena & Dhol Entrance", "time": "8:30 PM", "description": "Choreographed family dances beneath the fairy lights" },
        { "id": "it-3", "title": "Late Night Street Feast", "time": "10:00 PM", "description": "Chai cart, kulfi & live qawwali" }
      ],
      "gallery": [],
      "rsvpHeadline": "Join the Festivities",
      "rsvpDeadline": "RSVP with your party headcount",
      "maxGuestsPerParty": 8
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "playful-pop",
      "particles": "petals",
      "lottieAccent": "confetti-burst"
    },
    "audio": {
      "enabled": true,
      "trackId": "festive-strings",
      "trackTitle": "Golden Hour Chimes",
      "customUrl": null,
      "volume": 0.65
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111107',
  'Avant-Garde Champagne Silk',
  'wedding',
  '/art/abstract-silk.jpg',
  true,
  '{
    "theme": {
      "presetId": "champagne-silk",
      "palette": {
        "background": "#F7F3ED",
        "surface": "#FCF9F4",
        "primary": "#261E1A",
        "secondary": "#5B483E",
        "accent": "#B5825E",
        "text": "#201915",
        "mutedText": "#72645B"
      },
      "typography": {
        "displayFont": "syne",
        "bodyFont": "cormorant",
        "scriptFont": "cormorant"
      },
      "paperTexture": "silk",
      "cardArt": {
        "motif": "abstract-organic",
        "borderStyle": "editorial-double",
        "backdropPreset": "abstract-silk",
        "backdropUrl": null,
        "backdropOpacity": 0.48,
        "heroFrame": "polaroid"
      }
    },
    "envelope": {
      "style": "minimal-folio",
      "envelopeColor": "#261E1A",
      "linerColor": "#DFC3AC",
      "waxSeal": {
        "enabled": true,
        "color": "#B5825E",
        "monogram": "M&F",
        "emblem": "monogram"
      },
      "promptText": "Tap seal to open the modern wedding folio"
    },
    "content": {
      "hostLine": "An Editorial Celebration",
      "headline": "Maham & Faris",
      "subtitle": "Modern vows, sculptural florals & late-evening supper",
      "storyQuote": "Crafted around minimal beauty, meaningful vows, and effortless joy.",
      "heroImageUrl": null,
      "couple": {
        "layout": "editorial-split",
        "frameShape": "polaroid",
        "crestText": "+",
        "brideName": "Maham",
        "brideRole": "Architect & Collector",
        "brideImageUrl": null,
        "groomName": "Faris",
        "groomRole": "Designer & Dreamer",
        "groomImageUrl": null
      },
      "dressCode": "Modern Black & Earth Tones",
      "itinerary": [
        { "id": "it-1", "title": "Atelier Cocktail Hour", "time": "6:00 PM", "description": "Warm espresso tonics & ambient vinyl set" },
        { "id": "it-2", "title": "Candlelit Signing & Toasts", "time": "7:30 PM", "description": "Minimalist glasshouse vows" },
        { "id": "it-3", "title": "Tasting Dinner", "time": "8:45 PM", "description": "Four-course contemporary supper" }
      ],
      "gallery": [],
      "rsvpHeadline": "Your Presence Matters",
      "rsvpDeadline": "Please respond online below",
      "maxGuestsPerParty": 4
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "editorial-fade",
      "particles": "gold-dust",
      "lottieAccent": "sparkle-ring"
    },
    "audio": {
      "enabled": true,
      "trackId": "ambient-piano",
      "trackTitle": "Velvet Nocturne",
      "customUrl": null,
      "volume": 0.55
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111102',
  'Moonlit Valima (Midnight Pearl)',
  'valima',
  '/templates/moonlit-valima.svg',
  true,
  '{
    "theme": {
      "presetId": "moonlit-valima",
      "palette": {
        "background": "#0E1324",
        "surface": "#161D35",
        "primary": "#E5C185",
        "secondary": "#242E52",
        "accent": "#F3D9B1",
        "text": "#F7F3EA",
        "mutedText": "#A8B2CE"
      },
      "typography": {
        "displayFont": "playfair",
        "bodyFont": "jakarta",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "silk",
      "cardArt": {
        "motif": "celestial-stars",
        "borderStyle": "arch-frame",
        "backdropPreset": "moonlit-garden",
        "backdropUrl": null,
        "backdropOpacity": 0.5,
        "heroFrame": "oval"
      }
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#161D35",
      "linerColor": "#E5C185",
      "waxSeal": {
        "enabled": true,
        "color": "#C99A4E",
        "monogram": "H&S",
        "emblem": "crescent"
      },
      "promptText": "Tap the crescent seal to open under starlight"
    },
    "content": {
      "hostLine": "Mr. & Mrs. Siddiqui cordially invite you to the Valima Reception of",
      "headline": "Hamza & Sana",
      "subtitle": "An evening of moonlight, gratitude, and heartfelt celebration",
      "storyQuote": "As the stars gather above, we celebrate a new chapter blessed with love and warmth.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "oval",
        "crestText": "&",
        "brideName": "Sana",
        "brideRole": "The Bride",
        "brideImageUrl": null,
        "groomName": "Hamza",
        "groomRole": "Son of Mr. & Mrs. Siddiqui",
        "groomImageUrl": null
      },
      "dressCode": "Evening Formal / Midnight, Ivory & Pearl",
      "itinerary": [
        { "id": "it-1", "title": "Red Carpet & Portraits", "time": "7:30 PM", "description": "Welcome mocktails and family photographs" },
        { "id": "it-2", "title": "Grand Entrance", "time": "8:30 PM", "description": "Candlelit walkway and live instrumental tribute" },
        { "id": "it-3", "title": "Valima Dinner & Chai Salon", "time": "9:15 PM", "description": "Artisanal culinary showcase and dessert bar" }
      ],
      "gallery": [],
      "rsvpHeadline": "Reserve Your Seat",
      "rsvpDeadline": "Please confirm attendance at your earliest convenience",
      "maxGuestsPerParty": 6
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "cinematic-silk",
      "particles": "starlight",
      "lottieAccent": "sparkle-ring"
    },
    "audio": {
      "enabled": true,
      "trackId": "celestial-harp",
      "trackTitle": "Moonlight Harp",
      "customUrl": null,
      "volume": 0.55
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111108',
  'Shahi Baraat (Crimson & Zari)',
  'baraat',
  '/art/baraat-palace.jpg',
  true,
  '{
    "theme": {
      "presetId": "shahi-baraat",
      "palette": {
        "background": "#FAF3EB",
        "surface": "#FFFDF9",
        "primary": "#6E1423",
        "secondary": "#9A2A3B",
        "accent": "#C9983A",
        "text": "#241114",
        "mutedText": "#785D60"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "linen",
      "cardArt": {
        "motif": "royal-arch",
        "borderStyle": "gold-filigree",
        "backdropPreset": "baraat-palace",
        "backdropUrl": null,
        "backdropOpacity": 0.46,
        "heroFrame": "arch"
      }
    },
    "envelope": {
      "style": "royal-flap",
      "envelopeColor": "#6E1423",
      "linerColor": "#D6A954",
      "waxSeal": {
        "enabled": true,
        "color": "#C9983A",
        "monogram": "S&H",
        "emblem": "crown"
      },
      "promptText": "Tap the royal crest to welcome the Shahi Baraat"
    },
    "content": {
      "hostLine": "Mr. & Mrs. Qureshi joyously invite you to the Baraat of",
      "headline": "Salma & Haris",
      "subtitle": "Procession under candlelit chandeliers, Nikah vows & royal banquet",
      "storyQuote": "Two traditions woven together with crimson roses, heritage, and blessings.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "arch",
        "crestText": "&",
        "brideName": "Salma Qureshi",
        "brideRole": "The Bride",
        "brideImageUrl": null,
        "groomName": "Haris Javed",
        "groomRole": "The Groom",
        "groomImageUrl": null
      },
      "dressCode": "Royal Heritage / Crimson, Ivory & Antique Gold",
      "itinerary": [
        { "id": "it-1", "title": "Istiqbal-e-Baraat", "time": "7:00 PM", "description": "Grand floral welcome and traditional dhol procession" },
        { "id": "it-2", "title": "Nikah & Garland Exchange", "time": "8:00 PM", "description": "Sacred vows beneath the crimson jharokha pavilion" },
        { "id": "it-3", "title": "Shahi Dastarkhwan", "time": "9:15 PM", "description": "Heritage multi-course dinner and family blessings" }
      ],
      "gallery": [],
      "rsvpHeadline": "Grace Us With Your Presence",
      "rsvpDeadline": "Please confirm attendance two weeks prior",
      "maxGuestsPerParty": 6
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "royal-unfold",
      "particles": "petals",
      "lottieAccent": "floral-flourish"
    },
    "audio": {
      "enabled": true,
      "trackId": "festive-strings",
      "trackTitle": "Golden Hour Chimes",
      "customUrl": null,
      "volume": 0.6
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111109',
  'Ivory Magnolia & Rose Engagement',
  'engagement',
  '/art/engagement-bloom.jpg',
  true,
  '{
    "theme": {
      "presetId": "ivory-engagement",
      "palette": {
        "background": "#FBF8F4",
        "surface": "#FFFFFF",
        "primary": "#3D4F46",
        "secondary": "#7C9286",
        "accent": "#C7927A",
        "text": "#212724",
        "mutedText": "#6D7772"
      },
      "typography": {
        "displayFont": "cormorant",
        "bodyFont": "jakarta",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "vellum",
      "cardArt": {
        "motif": "floral-bouquet",
        "borderStyle": "botanical-vine",
        "backdropPreset": "engagement-bloom",
        "backdropUrl": null,
        "backdropOpacity": 0.5,
        "heroFrame": "oval"
      }
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#3D4F46",
      "linerColor": "#E4C5B6",
      "waxSeal": {
        "enabled": true,
        "color": "#C7927A",
        "monogram": "R&K",
        "emblem": "floral"
      },
      "promptText": "Tap the rose-gold seal to celebrate the engagement"
    },
    "content": {
      "hostLine": "Together with both families, celebrate the engagement of",
      "headline": "Rania & Kabir",
      "subtitle": "Ring ceremony, botanical garden high-tea & evening portraits",
      "storyQuote": "From one unforgettable promise to a lifetime ahead — begin this chapter with us.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "oval",
        "crestText": "&",
        "brideName": "Rania Aziz",
        "brideRole": "Soon-to-be Bride",
        "brideImageUrl": null,
        "groomName": "Kabir Hassan",
        "groomRole": "Soon-to-be Groom",
        "groomImageUrl": null
      },
      "dressCode": "Pastel Sage, Champagne & Pearl",
      "itinerary": [
        { "id": "it-1", "title": "Garden Aperitifs & Portraits", "time": "5:00 PM", "description": "Welcome tea & magnolia courtyard photos" },
        { "id": "it-2", "title": "Rasm-e-Nisbat & Ring Exchange", "time": "6:15 PM", "description": "Formal exchange of rings & sweet traditions" },
        { "id": "it-3", "title": "Sunset Conservatory Dinner", "time": "7:30 PM", "description": "Acoustic violin & intimate celebration feast" }
      ],
      "gallery": [],
      "rsvpHeadline": "Join Our Celebration",
      "rsvpDeadline": "Kindly confirm below",
      "maxGuestsPerParty": 5
    },
    "sections": {
      "showCouple": true,
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "cinematic-silk",
      "particles": "gold-dust",
      "lottieAccent": "sparkle-ring"
    },
    "audio": {
      "enabled": true,
      "trackId": "celestial-harp",
      "trackTitle": "Moonlight Harp",
      "customUrl": null,
      "volume": 0.55
    }
  }'::jsonb
)
on conflict (id) do update
  set title = excluded.title,
      category = excluded.category,
      thumbnail_url = excluded.thumbnail_url,
      default_config = excluded.default_config,
      is_active = excluded.is_active;

-- Retire legacy non-wedding templates without breaking existing user event FKs
update public.templates
set is_active = false
where id in (
  '11111111-1111-4111-8111-111111111103',
  '11111111-1111-4111-8111-111111111104'
)
or lower(category) in ('birthday', 'gala');

