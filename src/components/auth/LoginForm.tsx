"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setIsLoading(false);
      setError(signInError.message);
      return;
    }

    if (!data.user) {
      setIsLoading(false);
      setError("Unable to sign in. Please try again.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("handle")
      .eq("id", data.user.id)
      .maybeSingle();

    setIsLoading(false);
    router.push(profile ? "/dashboard" : "/onboarding");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
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
          htmlFor="login-password"
          className="mb-1 block text-sm font-medium"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
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
        aria-label="Log in"
      >
        {isLoading ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account yet?{" "}
        <Link href="/signup" className="font-medium underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};
