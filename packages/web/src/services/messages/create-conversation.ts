import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

type CreateConversationInput = {
  userIds: number[];
};

const createConversation = async (dto: CreateConversationInput) => {
  const response = await axios.post("/conversations/create", dto);
  return response.data;
};

export const useCreateConversation = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createConversation,
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { createConversation: mutateAsync, isPending, error };
};
