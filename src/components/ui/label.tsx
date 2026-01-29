import { cn } from "@/lib/utils";

type LabelProps = React.ComponentProps<"label">;

export const Label = ({ className, ...props }: LabelProps) => {
  return <label className={cn("mb-2 block text-sm text-stone-400", className)} {...props} />;
};
