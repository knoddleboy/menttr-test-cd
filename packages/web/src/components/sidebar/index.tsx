import { IconContext } from "react-icons";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUser } from "react-icons/hi";
import {
  HiChatBubbleLeftRight,
  HiEnvelope,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import SidebarNavLink from "./sidebar-nav-link";
import { useAuthStore } from "@/stores/auth";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <nav role="navigation" className="p-2 flex-1 flex flex-col items-center justify-center gap-2">
      <IconContext.Provider value={{ className: "w-8 h-8 text-neutral-600" }}>
        <SidebarNavLink to="/" tooltipText="Programs">
          {({ isActive }) => (isActive ? <GoHomeFill className="text-neutral-700" /> : <GoHome />)}
        </SidebarNavLink>

        {isAuthenticated && (
          <SidebarNavLink to="/messages" tooltipText="Messages">
            {({ isActive }) =>
              isActive ? (
                <HiEnvelope className="!w-7 text-neutral-700" />
              ) : (
                <HiOutlineEnvelope className="!w-7" />
              )
            }
          </SidebarNavLink>
        )}

        <SidebarNavLink to="/discussions" tooltipText="Discussions">
          {({ isActive }) =>
            isActive ? (
              <HiChatBubbleLeftRight className="!w-7 text-neutral-700" />
            ) : (
              <HiOutlineChatBubbleLeftRight className="!w-7" />
            )
          }
        </SidebarNavLink>

        {isAuthenticated && (
          <SidebarNavLink to={`/${user.username}`} tooltipText="Profile">
            {({ isActive }) =>
              isActive ? (
                <HiOutlineUser className="fill-neutral-700 stroke-[1.5] stroke-neutral-700" />
              ) : (
                <HiOutlineUser className="stroke-[1.5]" />
              )
            }
          </SidebarNavLink>
        )}
      </IconContext.Provider>
    </nav>
  );
};

export default Sidebar;
