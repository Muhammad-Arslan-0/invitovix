"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const missingSetup = searchParams.get("setup") === "missing";

  const { isConfigured } = getSupabaseEnv();

  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_failed"
      ? "Magic link verification failed or expired. Please try again."
      : null
  );
  const [magicSent, setMagicSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError(
        "Supabase keys are not configured in .env.local yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and restart the dev server."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (mode === "magic") {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              nextPath
            )}`,
          },
        });
        if (otpError) {
          setError(otpError.message);
          return;
        }
        setMagicSent(true);
        return;
      }

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
          setError(signUpError.message);
          return;
        }
        if (data.session) {
          router.push(nextPath);
          router.refresh();
          return;
        }
        setMagicSent(true);
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
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] flex flex-col justify-between px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Invitovix
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-7 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-[0.22em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Invitovix Studio</span>
          </div>

          <h1 className="mt-2 text-2xl font-serif font-semibold text-stone-900">
            {mode === "signup"
              ? "Create Host Account"
              : mode === "magic"
                ? "Sign In with Magic Link"
                : "Welcome Back"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Design animated invitations, customize music, and track live RSVPs.
          </p>

          {(missingSetup || !isConfigured) && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 flex gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div>
                <p className="font-semibold">Supabase Setup Pending</p>
                <p className="mt-0.5 leading-relaxed">
                  Copy <code className="font-mono">.env.example</code> to{" "}
                  <code className="font-mono">.env.local</code>, add your{" "}
                  <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  , and run the SQL scripts in{" "}
                  <code className="font-mono">supabase/migrations/</code>. You can
                  still preview the guest experience at{" "}
                  <Link href="/e/demo" className="underline font-medium">
                    /e/demo
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="mt-6 grid grid-cols-3 rounded-xl bg-stone-100 p-1 text-xs font-medium">
            {(
              [
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Sign Up" },
                { id: "magic", label: "Magic Link" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setError(null);
                  setMagicSent(false);
                }}
                className={`rounded-lg py-2 transition cursor-pointer ${
                  mode === tab.id
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {magicSent ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h2 className="mt-2 text-sm font-semibold text-emerald-950">
                Check Your Inbox
              </h2>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                We sent a confirmation / sign-in link to{" "}
                <strong>{email}</strong>. Click the link in your email to open
                your Invitovix Dashboard.
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

              {mode !== "magic" && (
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
              )}

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : mode === "magic" ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Magic Link</span>
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
      </div>

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
        <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-sm text-stone-500">
          Loading Invitovix...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

