import { api } from "../client";
import { unwrap } from "../envelope";
import type { CompleteSignupResponse } from "@/types/domain";

/**
 * Exchange the short-lived onboarding token plus a chosen username
 * for a session token + user.
 */
export function completeSignup(userId: string, onboardingToken: string) {
  return unwrap<CompleteSignupResponse>(
    api.post(
      "/auth/complete-signup",
      { user_id: userId },
      { headers: { Authorization: `Bearer ${onboardingToken}` } },
    ),
  );
}