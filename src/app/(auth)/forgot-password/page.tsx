"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { LuxLoader } from "@/components/ui/LuxLoader";
import { BrandMark } from "@/components/ui/BrandMark";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");

  const { isConfigured } = getSupabaseEnv();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (initialError === "link_expired") {
      return "Your password reset link is invalid or has expired. Please request a new one below.";
    }
    return null;
  });
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError(
        "Account recovery is currently unavailable. Please check back shortly."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        const msg = resetError.message.toLowerCase();
        if (msg.includes("rate limit") || msg.includes("security purposes")) {
          setError(
            "For security purposes, please wait a minute before requesting another reset email."
          );
        } else {
          setError(resetError.message);
        }
        return;
      }

      setResetSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex flex-col justify-between px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full mx-auto my-8"
      >
        <div className="rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-sm p-7 sm:p-8 shadow-xl shadow-stone-900/5">
          <div className="flex items-center gap-2.5 text-amber-700 text-xs font-semibold uppercase tracking-[0.22em]">
            <BrandMark size="sm" rounded="xl" decorative />
            <span>Invitovix Studio</span>
          </div>

          <h1
            className="mt-2 text-2xl font-semibold text-stone-900 flex items-center gap-2"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            <span>Reset Password</span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Enter your host account email address and we&apos;ll send you a
            secure link to reset your password.
          </p>

          {!isConfigured && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 flex gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div>
                <p className="font-semibold">Service Notice</p>
                <p className="mt-0.5 leading-relaxed">
                  Password recovery is currently undergoing brief maintenance.
                  Please check back shortly or return to{" "}
                  <Link href="/login" className="underline font-medium">
                    Sign In
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {resetSent ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h2 className="text-sm font-semibold text-emerald-950">
                Check Your Inbox
              </h2>
              <p className="text-xs text-emerald-800 leading-relaxed">
                We sent a password reset link to <strong>{email}</strong>.
                Click the link in your email to choose a new password.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setError(null);
                  }}
                  className="rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-medium text-emerald-900 hover:bg-emerald-100 transition cursor-pointer"
                >
                  Send to different email
                </button>
                <Link
                  href="/login"
                  className="rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-stone-800 transition inline-flex items-center justify-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Host Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="host@example.com"
                    className="w-full rounded-xl border border-stone-300 pl-9 pr-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white shadow-sm hover:bg-stone-800 disabled:opacity-60 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-medium text-stone-500 hover:text-stone-900 transition"
                >
                  Remember your password?{" "}
                  <span className="text-amber-700 underline font-semibold">
                    Sign In
                  </span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      <p className="text-center text-xs text-stone-400">
        Invitovix · Interactive Digital Invitations
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex items-center justify-center">
          <LuxLoader
            title="Invitovix Studio"
            subtitle="Preparing password reset..."
          />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
