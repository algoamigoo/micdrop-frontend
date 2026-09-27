import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setCurrentUserId } from "@/api/client";
import { upsertUser } from "@/api/endpoints/users";
import { DEFAULT_USER_ID, SEED_USERS, STORAGE_KEYS } from "@/lib/constants";
import { IdentityContext } from "./context";

function readKnownUsers(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.knownUsers);
    if (!raw) return SEED_USERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) return parsed;
  } catch {
    /* ignore */
  }
  return SEED_USERS;
}

function readUserId(): string {
  return localStorage.getItem(STORAGE_KEYS.userId) ?? DEFAULT_USER_ID;
}

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string>(readUserId);
  const [knownUsers, setKnownUsers] = useState<string[]>(readKnownUsers);
  const ensuredRef = useRef<string | null>(null);

  useEffect(() => {
    setCurrentUserId(userId);
  }, [userId]);

  useEffect(() => {
    if (ensuredRef.current === userId) return;
    ensuredRef.current = userId;
    upsertUser(userId).catch(() => {
      /* silent — first real action will surface errors */
    });
  }, [userId]);

  const setUserId = useCallback((next: string) => {
    const trimmed = next.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEYS.userId, trimmed);
    setUserIdState(trimmed);
    setKnownUsers((prev) => {
      const merged = Array.from(new Set([...prev, trimmed]));
      localStorage.setItem(STORAGE_KEYS.knownUsers, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const value = useMemo(() => ({ userId, knownUsers, setUserId }), [userId, knownUsers, setUserId]);

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}