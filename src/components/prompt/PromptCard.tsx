import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { OwnerActions } from "@/components/content/OwnerActions";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { VoteControl } from "@/components/vote/VoteControl";
import { absoluteTime, formatCount, timeAgo } from "@/lib/format";
import type { Prompt } from "@/types/domain";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <article className="group border-border bg-card hover:border-foreground/20 rounded-lg border p-4 transition-colors">
      <div className="flex gap-3 sm:gap-4">
        <div className="pt-0.5">
          <VoteControl
            kind="prompt"
            id={prompt.post_id}
            score={prompt.prompt_upvotes}
            viewerVote={prompt.viewer_vote ?? null}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
            <Avatar userId={prompt.user_id} size={18} />
            <Link
              to={`/u/${encodeURIComponent(prompt.user_id)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-foreground font-medium hover:underline"
            >
              u/{prompt.user_id}
            </Link>
            <span aria-hidden>·</span>
            <time dateTime={prompt.created_at} title={absoluteTime(prompt.created_at)}>
              {timeAgo(prompt.created_at)}
            </time>
          </div>

          <Link to={`/p/${prompt.post_id}`} className="block">
            <h3 className="text-foreground hover:text-primary text-base leading-snug font-medium sm:text-lg">
              {prompt.body}
            </h3>
          </Link>

          {prompt.edited && (
            <p className="text-muted-foreground mt-1 text-xs">(edited)</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <Badge>
              <MessageSquare className="size-3" />
              {formatCount(prompt.response_count)}{" "}
              {prompt.response_count === 1 ? "response" : "responses"}
            </Badge>
          </div>

          <OwnerActions
            kind="prompt"
            id={prompt.post_id}
            authorId={prompt.user_id}
            body={prompt.body}
          />
        </div>
      </div>
    </article>
  );
}
