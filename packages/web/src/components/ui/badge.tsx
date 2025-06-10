import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const badgeVariants = cva(
  "inline-block h-6 rounded-md px-2 text-sm font-medium leading-6 whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default: "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200",
        mentee: "bg-blue-500 text-white hover:bg-blue-600",
        mentor: "bg-orange-500 text-white hover:bg-orange-600",
        // default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        // secondary:
        //   "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        // destructive:
        //   "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
