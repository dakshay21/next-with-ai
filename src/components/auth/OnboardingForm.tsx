"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert } from "@/components/ui/FormAlert";
import { mapApiError, messages } from "@/lib/messages";
import { handleSchema } from "@/lib/validators";

export const OnboardingForm = () => {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = handleSchema.safeParse(handle);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid handle.");
      return;
    }

    setIsLoading(true);

    let response: Response;
    try {
      response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: parsed.data,
          display_name: displayName.trim() || undefined,
        }),
      });
    } catch {
      setIsLoading(false);
      setError("Connection problem. Check your internet and try again.");
      return;
    }

    const body = (await response.json()) as { error?: string };

    setIsLoading(false);

    if (!response.ok) {
      setError(
        mapApiError(body.error, messages.onboarding.saveFailed),
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="handle" className="mb-1 block text-sm font-medium">
          Choose your @handle
        </label>
        <div className="flex items-center gap-1">
          <span className="text-zinc-500">@</span>
          <input
            id="handle"
            type="text"
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            placeholder="yourname"
            pattern="[a-z0-9_]{3,30}"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            aria-label="Handle"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          3–30 characters: lowercase letters, numbers, underscores
        </p>
      </div>
      <div>
        <label htmlFor="display-name" className="mb-1 block text-sm font-medium">
          Display name (optional)
        </label>
        <input
          id="display-name"
          type="text"
          maxLength={100}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Display name"
        />
      </div>
      {error && <FormAlert variant="error">{error}</FormAlert>}
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        aria-label="Save handle"
      >
        {isLoading ? "Saving…" : "Continue to dashboard"}
      </button>
    </form>
  );
};
