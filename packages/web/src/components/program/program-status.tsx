import { capitalize, cn } from "@/libs/utils";

type Props = {
  status: string;
  className?: string;
};

const ProgramStatus = ({ status, className }: Props) => {
  return (
    <div className={cn("flex items-center gap-2 text-[15px]", className)}>
      <div
        className={cn(
          "w-[7px] h-[7px] mt-[1.5px] rounded-full",
          status === "enrollment" && "bg-green-500",
          status === "ongoing" && "bg-yellow-500",
          status === "completed" && "bg-orange-500"
        )}
      ></div>
      <span className="text-neutral-700 text-[1em] leading-5">{capitalize(status)}</span>
    </div>
  );
};

export default ProgramStatus;
