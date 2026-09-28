import { api } from "../client";
import { unwrap } from "../envelope";
import type { Prompt, Response } from "@/types/domain";

export type VoteType = "upvote" | "downvote";

export function votePrompt(postId: number, vote: VoteType) {
  return unwrap<Prompt>(api.post(`/prompts/${postId}/${vote}`));
}

export function voteResponse(responseId: number, vote: VoteType) {
  return unwrap<Response>(api.post(`/responses/${responseId}/${vote}`));
}
