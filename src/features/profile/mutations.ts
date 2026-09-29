import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMe } from "@/api/endpoints/users";
import { getToken, setAuth } from "@/features/auth/auth";
import { userKeys } from "./keys";
import type { UpdateProfileInput, User } from "@/types/domain";

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMe(input),
    onSuccess: (updated: User) => {
      // Keep the auth store (header + user menu) in sync with the server.
      const token = getToken();
      if (token) setAuth(token, updated);

      // Profile pages may be showing stale data.
      qc.invalidateQueries({ queryKey: userKeys.all });

      toast.success("Profile updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    },
  });
}