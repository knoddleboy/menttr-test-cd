import Header from "@/components/header";
import HeaderLogo from "@/components/header/header-logo";
import { Outlet } from "react-router";

const AdminPanelLayout = () => {
  return (
    <div className="grid h-screen grid-cols-[72px_1fr] grid-rows-[72px_1fr]">
      <HeaderLogo border />

      <Header />

      <main className="col-span-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanelLayout;
