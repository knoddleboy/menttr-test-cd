import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const updateUserPendingConversation = async (dto: { id: number; status: string }) => {
  const response = await axios.patch(`/conversations/${dto.id}/pending`, dto);
  return response.data;
};

export const useUpdateUserPendingConversation = () => {
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: updateUserPendingConversation,
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { updateUserPendingConversation: mutateAsync, ...rest };
};
