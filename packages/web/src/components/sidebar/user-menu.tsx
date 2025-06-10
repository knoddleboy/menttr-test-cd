import { useAuthStore } from "@/stores/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { useLogout } from "@/services/auth";
import UserAvatar from "../user-avatar";

const UserMenu = () => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer hover:opacity-85 rounded-full outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2">
          <UserAvatar name={user.name} avatar={user.profileImageUrl} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 mr-2" side="bottom" align="center">
        <DropdownMenuItem asChild>
          <Link to={`/${user.username}`} className="flex gap-3">
            <UserAvatar name={user.name} avatar={user.profileImageUrl} />
            <div className="flex-1">
              <div className="text-neutral-700 font-semibold">{user.name}</div>
              <div className="text-neutral-500">@{user.username}</div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="!text-neutral-500 font-medium">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
