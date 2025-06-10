import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  // "active-effect cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  "active-effect cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2",
  {
    variants: {
      variant: {
        primary: "active:bg-orange-600 bg-orange-500 text-white hover:bg-orange-600/90",
        secondary:
          "active:bg-neutral-300/90 bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200",
        round: "rounded-xl hover:bg-neutral-200",
        outline: "border border-neutral-200 bg-background hover:bg-neutral-200/80 text-neutral-700",
        destructive:
          "active:bg-red-600 bg-red-500 text-white hover:bg-red-600 focus-visible:ring-destructive/20",
        ghost: "hover:bg-neutral-200 text-neutral-700",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 leading-10 has-[>svg]:px-3",
        sm: "h-8 px-2.5 leading-8 has-[>svg]:px-3 text-sm",
        // sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        // lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-14",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
