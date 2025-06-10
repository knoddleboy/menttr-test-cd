import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavLink, type NavLinkProps } from "react-router";
import { Button } from "../ui/button";

interface Props extends NavLinkProps {
  tooltipText: string;
}

const SidebarNavLink = ({ tooltipText, children, ...props }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="round" size="icon" asChild>
            <NavLink {...props}>{children}</NavLink>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-neutral-700 px-2 data-[side=right]:!slide-in-from-left-0"
        >
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarNavLink;
