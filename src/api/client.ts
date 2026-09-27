import axios from "axios";
import { ApiError } from "./errors";
import { DEFAULT_USER_ID } from "@/lib/constants";

let currentUserId = DEFAULT_USER_ID;

export function setCurrentUserId(id: string) {
  currentUserId = id;
}

export function getCurrentUserId() {
  return currentUserId;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  config.headers.set("X-User-ID", currentUserId);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const payload = error.response?.data as { error?: string } | undefined;
      const message =
        payload?.error ??
        (status === 0 ? "Network error — check your connection." : error.message);
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(error);
  },
);