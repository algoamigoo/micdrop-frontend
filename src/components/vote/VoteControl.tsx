import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { isConflict } from "@/api/errors";
import { votePrompt, voteResponse, type VoteType } from "@/api/endpoints/votes";
import { useIdentity } from "@/features/identity/useIdentity";
import { useLocalVote, type VoteKind } from "@/features/votes/useLocalVote";
import { patchPromptInCache, patchResponseInCache } from "@/features/votes/cache";
import { promptKeys } from "@/features/prompts/keys";
import { responseKeys } from "@/features/responses/keys";
import { cn } from "@/lib/cn";
import type { Prompt, Response } from "@/types/domain";

const delta = (v: VoteType) => (v === "upvote" ? 1 : -1);

interface VoteControlProps {
  kind: VoteKind;
  id: number;
  score: number;
  authorId: string;
  orientation?: "vertical" | "horizontal";
}

export function VoteControl({
  kind,
  id,
  score,
  authorId,
  orientation = "vertical",
}: VoteControlProps) {
  const { userId } = useIdentity();
  const qc = useQueryClient();
  const [localVote, markVoted] = useLocalVote(userId, kind, id);

  const isSelf = userId === authorId;
  const locked = isSelf || localVote !== null;

  // ---- Prompt mutation ----
  const promptMutation = useMutation({
    mutationFn: (vote: VoteType) => votePrompt(id, vote),

    onMutate: async (vote) => {
      await qc.cancelQueries({ queryKey: promptKeys.all });
      patchPromptInCache(qc, id, (p: Prompt) => ({
        ...p,
        prompt_upvotes: p.prompt_upvotes + delta(vote),
      }));
    },

    onError: (err, vote) => {
      patchPromptInCache(qc, id, (p: Prompt) => ({
        ...p,
        prompt_upvotes: p.prompt_upvotes - delta(vote),
      }));
      if (isConflict(err)) {
        markVoted(vote);
        toast.error("You've already voted on this.");
      } else {
        toast.error(err instanceof Error ? err.message : "Vote failed");
      }
    },

    onSuccess: (updated, vote) => {
      markVoted(vote);
      patchPromptInCache(qc, id, () => updated);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: promptKeys.lists() });
      qc.invalidateQueries({ queryKey: promptKeys.detail(id) });
    },
  });

  // ---- Response mutation ----
  const responseMutation = useMutation({
    mutationFn: (vote: VoteType) => voteResponse(id, vote),

    onMutate: async (vote) => {
      await qc.cancelQueries({ queryKey: responseKeys.all });
      patchResponseInCache(qc, id, (r: Response) => ({
        ...r,
        response_upvotes: r.response_upvotes + delta(vote),
      }));
    },

    onError: (err, vote) => {
      patchResponseInCache(qc, id, (r: Response) => ({
        ...r,
        response_upvotes: r.response_upvotes - delta(vote),
      }));
      if (isConflict(err)) {
        markVoted(vote);
        toast.error("You've already voted on this.");
      } else {
        toast.error(err instanceof Error ? err.message : "Vote failed");
      }
    },

    onSuccess: (updated, vote) => {
      markVoted(vote);
      patchResponseInCache(qc, id, () => updated);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: responseKeys.lists() });
    },
  });

  // Pick whichever is relevant for this instance
  const pending = kind === "prompt" ? promptMutation.isPending : responseMutation.isPending;
  const pendingVote =
    kind === "prompt" ? promptMutation.variables : responseMutation.variables;

  const handle = (vote: VoteType) => {
    if (locked || pending) return;
    if (kind === "prompt") promptMutation.mutate(vote);
    else responseMutation.mutate(vote);
  };

  const disabledReason = isSelf
    ? "You can't vote on your own post"
    : localVote
      ? `You ${localVote}d this`
      : undefined;

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row",
      )}
    >
      <VoteButton
        direction="up"
        active={localVote === "upvote" || pendingVote === "upvote"}
        disabled={locked}
        onClick={() => handle("upvote")}
        title={disabledReason}
      />
      <span
        aria-label={`Score ${score}`}
        className={cn(
          "min-w-[2ch] text-center text-sm font-semibold tabular-nums",
          localVote === "upvote" && "text-upvote",
          localVote === "downvote" && "text-downvote",
        )}
      >
        {score}
      </span>
      <VoteButton
        direction="down"
        active={localVote === "downvote" || pendingVote === "downvote"}
        disabled={locked}
        onClick={() => handle("downvote")}
        title={disabledReason}
      />
    </div>
  );
}

function VoteButton({
  direction,
  active,
  disabled,
  onClick,
  title,
}: {
  direction: "up" | "down";
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  title?: string;
}) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      aria-label={direction === "up" ? "Upvote" : "Downvote"}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition-colors",
        "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
        active && direction === "up" && "text-upvote",
        active && direction === "down" && "text-downvote",
      )}
    >
      <Icon className="size-5" strokeWidth={2.5} />
    </button>
  );
}