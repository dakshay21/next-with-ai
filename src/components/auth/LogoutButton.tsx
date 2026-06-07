"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { createClient } from "@/lib/supabase/client";
import { messages } from "@/lib/messages";
import {
  dismissToast,
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";

export const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const toastId = showLoadingToast(messages.loading.logout);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        dismissToast(toastId);
        showErrorToast("We couldn't sign you out. Please try again.");
        setIsLoading(false);
        return;
      }

      showSuccessToast(messages.toast.logoutSuccess, { id: toastId });
      router.push("/");
      router.refresh();
    } catch {
      dismissToast(toastId);
      showErrorToast(messages.toast.networkError);
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      type="button"
      onClick={handleLogout}
      isLoading={isLoading}
      loadingLabel="Signing out…"
      aria-label="Log out"
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      Log out
    </LoadingButton>
  );
};
