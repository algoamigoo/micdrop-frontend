import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadMoreButton } from "@/components/feedback/LoadMoreButton";
import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptSkeleton } from "@/components/prompt/PromptSkeleton";
import { PromptSortTabs } from "@/components/prompt/PromptSortTabs";
import { usePrompts } from "@/features/prompts/queries";
import { PAGE_SIZE } from "@/lib/constants";
import type { PromptSort } from "@/types/domain";

const VALID_SORTS: PromptSort[] = ["newest", "top"];

export default function HomePage() {
  const [params, setParams] = useSearchParams();

  const sortParam = params.get("sort");
  const sort: PromptSort =
    sortParam && (VALID_SORTS as string[]).includes(sortParam)
      ? (sortParam as PromptSort)
      : "newest";

  // Per-sort limit so switching tabs preserves each list's pagination.
  const [limits, setLimits] = useState<Record<PromptSort, number>>(() => ({
    newest: PAGE_SIZE.prompts,
    top: PAGE_SIZE.prompts,
  }));

  const limit = limits[sort];
  const query = usePrompts({ sort, limit, offset: 0 });

  const prompts = useMemo(() => query.data ?? [], [query.data]);
  const hasMore = prompts.length === limit;

  const setSort = (next: PromptSort) => {
    const nextParams = new URLSearchParams(params);
    if (next === "newest") nextParams.delete("sort");
    else nextParams.set("sort", next);
    setParams(nextParams, { replace: true });
  };

  return (
    <Container size="md">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Setups from the crowd. Punchlines from the brave.
          </p>
        </div>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to="/new">+ New prompt</Link>
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <PromptSortTabs value={sort} onChange={setSort} />
        <Button asChild size="sm" className="sm:hidden">
          <Link to="/new">+ New</Link>
        </Button>
      </div>

      {query.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PromptSkeleton key={i} />
          ))}
        </div>
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : prompts.length === 0 ? (
        <EmptyState
          icon={<MessageSquarePlus className="size-8" />}
          title="No prompts yet"
          description="Be the first to drop a setup and let the crowd riff."
          action={
            <Button asChild>
              <Link to="/new">Create the first prompt</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {prompts.map((p) => (
              <PromptCard key={p.post_id} prompt={p} />
            ))}
          </div>
          <LoadMoreButton
            loading={query.isFetching}
            hasMore={hasMore}
            onClick={() =>
              setLimits((prev) => ({ ...prev, [sort]: prev[sort] + PAGE_SIZE.prompts }))
            }
          />
        </>
      )}
    </Container>
  );
}
