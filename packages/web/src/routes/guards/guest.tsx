import { useAuthStore } from "@/stores/auth";
import { Navigate, Outlet } from "react-router";

const GuestGuard = () => {
  const isAuthenticated = useAuthStore((state) => !!state.user);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
