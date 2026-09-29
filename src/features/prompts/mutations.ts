import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPrompt } from "@/api/endpoints/prompts";
import { getUser } from "@/features/auth/auth";
import { promptKeys } from "./keys";
import { prependPromptToFeed, removePromptFromFeed, replacePromptInFeed } from "./cache";
import type { Prompt } from "@/types/domain";

export function useCreatePrompt() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { body: string }) => createPrompt(input),

    onMutate: async ({ body }) => {
      // Optimistic insert at the top of every "newest" feed.
      const user = getUser();
      if (!user) return { placeholderId: 0 };

      await qc.cancelQueries({ queryKey: promptKeys.all });

      const now = new Date().toISOString();
      const placeholderId = -Date.now();
      prependPromptToFeed(qc, {
        post_id: placeholderId,
        user_id: user.user_id,
        body,
        prompt_upvotes: 1,
        viewer_vote: "upvote",
        response_count: 0,
        created_at: now,
        updated_at: now,
      });

      return { placeholderId };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.placeholderId) removePromptFromFeed(qc, ctx.placeholderId);
      toast.error(err instanceof Error ? err.message : "Failed to create prompt");
    },

    onSuccess: (created: Prompt, _vars, ctx) => {
      if (ctx?.placeholderId) replacePromptInFeed(qc, ctx.placeholderId, created);
      qc.setQueryData(promptKeys.detail(created.post_id), created);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: promptKeys.lists() });
    },
  });
}