import type { QueryClient } from "@tanstack/react-query";
import { promptKeys } from "@/features/prompts/keys";
import { responseKeys } from "@/features/responses/keys";
import { userKeys } from "@/features/profile/keys";
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

  patchUserPromptsInCache(qc, postId, updater);
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
  patchUserResponsesInCache(qc, responseId, updater);
}

/**
 * Profile-page lists live under userKeys (["users", username, "prompts"|"responses", ...]),
 * so vote mutations must sweep them too — otherwise voting from a profile
 * shows nothing until a refetch, and the stale viewer_vote corrupts the next toggle.
 */
export function patchUserPromptsInCache(
  qc: QueryClient,
  postId: number,
  updater: (p: Prompt) => Prompt,
) {
  for (const [key, list] of qc.getQueriesData<Prompt[]>({ queryKey: userKeys.all })) {
    if (key[2] !== "prompts" || !Array.isArray(list)) continue;
    qc.setQueryData<Prompt[]>(
      key,
      list.map((p) => (p.post_id === postId ? updater(p) : p)),
    );
  }
}

export function patchUserResponsesInCache(
  qc: QueryClient,
  responseId: number,
  updater: (r: Response) => Response,
) {
  for (const [key, list] of qc.getQueriesData<Response[]>({ queryKey: userKeys.all })) {
    if (key[2] !== "responses" || !Array.isArray(list)) continue;
    qc.setQueryData<Response[]>(
      key,
      list.map((r) => (r.response_id === responseId ? updater(r) : r)),
    );
  }
}
