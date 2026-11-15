"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { startNavigation } from "@/components/ui/NavigationProgress";
import { LuxLoader } from "@/components/ui/LuxLoader";
import { BrandMark } from "@/components/ui/BrandMark";

function ResetPasswordForm() {
  const router = useRouter();
  const { isConfigured } = getSupabaseEnv();

  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setHasSession(true);
      }
      setCheckingSession(false);
    });

    // Listen for auth state change (e.g. PASSWORD_RECOVERY event or token hydration)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError(
        "Account service is currently unavailable. Please check back shortly."
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      startNavigation();
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex flex-col justify-between px-4 py-8">
      <div className="max-w-md w-full mx-auto" />

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
            className="mt-2 text-2xl font-semibold text-stone-900"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Set New Password
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Create a secure new password for your Invitovix host account.
          </p>

          {checkingSession ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
              <p className="text-xs text-stone-500">
                Verifying password reset session...
              </p>
            </div>
          ) : !hasSession ? (
            <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-700 mx-auto" />
              <h2 className="text-sm font-semibold text-amber-950">
                Reset Link Expired or Invalid
              </h2>
              <p className="text-xs text-amber-800 leading-relaxed">
                We couldn&apos;t find an active password recovery session.
                Password reset links are single-use and expire after a short
                time.
              </p>
              <div className="pt-2">
                <Link
                  href="/forgot-password"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-stone-800 transition"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Request New Reset Link</span>
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h2 className="text-sm font-semibold text-emerald-950">
                Password Updated!
              </h2>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your password has been changed successfully. You are being
                redirected to your dashboard...
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-stone-800 transition"
                >
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-stone-300 pl-9 pr-10 py-2.5 text-sm focus:border-stone-900 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition"
                    title={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full rounded-xl border border-stone-300 pl-9 pr-10 py-2.5 text-sm focus:border-stone-900 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition"
                    title={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {password && confirmPassword && (
                <div className="text-[11px] flex items-center gap-1.5 font-medium">
                  {password === confirmPassword ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Passwords do not
                      match
                    </span>
                  )}
                </div>
              )}

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white shadow-sm hover:bg-stone-800 disabled:opacity-60 transition cursor-pointer"
              >
                {loading || isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
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

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
