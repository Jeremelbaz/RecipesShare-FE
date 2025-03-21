import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    //baseURL: 'https://10.10.248.100',
    baseURL: 'http://127.0.0.1:3000',
});

apiClient.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem("refreshToken");

      if (token && config.url !== "/auth/logout") {
          config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default apiClient;