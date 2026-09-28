import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPrompt, listPrompts, type ListPromptsParams } from "@/api/endpoints/prompts";
import { promptKeys } from "./keys";

export function usePrompts(params: Required<ListPromptsParams>) {
  return useQuery({
    queryKey: promptKeys.list(params),
    queryFn: () => listPrompts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function usePrompt(postId: number | undefined) {
  return useQuery({
    queryKey: promptKeys.detail(postId ?? 0),
    queryFn: () => getPrompt(postId!),
    enabled: typeof postId === "number" && Number.isFinite(postId),
    staleTime: 60_000,
  });
}
