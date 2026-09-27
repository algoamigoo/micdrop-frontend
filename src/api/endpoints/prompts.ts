import { api } from "../client";
import { unwrap } from "../envelope";
import type { Prompt, PromptSort } from "@/types/domain";

export interface ListPromptsParams {
  sort?: PromptSort;
  limit?: number;
  offset?: number;
}

export function listPrompts({ sort = "newest", limit = 10, offset = 0 }: ListPromptsParams = {}) {
  return unwrap<Prompt[]>(api.get("/prompts", { params: { sort, limit, offset } }));
}

export function getPrompt(postId: number) {
  return unwrap<Prompt>(api.get(`/prompts/${postId}`));
}

export function createPrompt(input: { user_id: string; body: string }) {
  return unwrap<Prompt>(api.post("/prompts", input));
}