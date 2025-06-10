import { Link } from "react-router";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/auth";
import UserMenu from "../sidebar/user-menu";
import HeaderTitle from "./header-title";

const Header = () => {
  const isAuthenticated = useAuthStore((state) => !!state.user);

  return (
    <header>
      <div className="fixed z-10 w-[calc(100vw-72px)] h-18 px-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <HeaderTitle />

        {!isAuthenticated ? (
          <div className="space-x-3">
            <Button variant="secondary" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Create account</Link>
            </Button>
          </div>
        ) : (
          <UserMenu />
        )}
      </div>
    </header>
  );
};

export default Header;
