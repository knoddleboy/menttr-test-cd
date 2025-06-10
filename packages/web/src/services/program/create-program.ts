import axios from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const createProgram = async (dto: unknown) => {
  const { data } = await axios.post("/programs", dto);
  return data;
};

export const useCreateProgram = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createProgram,
    onSuccess: (data) => {
      queryClient.setQueryData(["program", data.id], data);
      toast.success(`Program ${data.title} successfully created.`);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { createProgram: mutateAsync, isPending, error };
};
