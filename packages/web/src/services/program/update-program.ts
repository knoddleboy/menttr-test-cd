import axios from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const updateProgram = async (programId: number, dto: unknown) => {
  const response = await axios.patch(`/programs/${programId}`, dto);
  return response.data;
};

export const useUpdateProgram = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ programId, data }: { programId: number; data: any }) =>
      updateProgram(programId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["program", data.id], data);
      toast.success(`Changes successfully saved.`);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { updateProgram: mutateAsync, isPending, error };
};
