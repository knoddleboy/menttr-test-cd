import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const scheduleSession = async (dto: unknown) => {
  const response = await axios.post("/sessions", dto);
  return response.data;
};

export const useScheduleSession = () => {
  return useMutation({
    mutationFn: ({ data }: { data: unknown }) => scheduleSession(data),
    onSuccess: ({ message }) => {
      toast.success(message, { duration: 5000 });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });
};
