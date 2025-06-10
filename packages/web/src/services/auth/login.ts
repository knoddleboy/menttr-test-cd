import axios from "@/libs/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { fetchUser } from "../user";
import { queryClient } from "@/libs/query-client";

const login = async (data: unknown) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      const user = await fetchUser();
      setUser(user);
      queryClient.setQueryData(["user"], user);
    },
  });

  return { login: mutateAsync, isPending, error };
};
