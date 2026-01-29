import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export const ErrorState = ({ message, action, className }: ErrorStateProps) => (
  <main className={cn("flex min-h-[50vh] flex-col items-center justify-center gap-4", className)}>
    <p className="text-red-400">{message}</p>
    {action}
  </main>
);
