import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchProgram = async (programId: number) => {
  const { data } = await axios.get(`/programs/${programId}`);
  return data;
};

export const useProgram = (programId: number) => {
  const {
    data: program,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () => fetchProgram(programId),
    refetchOnMount: true,
  });

  return { program, isPending, error, refetch };
};
