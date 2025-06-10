import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchPendingConversations = async () => {
  const response = await axios.get("/conversations/pending");
  return response.data;
};

export const usePendingConversations = () => {
  return useQuery({
    queryKey: ["conversations", "pending"],
    queryFn: fetchPendingConversations,
    refetchOnMount: true,
  });
};
