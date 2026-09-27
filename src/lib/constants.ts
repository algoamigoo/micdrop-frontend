export const BODY_MAX = 280;
export const BODY_WARN = 240;

export const DEFAULT_USER_ID = "alice";
export const SEED_USERS = ["alice", "bob", "carol"];

export const STORAGE_KEYS = {
  userId: "micdrop:userId",
  knownUsers: "micdrop:knownUsers",
  localVotes: "micdrop:localVotes",
} as const;

export const PAGE_SIZE = {
  prompts: 10,
  responses: 20,
} as const;