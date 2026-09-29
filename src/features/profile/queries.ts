import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserProfile, listUserPrompts, listUserResponses } from "@/api/endpoints/users";
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