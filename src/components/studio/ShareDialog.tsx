"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Check, Copy, Download, ExternalLink, Share2, X } from "lucide-react";

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

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${slug}`
      : `http://localhost:3000/e/${slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl border border-stone-200">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-serif font-semibold text-stone-900">
                Share Invitation
              </Dialog.Title>
              <Dialog.Description className="text-xs text-stone-500 mt-0.5">
                {title}
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
            className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 p-5"
          >
            <QRCodeCanvas value={shareUrl} size={164} includeMargin />
            <button
              type="button"
              onClick={handleDownloadQr}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR PNG (for print cards)</span>
            </button>
          </div>

          {/* Copyable Link */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-mono text-stone-700"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-stone-800 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href={`/e/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900"
            >
              <span>Open Guest Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

