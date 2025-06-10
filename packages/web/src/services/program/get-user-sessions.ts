import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchUserSessions = async () => {
  const response = await axios.get("/sessions");
  return response.data;
};

export const useUserSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchUserSessions,
    // onSuccess: ({ message }) => {
    //   toast.success(message, { duration: 5000 });
    // },
    // onError: (err) => {
    //   if (isAxiosError(err)) {
    //     const data = err.response?.data as { message?: string };
    //     toast.error(data.message);
    //   }
    // },
  });
};
