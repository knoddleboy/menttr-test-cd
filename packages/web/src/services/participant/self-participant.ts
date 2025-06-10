import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchSelfParticipant = async (programId: number) => {
  const { data } = await axios.get(`/participants/self?program_id=${programId}`);
  return data;
};

export const useSelfParticipant = (programId: number) => {
  const {
    data: selfParticipant,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["program", programId, "participants", "existing"],
    queryFn: () => fetchSelfParticipant(programId),
  });

  return { selfParticipant, isPending, error, refetch };
};
