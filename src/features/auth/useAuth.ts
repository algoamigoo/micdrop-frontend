import { useSyncExternalStore } from "react";
import { clearAuth, getToken, getUser, subscribe } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  const user = useSyncExternalStore(subscribe, getUser, () => null);

  return {
    user,
    isAuthenticated: !!token && !!user,
    login: () => {
      window.location.href = `${API_BASE}/auth/google/login`;
    },
    logout: clearAuth,
  };
}
