-- Invitovix Latest Marriage Templates Seed (Idempotent)

insert into public.templates (id, title, category, thumbnail_url, is_active, default_config)
values
(
  '11111111-1111-4111-8111-111111111121',
  'Jharokha Rajputana (Jaipur Heritage & Pichwai Gold)',
  'wedding',
  '/templates/rajputana-heritage.svg',
  true,
  '{
    "theme": {
      "presetId": "rajputana-heritage",
      "palette": {
        "background": "#FBF6EE",
        "surface": "#FFFDF8",
        "primary": "#681424",
        "secondary": "#8C2436",
        "accent": "#D4A348",
        "text": "#2A1810",
        "mutedText": "#7C5E50"
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
        "backdropOpacity": 0.38,
        "heroFrame": "arch"
      }
    },
    "envelope": {
      "style": "royal-flap",
      "envelopeColor": "#5B121F",
      "linerColor": "#D4A348",
      "waxSeal": {
        "enabled": true,
        "color": "#B88628",
        "monogram": "M&D",
        "emblem": "crown"
      },
      "promptText": "Tap the royal wax seal to unveil the imperial wedding folio"
    },
    "content": {
      "hostLine": "Under the gracious auspices of their elders & families",
      "headline": "Meera & Devrat",
      "subtitle": "Request the honor of your august presence at their Royal Vivah Sanskar & Banquet",
      "storyQuote": "Rooted in heritage, celebrated with grandeur — two royal lineages unite under starlit palace arches.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "arch",
        "crestText": "&",
        "brideName": "Meera Rathore",
        "brideRole": "Daughter of Maharaj & Maharani Rathore",
        "brideImageUrl": null,
        "groomName": "Devrat Shekhawat",
        "groomRole": "Son of Thakur & Thakurani Shekhawat",
        "groomImageUrl": null
      },
      "dressCode": "Royal Heritage / Regal Sherwanis, Zari Lehengas & Turbans",
      "itinerary": [
        { "id": "it-1", "title": "Shahi Swagat & Shehnai Welcome", "time": "6:00 PM", "description": "Rose petal showers, traditional welcome aarti and live shehnai ensemble" },
        { "id": "it-2", "title": "Varmala & Royal Arch Exchange", "time": "7:30 PM", "description": "Grand floral jaimala ceremony under illuminated marble courtyards" },
        { "id": "it-3", "title": "Pheras & Shahi Dastarkhwan Banquet", "time": "8:45 PM", "description": "Sacred Vedic vows around the agni kund followed by a grand royal feast" }
      ],
      "gallery": [],
      "rsvpHeadline": "R.S.V.P.",
      "rsvpDeadline": "Kindly confirm your attendance three weeks prior to the royal nuptials",
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
      "trackId": "festive-strings",
      "trackTitle": "Golden Hour Chimes",
      "customUrl": null,
      "volume": 0.65
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111122',
  'Dawat-e-Ishq (Midnight Indigo & Sufi Lanterns)',
  'wedding',
  '/templates/dawat-e-ishq.svg',
  true,
  '{
    "theme": {
      "presetId": "dawat-e-ishq",
      "palette": {
        "background": "#0B132B",
        "surface": "#131E3D",
        "primary": "#E0A948",
        "secondary": "#384B78",
        "accent": "#F5C563",
        "text": "#F7F8FC",
        "mutedText": "#9BA9CC"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "obsidian",
      "cardArt": {
        "motif": "celestial-stars",
        "borderStyle": "gold-filigree",
        "backdropPreset": "moonlit-garden",
        "backdropUrl": null,
        "backdropOpacity": 0.42,
        "heroFrame": "oval"
      }
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#0B132B",
      "linerColor": "#E0A948",
      "waxSeal": {
        "enabled": true,
        "color": "#C98D2E",
        "monogram": "I&F",
        "emblem": "crescent"
      },
      "promptText": "Tap the celestial wax seal to enter the starlit courtyard"
    },
    "content": {
      "hostLine": "Together with their families, in celebration of divine grace",
      "headline": "Inaaya & Farhan",
      "subtitle": "Cordially request your presence at their Dawat-e-Ishq & Qawwali Night",
      "storyQuote": "Kahaan se aayi yeh taaza hawa... when hearts harmonize, starlight fills the night.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "oval",
        "crestText": "&",
        "brideName": "Inaaya Mir",
        "brideRole": "Daughter of Dr. & Mrs. Mir",
        "brideImageUrl": null,
        "groomName": "Farhan Qureshi",
        "groomRole": "Son of Barrister & Mrs. Qureshi",
        "groomImageUrl": null
      },
      "dressCode": "Nocturne Elegance / Velvet Kurtas, Anarkalis & Pashminas in Deep Jewel Tones",
      "itinerary": [
        { "id": "it-1", "title": "Lantern Courtyard Welcome & Kahwa Bar", "time": "7:00 PM", "description": "Cardamom green tea, saffron dry fruits and acoustic harmonium prelude" },
        { "id": "it-2", "title": "Mehfil-e-Qawwali & Sufi Poetry", "time": "8:15 PM", "description": "Soulful renditions by world-renowned Ustad qawwals beneath candlelight" },
        { "id": "it-3", "title": "Shahi Dawat & Kashmiri Chai Salon", "time": "10:00 PM", "description": "Slow-cooked heritage feast followed by pink noon chai and pistachio jalebis" }
      ],
      "gallery": [],
      "rsvpHeadline": "Kindly Grace Us With Your Presence",
      "rsvpDeadline": "Please confirm your attendance by the fourteenth of November",
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
      "volume": 0.6
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111123',
  'Tuscan Olive & Terracotta Villa (Destination Sunset)',
  'wedding',
  '/templates/tuscan-terracotta.svg',
  true,
  '{
    "theme": {
      "presetId": "tuscan-terracotta",
      "palette": {
        "background": "#F9F6F0",
        "surface": "#FFFFFF",
        "primary": "#B85D38",
        "secondary": "#566A4E",
        "accent": "#D99B43",
        "text": "#2B2118",
        "mutedText": "#7A6E64"
      },
      "typography": {
        "displayFont": "cormorant",
        "bodyFont": "dm-sans",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "linen",
      "cardArt": {
        "motif": "floral-bouquet",
        "borderStyle": "botanical-vine",
        "backdropPreset": "peony-arch",
        "backdropUrl": null,
        "backdropOpacity": 0.32,
        "heroFrame": "oval"
      }
    },
    "envelope": {
      "style": "minimal-folio",
      "envelopeColor": "#B85D38",
      "linerColor": "#EFE6D8",
      "waxSeal": {
        "enabled": true,
        "color": "#8F4122",
        "monogram": "S&M",
        "emblem": "floral"
      },
      "promptText": "Tap the terracotta wax seal to unseal your Italian villa invitation"
    },
    "content": {
      "hostLine": "Together with their joyfully expectant families",
      "headline": "Sofia & Matteo",
      "subtitle": "Warmly invite you to celebrate their destination wedding under the Tuscan sun",
      "storyQuote": "Underneath the Italian olive groves and golden hills, two wanderers found home in each other.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "oval",
        "crestText": "&",
        "brideName": "Sofia Romano",
        "brideRole": "Daughter of Luca & Elena Romano",
        "brideImageUrl": null,
        "groomName": "Matteo Bianchi",
        "groomRole": "Son of Marco & Giulia Bianchi",
        "groomImageUrl": null
      },
      "dressCode": "Cocktail Al Fresco / Earthy Terracotta, Olive, Sage & Crisp Summer Linens",
      "itinerary": [
        { "id": "it-1", "title": "Aperitivo & Prosecco in the Olive Grove", "time": "4:30 PM", "description": "Wood-fired crostini, sparkling spritz, and live Italian acoustic guitar" },
        { "id": "it-2", "title": "Garden Vows at Golden Hour", "time": "5:45 PM", "description": "Sunset ceremony framed by cypress trees and antique stone balustrades" },
        { "id": "it-3", "title": "Long Table Family Feast & Gelato Cart", "time": "7:15 PM", "description": "Handmade tagliolini, Chianti toasts, candlelit long tables and dancing under bistro lights" }
      ],
      "gallery": [],
      "rsvpHeadline": "Favorita Risposta",
      "rsvpDeadline": "Please respond by the first of June to ensure villa accommodations",
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
      "particles": "petals",
      "lottieAccent": "floral-flourish"
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
  '11111111-1111-4111-8111-111111111124',
  'Kanjeevaram Temple Muhurtham (Kumkum & Vedic Gold)',
  'wedding',
  '/templates/kanjeevaram-temple.svg',
  true,
  '{
    "theme": {
      "presetId": "kanjeevaram-temple",
      "palette": {
        "background": "#FDF8EE",
        "surface": "#FFFDF7",
        "primary": "#881B24",
        "secondary": "#580E15",
        "accent": "#D89F34",
        "text": "#231617",
        "mutedText": "#8E6351"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "linen",
      "cardArt": {
        "motif": "marigold-garland",
        "borderStyle": "gold-filigree",
        "backdropPreset": "marigold-mehndi",
        "backdropUrl": null,
        "backdropOpacity": 0.35,
        "heroFrame": "arch"
      }
    },
    "envelope": {
      "style": "royal-flap",
      "envelopeColor": "#7A141D",
      "linerColor": "#D89F34",
      "waxSeal": {
        "enabled": true,
        "color": "#B87B1E",
        "monogram": "A&S",
        "emblem": "crown"
      },
      "promptText": "Tap the auspicious gold seal to receive sacred blessings"
    },
    "content": {
      "hostLine": "Om Sri Ganeshaya Namaha · With the blessings of Almighty & Ancestors",
      "headline": "Ananya & Siddharth",
      "subtitle": "Request the honor of your presence & blessings at their auspicious Kalyanam",
      "storyQuote": "United by sacred Vedic rites, walking seven sacred steps toward a lifetime of togetherness.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "arch",
        "crestText": "&",
        "brideName": "Ananya Raman",
        "brideRole": "Daughter of Sri. & Smt. Ramanathan",
        "brideImageUrl": null,
        "groomName": "Siddharth Iyer",
        "groomRole": "Son of Sri. & Smt. Sundaresan",
        "groomImageUrl": null
      },
      "dressCode": "Traditional South Indian / Kanjeevaram Silk Sarees & Veshti / Kurta",
      "itinerary": [
        { "id": "it-1", "title": "Nadaswaram & Mangala Vadhyam", "time": "7:30 AM", "description": "Sacred dawn musical invocation, filter coffee and traditional welcome" },
        { "id": "it-2", "title": "Muhurtham & Maangalya Dhaaranam", "time": "9:15 AM", "description": "Tying of the holy thali amidst showering of akshata blessings" },
        { "id": "it-3", "title": "Kalyana Virundhu (Traditional Banana Leaf Feast)", "time": "11:30 AM", "description": "Sumptuous South Indian feast served on fresh plantain leaves" }
      ],
      "gallery": [],
      "rsvpHeadline": "Kindly Bless The Couple",
      "rsvpDeadline": "Please confirm your attendance by the tenth of December",
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
      "trackId": "festive-strings",
      "trackTitle": "Golden Hour Chimes",
      "customUrl": null,
      "volume": 0.65
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111125',
  'Old Money Quiet Luxury (Minimalist Blind Emboss)',
  'wedding',
  '/templates/quiet-luxury-minimalist.svg',
  true,
  '{
    "theme": {
      "presetId": "quiet-luxury-minimalist",
      "palette": {
        "background": "#F7F5F0",
        "surface": "#FDFBF7",
        "primary": "#18181A",
        "secondary": "#3B3D42",
        "accent": "#C4B59D",
        "text": "#121214",
        "mutedText": "#666870"
      },
      "typography": {
        "displayFont": "playfair",
        "bodyFont": "jakarta",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "clean",
      "cardArt": {
        "motif": "none",
        "borderStyle": "editorial-double",
        "backdropPreset": "none",
        "backdropUrl": null,
        "backdropOpacity": 0.2,
        "heroFrame": "polaroid"
      }
    },
    "envelope": {
      "style": "minimal-folio",
      "envelopeColor": "#18181A",
      "linerColor": "#F0EAE1",
      "waxSeal": {
        "enabled": true,
        "color": "#26262B",
        "monogram": "C&A",
        "emblem": "monogram"
      },
      "promptText": "Tap the blind-embossed onyx seal to view the folio"
    },
    "content": {
      "hostLine": "Mr. & Mrs. Charles Sterling request the honor of your presence",
      "headline": "Camille & Alexander",
      "subtitle": "At the celebration of their marriage & black-tie dinner reception",
      "storyQuote": "Simplicity is the highest form of sophistication — quiet elegance, enduring devotion.",
      "heroImageUrl": null,
      "couple": {
        "layout": "editorial-split",
        "frameShape": "polaroid",
        "crestText": "&",
        "brideName": "Camille Sterling",
        "brideRole": "Daughter of Mr. & Mrs. Sterling",
        "brideImageUrl": null,
        "groomName": "Alexander Vance",
        "groomRole": "Son of Dr. & Mrs. Vance",
        "groomImageUrl": null
      },
      "dressCode": "Strictly Black-Tie / Floor-length gowns & classic tuxedos",
      "itinerary": [
        { "id": "it-1", "title": "Vintage Champagne & Caviar Service", "time": "6:00 PM", "description": "Library salon reception with live string quartet" },
        { "id": "it-2", "title": "Vows in the Sculpture Pavilion", "time": "7:00 PM", "description": "Architectural candlelight vows beneath vaulted glass arches" },
        { "id": "it-3", "title": "Tasting Menu Dinner & Midnight Jazz", "time": "8:30 PM", "description": "Six-course seasonal dinner paired with fine reserve wines and live jazz club" }
      ],
      "gallery": [],
      "rsvpHeadline": "Répondez S''il Vous Plaît",
      "rsvpDeadline": "Kindly confirm your attendance by the twentieth of September",
      "maxGuestsPerParty": 2
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
      "particles": "none",
      "lottieAccent": "none"
    },
    "audio": {
      "enabled": true,
      "trackId": "ambient-piano",
      "trackTitle": "Velvet Nocturne",
      "customUrl": null,
      "volume": 0.5
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111126',
  'Château de Lavande (French Rococo Blue & Gilt)',
  'valima',
  '/templates/chateau-rococo-blue.svg',
  true,
  '{
    "theme": {
      "presetId": "chateau-rococo-blue",
      "palette": {
        "background": "#F8FAFC",
        "surface": "#FFFFFF",
        "primary": "#4A6B82",
        "secondary": "#2C4355",
        "accent": "#CBB07E",
        "text": "#162836",
        "mutedText": "#657D91"
      },
      "typography": {
        "displayFont": "cormorant",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "silk",
      "cardArt": {
        "motif": "floral-bouquet",
        "borderStyle": "botanical-vine",
        "backdropPreset": "peony-arch",
        "backdropUrl": null,
        "backdropOpacity": 0.36,
        "heroFrame": "oval"
      }
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#3D596E",
      "linerColor": "#CBB07E",
      "waxSeal": {
        "enabled": true,
        "color": "#9E8050",
        "monogram": "E&J",
        "emblem": "floral"
      },
      "promptText": "Tap the gilded French seal to open the château invitation"
    },
    "content": {
      "hostLine": "Together with their families, in celebration of love and devotion",
      "headline": "Elysia & Julian",
      "subtitle": "Cordially invite you to celebrate their Valima & Evening Reception",
      "storyQuote": "Where lavender breezes greet stone terrace balustrades, our forever begins.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "oval",
        "crestText": "&",
        "brideName": "Elysia Beaumont",
        "brideRole": "Daughter of Henri & Vivienne Beaumont",
        "brideImageUrl": null,
        "groomName": "Julian Saint-Clair",
        "groomRole": "Son of Dominique & Claire Saint-Clair",
        "groomImageUrl": null
      },
      "dressCode": "Pastel Formal / Powder Blue, Lavender, Champagne & Silver",
      "itinerary": [
        { "id": "it-1", "title": "Terrace Portraits & French Macaron Bar", "time": "6:30 PM", "description": "Welcome sparkling cider, elderflower spritz and harp melodies" },
        { "id": "it-2", "title": "Grand Entrance of the Couple", "time": "7:45 PM", "description": "Welcome shower of white hydrangea petals on the grand terrace staircase" },
        { "id": "it-3", "title": "Château Banquet & Candlelit Toasts", "time": "8:45 PM", "description": "Exquisite four-course banquet accompanied by speeches and dessert pavilion" }
      ],
      "gallery": [],
      "rsvpHeadline": "Kindly Grace Us With Your Presence",
      "rsvpDeadline": "Two weeks prior to the reception",
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
  '11111111-1111-4111-8111-111111111127',
  'Boho Sunset Sangeet (Terracotta, Ochre & Dholki)',
  'mehndi',
  '/templates/boho-sunset-sangeet.svg',
  true,
  '{
    "theme": {
      "presetId": "boho-sunset-sangeet",
      "palette": {
        "background": "#FDF6EE",
        "surface": "#FFFBF5",
        "primary": "#DF7C39",
        "secondary": "#9A4222",
        "accent": "#E8A942",
        "text": "#2A1D15",
        "mutedText": "#7F5E4E"
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
        "backdropOpacity": 0.35,
        "heroFrame": "rounded"
      }
    },
    "envelope": {
      "style": "art-deco",
      "envelopeColor": "#8C3A1E",
      "linerColor": "#E8A942",
      "waxSeal": {
        "enabled": true,
        "color": "#B44A26",
        "monogram": "Z&K",
        "emblem": "star"
      },
      "promptText": "Tap the festive terracotta seal to join the sunset fiesta"
    },
    "content": {
      "hostLine": "Get ready for song, dance, henna & festive beats!",
      "headline": "Zara & Kabir",
      "subtitle": "Invite you to their colorful Boho Sunset Sangeet & Dholki Night",
      "storyQuote": "Under golden twilight skies, when the dhol begins to play, our celebration begins!",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "rounded",
        "crestText": "&",
        "brideName": "Zara Farooqi",
        "brideRole": "Daughter of Mr. & Mrs. Farooqi",
        "brideImageUrl": null,
        "groomName": "Kabir Malik",
        "groomRole": "Son of Mr. & Mrs. Malik",
        "groomImageUrl": null
      },
      "dressCode": "Festive Boho Chic / Sunset Orange, Mustard Yellow, Terracotta & Mirror Work",
      "itinerary": [
        { "id": "it-1", "title": "Chaat Street & Henna Mehndi Lounge", "time": "5:30 PM", "description": "Pani puri shots, live bangle bar, artisanal henna artists and sunset lounge vibes" },
        { "id": "it-2", "title": "Dhol Beat Entrance & Sangeet Face-Off", "time": "7:00 PM", "description": "High-energy dance performances by family & friends around the outdoor fire pits" },
        { "id": "it-3", "title": "Midnight Street Food Carnival & DJ Set", "time": "9:00 PM", "description": "Live tawa grill feast, kulfi falooda cart and dancing till late" }
      ],
      "gallery": [],
      "rsvpHeadline": "Save Your Spot on the Dancefloor",
      "rsvpDeadline": "Confirm by the first of November",
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
      "preset": "playful-pop",
      "particles": "gold-dust",
      "lottieAccent": "sparkle-ring"
    },
    "audio": {
      "enabled": true,
      "trackId": "festive-strings",
      "trackTitle": "Golden Hour Chimes",
      "customUrl": null,
      "volume": 0.7
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111128',
  'Anand Karaj (Rosewater Whisper & Mint Sage)',
  'wedding',
  '/templates/anand-karaj-sage.svg',
  true,
  '{
    "theme": {
      "presetId": "anand-karaj-sage",
      "palette": {
        "background": "#F6F9F6",
        "surface": "#FFFFFF",
        "primary": "#4A6B5D",
        "secondary": "#2C483C",
        "accent": "#C5A55D",
        "text": "#192E25",
        "mutedText": "#5E776C"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "vellum",
      "cardArt": {
        "motif": "floral-bouquet",
        "borderStyle": "botanical-vine",
        "backdropPreset": "peony-arch",
        "backdropUrl": null,
        "backdropOpacity": 0.3,
        "heroFrame": "arch"
      }
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#3C584C",
      "linerColor": "#C5A55D",
      "waxSeal": {
        "enabled": true,
        "color": "#A88741",
        "monogram": "S&H",
        "emblem": "floral"
      },
      "promptText": "Tap the sage floral seal to open the sacred wedding folio"
    },
    "content": {
      "hostLine": "Ik Onkar · With the divine grace and blessings of Waheguru",
      "headline": "Simran & Harpreet",
      "subtitle": "Humbly request your presence and blessings at their sacred Anand Karaj",
      "storyQuote": "They are not said to be husband and wife who merely sit together. Rather, one soul in two bodies.",
      "heroImageUrl": null,
      "couple": {
        "layout": "side-by-side",
        "frameShape": "arch",
        "crestText": "&",
        "brideName": "Simran Kaur",
        "brideRole": "Daughter of Sardar & Sardarni Grewal",
        "brideImageUrl": null,
        "groomName": "Harpreet Singh",
        "groomRole": "Son of Sardar & Sardarni Dhillon",
        "groomImageUrl": null
      },
      "dressCode": "Elegance in Pastels / Mint Sage, Rosewater Blush, Ivory & Powder Gold (Heads to be covered)",
      "itinerary": [
        { "id": "it-1", "title": "Baraat Arrival & Milni Ceremony", "time": "9:30 AM", "description": "Traditional floral garland exchange between elder family members and warm breakfast" },
        { "id": "it-2", "title": "Anand Karaj (Laavan Nuptials)", "time": "10:45 AM", "description": "Four sacred circumambulations around Sri Guru Granth Sahib Ji accompanied by divine kirtan" },
        { "id": "it-3", "title": "Guru Ka Langar & Family Reception", "time": "12:30 PM", "description": "Sacred community meal followed by celebration lunch in the garden marquee" }
      ],
      "gallery": [],
      "rsvpHeadline": "Kindly Bless Our Union",
      "rsvpDeadline": "Please confirm attendance by the twenty-fifth of October",
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
)
on conflict (id) do update
  set title = excluded.title,
      category = excluded.category,
      thumbnail_url = excluded.thumbnail_url,
      default_config = excluded.default_config,
      is_active = excluded.is_active;
