import { refresh } from "@/services/auth/refresh";
import _axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const axios = _axios.create({ baseURL: "/api", withCredentials: true });

createAuthRefreshInterceptor(axios, refresh, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

export default axios;
