import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "dashed";
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex h-48 flex-col items-center justify-center gap-4",
      variant === "dashed" && "rounded-xl border border-dashed border-stone-700 bg-stone-900/50",
      className,
    )}
  >
    {icon}
    <div className="text-center">
      <p className="text-stone-500">{title}</p>
      {description && <p className="mt-1 text-sm text-stone-600">{description}</p>}
    </div>
    {action}
  </div>
);
