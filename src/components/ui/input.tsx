import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input">;

export const Input = ({ className, type = "text", ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5",
        "text-white placeholder:text-stone-500",
        "ring-1 ring-stone-800 outline-none",
        "focus:ring-emerald-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};
