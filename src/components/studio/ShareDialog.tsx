"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeCanvas } from "qrcode.react";
import {
  CalendarDays,
  Check,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Share2,
  Sparkles,
  X,
} from "lucide-react";

interface ShareDialogProps {
  slug: string;
  title: string;
  isPublished: boolean;
  onTogglePublish: () => void;
}

export function ShareDialog({
  slug,
  title,
  isPublished,
  onTogglePublish,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<"all" | "reception">("all");
  const qrWrapRef = useRef<HTMLDivElement | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${slug}`
      : `http://localhost:3000/e/${slug}`;

  const activeShareUrl =
    selectedTarget === "reception" ? `${baseUrl}?access=reception` : baseUrl;

  async function handleCopy() {
    await navigator.clipboard.writeText(activeShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleDownloadQr() {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `${slug}-${selectedTarget}-qr.png`;
    a.click();
  }

  const whatsappMessage =
    selectedTarget === "reception"
      ? `Warm greetings! We cordially invite you to celebrate the Wedding Reception & Dinner of ${title}. Please open your invitation here: ${activeShareUrl}`
      : `Warm greetings! You and your family are cordially invited to celebrate all three days of our wedding ceremonies (Mehndi, Baraat & Reception) of ${title}. Please open your invitation here: ${activeShareUrl}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Links</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-serif font-semibold text-stone-900">
                Share Guest Invitations
              </Dialog.Title>
              <Dialog.Description className="text-xs text-stone-500 mt-0.5">
                {title} · Send custom links for 3-Day guests or Reception-only guests
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {!isPublished && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 flex items-center justify-between gap-3">
              <p className="text-xs text-amber-900">
                Currently a <strong>draft</strong>. Publish so guests can view it.
              </p>
              <button
                type="button"
                onClick={onTogglePublish}
                className="shrink-0 rounded-lg bg-amber-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-amber-800 cursor-pointer"
              >
                Publish Now
              </button>
            </div>
          )}

          {/* Invitation Target Selector (3-Days vs Reception Only) */}
          <div className="mt-5 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Select Guest Invitation Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTarget("all")}
                className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                  selectedTarget === "all"
                    ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                    : "border-stone-200 bg-stone-50/70 hover:bg-white text-stone-800"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <CalendarDays
                    className={`w-4 h-4 ${
                      selectedTarget === "all" ? "text-amber-300" : "text-amber-700"
                    }`}
                  />
                  <span>All 3 Days (Full Wedding)</span>
                </div>
                <p
                  className={`mt-1 text-[11px] leading-tight ${
                    selectedTarget === "all" ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  For family &amp; close friends (Mehndi, Baraat &amp; Reception)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget("reception")}
                className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                  selectedTarget === "reception"
                    ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                    : "border-stone-200 bg-stone-50/70 hover:bg-white text-stone-800"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles
                    className={`w-4 h-4 ${
                      selectedTarget === "reception" ? "text-amber-300" : "text-amber-700"
                    }`}
                  />
                  <span>Reception Only (Valima)</span>
                </div>
                <p
                  className={`mt-1 text-[11px] leading-tight ${
                    selectedTarget === "reception" ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  Shows only Reception &amp; Dinner; hides private Mehndi/Baraat
                </p>
              </button>
            </div>
          </div>

          {/* QR Code (dynamically matches chosen link) */}
          <div
            ref={qrWrapRef}
            className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 p-4"
          >
            <QRCodeCanvas value={activeShareUrl} size={150} includeMargin />
            <div className="mt-2.5 flex items-center gap-3">
              <span className="text-[11px] font-semibold text-stone-700">
                {selectedTarget === "reception"
                  ? "Reception-Only QR Code"
                  : "All 3 Days QR Code"}
              </span>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 hover:text-amber-950 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          {/* Copyable Link & WhatsApp Share */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={activeShareUrl}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-mono text-stone-700 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-stone-800 cursor-pointer transition shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-900 hover:bg-emerald-100 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  Share via WhatsApp ({selectedTarget === "reception" ? "Reception" : "3-Days"})
                </span>
              </a>

              <a
                href={activeShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900"
              >
                <span>Preview As Guest</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
