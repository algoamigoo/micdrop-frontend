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

export function createPrompt(input: { body: string }) {
  return unwrap<Prompt>(api.post("/prompts", input));
}

export function updatePrompt(postId: number, input: { body: string }) {
  return unwrap<Prompt>(api.patch(`/prompts/${postId}`, input));
}

export function deletePrompt(postId: number) {
  return api.delete(`/prompts/${postId}`).then(() => undefined);
}
