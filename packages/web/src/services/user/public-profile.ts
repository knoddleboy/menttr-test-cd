import axios from "@/libs/axios";
import type { UserDto } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";

type Options = {
  enabled: boolean;
};

const fetchUserProfile = async (username: string) => {
  const { data } = await axios.get<UserDto>(`/users/profile/${username}`);
  return data;
};

export const usePublicProfile = (username: string, options?: Options) => {
  const {
    data: publicUser,
    isPending,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user_profile", username],
    queryFn: () => fetchUserProfile(username),
    enabled: options?.enabled ?? true,
  });

  return { publicUser, isPending, isLoading, error };
};
