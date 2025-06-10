import _axios from "axios";
import axios from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";

const convertMentor = async (dto: unknown) => {
  const { data } = await axios.post("/users/profile/convert-mentor", dto);
  return data;
};

export const useConvertMentor = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: convertMentor,
    onSuccess: (data) => {
      updateUser({ mentorApplications: [data.application] });
      toast.dismiss();
      toast.success(data.message);
    },
    onError: (err) => {
      if (_axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        const message = data.message;
        toast.info(message);
      } else {
        toast.error("Something went wrong.");
      }
    },
  });

  return { convertMentor: mutateAsync, isPending, error };
};
