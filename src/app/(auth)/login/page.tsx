import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Log in</h1>
        <p className="mb-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Welcome back to your bookmarks
        </p>
        <LoginForm />
      </div>
      <Link
        href="/"
        className="mt-8 text-sm text-zinc-500 hover:underline"
        aria-label="Back to home"
      >
        ← Back to home
      </Link>
    </main>
  );
}
