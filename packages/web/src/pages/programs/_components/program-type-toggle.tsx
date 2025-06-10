import { capitalize, cn } from "@/libs/utils";
import { FaUserGroup } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";

type Props = {
  type: string;
  isSelected?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick: () => void;
};

const ProgramTypeToggle = ({ type, isSelected, disabled, children, onClick }: Props) => (
  <button
    role="radio"
    aria-checked={isSelected}
    type="button"
    className={cn(
      "flex-1 py-4 px-3 flex flex-col gap-2 items-center border border-input hover:bg-neutral-200/30 rounded-lg shadow-xs cursor-pointer active-effect",
      isSelected && "bg-neutral-200/30",
      disabled && "pointer-events-none opacity-85"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    <div
      className={cn(
        "size-10 rounded-full flex justify-center items-center",
        type === "1-on-1" && "bg-blue-100 text-blue-500",
        type === "group" && "bg-orange-100 text-orange-500"
      )}
    >
      {type === "1-on-1" && <FaUserGroup className="size-5.5" />}
      {type === "group" && <MdGroupWork className="size-6" />}
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-neutral-700 font-semibold text-[15px]">{capitalize(type)}</h3>
      <div className="text-neutral-500 text-sm">{children}</div>
    </div>
  </button>
);

export default ProgramTypeToggle;
