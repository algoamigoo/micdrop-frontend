import { api } from "../client";
import { unwrap } from "../envelope";
import type { Prompt, Response, User } from "@/types/domain";

export function getMe() {
  return unwrap<User>(api.get("/auth/me"));
}

/** Public — kept for fallback/testing. */
export function getUser(userId: string) {
  return unwrap<User>(api.get(`/users/${encodeURIComponent(userId)}`));
}

export function listUserPrompts(userId: string, params: { limit?: number; offset?: number } = {}) {
  const { limit = 10, offset = 0 } = params;
  return unwrap<Prompt[]>(
    api.get(`/users/${encodeURIComponent(userId)}/prompts`, { params: { limit, offset } }),
  );
}

export function listUserResponses(
  userId: string,
  params: { limit?: number; offset?: number } = {},
) {
  const { limit = 10, offset = 0 } = params;
  return unwrap<Response[]>(
    api.get(`/users/${encodeURIComponent(userId)}/responses`, { params: { limit, offset } }),
  );
}
