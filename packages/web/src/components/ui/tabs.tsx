import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/libs/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "h-10 inline-flex items-center justify-center border-b border-neutral-200",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "border-b-2 border-transparent data-[state=active]:border-neutral-700 data-[state=active]:text-neutral-700 text-neutral-500 hover:text-neutral-700 h-10 flex-1 inline-flex items-center justify-center leading-10 text-sm font-semibold whitespace-nowrap focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring cursor-pointer disabled:cursor-not-allowed disabled:hover:text-neutral-500 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

function TabsEmpty({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="my-10 space-y-1 text-center">
      <div className="text-[15px] text-neutral-700 font-semibold">{title}</div>
      {subtitle && <div className="text-sm text-neutral-500 max-w-[50ch] mx-auto">{subtitle}</div>}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsEmpty };
