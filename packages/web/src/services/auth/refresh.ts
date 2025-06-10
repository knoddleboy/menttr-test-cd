import axios from "@/libs/axios";

export const refresh = async () => {
  await axios.post("/auth/refresh");
};
