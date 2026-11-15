"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
} from "@/lib/i18n/languages";
import { useCardLanguage } from "@/lib/i18n/CardLanguageContext";

interface LanguageSelectorProps {
  variant?: "floating" | "envelope" | "wing";
  accentColor?: string;
  surfaceColor?: string;
  textColor?: string;
  className?: string;
}

export function LanguageSelector({
  variant = "floating",
  accentColor = "#C99A3B",
  surfaceColor,
  textColor,
  className = "",
}: LanguageSelectorProps) {
  const { language, setLanguage, t, isTranslating } = useCardLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "wing") {
    return (
      <div
        ref={containerRef}
        className={`relative w-full ${isOpen ? "z-50" : "z-20"} ${className}`}
        data-testid="language-selector-wing"
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full inline-flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-medium text-stone-200 transition cursor-pointer"
          aria-expanded={isOpen}
          aria-label={t("selectLanguage")}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>
              {currentLang.flag} {currentLang.nativeName}
            </span>
            {isTranslating && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute left-0 right-0 bottom-full mb-1.5 z-50 rounded-2xl bg-[#1c1815]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-1.5 max-h-60 overflow-y-auto"
            >
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                {t("selectLanguage")}
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-white/15 text-white font-semibold"
                        : "text-stone-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-stone-400">
                        ({lang.name})
                      </span>
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "envelope") {
    return (
      <div
        ref={containerRef}
        className={`relative ${isOpen ? "z-50" : "z-20"} ${className}`}
        data-testid="language-selector-envelope"
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md border shadow-xs transition hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: surfaceColor ? `${surfaceColor}D8` : "rgba(255,255,255,0.12)",
            borderColor: `${accentColor}55`,
            color: textColor || "inherit",
          }}
          aria-expanded={isOpen}
          aria-label={t("selectLanguage")}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
          <span>
            {currentLang.flag} {currentLang.nativeName}
          </span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-56 rounded-2xl p-1.5 backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.35)] max-h-64 overflow-y-auto no-scrollbar"
              style={{
                backgroundColor: surfaceColor || "#1F1A16",
                borderColor: `${accentColor}44`,
                color: textColor || "#FAF6EE",
              }}
            >
              <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider opacity-60 font-semibold">
                {t("selectLanguage")}
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer hover:bg-current/10"
                    style={{
                      backgroundColor: isSelected
                        ? `${accentColor}25`
                        : "transparent",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-[10px] opacity-60">
                        ({lang.name})
                      </span>
                    </span>
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Floating variant (for card toolbar)
  return (
    <div
      ref={containerRef}
      className={`relative pointer-events-auto ${isOpen ? "z-50" : "z-20"} ${className}`}
      data-testid="language-selector-floating"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[11px] font-medium backdrop-blur-md border shadow-md transition hover:scale-105 cursor-pointer"
        style={{
          backgroundColor: surfaceColor ? `${surfaceColor}E8` : "rgba(255, 253, 248, 0.9)",
          borderColor: `${accentColor}55`,
          color: textColor || "#17261F",
        }}
        title={t("selectLanguage")}
        aria-label={t("selectLanguage")}
        aria-expanded={isOpen}
      >
        <Globe
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accentColor }}
        />
        <span className="font-medium">{currentLang.flag}</span>
        <span className="hidden sm:inline font-medium">
          {currentLang.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 opacity-60 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto absolute right-0 top-full mt-2 z-50 w-52 sm:w-56 rounded-2xl p-1.5 backdrop-blur-2xl border shadow-2xl max-h-64 overflow-y-auto no-scrollbar"
            style={{
              backgroundColor: surfaceColor || "#FAF6EE",
              borderColor: `${accentColor}55`,
              color: textColor || "#17261F",
            }}
          >
            <div
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider opacity-60 font-semibold"
              style={{ color: textColor || "inherit" }}
            >
              {t("selectLanguage")}
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer hover:bg-black/5"
                  style={{
                    backgroundColor: isSelected
                      ? `${accentColor}25`
                      : "transparent",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] opacity-60">
                      ({lang.name})
                    </span>
                  </span>
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
