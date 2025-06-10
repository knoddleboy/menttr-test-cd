import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchProgramReviews = async (programId: number) => {
  const { data } = await axios.get(`/reviews/by-program/${programId}`);
  return data;
};

export const useProgramReviews = (programId: number) => {
  return useQuery({
    queryKey: ["program", programId, "reviews"],
    queryFn: () => fetchProgramReviews(programId),
  });
};
