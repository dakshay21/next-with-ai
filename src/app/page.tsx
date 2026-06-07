import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Bookmarks</h1>
      <p className="mt-3 max-w-sm text-zinc-600 dark:text-zinc-400">
        A minimal bookmarks manager. Save links privately or share your public
        profile with the world.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/signup"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label="Sign up"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          aria-label="Log in"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
