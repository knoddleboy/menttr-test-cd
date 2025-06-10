import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const fetchUserReviews = async (userId: number) => {
  const { data } = await axios.get(`/reviews/by-user/${userId}`);
  return data;
};

export const useUserReviews = (userId: number) => {
  return useQuery({
    queryKey: ["user", userId, "reviews"],
    queryFn: () => fetchUserReviews(userId),
  });
};
