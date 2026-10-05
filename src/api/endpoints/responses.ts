import { api } from "../client";
import { unwrap } from "../envelope";
import type { Response } from "@/types/domain";

export interface ListResponsesParams {
  limit?: number;
  offset?: number;
}

export function listResponses(
  postId: number,
  { limit = 20, offset = 0 }: ListResponsesParams = {},
) {
  return unwrap<Response[]>(api.get(`/prompts/${postId}/responses`, { params: { limit, offset } }));
}

export function createResponse(postId: number, input: { body: string }) {
  return unwrap<Response>(api.post(`/prompts/${postId}/responses`, input));
}

export function updateResponse(responseId: number, input: { body: string }) {
  return unwrap<Response>(api.patch(`/responses/${responseId}`, input));
}

export function deleteResponse(responseId: number) {
  return api.delete(`/responses/${responseId}`).then(() => undefined);
}
