"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EventDesignData } from "@/types/invitation";
import {
  DEFAULT_LANGUAGE_CODE,
  LanguageCode,
  LanguageMeta,
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
  isRtlLanguage,
} from "./languages";
import {
  TranslationKey,
  UI_TRANSLATIONS,
} from "./translations";
import {
  formatLocalizedDate,
  formatLocalizedTime,
  saveClientTranslations,
  translateDesignData,
  translateText,
} from "./translateService";

interface CardLanguageContextValue {
  language: LanguageCode;
  languageMeta: LanguageMeta;
  setLanguage: (code: LanguageCode) => void;
  isRTL: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  translate: (text?: string | null) => string;
  translatedDesignData: EventDesignData;
  translatedVenueName: string;
  translatedVenueAddress: string;
  formatDate: (
    dateIso: string | Date,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatTime: (
    dateIso: string | Date,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  isTranslating: boolean;
}

const CardLanguageContext = createContext<CardLanguageContextValue | null>(null);

const STORAGE_KEY = "invitovix_card_lang";

interface CardLanguageProviderProps {
  children: React.ReactNode;
  initialDesignData: EventDesignData;
  venueName?: string;
  venueAddress?: string | null;
  initialLang?: string | null;
}

export function CardLanguageProvider({
  children,
  initialDesignData,
  venueName = "",
  venueAddress = "",
  initialLang,
}: CardLanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (initialLang) {
      const meta = getLanguageMeta(initialLang);
      return meta.code;
    }
    return DEFAULT_LANGUAGE_CODE;
  });

  const [dynamicTranslations, setDynamicTranslations] = useState<
    Record<string, string>
  >({});
  const [isTranslating, setIsTranslating] = useState(false);
  const requestedTextsRef = useRef<Set<string>>(new Set());

  // Check URL query parameters and localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang") || urlParams.get("locale");
      if (urlLang) {
        const meta = getLanguageMeta(urlLang);
        setLanguageState(meta.code);
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const meta = getLanguageMeta(stored);
        setLanguageState(meta.code);
      }
    } catch {
      // ignore
    }
  }, []);

  const languageMeta = useMemo(() => getLanguageMeta(language), [language]);
  const isRTL = useMemo(() => isRtlLanguage(language), [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  }, []);

  // UI Translation lookup with parameter interpolation
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
      let template = dict[key] || UI_TRANSLATIONS.en[key] || key;

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          template = template.replaceAll(`{${k}}`, String(v));
        }
      }
      return template;
    },
    [language]
  );

  const translate = useCallback(
    (text?: string | null): string => {
      if (!text) return "";
      if (language === "en") return text;
      if (dynamicTranslations[text]) return dynamicTranslations[text];
      return translateText(text, language);
    },
    [language, dynamicTranslations]
  );

  // Translated Design Data
  const translatedDesignData = useMemo(() => {
    return translateDesignData(
      initialDesignData,
      language,
      dynamicTranslations
    );
  }, [initialDesignData, language, dynamicTranslations]);

  const translatedVenueName = useMemo(() => {
    return translate(venueName);
  }, [venueName, translate]);

  const translatedVenueAddress = useMemo(() => {
    return translate(venueAddress || "");
  }, [venueAddress, translate]);

  // Request async translations for user-defined strings not in dictionary
  useEffect(() => {
    if (language === "en") return;

    const uncachedTexts: string[] = [];
    const checkAndCollect = (str?: string | null) => {
      if (!str || typeof str !== "string") return;
      const trimmed = str.trim();
      if (!trimmed) return;
      const reqKey = `${language}:${trimmed}`;
      if (requestedTextsRef.current.has(reqKey)) return;

      const translated = translateText(trimmed, language);
      if (translated === trimmed && !dynamicTranslations[trimmed]) {
        uncachedTexts.push(trimmed);
        requestedTextsRef.current.add(reqKey);
      }
    };

    if (initialDesignData.envelope?.promptText) {
      checkAndCollect(initialDesignData.envelope.promptText);
    }

    checkAndCollect(initialDesignData.content.hostLine);
    checkAndCollect(initialDesignData.content.headline);
    checkAndCollect(initialDesignData.content.subtitle);
    checkAndCollect(initialDesignData.content.storyQuote);
    checkAndCollect(initialDesignData.content.dressCode);
    checkAndCollect(initialDesignData.content.rsvpHeadline);
    checkAndCollect(venueName);
    checkAndCollect(venueAddress);

    if (initialDesignData.content.couple) {
      checkAndCollect(initialDesignData.content.couple.brideName);
      checkAndCollect(initialDesignData.content.couple.groomName);
      checkAndCollect(initialDesignData.content.couple.brideRole);
      checkAndCollect(initialDesignData.content.couple.groomRole);
    }

    for (const it of initialDesignData.content.itinerary || []) {
      checkAndCollect(it.title);
      checkAndCollect(it.description);
      checkAndCollect(it.dayLabel);
    }

    if (uncachedTexts.length === 0) return;

    let cancelled = false;
    setIsTranslating(true);

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: uncachedTexts, to: language }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.translations) {
          const valid: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.translations as Record<string, string>)) {
            if (v && v.trim() && v !== k) {
              valid[k] = v;
            }
          }
          if (Object.keys(valid).length > 0) {
            setDynamicTranslations((prev) => ({
              ...prev,
              ...valid,
            }));
            saveClientTranslations(valid, language);
          }
        }
      })
      .catch(() => {
        // Fallback silently without throwing
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    language,
    initialDesignData,
    venueName,
    venueAddress,
  ]);

  const formatDate = useCallback(
    (dateIso: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return formatLocalizedDate(dateIso, languageMeta.locale, options);
    },
    [languageMeta.locale]
  );

  const formatTime = useCallback(
    (dateIso: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return formatLocalizedTime(dateIso, languageMeta.locale, options);
    },
    [languageMeta.locale]
  );

  const contextValue = useMemo<CardLanguageContextValue>(() => {
    return {
      language,
      languageMeta,
      setLanguage,
      isRTL,
      t,
      translate,
      translatedDesignData,
      translatedVenueName,
      translatedVenueAddress,
      formatDate,
      formatTime,
      isTranslating,
    };
  }, [
    language,
    languageMeta,
    setLanguage,
    isRTL,
    t,
    translate,
    translatedDesignData,
    translatedVenueName,
    translatedVenueAddress,
    formatDate,
    formatTime,
    isTranslating,
  ]);

  return (
    <CardLanguageContext.Provider value={contextValue}>
      {children}
    </CardLanguageContext.Provider>
  );
}

const defaultFallback: CardLanguageContextValue = {
  language: "en",
  languageMeta: SUPPORTED_LANGUAGES[0],
  setLanguage: () => {},
  isRTL: false,
  t: (key, params) => {
    let template = UI_TRANSLATIONS.en[key] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        template = template.replaceAll(`{${k}}`, String(v));
      }
    }
    return template;
  },
  translate: (text) => text || "",
  translatedDesignData: {} as EventDesignData,
  translatedVenueName: "",
  translatedVenueAddress: "",
  formatDate: (date, options) => formatLocalizedDate(date, "en-US", options),
  formatTime: (date, options) => formatLocalizedTime(date, "en-US", options),
  isTranslating: false,
};

export function useCardLanguage(): CardLanguageContextValue {
  const ctx = useContext(CardLanguageContext);
  return ctx || defaultFallback;
}
