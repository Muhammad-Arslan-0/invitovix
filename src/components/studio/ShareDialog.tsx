"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeCanvas } from "qrcode.react";
import {
  Check,
  Copy,
  CopyPlus,
  Download,
  ExternalLink,
  MessageCircle,
  Share2,
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
  const qrWrapRef = useRef<HTMLDivElement | null>(null);

  const activeShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${slug}`
      : `http://localhost:3000/e/${slug}`;

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
    a.download = `${slug}-qr.png`;
    a.click();
  }

  const whatsappMessage = `Warm greetings! You are cordially invited to celebrate ${title}. Please open your invitation here: ${activeShareUrl}`;

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
          <span>Share Link</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-serif font-semibold text-stone-900">
                Share Invitation Card
              </Dialog.Title>
              <Dialog.Description className="text-xs text-stone-500 mt-0.5">
                {title} · Share your private, secure guest link
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

          {/* QR Code */}
          <div
            ref={qrWrapRef}
            className="mt-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 border border-stone-200/80"
          >
            <QRCodeCanvas
              value={activeShareUrl}
              size={180}
              level="H"
              marginSize={2}
              className="rounded-xl bg-white p-2 shadow-xs"
            />
            <p className="mt-2 text-[11px] text-stone-500 text-center">
              Scan with camera to open invitation card
            </p>
          </div>

          {/* Share URL Box */}
          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Secure Guest Link:
            </label>
            <div className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-50/70 p-1.5 pr-2 focus-within:border-stone-900 focus-within:bg-white transition">
              <input
                type="text"
                readOnly
                value={activeShareUrl}
                className="w-full bg-transparent px-2.5 text-xs text-stone-700 font-mono focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 transition cursor-pointer shrink-0 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#20BD5A] transition shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadQr}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save QR Code</span>
            </button>
          </div>

          {/* Tip for Multiple Events / Reception Only */}
          <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <CopyPlus className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Multiple Events or Reception Only?</span>
              <p className="mt-0.5 text-amber-800/90 leading-relaxed text-[11px]">
                Use <strong>Duplicate Card</strong> to create a dedicated invitation for other ceremonies or reception-only guests. Duplicated cards have their own private link and RSVP responses, keeping your events clean and private.
              </p>
            </div>
          </div>

          {/* Footer Preview Link */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Live Guest Link</span>
            <a
              href={activeShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-stone-900 hover:underline font-medium"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
