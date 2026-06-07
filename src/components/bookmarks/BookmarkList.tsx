"use client";

import { useState } from "react";
import type { Bookmark } from "@/types/database.types";

type BookmarkListProps = {
  bookmarks: Bookmark[];
  onUpdate: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
};

export const BookmarkList = ({
  bookmarks,
  onUpdate,
  onDelete,
}: BookmarkListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
    setEditIsPublic(bookmark.is_public);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleSaveEdit = async (id: string) => {
    setError(null);

    const response = await fetch(`/api/bookmarks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        url: editUrl,
        is_public: editIsPublic,
      }),
    });

    const body = (await response.json()) as {
      error?: string;
      bookmark?: Bookmark;
    };

    if (!response.ok || !body.bookmark) {
      setError(body.error ?? "Failed to update bookmark");
      return;
    }

    onUpdate(body.bookmark);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setError(null);

    const response = await fetch(`/api/bookmarks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Failed to delete bookmark");
      return;
    }

    onDelete(id);
  };

  if (bookmarks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No bookmarks yet. Add your first one above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            {editingId === bookmark.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  aria-label="Edit title"
                />
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  aria-label="Edit URL"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    aria-label="Edit public visibility"
                  />
                  Public
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(bookmark.id)}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
                    aria-label="Save changes"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {bookmark.title}
                  </a>
                  <p className="truncate text-xs text-zinc-500">{bookmark.url}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                      bookmark.is_public
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {bookmark.is_public ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(bookmark)}
                    className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
                    aria-label={`Edit ${bookmark.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(bookmark.id)}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                    aria-label={`Delete ${bookmark.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
