import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { VoteControl } from "@/components/vote/VoteControl";
import { absoluteTime, formatCount, timeAgo } from "@/lib/format";
import type { Prompt } from "@/types/domain";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <article className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex gap-3 sm:gap-4">
        <div className="pt-0.5">
          <VoteControl
            kind="prompt"
            id={prompt.post_id}
            score={prompt.prompt_upvotes}
            authorId={prompt.user_id}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar userId={prompt.user_id} size={18} />
            <span className="font-medium text-foreground">u/{prompt.user_id}</span>
            <span aria-hidden>·</span>
            <time dateTime={prompt.created_at} title={absoluteTime(prompt.created_at)}>
              {timeAgo(prompt.created_at)}
            </time>
          </div>

          <Link to={`/p/${prompt.post_id}`} className="block">
            <h3 className="text-base font-medium leading-snug text-foreground hover:text-primary sm:text-lg">
              {prompt.body}
            </h3>
          </Link>

          <div className="mt-3 flex items-center gap-2">
            <Badge>
              <MessageSquare className="size-3" />
              {formatCount(prompt.response_count)}{" "}
              {prompt.response_count === 1 ? "response" : "responses"}
            </Badge>
          </div>
        </div>
      </div>
    </article>
  );
}