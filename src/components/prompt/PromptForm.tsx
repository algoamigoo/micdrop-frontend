import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { CharacterCounter } from "@/components/ui/CharacterCounter";
import { Spinner } from "@/components/ui/Spinner";
import { BODY_MAX } from "@/lib/constants";

export function PromptForm({
  onSubmit,
  submitting,
  onCancel,
}: {
  onSubmit: (body: string) => void;
  submitting: boolean;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState("");
  const trimmed = body.trim();
  const valid = trimmed.length > 0 && body.length <= BODY_MAX;

  const submit = () => {
    if (!valid || submitting) return;
    onSubmit(trimmed);
  };

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
        placeholder="Drop your prompt… (⌘ + Enter to submit)"
        maxLength={BODY_MAX + 20}
        disabled={submitting}
        autoFocus
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <CharacterCounter length={body.length} />
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button size="sm" onClick={submit} disabled={!valid || submitting}>
            {submitting ? <Spinner /> : null}
            Post prompt
          </Button>
        </div>
      </div>
    </div>
  );
}
