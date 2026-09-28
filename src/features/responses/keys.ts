export const responseKeys = {
  all: ["responses"] as const,
  lists: () => [...responseKeys.all, "list"] as const,
  list: (postId: number, filters: { limit: number; offset: number }) =>
    [...responseKeys.lists(), postId, filters] as const,
};
