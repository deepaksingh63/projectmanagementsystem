import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const localAuth = localStorage.getItem("ethara-auth");
  const sessionAuth = sessionStorage.getItem("ethara-auth");
  const auth = localAuth || sessionAuth;

  if (auth) {
    const token = JSON.parse(auth).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPath = ["/login", "/register", "/forgot-password"].includes(window.location.pathname);
      if (!publicPath) {
        toast.error("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;