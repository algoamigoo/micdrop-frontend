import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useVote, type VoteKind } from "@/features/votes/useVote";
import { cn } from "@/lib/cn";
import type { ViewerVote, VoteDirection } from "@/types/domain";

interface VoteControlProps {
  kind: VoteKind;
  id: number;
  score: number;
  viewerVote: ViewerVote;
  orientation?: "vertical" | "horizontal";
}

export function VoteControl({
  kind,
  id,
  score,
  viewerVote,
  orientation = "vertical",
}: VoteControlProps) {
  const { isAuthenticated, login } = useAuth();
  const vote = useVote({ kind, id, current: viewerVote ?? null });

  const handle = (direction: VoteDirection) => {
    if (!isAuthenticated) {
      toast.info("Sign in to vote", {
        action: { label: "Sign in", onClick: login },
      });
      return;
    }
    if (vote.isPending) return;
    vote.mutate(direction);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row",
      )}
    >
      <VoteButton
        direction="up"
        active={viewerVote === "upvote"}
        disabled={vote.isPending}
        onClick={() => handle("upvote")}
        title={!isAuthenticated ? "Sign in to vote" : undefined}
      />
      <span
        aria-label={`Score ${score}`}
        className={cn(
          "min-w-[2ch] text-center text-sm font-semibold tabular-nums",
          viewerVote === "upvote" && "text-upvote",
          viewerVote === "downvote" && "text-downvote",
        )}
      >
        {score}
      </span>
      <VoteButton
        direction="down"
        active={viewerVote === "downvote"}
        disabled={vote.isPending}
        onClick={() => handle("downvote")}
        title={!isAuthenticated ? "Sign in to vote" : undefined}
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
      aria-pressed={active}
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
