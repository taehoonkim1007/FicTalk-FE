import { cn } from "@/lib/utils";

type CardProps = React.ComponentProps<"div">;

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div className={cn("rounded-xl border border-stone-800 bg-stone-900", className)} {...props} />
  );
};

export const CardHeader = ({ className, ...props }: CardProps) => {
  return <div className={cn("p-4", className)} {...props} />;
};

export const CardContent = ({ className, ...props }: CardProps) => {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
};

export const CardFooter = ({ className, ...props }: CardProps) => {
  return <div className={cn("flex items-center p-4 pt-0", className)} {...props} />;
};
