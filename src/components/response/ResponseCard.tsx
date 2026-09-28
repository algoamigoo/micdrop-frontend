import { Avatar } from "@/components/ui/Avatar";
import { VoteControl } from "@/components/vote/VoteControl";
import { absoluteTime, timeAgo } from "@/lib/format";
import type { Response } from "@/types/domain";

export function ResponseCard({ response }: { response: Response }) {
  return (
    <article className="border-border bg-card rounded-lg border p-4">
      <div className="flex gap-3 sm:gap-4">
        <div className="pt-0.5">
          <VoteControl
            kind="response"
            id={response.response_id}
            score={response.response_upvotes}
            authorId={response.user_id}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
            <Avatar userId={response.user_id} size={18} />
            <span className="text-foreground font-medium">u/{response.user_id}</span>
            <span aria-hidden>·</span>
            <time dateTime={response.created_at} title={absoluteTime(response.created_at)}>
              {timeAgo(response.created_at)}
            </time>
          </div>
          <p className="text-foreground text-[15px] leading-snug">{response.body}</p>
        </div>
      </div>
    </article>
  );
}
