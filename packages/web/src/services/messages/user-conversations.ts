import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchUserConversations = async () => {
  const response = await axios.get("/conversations");
  return response.data;
};

export const useUserConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchUserConversations,
    refetchOnMount: true,
  });
};
