import { cn } from "@/libs/utils";
import { LuLoaderCircle } from "react-icons/lu";

type Props = {
  className?: string;
};

function Spinner({ className }: Props) {
  return (
    <span>
      <LuLoaderCircle className={cn("size-8 text-neutral-500 animate-spin", className)} />
    </span>
  );
}

export { Spinner };
