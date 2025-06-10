import { Link } from "react-router";
import { Button } from "../ui/button";
import { cn } from "@/libs/utils";

type Props = {
  border?: boolean;
};

const HeaderLogo = ({ border }: Props) => {
  return (
    <div>
      <div className={cn("fixed w-18 h-18 p-2 border-r border-neutral-200", border && "border-b")}>
        <Button variant="round" size="icon" asChild>
          <Link to="/">
            <span className="font-bold text-2xl text-orange-500 rotate-[36deg] select-none">M</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HeaderLogo;
