import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        This profile does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium underline"
        aria-label="Go home"
      >
        Go home
      </Link>
    </main>
  );
}
