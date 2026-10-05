export const userKeys = {
  all: ["users"] as const,
  profile: (username: string) => [...userKeys.all, username, "profile"] as const,
  prompts: (username: string, limit: number) =>
    [...userKeys.all, username, "prompts", { limit }] as const,
  responses: (username: string, limit: number) =>
    [...userKeys.all, username, "responses", { limit }] as const,
  followers: (username: string, limit: number) =>
    [...userKeys.all, username, "followers", { limit }] as const,
  following: (username: string, limit: number) =>
    [...userKeys.all, username, "following", { limit }] as const,
};
