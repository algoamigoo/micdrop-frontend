import { UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/useAuth";
import { useToggleFollow } from "@/features/profile/followMutations";

export function FollowButton({ userId, isFollowing }: { userId: string; isFollowing: boolean }) {
  const { isAuthenticated } = useAuth();
  const toggle = useToggleFollow(userId);

  if (!isAuthenticated) {
    return (
      <Button asChild size="sm">
        <a href="/signup">Sign in to follow</a>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "primary"}
      disabled={toggle.isPending}
      onClick={() => toggle.mutate(!isFollowing)}
    >
      {isFollowing ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
