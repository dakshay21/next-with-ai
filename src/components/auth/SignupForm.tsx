"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert } from "@/components/ui/FormAlert";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { createClient } from "@/lib/supabase/client";
import { mapAuthError, messages } from "@/lib/messages";
import {
  dismissToast,
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";

export const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const toastId = showLoadingToast(messages.loading.signup);

    const supabase = createClient();
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      dismissToast(toastId);
      showErrorToast(mapAuthError(signUpError.message));
      return;
    }

    if (data.user && data.user.identities?.length === 0) {
      dismissToast(toastId);
      showErrorToast(messages.signup.duplicateEmail, {
        description: "Use the login page if you already have an account.",
      });
      return;
    }

    showSuccessToast(messages.signup.successTitle, {
      id: toastId,
      description: messages.signup.successBody(email),
      duration: 8000,
    });
    setSuccess(true);
    router.refresh();
  };

  if (success) {
    return (
      <FormAlert
        variant="success"
        title={messages.signup.successTitle}
        action={{ href: "/login", label: "Back to login" }}
      >
        {messages.signup.successBody(email)}
      </FormAlert>
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
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
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
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Password"
        />
        <p className="mt-1 text-xs text-zinc-500">At least 6 characters</p>
      </div>
      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingLabel="Creating account…"
        aria-label="Create account"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Sign up
      </LoadingButton>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </form>
  );
};
