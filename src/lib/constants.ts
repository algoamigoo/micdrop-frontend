export const BODY_MAX = 280;
export const BODY_WARN = 240;

export const STORAGE_KEYS = {
  token: "micdrop:token",
  user: "micdrop:user",
  onboardingToken: "micdrop:onboardingToken",
} as const;

export const PAGE_SIZE = {
  prompts: 10,
  responses: 20,
} as const;

// Per-endpoint server caps. The API returns 400 for a limit above these, so
// "load more" has to stop here.
export const PAGE_MAX = {
  feed: 50,
  promptResponses: 100,
  userPrompts: 50,
  userResponses: 50,
  userFollowers: 100,
} as const;
