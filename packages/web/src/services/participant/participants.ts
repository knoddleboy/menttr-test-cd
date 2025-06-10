import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

type ParticipantsDto = {
  active?: any[];
  activeCount: number;
  pending?: any[];
  pendingCount?: number;
};

const fetchProgramParticipants = async (programId: number) => {
  const { data } = await axios.get<ParticipantsDto>(`/participants?program_id=${programId}`);
  return data;
};

export const useProgramParticipants = (programId: number) => {
  const {
    data: participants,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["program", programId, "participants"],
    queryFn: () => fetchProgramParticipants(programId),
    refetchOnMount: true,
  });

  return { participants, isPending, error, refetch };
};
