import { useCallback, useSyncExternalStore } from "react";
import { getLocalVote, setLocalVote, subscribeVotes, type LocalVote, type VoteKind } from "./store";

export type { LocalVote, VoteKind };

export function useLocalVote(userId: string, kind: VoteKind, id: number) {
  const vote = useSyncExternalStore(
    subscribeVotes,
    () => getLocalVote(userId, kind, id),
    () => null,
  );

  const mark = useCallback(
    (v: LocalVote) => {
      setLocalVote(userId, kind, id, v);
    },
    [userId, kind, id],
  );

  return [vote, mark] as const;
}
