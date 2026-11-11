"use client";

import { useEffect } from "react";
import { BrandMark } from "@/components/ui/BrandMark";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Invitovix global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfaf7] text-stone-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl">
          <BrandMark
            size="lg"
            decorative
            className="mx-auto mb-3"
          />
          <p className="text-[11px] uppercase tracking-[0.24em] text-amber-700 font-semibold">
            Invitovix
          </p>
          <h1 className="mt-2 text-2xl font-serif font-semibold text-stone-900">
            Temporary Server Interruption
          </h1>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            {error.message ||
              "Please refresh or try again in a moment."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-stone-800 cursor-pointer"
            >
              Reload Page
            </button>
            <a
              href="/dashboard"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

