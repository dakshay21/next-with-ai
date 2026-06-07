import { Spinner } from "@/components/ui/Spinner";

type LoadingButtonProps = {
  isLoading: boolean;
  loadingLabel: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

export const LoadingButton = ({
  isLoading,
  loadingLabel,
  children,
  className = "",
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: LoadingButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled ?? isLoading}
    aria-label={ariaLabel}
    aria-busy={isLoading}
    className={`inline-flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
  >
    {isLoading && <Spinner size="sm" />}
    {isLoading ? loadingLabel : children}
  </button>
);
