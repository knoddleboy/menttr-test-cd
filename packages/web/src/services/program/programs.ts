import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchPrograms = async () => {
  const { data } = await axios.get("/feed/programs");
  return data;
};

export const usePrograms = () => {
  const {
    data: programs,
    isPending,
    error,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
    refetchOnMount: true,
  });

  return { programs, isPending, error };
};
