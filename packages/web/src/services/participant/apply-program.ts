import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const applyProgram = async (programId: number, dto: unknown) => {
  const { data } = await axios.post(`/programs/${programId}/apply`, dto);
  return data;
};

export const useApplyProgram = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ programId, data }: { programId: number; data: unknown }) =>
      applyProgram(programId, data),
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

  return { applyProgram: mutateAsync, isPending, error };
};
