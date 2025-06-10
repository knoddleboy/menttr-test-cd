import axios from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";

const logout = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};

export const useLogout = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const clearUser = () => {
    setUser(null);
    queryClient.setQueryData(["user"], null);
  };

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: clearUser,
    onError: clearUser,
  });

  return { logout: mutateAsync, isPending, error };
};
