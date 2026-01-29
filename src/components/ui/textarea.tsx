import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea">;

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5",
        "text-white placeholder:text-stone-500",
        "resize-none ring-1 ring-stone-800 outline-none",
        "focus:ring-emerald-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};
