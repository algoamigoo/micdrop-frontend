import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createResponse } from "@/api/endpoints/responses";
import { patchPromptInCache } from "@/features/votes/cache";
import { responseKeys } from "./keys";
import type { Prompt, Response } from "@/types/domain";

export function useCreateResponse(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { body: string }) => createResponse(postId, input),
    onSuccess: (created: Response) => {
      patchPromptInCache(qc, created.post_id, (p: Prompt) => ({
        ...p,
        response_count: p.response_count + 1,
      }));
      qc.invalidateQueries({ queryKey: responseKeys.lists() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to post response");
    },
  });
}
