import { capitalize, cn } from "@/libs/utils";

type Props = {
  role: "mentor" | "mentee";
  isSelected?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick: () => void;
};

const RoleToggle = ({ role, isSelected, disabled, children, onClick }: Props) => (
  <button
    role="radio"
    aria-checked={isSelected}
    type="button"
    className={cn(
      "flex-1 p-2 flex flex-col gap-2 items-center border border-input rounded-lg shadow-xs cursor-pointer active-effect",
      role === "mentee" && "bg-orange-200",
      role === "mentor" && "bg-blue-200",
      isSelected && "bg-neutral-200/30",
      disabled && "pointer-events-none opacity-85"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {/* <div
      className={cn(
        "size-10 rounded-full flex justify-center items-center",
        role === "mentee" && "bg-blue-100 text-blue-500",
        role === "mentor" && "bg-orange-100 text-orange-500"
      )}
    >
      {role === "mentee" && <FaUserGroup className="size-5.5" />}
      {role === "mentor" && <MdGroupWork className="size-6" />}
    </div> */}
    <div className="flex flex-col gap-1">
      <h3 className="text-white font-semibold text-[15px]">{capitalize(role)}</h3>
      <div className="text-white text-sm">{children}</div>
    </div>
  </button>
);

export default RoleToggle;
