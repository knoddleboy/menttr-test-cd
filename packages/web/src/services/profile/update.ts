import { isAxiosError } from "axios";
import axios from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const updateProfile = async (dto: unknown) => {
  const { data } = await axios.patch("/users/profile", dto);
  return data;
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["user"], data);
      toast.success("Changes successfully saved.");
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { updateProfile: mutateAsync, isPending, error };
};
