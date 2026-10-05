import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadMoreButton } from "@/components/feedback/LoadMoreButton";
import { useFollowList } from "@/features/profile/queries";
import { PAGE_MAX } from "@/lib/constants";
import { hasMorePages, nextLimit } from "@/lib/pagination";
import type { User } from "@/types/domain";

const STEP = 20;

/**
 * Followers / following list for a profile. Both directions are the same view over a
 * different endpoint, so they share this component.
 */
export function FollowListPage({ kind }: { kind: "followers" | "following" }) {
  const { username = "" } = useParams<{ username: string }>();
  const [limit, setLimit] = useState(STEP);
  const query = useFollowList(username, kind, limit);
  const users = query.data ?? [];

  const label = kind === "followers" ? "Followers" : "Following";

  if (!username) {
    return (
      <Container size="md">
        <ErrorState title="Invalid profile URL" error={new Error("The URL is malformed.")} />
      </Container>
    );
  }

  return (
    <Container size="md">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-xl font-semibold tracking-tight">{label}</h1>
        <Link
          to={`/u/${encodeURIComponent(username)}`}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          u/{username}
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {query.isPending ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-border bg-card h-16 animate-pulse rounded-lg border" />
          ))
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="size-8" />}
            title={kind === "followers" ? "No followers yet" : "Not following anyone"}
            description={
              kind === "followers"
                ? `When someone follows u/${username}, they show up here.`
                : `When u/${username} follows someone, they show up here.`
            }
          />
        ) : (
          users.map((u) => <FollowRow key={u.user_id} user={u} />)
        )}
      </div>

      <LoadMoreButton
        loading={query.isFetching}
        hasMore={hasMorePages(users.length, limit, PAGE_MAX.userFollowers)}
        onClick={() => setLimit((l) => nextLimit(l, STEP, PAGE_MAX.userFollowers))}
      />
    </Container>
  );
}

function FollowRow({ user }: { user: User }) {
  return (
    <Link
      to={`/u/${encodeURIComponent(user.user_id)}`}
      className="border-border bg-card hover:border-foreground/20 flex items-center gap-3 rounded-lg border p-3 transition-colors"
    >
      <Avatar userId={user.user_id} size={36} />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">
          {user.user_name || user.user_id}
        </p>
        <p className="text-muted-foreground truncate text-xs">u/{user.user_id}</p>
      </div>
      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
        {user.total_score} karma
      </span>
    </Link>
  );
}
