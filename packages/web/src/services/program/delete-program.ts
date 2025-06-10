import axios from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const deleteProgram = async (id: number) => {
  const { data } = await axios.delete(`/programs/${id}`);
  return data;
};

export const useDeleteProgram = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: deleteProgram,
    onSuccess: ({ data, message }) => {
      queryClient.invalidateQueries({ queryKey: ["program", data.id] });
      toast.success(message);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const { message } = err.response?.data as { message?: string };
        toast.error(message, { duration: 5000 });
      }
    },
  });

  return { deleteProgram: mutateAsync, isPending, error };
};
