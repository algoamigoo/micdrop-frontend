import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { MessageSquare, MessageSquarePlus, PenLine } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadMoreButton } from "@/components/feedback/LoadMoreButton";
import { FollowButton } from "@/components/profile/FollowButton";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { UserLink } from "@/components/profile/UserLink";
import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptSkeleton } from "@/components/prompt/PromptSkeleton";
import { ResponseCard } from "@/components/response/ResponseCard";
import { ResponseSkeleton } from "@/components/response/ResponseSkeleton";
import { useAuth } from "@/features/auth/useAuth";
import { useUserPrompts, useUserProfile, useUserResponses } from "@/features/profile/queries";
import { isNotFound } from "@/api/errors";
import { PAGE_MAX, PAGE_SIZE } from "@/lib/constants";
import { hasMorePages, nextLimit } from "@/lib/pagination";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/cn";

type ProfileTab = "prompts" | "responses";

const TABS: ProfileTab[] = ["prompts", "responses"];

function joinedLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: me } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState<ProfileTab>("prompts");
  const [limits, setLimits] = useState<Record<ProfileTab, number>>({
    prompts: PAGE_SIZE.prompts,
    responses: PAGE_SIZE.responses,
  });
  const [editDismissed, setEditDismissed] = useState(false);

  const profileQuery = useUserProfile(username);
  const promptsQuery = useUserPrompts(tab === "prompts" ? username : undefined, limits.prompts);
  const responsesQuery = useUserResponses(
    tab === "responses" ? username : undefined,
    limits.responses,
  );

  if (!username) {
    return (
      <Container size="md">
        <ErrorState title="Invalid profile URL" error={new Error("The URL is malformed.")} />
      </Container>
    );
  }

  if (profileQuery.isPending) {
    return (
      <Container size="md">
        <div className="border-border bg-card mt-4 rounded-lg border p-6">
          <div className="flex gap-5">
            <div className="bg-muted size-[72px] shrink-0 animate-pulse rounded-full" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="bg-muted h-6 w-44 animate-pulse rounded" />
              <div className="bg-muted h-4 w-64 animate-pulse rounded" />
              <div className="bg-muted h-4 w-52 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (profileQuery.isError) {
    const notFound = isNotFound(profileQuery.error);
    return (
      <Container size="md">
        <ErrorState
          title={notFound ? "User not found" : "Couldn't load profile"}
          error={profileQuery.error}
          onRetry={notFound ? undefined : () => profileQuery.refetch()}
        />
      </Container>
    );
  }

  const { user, stats, follows } = profileQuery.data;
  const isOwnProfile = !!me && me.user_id === user.user_id;

  // URL-driven editor (?edit=1) so the user menu can deep-link here.
  const editRequested = searchParams.get("edit") === "1";
  const editorOpen = isOwnProfile && editRequested && !editDismissed;

  const openEditor = () => {
    setEditDismissed(false);
    const next = new URLSearchParams(searchParams);
    next.set("edit", "1");
    setSearchParams(next, { replace: true });
  };

  const closeEditor = () => {
    setEditDismissed(true);
    if (editRequested) {
      const next = new URLSearchParams(searchParams);
      next.delete("edit");
      setSearchParams(next, { replace: true });
    }
  };

  const prompts = promptsQuery.data ?? [];
  const responses = responsesQuery.data ?? [];

  return (
    <Container size="md">
      {/* Profile header */}
      <article className="border-border bg-card rounded-lg border p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Avatar userId={user.user_id} size={72} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {user.user_name || user.user_id}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  u/{user.user_id} · joined {joinedLabel(user.created_at)}
                </p>
              </div>
              {isOwnProfile ? (
                <Button variant="outline" size="sm" onClick={openEditor}>
                  <PenLine className="size-4" />
                  Edit profile
                </Button>
              ) : (
                <FollowButton
                  userId={user.user_id}
                  isFollowing={profileQuery.data.follows.is_following}
                />
              )}
            </div>

            {user.bio ? (
              <p className="text-foreground mt-4 max-w-prose text-sm leading-relaxed">{user.bio}</p>
            ) : isOwnProfile ? (
              <p className="text-muted-foreground mt-4 text-sm">No bio yet.</p>
            ) : null}

            {!!user.links?.length && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {user.links.map((link) => (
                  <UserLink key={`${link.type}:${link.url}`} link={link} />
                ))}
              </div>
            )}

            <div className="border-border mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t pt-4">
              <div>
                <p className="text-base font-semibold">{formatCount(user.total_score)}</p>
                <p className="text-muted-foreground text-xs">Total karma</p>
              </div>
              <button type="button" className="text-left" onClick={() => setTab("prompts")}>
                <p className={cn("text-base font-semibold", tab === "prompts" && "text-primary")}>
                  {formatCount(stats.prompt_count)}
                </p>
                <p className="text-muted-foreground text-xs">Prompts</p>
              </button>
              <button type="button" className="text-left" onClick={() => setTab("responses")}>
                <p className={cn("text-base font-semibold", tab === "responses" && "text-primary")}>
                  {formatCount(stats.response_count)}
                </p>
                <p className="text-muted-foreground text-xs">Responses</p>
              </button>
              <Link
                to={`/u/${encodeURIComponent(user.user_id)}/followers`}
                className="hover:text-primary"
              >
                <p className="text-base font-semibold">{formatCount(follows.followers_count)}</p>
                <p className="text-muted-foreground text-xs">Followers</p>
              </Link>
              <Link
                to={`/u/${encodeURIComponent(user.user_id)}/following`}
                className="hover:text-primary"
              >
                <p className="text-base font-semibold">{formatCount(follows.following_count)}</p>
                <p className="text-muted-foreground text-xs">Following</p>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Tabs */}
      <div className="border-border mt-6 flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "prompts" ? (
        promptsQuery.isPending ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PromptSkeleton key={i} />
            ))}
          </div>
        ) : promptsQuery.isError ? (
          <div className="mt-4">
            <ErrorState error={promptsQuery.error} onRetry={() => promptsQuery.refetch()} />
          </div>
        ) : prompts.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<MessageSquarePlus className="size-8" />}
              title="No prompts yet"
              description={
                isOwnProfile
                  ? "Drop your first setup from the feed."
                  : `${user.user_id} hasn't posted a setup yet.`
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {prompts.map((p) => (
                <PromptCard key={p.post_id} prompt={p} />
              ))}
            </div>
            <LoadMoreButton
              loading={promptsQuery.isFetching}
              hasMore={hasMorePages(prompts.length, limits.prompts, PAGE_MAX.userPrompts)}
              onClick={() =>
                setLimits((prev) => ({
                  ...prev,
                  prompts: nextLimit(prev.prompts, PAGE_SIZE.prompts, PAGE_MAX.userPrompts),
                }))
              }
            />
          </>
        )
      ) : responsesQuery.isPending ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ResponseSkeleton key={i} />
          ))}
        </div>
      ) : responsesQuery.isError ? (
        <div className="mt-4">
          <ErrorState error={responsesQuery.error} onRetry={() => responsesQuery.refetch()} />
        </div>
      ) : responses.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<MessageSquare className="size-8" />}
            title="No responses yet"
            description={
              isOwnProfile
                ? "Go riff on someone's setup."
                : `${user.user_id} hasn't dropped a punchline yet.`
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {responses.map((r) => (
              <ResponseCard key={r.response_id} response={r} />
            ))}
          </div>
          <LoadMoreButton
            loading={responsesQuery.isFetching}
            hasMore={hasMorePages(responses.length, limits.responses, PAGE_MAX.userResponses)}
            onClick={() =>
              setLimits((prev) => ({
                ...prev,
                responses: nextLimit(prev.responses, PAGE_SIZE.responses, PAGE_MAX.userResponses),
              }))
            }
          />
        </>
      )}

      {editorOpen && <ProfileEditor user={user} onClose={closeEditor} />}
    </Container>
  );
}
