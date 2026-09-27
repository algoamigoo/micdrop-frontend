import { api } from "../client";
import { unwrap } from "../envelope";
import type { User } from "@/types/domain";

export function upsertUser(userId: string, userName?: string) {
  return unwrap<User>(api.post("/users", { user_id: userId, user_name: userName ?? userId }));
}

export function getUser(userId: string) {
  return unwrap<User>(api.get(`/users/${encodeURIComponent(userId)}`));
}