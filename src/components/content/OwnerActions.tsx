import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CharacterCounter } from "@/components/ui/CharacterCounter";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/features/auth/useAuth";
import { useDeletePrompt, useUpdatePrompt } from "@/features/prompts/editMutations";
import { useDeleteResponse, useUpdateResponse } from "@/features/responses/editMutations";
import { BODY_MAX } from "@/lib/constants";

interface Props {
  kind: "prompt" | "response";
  id: number;
  authorId: string;
  body: string;
  /** Required for responses so the prompt's response_count can be patched. */
  postId?: number;
}

/**
 * Edit / delete controls for content the signed-in user authored. Renders nothing for
 * anyone else's content; the server enforces the same rule (403).
 */
export function OwnerActions({ kind, id, authorId, body, postId }: Props) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const [confirming, setConfirming] = useState(false);

  const updatePrompt = useUpdatePrompt();
  const deletePrompt = useDeletePrompt();
  const updateResponse = useUpdateResponse();
  const deleteResponse = useDeleteResponse();

  if (!user || user.user_id !== authorId) return null;

  const busy =
    updatePrompt.isPending ||
    deletePrompt.isPending ||
    updateResponse.isPending ||
    deleteResponse.isPending;

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed.length <= BODY_MAX && trimmed !== body;

  const save = () => {
    if (!canSave) return;
    if (kind === "prompt") updatePrompt.mutate({ postId: id, body: trimmed });
    else updateResponse.mutate({ responseId: id, body: trimmed });
    setEditing(false);
  };

  const remove = () => {
    if (kind === "prompt") deletePrompt.mutate(id);
    else if (postId !== undefined) deleteResponse.mutate({ responseId: id, postId });
    setConfirming(false);
  };

  if (editing) {
    return (
      <div className="mt-3 space-y-2">
        <Textarea
          value={draft}
          autoFocus
          maxLength={BODY_MAX}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={save} disabled={!canSave || busy}>
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDraft(body);
              setEditing(false);
            }}
          >
            <X className="size-4" />
            Cancel
          </Button>
          <CharacterCounter length={draft.length} />
        </div>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs">
          Delete{kind === "prompt" ? " this prompt and its responses" : " this response"}?
        </span>
        <Button size="sm" variant="destructive" onClick={remove} disabled={busy}>
          Delete
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
      <Button
        size="sm"
        variant="ghost"
        aria-label="Edit"
        onClick={() => {
          setDraft(body);
          setEditing(true);
        }}
      >
        <Pencil className="size-4" />
      </Button>
      <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => setConfirming(true)}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
