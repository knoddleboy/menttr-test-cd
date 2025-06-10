import axios from "@/libs/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { fetchUser } from "../user";

const signup = async (data: unknown) => {
  const response = await axios.post("/auth/signup", data);
  return response.data;
};

export const useSignup = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      const user = await fetchUser();
      setUser(user);
    },
  });

  return { signup: mutateAsync, isPending, error };
};
