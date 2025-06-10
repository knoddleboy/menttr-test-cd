import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const updateParticipantStatus = async (id: number, dto: unknown) => {
  const { data } = await axios.patch(`/participants/${id}/status`, dto);
  return data;
};

export const useUpdateParticipantStatus = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: unknown }) => updateParticipantStatus(id, dto),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return { updateParticipantStatus: mutateAsync, isPending, error };
};
