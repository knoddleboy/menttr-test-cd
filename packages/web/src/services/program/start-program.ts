import axios from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const startProgram = async (programId: number) => {
  const response = await axios.patch(`/programs/${programId}`, { status: "ongoing" });
  return response.data;
};

export const useStartProgram = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (programId: number) => startProgram(programId),
    onSuccess: (data) => {
      queryClient.setQueryData(["program", data.id], data);
      toast.success("Program successfully started. Participants of the program will be notified.");
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        toast.error(data.message);
      }
    },
  });

  return { startProgram: mutateAsync, isPending, error };
};
