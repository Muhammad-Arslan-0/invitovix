"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Invitovix route error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-stone-200 bg-white/95 p-8 text-center shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-amber-700 font-semibold">
          Invitovix · Recovery
        </p>
        <h1
          className="mt-1.5 text-2xl font-semibold text-stone-900"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          Something Interrupted This View
        </h1>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
          {error.message ||
            "We hit an unexpected issue loading this screen. Try reloading or returning to your dashboard."}
        </p>
        {error.digest && (
          <p className="mt-2 text-[11px] font-mono text-stone-400">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>Try Again</span>
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

