import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  listFollowers,
  listFollowing,
  listUserPrompts,
  listUserResponses,
} from "@/api/endpoints/users";
import { userKeys } from "./keys";

export function useUserProfile(username: string | undefined) {
  return useQuery({
    queryKey: userKeys.profile(username ?? ""),
    queryFn: () => getUserProfile(username!),
    enabled: typeof username === "string" && username.length > 0,
    staleTime: 30_000,
  });
}

export function useUserPrompts(username: string | undefined, limit: number) {
  return useQuery({
    queryKey: userKeys.prompts(username ?? "", limit),
    queryFn: () => listUserPrompts(username!, { limit, offset: 0 }),
    enabled: typeof username === "string" && username.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useUserResponses(username: string | undefined, limit: number) {
  return useQuery({
    queryKey: userKeys.responses(username ?? "", limit),
    queryFn: () => listUserResponses(username!, { limit, offset: 0 }),
    enabled: typeof username === "string" && username.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
/** Followers or following for a profile — one hook so the page has no conditional hooks. */
export function useFollowList(
  username: string | undefined,
  kind: "followers" | "following",
  limit: number,
) {
  return useQuery({
    queryKey:
      kind === "followers"
        ? userKeys.followers(username ?? "", limit)
        : userKeys.following(username ?? "", limit),
    queryFn: () =>
      kind === "followers"
        ? listFollowers(username!, { limit, offset: 0 })
        : listFollowing(username!, { limit, offset: 0 }),
    enabled: typeof username === "string" && username.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
