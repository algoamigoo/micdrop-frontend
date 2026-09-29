import axios from "axios";
import { ApiError } from "./errors";
import { getToken } from "@/features/auth/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  // Don't clobber an explicitly provided Authorization header
  // (the onboarding token on /auth/complete-signup).
  if (!config.headers.get("Authorization")) {
    const token = getToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const url = error.config?.url ?? "";

      // Don't kill the session on the mid-callback /auth/me check
      if (status === 401 && !url.includes("/auth/me")) {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }

      const payload = error.response?.data as { error?: string } | undefined;
      const message =
        payload?.error ?? (status === 0 ? "Network error — check your connection." : error.message);
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(error);
  },
);