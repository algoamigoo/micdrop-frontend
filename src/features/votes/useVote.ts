import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { setPromptVote, setResponseVote } from "@/api/endpoints/votes";
import { promptKeys } from "@/features/prompts/keys";
import { responseKeys } from "@/features/responses/keys";
import { userKeys } from "@/features/profile/keys";
import { patchPromptInCache, patchResponseInCache } from "./cache";
import type { Prompt, Response, ViewerVote, VoteDirection, VoteValue } from "@/types/domain";

export type VoteKind = "prompt" | "response";

/** Pure toggle: clicking the current direction clears it, otherwise flips/sets. */
export function nextVote(current: ViewerVote, clicked: VoteDirection): VoteValue {
  if (current === clicked) return "none";
  return clicked;
}

function valueOf(v: ViewerVote | VoteValue | undefined): number {
  if (v === "upvote") return 1;
  if (v === "downvote") return -1;
  return 0;
}

interface UseVoteArgs {
  kind: VoteKind;
  id: number;
  current: ViewerVote;
}

interface Snapshot {
  previousPrompts: Array<[QueryKey, unknown]>;
  previousResponses: Array<[QueryKey, unknown]>;
  previousUsers: Array<[QueryKey, unknown]>;
}

/**
 * Single vote mutation for prompts and responses, usable from the feed,
 * prompt detail, and profile pages.
 * Optimistically patches counters + viewer_vote, rolls back from a snapshot on error.
 * The server is the source of truth on success.
 */
export function useVote({ kind, id, current }: UseVoteArgs) {
  const qc = useQueryClient();

  return useMutation<Prompt | Response, Error, VoteDirection, Snapshot>({
    mutationFn: (clicked: VoteDirection) => {
      const desired = nextVote(current, clicked);
      return kind === "prompt" ? setPromptVote(id, desired) : setResponseVote(id, desired);
    },

    onMutate: async (clicked) => {
      const desired = nextVote(current, clicked);
      const delta = valueOf(desired) - valueOf(current);

      await qc.cancelQueries({ queryKey: promptKeys.all });
      await qc.cancelQueries({ queryKey: responseKeys.all });

      // Snapshot for rollback (rather than inverse deltas).
      // userKeys included: profile pages render the same items.
      const previousPrompts = qc.getQueriesData({ queryKey: promptKeys.all });
      const previousResponses = qc.getQueriesData({ queryKey: responseKeys.all });
      const previousUsers = qc.getQueriesData({ queryKey: userKeys.all });

      const nextViewer: ViewerVote = desired === "none" ? null : desired;
      if (kind === "prompt") {
        patchPromptInCache(qc, id, (p) => ({
          ...p,
          prompt_upvotes: p.prompt_upvotes + delta,
          viewer_vote: nextViewer,
        }));
      } else {
        patchResponseInCache(qc, id, (r) => ({
          ...r,
          response_upvotes: r.response_upvotes + delta,
          viewer_vote: nextViewer,
        }));
      }

      return { previousPrompts, previousResponses, previousUsers };
    },

    onError: (err, _clicked, ctx) => {
      if (ctx) {
        for (const [key, data] of ctx.previousPrompts) qc.setQueryData(key, data);
        for (const [key, data] of ctx.previousResponses) qc.setQueryData(key, data);
        for (const [key, data] of ctx.previousUsers) qc.setQueryData(key, data);
      }
      toast.error(err instanceof Error ? err.message : "Vote failed");
    },

    onSuccess: (updated) => {
      if (kind === "prompt" && "response_count" in updated) {
        patchPromptInCache(qc, updated.post_id, () => updated);
      } else if (kind === "response" && "response_id" in updated) {
        patchResponseInCache(qc, updated.response_id, () => updated);
      }
    },

    onSettled: () => {
      if (kind === "prompt") {
        qc.invalidateQueries({ queryKey: promptKeys.detail(id) });
        qc.invalidateQueries({ queryKey: promptKeys.lists() });
      } else {
        qc.invalidateQueries({ queryKey: responseKeys.lists() });
      }
      // Profile lists show the same items, and the profile header shows the
      // author's karma — both change on a vote.
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
