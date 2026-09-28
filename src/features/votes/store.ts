import { STORAGE_KEYS } from "@/lib/constants";

export type VoteKind = "prompt" | "response";
export type LocalVote = "upvote" | "downvote";

type VotesMap = Record<string, LocalVote>;
type Listener = () => void;

let cache: VotesMap | null = null;
const listeners = new Set<Listener>();

function loadMap(): VotesMap {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.localVotes);
    cache = raw ? (JSON.parse(raw) as VotesMap) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function emit() {
  for (const l of listeners) l();
}

function makeKey(userId: string, kind: VoteKind, id: number) {
  return `${userId}:${kind}:${id}`;
}

export function getLocalVote(userId: string, kind: VoteKind, id: number): LocalVote | null {
  return loadMap()[makeKey(userId, kind, id)] ?? null;
}

export function setLocalVote(userId: string, kind: VoteKind, id: number, vote: LocalVote) {
  const map = loadMap();
  const key = makeKey(userId, kind, id);
  if (map[key] === vote) return;
  map[key] = vote;
  try {
    localStorage.setItem(STORAGE_KEYS.localVotes, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
  emit();
}

export function subscribeVotes(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Sync from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEYS.localVotes) {
      cache = null;
      emit();
    }
  });
}
