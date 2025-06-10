import { capitalize, cn } from "@/libs/utils";
import { FaUserGroup } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";

type Props = {
  type: string;
  withLabel?: boolean;
};

const ProgramType = ({ type, withLabel = true }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        type === "1-on-1" && "text-blue-500",
        type === "group" && "text-orange-500"
      )}
    >
      <div
        className={cn(
          "size-7 rounded-full flex justify-center items-center",
          type === "1-on-1" && "bg-blue-100",
          type === "group" && "bg-orange-100"
        )}
      >
        {type === "1-on-1" && <FaUserGroup className="size-4" />}
        {type === "group" && <MdGroupWork className="size-4.5" />}
      </div>
      {withLabel && (
        <span className="text-[15px] leading-5 whitespace-nowrap">{capitalize(type)}</span>
      )}
    </div>
  );
};

export default ProgramType;
