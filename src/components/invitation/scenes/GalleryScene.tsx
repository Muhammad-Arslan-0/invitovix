"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, X } from "lucide-react";
import { EventDesignData, GalleryPhoto } from "@/types/invitation";
import { getDisplayFontFamily } from "@/lib/utils/fonts";
import { getInvitationTypeMeta } from "@/lib/templates/categories";
import { useCardLanguage } from "@/lib/i18n/CardLanguageContext";

interface GallerySceneProps {
  id?: string;
  designData: EventDesignData;
  eventType?: string;
  isStudioPreview?: boolean;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

export function GalleryScene({
  id = "invite-gallery",
  designData,
  eventType = "wedding",
  isStudioPreview = false,
  scrollRootRef,
}: GallerySceneProps) {
  const { t, isRTL } = useCardLanguage();
  const { theme, content, sections } = designData;
  const typeMeta = getInvitationTypeMeta(eventType);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!sections.showGallery) return null;

  if (content.gallery.length === 0) {
    if (!isStudioPreview) return null;
    return (
      <section
        id={id}
        dir={isRTL ? "rtl" : "ltr"}
        className="scroll-mt-14 px-6 sm:px-7 py-6 max-w-lg mx-auto"
      >
        <div
          className="rounded-2xl border border-dashed p-6 text-center"
          style={{ borderColor: `${theme.palette.accent}55` }}
        >
          <ImageIcon
            className="w-6 h-6 mx-auto mb-2 opacity-60"
            style={{ color: theme.palette.accent }}
          />
          <p className="text-xs" style={{ color: theme.palette.mutedText }}>
            {typeMeta.galleryEmptyHint}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      dir={isRTL ? "rtl" : "ltr"}
      className="scroll-mt-14 px-6 sm:px-7 py-8 max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <p
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: theme.palette.accent }}
        >
          {t("momentsAndMemories")}
        </p>
        <h2
          className="mt-1.5 text-2xl sm:text-3xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont),
          }}
        >
          {t("gallery")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {content.gallery.map((photo, idx) => (
          <motion.button
            key={photo.id}
            type="button"
            onClick={() => setActivePhoto(photo)}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{
              once: true,
              amount: 0.05,
              ...(scrollRootRef ? { root: scrollRootRef } : {}),
            }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            whileHover={{ y: -3 }}
            className={`group relative overflow-hidden rounded-2xl border shadow-sm text-left cursor-pointer ${
              idx === 0 && content.gallery.length % 2 === 1
                ? "col-span-2 aspect-[16/10]"
                : "aspect-[4/5]"
            }`}
            style={{
              backgroundColor: theme.palette.surface,
              borderColor: `${theme.palette.accent}44`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption || t("gallery")}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
                <p className="line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {activePhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActivePhoto(null)}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
              >
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                  aria-label={t("close")}
                >
                  <X className="w-5 h-5" />
                </button>
                <div
                  className="max-w-2xl w-full max-h-[85vh] flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption || t("gallery")}
                    className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
                  />
                  {activePhoto.caption && (
                    <p className="mt-3 text-sm text-stone-200 text-center max-w-md">
                      {activePhoto.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
