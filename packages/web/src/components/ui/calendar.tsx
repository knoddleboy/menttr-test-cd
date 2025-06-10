import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/libs/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "w-full flex flex-col gap-4",
        caption: "flex justify-center pt-0 relative items-center w-full",
        caption_label: "text-sm font-medium text-neutral-700",
        nav: "flex items-center gap-1",
        nav_button: cn(buttonVariants({ variant: "ghost" }), "size-7 p-0"),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex justify-between",
        head_cell: "text-neutral-500 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex justify-between w-full mt-0.5",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-neutral-700 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-neutral-700 aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-neutral-700 aria-selected:text-primary-foreground",
        day_selected:
          "bg-neutral-700 text-primary-foreground hover:bg-neutral-700 hover:text-primary-foreground focus:bg-neutral-700 focus:text-primary-foreground",
        day_today: "bg-neutral-200/50 text-accent-foreground",
        day_outside: "day-outside !text-neutral-400 aria-selected:text-white",
        day_disabled: "text-neutral-200 opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
