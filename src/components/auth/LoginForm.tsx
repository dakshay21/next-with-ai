"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { createClient } from "@/lib/supabase/client";
import { mapAuthError, messages } from "@/lib/messages";
import {
  dismissToast,
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const toastId = showLoadingToast(messages.loading.login);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setIsLoading(false);
      dismissToast(toastId);
      showErrorToast(mapAuthError(signInError.message));
      return;
    }

    if (!data.user) {
      setIsLoading(false);
      dismissToast(toastId);
      showErrorToast(messages.login.genericFailure);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("handle")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      setIsLoading(false);
      dismissToast(toastId);
      showErrorToast("We couldn't load your profile. Please try again.");
      return;
    }

    showSuccessToast(messages.toast.loginSuccess, { id: toastId });
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
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
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
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Password"
        />
      </div>
      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingLabel="Signing in…"
        aria-label="Log in"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Log in
      </LoadingButton>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account yet?{" "}
        <Link href="/signup" className="font-medium underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};
