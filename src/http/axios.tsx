import axios, { AxiosInstance } from "axios";
import toast from "react-hot-toast";

const baseServerUrl = localStorage.getItem("fluxServerURL");

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseServerUrl || "", // Default to an empty string
});

axiosInstance.interceptors.request.use(
  (config) => {
    const baseServerUrl = localStorage.getItem("fluxServerURL");
    if (!baseServerUrl) {
      toast.error("Server URL is not configured. Please set it and try again.");
      throw new Error("No server URL configured");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
