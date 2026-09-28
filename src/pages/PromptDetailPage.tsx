import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadMoreButton } from "@/components/feedback/LoadMoreButton";
import { VoteControl } from "@/components/vote/VoteControl";
import { ResponseCard } from "@/components/response/ResponseCard";
import { ResponseForm } from "@/components/response/ResponseForm";
import { ResponseSkeleton } from "@/components/response/ResponseSkeleton";
import { usePrompt } from "@/features/prompts/queries";
import { useResponses } from "@/features/responses/queries";
import { useCreateResponse } from "@/features/responses/mutations";
import { PAGE_SIZE } from "@/lib/constants";
import { absoluteTime, formatCount, timeAgo } from "@/lib/format";
import { isNotFound } from "@/api/errors";

export default function PromptDetailPage() {
  const { postId: postIdParam } = useParams<{ postId: string }>();
  const postId = postIdParam ? Number(postIdParam) : NaN;

  const [limit, setLimit] = useState<number>(PAGE_SIZE.responses);

  const promptQuery = usePrompt(Number.isFinite(postId) ? postId : undefined);
  const responsesQuery = useResponses(Number.isFinite(postId) ? postId : undefined, {
    limit,
    offset: 0,
  });
  const createResponse = useCreateResponse(postId);

  const responses = responsesQuery.data ?? [];
  const hasMore = responses.length === limit;

  // Invalid route param
  if (!Number.isFinite(postId)) {
    return (
      <Container size="md">
        <ErrorState title="Invalid prompt ID" error={new Error("The URL is malformed.")} />
      </Container>
    );
  }

  // Loading prompt
  if (promptQuery.isPending) {
    return (
      <Container size="md">
        <BackLink />
        <div className="border-border bg-card mt-4 rounded-lg border p-5">
          <div className="bg-muted h-5 w-40 animate-pulse rounded" />
          <div className="bg-muted mt-4 h-6 w-3/4 animate-pulse rounded" />
          <div className="bg-muted mt-2 h-6 w-1/2 animate-pulse rounded" />
        </div>
      </Container>
    );
  }

  // Prompt not found / error
  if (promptQuery.isError) {
    const notFound = isNotFound(promptQuery.error);
    return (
      <Container size="md">
        <BackLink />
        <div className="mt-4">
          <ErrorState
            title={notFound ? "Prompt not found" : "Couldn't load prompt"}
            error={promptQuery.error}
            onRetry={notFound ? undefined : () => promptQuery.refetch()}
          />
        </div>
      </Container>
    );
  }

  const prompt = promptQuery.data;

  return (
    <Container size="md">
      <BackLink />

      {/* Prompt header */}
      <article className="border-border bg-card mt-4 rounded-lg border p-5">
        <div className="flex gap-4">
          <div className="pt-1">
            <VoteControl
              kind="prompt"
              id={prompt.post_id}
              score={prompt.prompt_upvotes}
              authorId={prompt.user_id}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-2 text-xs">
              <Avatar userId={prompt.user_id} size={18} />
              <span className="text-foreground font-medium">u/{prompt.user_id}</span>
              <span aria-hidden>·</span>
              <time dateTime={prompt.created_at} title={absoluteTime(prompt.created_at)}>
                {timeAgo(prompt.created_at)}
              </time>
            </div>
            <h1 className="text-foreground text-xl leading-snug font-semibold sm:text-2xl">
              {prompt.body}
            </h1>
            <div className="mt-3">
              <Badge>
                <MessageSquare className="size-3" />
                {formatCount(prompt.response_count)}{" "}
                {prompt.response_count === 1 ? "response" : "responses"}
              </Badge>
            </div>
          </div>
        </div>
      </article>

      {/* Composer */}
      <div className="mt-6">
        <ResponseForm
          submitting={createResponse.isPending}
          onSubmit={(body, reset) => {
            createResponse.mutate({ body }, { onSuccess: () => reset() });
          }}
        />
      </div>

      {/* Responses */}
      <div className="mt-6 space-y-3">
        {responsesQuery.isPending ? (
          Array.from({ length: 3 }).map((_, i) => <ResponseSkeleton key={i} />)
        ) : responsesQuery.isError ? (
          <ErrorState error={responsesQuery.error} onRetry={() => responsesQuery.refetch()} />
        ) : responses.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-8" />}
            title="No responses yet"
            description="Be the first to riff on this setup."
          />
        ) : (
          responses.map((r) => <ResponseCard key={r.response_id} response={r} />)
        )}
      </div>

      <LoadMoreButton
        loading={responsesQuery.isFetching}
        hasMore={hasMore && responses.length > 0}
        onClick={() => setLimit((l) => l + PAGE_SIZE.responses)}
      />
    </Container>
  );
}

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link to="/">
        <ArrowLeft className="size-4" />
        Back to feed
      </Link>
    </Button>
  );
}
