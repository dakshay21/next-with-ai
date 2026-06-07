"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Spinner } from "@/components/ui/Spinner";
import { mapApiError, messages } from "@/lib/messages";
import {
  dismissToast,
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
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
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStartEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
    setEditIsPublic(bookmark.is_public);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    setSavingId(id);
    const toastId = showLoadingToast(messages.loading.bookmarkUpdate);

    let response: Response;
    try {
      response = await fetch(`/api/bookmarks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          url: editUrl,
          is_public: editIsPublic,
        }),
      });
    } catch {
      setSavingId(null);
      dismissToast(toastId);
      showErrorToast(messages.toast.networkError);
      return;
    }

    const body = (await response.json()) as {
      error?: string;
      bookmark?: Bookmark;
    };

    setSavingId(null);

    if (!response.ok || !body.bookmark) {
      dismissToast(toastId);
      showErrorToast(mapApiError(body.error, messages.bookmarks.updateFailed));
      return;
    }

    onUpdate(body.bookmark);
    setEditingId(null);
    showSuccessToast(messages.bookmarks.updated, { id: toastId });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const toastId = showLoadingToast(messages.loading.bookmarkDelete);

    let response: Response;
    try {
      response = await fetch(`/api/bookmarks/${id}`, {
        method: "DELETE",
      });
    } catch {
      setDeletingId(null);
      dismissToast(toastId);
      showErrorToast(messages.toast.networkError);
      return;
    }

    setDeletingId(null);

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      dismissToast(toastId);
      showErrorToast(mapApiError(body.error, messages.bookmarks.deleteFailed));
      return;
    }

    onDelete(id);
    showSuccessToast(messages.bookmarks.deleted, { id: toastId });
  };

  if (bookmarks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        {messages.bookmarks.empty}
      </p>
    );
  }

  return (
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
                disabled={savingId === bookmark.id}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
                aria-label="Edit title"
              />
              <input
                type="url"
                value={editUrl}
                disabled={savingId === bookmark.id}
                onChange={(e) => setEditUrl(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
                aria-label="Edit URL"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editIsPublic}
                  disabled={savingId === bookmark.id}
                  onChange={(e) => setEditIsPublic(e.target.checked)}
                  aria-label="Edit public visibility"
                />
                Public
              </label>
              <div className="flex gap-2">
                <LoadingButton
                  type="button"
                  onClick={() => handleSaveEdit(bookmark.id)}
                  isLoading={savingId === bookmark.id}
                  loadingLabel="Saving…"
                  aria-label="Save changes"
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Save
                </LoadingButton>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={savingId === bookmark.id}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-700"
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
                  disabled={deletingId === bookmark.id}
                  className="text-sm text-zinc-600 hover:underline disabled:opacity-50 dark:text-zinc-400"
                  aria-label={`Edit ${bookmark.title}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(bookmark.id)}
                  disabled={deletingId === bookmark.id}
                  className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                  aria-label={`Delete ${bookmark.title}`}
                  aria-busy={deletingId === bookmark.id}
                >
                  {deletingId === bookmark.id && <Spinner size="sm" />}
                  {deletingId === bookmark.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
