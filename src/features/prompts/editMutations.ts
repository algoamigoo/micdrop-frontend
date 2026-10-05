import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePrompt, updatePrompt } from "@/api/endpoints/prompts";
import { userKeys } from "@/features/profile/keys";
import { promptKeys } from "./keys";

export function useUpdatePrompt() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, body }: { postId: number; body: string }) =>
      updatePrompt(postId, { body }),

    onSuccess: (updated) => {
      qc.setQueryData(promptKeys.detail(updated.post_id), updated);
      qc.invalidateQueries({ queryKey: promptKeys.lists() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update prompt");
    },
  });
}

export function useDeletePrompt() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePrompt(postId),

    onSuccess: (_data, postId) => {
      qc.removeQueries({ queryKey: promptKeys.detail(postId) });
      // Lists and the author's own profile both need the row gone.
      qc.invalidateQueries({ queryKey: promptKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete prompt");
    },
  });
}
