"use client";

import { useState } from "react";
import { BookmarkForm } from "@/components/bookmarks/BookmarkForm";
import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import type { Bookmark } from "@/types/database.types";

type DashboardClientProps = {
  initialBookmarks: Bookmark[];
};

export const DashboardClient = ({ initialBookmarks }: DashboardClientProps) => {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  const handleCreated = (bookmark: Bookmark) => {
    setBookmarks((prev) => [bookmark, ...prev]);
  };

  const handleUpdate = (bookmark: Bookmark) => {
    setBookmarks((prev) =>
      prev.map((item) => (item.id === bookmark.id ? bookmark : item)),
    );
  };

  const handleDelete = (id: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <BookmarkForm onCreated={handleCreated} />
      <BookmarkList
        bookmarks={bookmarks}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};
