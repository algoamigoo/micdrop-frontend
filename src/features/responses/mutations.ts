import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createResponse } from "@/api/endpoints/responses";
import { responseKeys } from "./keys";
import { patchPromptInCache } from "@/features/votes/cache";
import type { Prompt, Response } from "@/types/domain";

export function useCreateResponse(postId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { user_id: string; body: string }) => createResponse(postId, input),
    onSuccess: (created: Response) => {
      // Bump response_count on every cached copy of the parent prompt
      patchPromptInCache(qc, created.post_id, (p: Prompt) => ({
        ...p,
        response_count: p.response_count + 1,
      }));
      // Refetch responses for this prompt (fresh list order)
      qc.invalidateQueries({ queryKey: responseKeys.lists() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to post response");
    },
  });
}