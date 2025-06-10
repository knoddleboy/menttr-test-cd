import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const updateApplicationStatus = async ({ id, dto }: { id: number; dto: unknown }) => {
  const { data } = await axios.patch(`/admin/applications/${id}/status`, dto);
  return data;
};

export const useUpdateMentorApplicationStatus = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return { updateMentorApplicationStatus: mutateAsync, isPending, error };
};
