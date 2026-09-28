import { STORAGE_KEYS } from "@/lib/constants";
import type { User } from "@/types/domain";

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedToken: string | null | undefined;
let cachedUser: User | null | undefined;

function emit() {
  cachedToken = undefined;
  cachedUser = undefined;
  for (const l of listeners) l();
}

export function getToken(): string | null {
  if (cachedToken !== undefined) return cachedToken;
  cachedToken = localStorage.getItem(STORAGE_KEYS.token);
  return cachedToken;
}

export function getUser(): User | null {
  if (cachedUser !== undefined) return cachedUser;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    cachedUser = raw ? (JSON.parse(raw) as User) : null;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

/** Set only the token. Used mid-OAuth-callback before /auth/me resolves. */
export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.token, token);
  emit();
}

/** Set token + user together (the normal "logged in" state). */
export function setAuth(token: string, user: User): void {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  emit();
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  emit();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEYS.token || e.key === STORAGE_KEYS.user) emit();
  });
  // Axios interceptor dispatches this on 401
  window.addEventListener("auth:unauthorized", () => clearAuth());
}
