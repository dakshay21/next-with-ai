import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DashboardClient } from "@/components/bookmarks/DashboardClient";
import { getCurrentUser, getProfileByUserId } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  const supabase = await createClient();
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Your bookmarks —{" "}
            <Link
              href={`/u/${profile.handle}`}
              className="font-medium underline"
              aria-label={`View public profile @${profile.handle}`}
            >
              @{profile.handle}
            </Link>
          </p>
        </div>
        <LogoutButton />
      </header>
      <DashboardClient initialBookmarks={bookmarks ?? []} />
    </main>
  );
}
