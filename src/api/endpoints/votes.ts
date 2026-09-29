import { api } from "../client";
import { unwrap } from "../envelope";
import type { Prompt, Response, VoteValue } from "@/types/domain";

export type { VoteValue };

export function setPromptVote(postId: number, vote: VoteValue) {
  return unwrap<Prompt>(api.put(`/prompts/${postId}/vote`, { vote }));
}

export function setResponseVote(responseId: number, vote: VoteValue) {
  return unwrap<Response>(api.put(`/responses/${responseId}/vote`, { vote }));
}
