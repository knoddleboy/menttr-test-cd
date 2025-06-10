import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchFilteredPrograms = async (query: string) => {
  const response = await axios.get(`/search/programs?${query}`);
  return response.data;
};

export const useFilteredPrograms = (params, enabled?: boolean) => {
  const query = new URLSearchParams(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(params).filter(([_, value]) => !!value && value?.length)
  ).toString();

  const {
    data: filteredPrograms,
    isPending,
    error,
  } = useQuery({
    queryKey: ["programs", query],
    queryFn: () => fetchFilteredPrograms(query),
    enabled: enabled ?? true,
  });

  return { filteredPrograms, isPending, error };
};
