import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPrompt } from "@/api/endpoints/prompts";
import { promptKeys } from "./keys";
import type { Prompt } from "@/types/domain";

export function useCreatePrompt() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { user_id: string; body: string }) => createPrompt(input),
    onSuccess: (created: Prompt) => {
      // Seed the detail cache so the destination page renders instantly
      qc.setQueryData(promptKeys.detail(created.post_id), created);
      // Refresh the feed
      qc.invalidateQueries({ queryKey: promptKeys.lists() });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create prompt");
    },
  });
}