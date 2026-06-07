"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      aria-label="Log out"
    >
      Log out
    </button>
  );
};
