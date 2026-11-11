"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, X } from "lucide-react";
import { EventDesignData, GalleryPhoto } from "@/types/invitation";
import { getDisplayFontFamily } from "@/lib/utils/fonts";
import { getInvitationTypeMeta } from "@/lib/templates/categories";

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
      <section id={id} className="scroll-mt-14 px-6 sm:px-7 py-6 max-w-lg mx-auto">
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
    <section id={id} className="scroll-mt-14 px-6 sm:px-7 py-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <p
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: theme.palette.accent }}
        >
          Moments &amp; Memories
        </p>
        <h2
          className="mt-1.5 text-2xl sm:text-3xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont),
          }}
        >
          Gallery
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
              alt={photo.caption || "Event gallery photo"}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3">
                <p className="text-xs text-white/95 line-clamp-1">
                  {photo.caption}
                </p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Portal Lightbox Modal so constrained card frames never clip zoom views */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activePhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActivePhoto(null)}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-lg w-full rounded-2xl overflow-hidden bg-stone-950 border border-white/15"
                >
                  <button
                    type="button"
                    onClick={() => setActivePhoto(null)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer"
                    aria-label="Close photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption || "Photo"}
                    className="w-full max-h-[75vh] object-contain"
                  />
                  {activePhoto.caption && (
                    <p className="p-3.5 text-center text-sm text-stone-200">
                      {activePhoto.caption}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

