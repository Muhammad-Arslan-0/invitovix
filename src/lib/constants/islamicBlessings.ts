export interface IslamicBlessingPresetItem {
  id: string;
  name: string;
  badge: string;
  arabicText: string;
  translation: string;
  reference: string;
  description: string;
  recommendedCategory: "wedding" | "general" | "family";
}

export const ISLAMIC_BLESSING_PRESETS: IslamicBlessingPresetItem[] = [
  {
    id: "bismillah-classic",
    name: "Bismillah Ar-Rahman Ar-Rahim",
    badge: "بِسْمِ ٱللَّٰهِ",
    arabicText: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful",
    reference: "Surah Al-Fatihah 1:1",
    description: "The timeless sacred opening invoking divine mercy and blessings.",
    recommendedCategory: "general",
  },
  {
    id: "ayat-ar-rum",
    name: "Surah Ar-Rum 30:21 (Love & Tranquility)",
    badge: "وَمِنْ ءَايَٰتِهِۦٓ",
    arabicText: "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً",
    translation: "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.",
    reference: "Surah Ar-Rum 30:21",
    description: "The most celebrated wedding verse describing divine peace, mutual love, and mercy.",
    recommendedCategory: "wedding",
  },
  {
    id: "ayat-pairs",
    name: "Surah An-Naba 78:8 (Created in Pairs)",
    badge: "أَزْوَٰجًۭا",
    arabicText: "وَخَلَقْنَـٰكُمْ أَزْوَٰجًۭا",
    translation: "And We created you in pairs.",
    reference: "Surah An-Naba 78:8",
    description: "A profound, minimalist Quranic declaration of companionship and soulmates.",
    recommendedCategory: "wedding",
  },
  {
    id: "dua-barakallah",
    name: "Sunnah Wedding Du'a (Barakallahu Laka)",
    badge: "بَارَكَ اللَّهُ",
    arabicText: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    translation: "May Allah bless you, bestow His blessings upon you, and unite you both in goodness.",
    reference: "Sunnah Du'a (Jami' at-Tirmidhi)",
    description: "The Prophet's ﷺ beloved supplication for newly united couples.",
    recommendedCategory: "wedding",
  },
  {
    id: "dua-rabbana",
    name: "Surah Al-Furqan 25:74 (Comfort of the Eyes)",
    badge: "رَبَّنَا هَبْ لَنَا",
    arabicText: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍۢ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    translation: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us leaders for the righteous.",
    reference: "Surah Al-Furqan 25:74",
    description: "The timeless prayer of the believers for loving marriage and blessed family.",
    recommendedCategory: "family",
  },
  {
    id: "ayat-garments",
    name: "Surah Al-Baqarah 2:187 (Garments for Each Other)",
    badge: "هُنَّ لِبَاسٌۭ",
    arabicText: "هُنَّ لِبَاسٌۭ لَّكُمْ وَأَنتُمْ لِبَاسٌۭ لَّهُنَّ",
    translation: "They are a garment for you, and you are a garment for them.",
    reference: "Surah Al-Baqarah 2:187",
    description: "The Quranic metaphor of mutual protection, warmth, and dignity in marriage.",
    recommendedCategory: "wedding",
  },
  {
    id: "bismillah-compact",
    name: "Bismillah (Compact Inscription)",
    badge: "بِسْمِ ٱللَّٰهِ",
    arabicText: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of God, Most Gracious, Most Merciful",
    reference: "",
    description: "A compact single-line heading ideal for delicate stationery borders.",
    recommendedCategory: "general",
  },
];

export function getBlessingPresetById(id: string): IslamicBlessingPresetItem | undefined {
  return ISLAMIC_BLESSING_PRESETS.find((item) => item.id === id);
}
