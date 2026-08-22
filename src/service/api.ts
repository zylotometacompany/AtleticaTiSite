import axios from "axios";

const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const compradorToken = localStorage.getItem(COMPRADOR_TOKEN_KEY);

    if (compradorToken) {
      config.headers.Authorization = `Bearer ${compradorToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);
