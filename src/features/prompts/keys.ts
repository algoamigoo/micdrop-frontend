import type { PromptSort } from "@/types/domain";

export const promptKeys = {
  all: ["prompts"] as const,
  lists: () => [...promptKeys.all, "list"] as const,
  list: (filters: { sort: PromptSort; limit: number; offset: number }) =>
    [...promptKeys.lists(), filters] as const,
  details: () => [...promptKeys.all, "detail"] as const,
  detail: (id: number) => [...promptKeys.details(), id] as const,
};
