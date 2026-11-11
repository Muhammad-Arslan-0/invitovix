import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-stone-200 bg-white/95 p-8 text-center shadow-lg">
        <BrandMark
          size="lg"
          decorative
          className="mx-auto"
        />
        <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-amber-700 font-semibold">
          404 · Invitovix
        </p>
        <h1
          className="mt-1.5 text-2xl font-semibold text-stone-900"
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          Invitation Not Found
        </h1>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed">
          The page or invitation link you followed could not be located.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-stone-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back Home</span>
          </Link>
          <Link
            href="/e/demo"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
          >
            <span>Open Demo Invite</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

