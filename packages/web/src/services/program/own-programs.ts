import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

type ProgramsDto = {
  active: {
    items: any;
    count: number;
  };
  archived: {
    items: any;
    count: number;
  };
};

const fetchOwnPrograms = async (userId: number) => {
  const { data } = await axios.get<ProgramsDto>(`/programs?user_id=${userId}`);
  return data;
};

export const useOwnPrograms = (userId: number) => {
  const {
    data: programs,
    isPending,
    error,
  } = useQuery({
    queryKey: ["programs", "own", userId],
    queryFn: () => fetchOwnPrograms(userId),
    refetchOnMount: true,
  });

  return { programs, isPending, error };
};
