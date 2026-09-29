import type { QueryClient } from "@tanstack/react-query";
import { promptKeys } from "../prompts/keys";
import type { Prompt, PromptSort } from "@/types/domain";

/**
 * Feed-list helpers for optimistic prompt creation. Only "newest"-sorted
 * lists are touched — "top" order is left to the server on refetch.
 */
export function prependPromptToFeed(qc: QueryClient, prompt: Prompt) {
  for (const [key, list] of qc.getQueriesData<Prompt[]>({ queryKey: promptKeys.lists() })) {
    if (!list) continue;
    if (sortOf(key) !== "newest") continue;
    qc.setQueryData<Prompt[]>(key, [prompt, ...list]);
  }
}

export function removePromptFromFeed(qc: QueryClient, postId: number) {
  for (const [key, list] of qc.getQueriesData<Prompt[]>({ queryKey: promptKeys.lists() })) {
    if (!list) continue;
    qc.setQueryData<Prompt[]>(key, list.filter((p) => p.post_id !== postId));
  }
}

export function replacePromptInFeed(qc: QueryClient, placeholderId: number, real: Prompt) {
  for (const [key, list] of qc.getQueriesData<Prompt[]>({ queryKey: promptKeys.lists() })) {
    if (!list) continue;
    qc.setQueryData<Prompt[]>(key, list.map((p) => (p.post_id === placeholderId ? real : p)));
  }
}

function sortOf(key: readonly unknown[]): PromptSort | undefined {
  const filters = key[2] as { sort?: PromptSort } | undefined;
  return filters?.sort;
}