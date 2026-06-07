import { toast } from "sonner";

type ToastOptions = {
  id?: string | number;
  description?: string;
  duration?: number;
};

export const showLoadingToast = (message: string) => toast.loading(message);

export const showSuccessToast = (
  message: string,
  options?: ToastOptions,
) =>
  toast.success(message, {
    id: options?.id,
    description: options?.description,
    duration: options?.duration ?? 4000,
  });

export const showErrorToast = (message: string, options?: ToastOptions) =>
  toast.error(message, {
    id: options?.id,
    description: options?.description,
    duration: options?.duration ?? 5000,
  });

export const dismissToast = (id: string | number) => toast.dismiss(id);
