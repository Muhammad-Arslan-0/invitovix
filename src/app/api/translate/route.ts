import { NextRequest, NextResponse } from "next/server";
import { PHRASE_TRANSLATIONS, UI_TRANSLATIONS } from "@/lib/i18n/translations";
import { LanguageCode, SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import { translateText } from "@/lib/i18n/translateService";

const translationCache = new Map<string, string>();

function getCacheKey(text: string, to: string): string {
  return `${to}:${text.trim().toLowerCase()}`;
}

async function fetchGoogleTranslate(
  text: string,
  targetLang: string
): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
    targetLang
  )}&dt=t&q=${encodeURIComponent(trimmed)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0]
        .map((segment: unknown) =>
          Array.isArray(segment) && typeof segment[0] === "string"
            ? segment[0]
            : ""
        )
        .join("");
      return translated || null;
    }
  } catch {
    return null;
  }
  return null;
}

async function fetchMyMemoryTranslate(
  text: string,
  targetLang: string
): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    trimmed
  )}&langpair=en|${encodeURIComponent(targetLang)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Invitovix/1.0",
      },
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();
    if (data?.responseData?.translatedText) {
      const trans = data.responseData.translatedText;
      if (typeof trans === "string" && !trans.includes("MYMEMORY WARNING")) {
        return trans;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texts: string[] = Array.isArray(body?.texts) ? body.texts : [];
    const to: string = typeof body?.to === "string" ? body.to.toLowerCase() : "en";

    if (!texts.length || to === "en") {
      const identity: Record<string, string> = {};
      for (const t of texts) {
        identity[t] = t;
      }
      return NextResponse.json({ translations: identity });
    }

    const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === to);
    const targetLang = (isSupported ? to : "en") as LanguageCode;

    const results: Record<string, string> = {};
    const textsToFetch: string[] = [];

    for (const text of texts) {
      if (!text || typeof text !== "string") continue;
      const trimmed = text.trim();
      if (!trimmed) {
        results[text] = text;
        continue;
      }

      // 1. Check in-memory cache
      const cacheKey = getCacheKey(trimmed, targetLang);
      if (translationCache.has(cacheKey)) {
        results[text] = translationCache.get(cacheKey)!;
        continue;
      }

      // 2. Check phrase dictionary & pattern resolver
      const localResult = translateText(trimmed, targetLang);
      if (localResult && localResult !== trimmed) {
        translationCache.set(cacheKey, localResult);
        results[text] = localResult;
        continue;
      }

      // 3. Check UI translations
      let uiFound = false;
      const uiDict = UI_TRANSLATIONS[targetLang];
      const enDict = UI_TRANSLATIONS.en;
      for (const [k, v] of Object.entries(enDict)) {
        if (v.toLowerCase() === trimmed.toLowerCase()) {
          const trans = uiDict[k as keyof typeof uiDict];
          if (trans) {
            translationCache.set(cacheKey, trans);
            results[text] = trans;
            uiFound = true;
            break;
          }
        }
      }
      if (uiFound) continue;

      textsToFetch.push(text);
    }

    // 4. For remaining uncached texts, try remote translation in parallel
    if (textsToFetch.length > 0) {
      await Promise.all(
        textsToFetch.map(async (text) => {
          let translated = await fetchGoogleTranslate(text, targetLang);
          if (!translated) {
            translated = await fetchMyMemoryTranslate(text, targetLang);
          }
          const finalResult = translated || translateText(text, targetLang) || text;
          const cacheKey = getCacheKey(text, targetLang);
          translationCache.set(cacheKey, finalResult);
          results[text] = finalResult;
        })
      );
    }

    return NextResponse.json({
      to: targetLang,
      translations: results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Translation error",
        translations: {},
      },
      { status: 200 }
    );
  }
}
