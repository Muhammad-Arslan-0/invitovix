export type LanguageCode =
  | "en"
  | "ur"
  | "ar"
  | "hi"
  | "fr"
  | "es"
  | "tr"
  | "de"
  | "it"
  | "bn"
  | "id";

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
    locale: "en-US",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    flag: "🇵🇰",
    dir: "rtl",
    locale: "ur-PK",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
    locale: "ar-SA",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    dir: "ltr",
    locale: "hi-IN",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    locale: "fr-FR",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    locale: "es-ES",
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    dir: "ltr",
    locale: "tr-TR",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    dir: "ltr",
    locale: "de-DE",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    dir: "ltr",
    locale: "it-IT",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇧🇩",
    dir: "ltr",
    locale: "bn-BD",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    dir: "ltr",
    locale: "id-ID",
  },
];

export const DEFAULT_LANGUAGE_CODE: LanguageCode = "en";

export function getLanguageMeta(code?: string | null): LanguageMeta {
  if (!code) {
    return SUPPORTED_LANGUAGES[0];
  }
  const normalized = code.toLowerCase().trim().slice(0, 2) as LanguageCode;
  const match = SUPPORTED_LANGUAGES.find((lang) => lang.code === normalized);
  return match || SUPPORTED_LANGUAGES[0];
}

export function isRtlLanguage(code?: string | null): boolean {
  return getLanguageMeta(code).dir === "rtl";
}
