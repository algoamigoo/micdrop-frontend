import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listResponses } from "@/api/endpoints/responses";
import { responseKeys } from "./keys";

export function useResponses(postId: number | undefined, params: { limit: number; offset: number }) {
  return useQuery({
    queryKey: responseKeys.list(postId ?? 0, params),
    queryFn: () => listResponses(postId!, params),
    enabled: typeof postId === "number" && Number.isFinite(postId),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}