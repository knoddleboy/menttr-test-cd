import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchConversation = async (id: number) => {
  const response = await axios.get(`/conversations/${id}`);
  return response.data;
};

export const useConversation = (id: number | null) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => fetchConversation(id!),
    refetchOnMount: true,
    enabled: !!id,
  });
};
