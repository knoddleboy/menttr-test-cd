import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const createReview = async (programId: number, dto: unknown) => {
  const response = await axios.post(`/programs/${programId}/reviews`, dto);
  return response.data;
};

export const useCreateReview = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ programId, dto }: { programId: number; dto: unknown }) =>
      createReview(programId, dto),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { createReview: mutateAsync, isPending, error };
};
