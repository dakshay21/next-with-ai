"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
    router.refresh();
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-green-800 underline dark:text-green-200"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Email address"
        />
      </div>
      <div>
        <label
          htmlFor="signup-password"
          className="mb-1 block text-sm font-medium"
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Password"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        aria-label="Create account"
      >
        {isLoading ? "Creating account…" : "Sign up"}
      </button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </form>
  );
};
