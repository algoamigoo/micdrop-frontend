import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { CharacterCounter } from "@/components/ui/CharacterCounter";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { useIdentity } from "@/features/identity/useIdentity";
import { BODY_MAX } from "@/lib/constants";

export function ResponseForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (body: string, reset: () => void) => void;
  submitting: boolean;
}) {
  const { userId } = useIdentity();
  const [body, setBody] = useState("");
  const trimmed = body.trim();
  const valid = trimmed.length > 0 && body.length <= BODY_MAX;

  const submit = () => {
    if (!valid || submitting) return;
    onSubmit(trimmed, () => setBody(""));
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Avatar userId={userId} size={22} />
        <span>
          Punching as <span className="font-medium text-foreground">u/{userId}</span>
        </span>
      </div>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
        placeholder="Drop your punchline…"
        maxLength={BODY_MAX + 20}
        disabled={submitting}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <CharacterCounter length={body.length} />
        <Button size="sm" onClick={submit} disabled={!valid || submitting}>
          {submitting ? <Spinner /> : null}
          Post response
        </Button>
      </div>
    </div>
  );
}