import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followUser, unfollowUser } from "@/api/endpoints/users";
import { userKeys } from "./keys";
import type { UserProfileResponse } from "@/types/domain";

/** The query stores the unwrapped profile under `data`. */
type ProfileQuery = { data: UserProfileResponse };

export function useToggleFollow(targetUserId: string) {
  const qc = useQueryClient();

  return useMutation({
    // Optimistic: flip immediately, the profile refetch settles it.
    mutationFn: (shouldFollow: boolean) =>
      shouldFollow ? followUser(targetUserId) : unfollowUser(targetUserId),

    onMutate: async (shouldFollow) => {
      await qc.cancelQueries({ queryKey: userKeys.profile(targetUserId) });
      const previous = qc.getQueryData<ProfileQuery>(userKeys.profile(targetUserId));

      qc.setQueryData<ProfileQuery>(userKeys.profile(targetUserId), (old) => {
        if (!old?.data?.follows) return old;
        return {
          ...old,
          data: {
            ...old.data,
            follows: {
              ...old.data.follows,
              is_following: shouldFollow,
              followers_count: Math.max(
                old.data.follows.followers_count + (shouldFollow ? 1 : -1),
                0,
              ),
            },
          },
        };
      });

      return { previous };
    },

    onError: (err, _shouldFollow, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData<ProfileQuery>(userKeys.profile(targetUserId), ctx.previous);
      }
      toast.error(err instanceof Error ? err.message : "Failed to update follow");
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: userKeys.profile(targetUserId) });
    },
  });
}
