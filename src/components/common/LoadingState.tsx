import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState = ({ message, className }: LoadingStateProps) => (
  <main className={cn("flex min-h-[50vh] items-center justify-center", className)}>
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      {message && <p className="text-sm text-stone-400">{message}</p>}
    </div>
  </main>
);
