import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PublicProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle, display_name, created_at, id")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const displayName = profile.display_name ?? `@${profile.handle}`;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-16">
      <header className="text-center">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="mt-1 text-sm text-zinc-500">@{profile.handle}</p>
      </header>

      {bookmarks && bookmarks.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-zinc-200 px-4 py-3 text-center font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                aria-label={`Open ${bookmark.title}`}
              >
                {bookmark.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-zinc-500">
          No public bookmarks yet.
        </p>
      )}

      <footer className="mt-auto text-center">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:underline"
          aria-label="Create your own bookmarks page"
        >
          Create your own →
        </Link>
      </footer>
    </main>
  );
}
