import axios from "@/libs/axios";
import { useAuthStore, type UserDto } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const fetchUser = async () => {
  const response = await axios.get<UserDto>("/users/profile/self");
  return response.data;
};

export const useUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (!isPending && user) {
      setUser(user);
    }
  }, [user, isPending, setUser]);

  return { user, isPending, error };
};
