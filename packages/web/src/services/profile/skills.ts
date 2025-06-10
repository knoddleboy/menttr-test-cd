import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const fetchSkills = async () => {
  const { data } = await axios.get("/users/skills");
  return data;
};

export const useSkills = () => {
  const {
    data: skills,
    isPending,
    error,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  return { skills, isPending, error };
};
