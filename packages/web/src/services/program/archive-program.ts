import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const archiveProgram = async (id: number) => {
  const { data } = await axios.post(`/programs/${id}/archive`);
  return data;
};

export const useArchiveProgram = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: archiveProgram,
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const { message } = err.response?.data as { message?: string };
        toast.error(message, { duration: 5000 });
      }
    },
  });

  return { archiveProgram: mutateAsync, isPending, error };
};
