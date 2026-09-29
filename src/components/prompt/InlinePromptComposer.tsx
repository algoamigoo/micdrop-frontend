import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CharacterCounter } from "@/components/ui/CharacterCounter";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/features/auth/useAuth";
import { useCreatePrompt } from "@/features/prompts/mutations";
import { BODY_MAX } from "@/lib/constants";

export function InlinePromptComposer() {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [focused, setFocused] = useState(false);
  const createPrompt = useCreatePrompt();

  if (!user) {
    return (
      <div className="border-border bg-card flex items-center justify-between gap-4 rounded-lg border border-dashed p-4">
        <p className="text-muted-foreground text-sm">Sign in to post a prompt.</p>
        <Button asChild size="sm">
          <Link to="/signup">Sign in</Link>
        </Button>
      </div>
    );
  }

  const trimmed = body.trim();
  const valid = trimmed.length > 0 && body.length <= BODY_MAX;

  const submit = () => {
    if (!valid || createPrompt.isPending) return;
    createPrompt.mutate({ body: trimmed }); // optimistic insert via onMutate
    setBody("");
    setFocused(false);
  };

  const collapse = () => {
    setBody("");
    setFocused(false);
  };

  if (!focused) {
    return (
      <div className="border-border bg-card flex items-center gap-3 rounded-lg border p-3">
        <Avatar userId={user.user_id} size={32} />
        <button
          type="button"
          onClick={() => setFocused(true)}
          className="text-muted-foreground hover:text-foreground min-w-0 flex-1 cursor-text truncate text-left text-sm"
        >
          Drop a prompt…
        </button>
        <Button variant="outline" size="sm" onClick={() => setFocused(true)}>
          Post
        </Button>
      </div>
    );
  }

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Avatar userId={user.user_id} size={22} />
        <span>
          Punching as <span className="text-foreground font-medium">u/{user.user_id}</span>
        </span>
      </div>
      <Textarea
        value={body}
        autoFocus
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            collapse();
            return;
          }
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Drop a prompt…"
        maxLength={BODY_MAX + 20}
        disabled={createPrompt.isPending}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <CharacterCounter length={body.length} />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={collapse}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit} disabled={!valid || createPrompt.isPending}>
            {createPrompt.isPending ? <Spinner /> : null}
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}