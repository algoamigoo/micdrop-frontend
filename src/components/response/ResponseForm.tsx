import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { CharacterCounter } from "@/components/ui/CharacterCounter";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/features/auth/useAuth";
import { BODY_MAX } from "@/lib/constants";

export function ResponseForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (body: string, reset: () => void) => void;
  submitting: boolean;
}) {
  const { user, login } = useAuth();
  const [body, setBody] = useState("");

  if (!user) {
    return (
      <div className="border-border bg-card flex items-center justify-between gap-4 rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">Sign in to drop a punchline.</p>
        <Button size="sm" onClick={login}>
          Sign in
        </Button>
      </div>
    );
  }

  const trimmed = body.trim();
  const valid = trimmed.length > 0 && body.length <= BODY_MAX;

  const submit = () => {
    if (!valid || submitting) return;
    onSubmit(trimmed, () => setBody(""));
  };

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Avatar userId={user.user_id} size={22} />
        <span>
          Punching as{" "}
          <span className="text-foreground font-medium">u/{user.user_name || user.user_id}</span>
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
