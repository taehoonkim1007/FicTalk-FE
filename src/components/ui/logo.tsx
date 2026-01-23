import type { ComponentProps } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const logoVariants = cva(
  "group inline-block cursor-pointer select-none font-serif font-extrabold tracking-tight transition-colors hover:text-emerald-400",
  {
    variants: {
      size: {
        default: "text-2xl",
        sm: "text-lg",
        lg: "text-5xl",
      },
      color: {
        white: "text-white",
        emerald: "text-emerald-500",
      },
    },
    defaultVariants: {
      size: "default",
      color: "white",
    },
  },
);

export const Logo = ({
  className,
  size,
  color,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof logoVariants>) => {
  return (
    <div className={cn(logoVariants({ size, color }), className)} {...props}>
      <span>FicTalk</span>
    </div>
  );
};
