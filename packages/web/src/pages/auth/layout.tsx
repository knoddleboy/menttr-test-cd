import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      <div className="h-18">
        <div className="fixed w-full bg-neutral-100">
          <div className="w-18 h-18 p-2">
            <Link to="/" className="w-14 h-14 flex items-center justify-center active-effect">
              <span className="font-bold text-2xl text-orange-500 rotate-[36deg] select-none">
                M
              </span>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
