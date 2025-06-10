import { useUser } from "@/services/user";
import { Navigate, Outlet } from "react-router";

type Props = {
  role?: "mentor" | "mentee" | "admin";
  fallbackPath?: string;
};

export const AuthGuard = ({ role, fallbackPath = "/" }: Props) => {
  const { user, isPending } = useUser();

  if (isPending) return null;

  if (fallbackPath === "/:username" && user) {
    fallbackPath = `/${user.username}`;
  }

  if (!user || (role && user.role !== role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};
