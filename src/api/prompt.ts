import { api } from "./client";
import type { Prompt } from "../types";

// Note: Our Go backend wraps everything in a { "data": ... } envelope
interface ApiResponse<T> {
  data: T;
}

export const getPrompts = async (): Promise<Prompt[]> => {
  const response = await api.get<ApiResponse<Prompt[]>>("/prompts");
  return response.data.data; // Extract the array from the envelope
};

export const createPrompt = async (body: string): Promise<Prompt> => {
  const response = await api.post<ApiResponse<Prompt>>("/prompts", {
    // We hardcoded the user_id as "alice" in our client.ts
    body: body,
  });
  return response.data.data;
};