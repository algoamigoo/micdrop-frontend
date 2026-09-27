import type { QueryClient } from "@tanstack/react-query";
import { promptKeys } from "@/features/prompts/keys";
import { responseKeys } from "@/features/responses/keys";
import type { Prompt, Response } from "@/types/domain";

export function patchPromptInCache(
  qc: QueryClient,
  postId: number,
  updater: (p: Prompt) => Prompt,
) {
  // Detail
  const detail = qc.getQueryData<Prompt>(promptKeys.detail(postId));
  if (detail) qc.setQueryData<Prompt>(promptKeys.detail(postId), updater(detail));

  // Every list query
  qc.setQueriesData<Prompt[]>({ queryKey: promptKeys.lists() }, (old) => {
    if (!old) return old;
    return old.map((p) => (p.post_id === postId ? updater(p) : p));
  });
}

export function patchResponseInCache(
  qc: QueryClient,
  responseId: number,
  updater: (r: Response) => Response,
) {
  qc.setQueriesData<Response[]>({ queryKey: responseKeys.lists() }, (old) => {
    if (!old) return old;
    return old.map((r) => (r.response_id === responseId ? updater(r) : r));
  });
}