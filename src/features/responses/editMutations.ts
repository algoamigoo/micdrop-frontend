import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteResponse, updateResponse } from "@/api/endpoints/responses";
import { patchPromptInCache, patchResponseInCache } from "@/features/votes/cache";
import { userKeys } from "@/features/profile/keys";
import { responseKeys } from "./keys";
import type { Prompt } from "@/types/domain";

export function useUpdateResponse() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId, body }: { responseId: number; body: string }) =>
      updateResponse(responseId, { body }),

    onSuccess: (updated) => {
      patchResponseInCache(qc, updated.response_id, (r) => ({ ...r, body: updated.body }));
      qc.invalidateQueries({ queryKey: responseKeys.lists() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update response");
    },
  });
}

export function useDeleteResponse() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId, postId }: { responseId: number; postId: number }) =>
      deleteResponse(responseId).then(() => postId),

    onSuccess: (postId) => {
      // The prompt's denormalized response_count drops server-side too.
      patchPromptInCache(qc, postId, (p: Prompt) => ({
        ...p,
        response_count: Math.max(p.response_count - 1, 0),
      }));
      qc.invalidateQueries({ queryKey: responseKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete response");
    },
  });
}
