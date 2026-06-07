"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { mapApiError, messages } from "@/lib/messages";
import {
  dismissToast,
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import type { Bookmark } from "@/types/database.types";

type BookmarkFormProps = {
  onCreated: (bookmark: Bookmark) => void;
};

export const BookmarkForm = ({ onCreated }: BookmarkFormProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const toastId = showLoadingToast(messages.loading.bookmarkCreate);

    let response: Response;
    try {
      response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, is_public: isPublic }),
      });
    } catch {
      setIsLoading(false);
      dismissToast(toastId);
      showErrorToast(messages.toast.networkError);
      return;
    }

    const body = (await response.json()) as {
      error?: string;
      bookmark?: Bookmark;
    };

    setIsLoading(false);

    if (!response.ok || !body.bookmark) {
      dismissToast(toastId);
      showErrorToast(mapApiError(body.error, messages.bookmarks.createFailed));
      return;
    }

    setTitle("");
    setUrl("");
    setIsPublic(false);
    showSuccessToast(messages.bookmarks.created, { id: toastId });
    onCreated(body.bookmark);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <h2 className="text-sm font-semibold">Add bookmark</h2>
      <input
        type="text"
        required
        disabled={isLoading}
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Bookmark title"
      />
      <input
        type="url"
        required
        disabled={isLoading}
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Bookmark URL"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          disabled={isLoading}
          onChange={(e) => setIsPublic(e.target.checked)}
          aria-label="Make bookmark public"
        />
        Public (visible on your profile)
      </label>
      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingLabel="Adding…"
        aria-label="Add bookmark"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Add bookmark
      </LoadingButton>
    </form>
  );
};
