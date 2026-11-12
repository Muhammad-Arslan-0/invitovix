"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { startNavigation } from "@/components/ui/NavigationProgress";
import { LuxLoader } from "@/components/ui/LuxLoader";
import { BrandMark } from "@/components/ui/BrandMark";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const missingSetup = searchParams.get("setup") === "missing";

  const { isConfigured } = getSupabaseEnv();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_failed"
      ? "Verification failed or link expired. Please try again."
      : null
  );
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError(
        "Account service is currently unavailable. Please check back shortly."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() || email.split("@")[0] },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              nextPath
            )}`,
          },
        });
        if (signUpError) {
          if (signUpError.message.toLowerCase().includes("rate limit")) {
            setError(
              "Sign-up limit reached. Please wait a few minutes before trying again or sign in if you already have an account."
            );
          } else {
            setError(signUpError.message);
          }
          return;
        }
        if (data.session) {
          startNavigation();
          startTransition(() => {
            router.push(nextPath);
            router.refresh();
          });
          return;
        }
        setConfirmationSent(true);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      startNavigation();
      startTransition(() => {
        router.push(nextPath);
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex flex-col justify-between px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Invitovix
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
            className="mt-2 text-2xl font-semibold text-stone-900"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            {mode === "signup"
              ? "Create Host Account"
              : "Welcome Back"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Design animated invitations, customize music, and track live RSVPs.
          </p>

          {(missingSetup || !isConfigured) && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 flex gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div>
                <p className="font-semibold">Service Notice</p>
                <p className="mt-0.5 leading-relaxed">
                  Host sign-in is currently undergoing brief maintenance. You can
                  still preview the interactive guest experience at{" "}
                  <Link href="/e/demo" className="underline font-medium">
                    /e/demo
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="mt-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-xs font-medium">
            {(
              [
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Sign Up" },
              ] as const
            ).map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMode(tab.id);
                    setError(null);
                    setConfirmationSent(false);
                  }}
                  className={`relative rounded-lg py-2 transition cursor-pointer ${
                    active
                      ? "text-stone-900"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="login-mode-pill"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {confirmationSent ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h2 className="mt-2 text-sm font-semibold text-emerald-950">
                Check Your Inbox
              </h2>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                We sent a confirmation link to{" "}
                <strong>{email}</strong>. Click the link in your email to verify
                your account and access your Invitovix Dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Amina Khan"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="host@example.com"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none"
                />
              </div>

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
                    <span>
                      {isPending ? "Opening Dashboard..." : "Please wait..."}
                    </span>
                  </>
                ) : mode === "signup" ? (
                  <span>Create Account</span>
                ) : (
                  <span>Sign In to Dashboard</span>
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex items-center justify-center">
          <LuxLoader title="Invitovix Studio" subtitle="Preparing host sign-in..." />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

