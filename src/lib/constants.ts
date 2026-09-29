export const BODY_MAX = 280;
export const BODY_WARN = 240;

export const STORAGE_KEYS = {
  token: "micdrop:token",
  user: "micdrop:user",
  onboardingToken: "micdrop:onboardingToken",
  localVotes: "micdrop:localVotes",
} as const;

export const PAGE_SIZE = {
  prompts: 10,
  responses: 20,
} as const;