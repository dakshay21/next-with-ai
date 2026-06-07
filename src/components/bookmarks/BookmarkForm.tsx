"use client";

import { useState } from "react";
import type { Bookmark } from "@/types/database.types";

type BookmarkFormProps = {
  onCreated: (bookmark: Bookmark) => void;
};

export const BookmarkForm = ({ onCreated }: BookmarkFormProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, is_public: isPublic }),
    });

    const body = (await response.json()) as {
      error?: string;
      bookmark?: Bookmark;
    };

    setIsLoading(false);

    if (!response.ok || !body.bookmark) {
      setError(body.error ?? "Failed to create bookmark");
      return;
    }

    setTitle("");
    setUrl("");
    setIsPublic(false);
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
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Bookmark title"
      />
      <input
        type="url"
        required
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Bookmark URL"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          aria-label="Make bookmark public"
        />
        Public (visible on your profile)
      </label>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        aria-label="Add bookmark"
      >
        {isLoading ? "Adding…" : "Add bookmark"}
      </button>
    </form>
  );
};
