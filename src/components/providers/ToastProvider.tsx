"use client";

import { Toaster } from "sonner";

export const ToastProvider = () => (
  <Toaster
    position="top-center"
    richColors
    closeButton
    toastOptions={{
      classNames: {
        toast:
          "rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100",
        title: "font-medium",
        description: "text-sm text-zinc-600 dark:text-zinc-400",
      },
    }}
  />
);
