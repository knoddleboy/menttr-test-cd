import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchMentorApplications = async () => {
  const { data } = await axios.get("/admin/applications");
  return data;
};

export const useMentorApplications = () => {
  const {
    data: applications,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mentor_applications"],
    queryFn: fetchMentorApplications,
  });

  return { applications, isPending, error, refetch };
};
