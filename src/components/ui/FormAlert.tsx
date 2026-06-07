import Link from "next/link";

type FormAlertProps = {
  variant: "error" | "success";
  title?: string;
  children: React.ReactNode;
  action?: {
    href: string;
    label: string;
  };
};

export const FormAlert = ({
  variant,
  title,
  children,
  action,
}: FormAlertProps) => {
  const isError = variant === "error";

  return (
    <div
      className={`rounded-lg border p-4 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          : "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
      }`}
      role={isError ? "alert" : "status"}
    >
      {title && <p className="font-semibold">{title}</p>}
      <p className={title ? "mt-1" : undefined}>{children}</p>
      {action && (
        <Link
          href={action.href}
          className={`mt-2 inline-block font-medium underline ${
            isError
              ? "text-red-800 dark:text-red-200"
              : "text-green-800 dark:text-green-200"
          }`}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
};
