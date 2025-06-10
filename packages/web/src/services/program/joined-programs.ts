import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

type ProgramsDto = {
  active: {
    items: any;
    count: number;
  };
  pending: {
    items: any;
    count: number;
  };
  archived: {
    items: any;
    count: number;
  };
};

const fetchJoinedPrograms = async (userId: number) => {
  const { data } = await axios.get<ProgramsDto>(`/programs/joined?user_id=${userId}`);
  return data;
};

export const useJoinedPrograms = (userId: number) => {
  const {
    data: programs,
    isPending,
    error,
  } = useQuery({
    queryKey: ["programs", "joined", userId],
    queryFn: () => fetchJoinedPrograms(userId),
    refetchOnMount: true,
  });

  return { programs, isPending, error };
};
