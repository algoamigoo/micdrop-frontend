export type LinkType = "github" | "twitter" | "youtube" | "instagram" | "linkedin" | "website";

export interface Link {
  type: LinkType;
  url: string;
}

export interface User {
  user_id: string;
  user_name: string;
  bio: string | null;
  links: Link[] | null;
  prompt_score: number;
  response_score: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  prompt_count: number;
  response_count: number;
}

export interface FollowCounts {
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

export interface UserProfileResponse {
  user: User;
  stats: UserStats;
  follows: FollowCounts;
}

export interface CompleteSignupResponse {
  token: string;
  user: User;
}

export interface UpdateProfileInput {
  user_name?: string;
  bio?: string;
  links?: Link[];
}

export type ViewerVote = "upvote" | "downvote" | null;
export type VoteValue = "upvote" | "downvote" | "none";
export type VoteDirection = "upvote" | "downvote";

export interface Prompt {
  post_id: number;
  user_id: string;
  body: string;
  prompt_upvotes: number;
  response_count: number;
  viewer_vote: ViewerVote;
  edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Response {
  response_id: number;
  post_id: number;
  user_id: string;
  body: string;
  response_upvotes: number;
  viewer_vote: ViewerVote;
  edited: boolean;
  created_at: string;
  updated_at: string;
}

export type PromptSort = "newest" | "top";
