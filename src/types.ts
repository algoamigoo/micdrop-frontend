// src/types.ts
export interface User {
  user_id: string;
  user_name: string;
  prompt_score: number;
  response_score: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  post_id: number;
  user_id: string;
  body: string;
  prompt_upvotes: number;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export interface Response {
  response_id: number;
  post_id: number;
  user_id: string;
  body: string;
  response_upvotes: number;
  created_at: string;
  updated_at: string;
}
