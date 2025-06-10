import Header from "@/components/header";
import HeaderLogo from "@/components/header/header-logo";
import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="grid h-screen grid-cols-[72px_1fr] grid-rows-[72px_1fr]">
      <HeaderLogo />

      <Header />

      <aside>
        <div className="fixed w-18 h-[calc(100dvh-72px)] flex flex-col border-r-[1px] border-neutral-200 bg-white/80 backdrop-blur-md z-1">
          <Sidebar />
        </div>
      </aside>

      <Outlet />
    </div>
  );
};

export default MainLayout;
