import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { votePrompt, voteResponse, type VoteType } from "@/api/endpoints/votes";
import { isConflict } from "@/api/errors";
import { promptKeys } from "@/features/prompts/keys";
import { responseKeys } from "@/features/responses/keys";
import { patchPromptInCache, patchResponseInCache } from "./cache";
import type { Prompt, Response } from "@/types/domain";

const delta = (v: VoteType) => (v === "upvote" ? 1 : -1);

export function useVotePrompt() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vote }: { id: number; vote: VoteType }) => votePrompt(id, vote),

    onMutate: async ({ id, vote }) => {
      await qc.cancelQueries({ queryKey: promptKeys.all });
      patchPromptInCache(qc, id, (p) => ({ ...p, prompt_upvotes: p.prompt_upvotes + delta(vote) }));
      return { id, vote };
    },

    onError: (err, vars) => {
      patchPromptInCache(qc, vars.id, (p) => ({
        ...p,
        prompt_upvotes: p.prompt_upvotes - delta(vars.vote),
      }));
      if (isConflict(err)) {
        toast.error("You've already voted on this prompt.");
      } else {
        toast.error(err instanceof Error ? err.message : "Vote failed");
      }
    },

    onSuccess: (updated: Prompt) => {
      // Server is source of truth
      patchPromptInCache(qc, updated.post_id, () => updated);
    },

    onSettled: (_d, _e, vars) => {
      qc.invalidateQueries({ queryKey: promptKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: promptKeys.lists() });
    },
  });
}

export function useVoteResponse() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vote }: { id: number; vote: VoteType }) => voteResponse(id, vote),

    onMutate: async ({ id, vote }) => {
      await qc.cancelQueries({ queryKey: responseKeys.all });
      patchResponseInCache(qc, id, (r) => ({
        ...r,
        response_upvotes: r.response_upvotes + delta(vote),
      }));
      return { id, vote };
    },

    onError: (err, vars) => {
      patchResponseInCache(qc, vars.id, (r) => ({
        ...r,
        response_upvotes: r.response_upvotes - delta(vars.vote),
      }));
      if (isConflict(err)) {
        toast.error("You've already voted on this response.");
      } else {
        toast.error(err instanceof Error ? err.message : "Vote failed");
      }
    },

    onSuccess: (updated: Response) => {
      patchResponseInCache(qc, updated.response_id, () => updated);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: responseKeys.lists() });
    },
  });
}
