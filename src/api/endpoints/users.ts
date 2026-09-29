import { api } from "../client";
import { unwrap } from "../envelope";
import type { Prompt, Response, UpdateProfileInput, User, UserProfileResponse } from "@/types/domain";

export function getMe() {
  return unwrap<User>(api.get("/auth/me"));
}

/** Public — full profile (user + stats) for a username. */
export function getUserProfile(userId: string) {
  return unwrap<UserProfileResponse>(api.get(`/users/${encodeURIComponent(userId)}`));
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

/** Update the signed-in user's display name / bio / links. */
export function updateMe(input: UpdateProfileInput) {
  return unwrap<User>(api.patch("/users/me", input));
}