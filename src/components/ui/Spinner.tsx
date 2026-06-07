type SpinnerProps = {
  className?: string;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
};

export const Spinner = ({ className = "", size = "sm" }: SpinnerProps) => (
  <span
    className={`inline-block animate-spin rounded-full border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100 ${sizeClasses[size]} ${className}`}
    role="status"
    aria-label="Loading"
  />
);
