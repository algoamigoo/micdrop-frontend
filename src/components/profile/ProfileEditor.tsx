import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { useUpdateProfile } from "@/features/profile/mutations";
import { cn } from "@/lib/cn";
import type { LinkType, User } from "@/types/domain";

const LINK_TYPES: LinkType[] = ["github", "twitter", "youtube", "instagram", "linkedin", "website"];
const URL_PATTERN = /^https?:\/\/\S+$/;

interface LinkDraft {
  type: LinkType;
  url: string;
  /** Set when the user explicitly picks a type (blocks auto-detection). */
  pinned: boolean;
}

function detectLinkType(url: string): LinkType {
  const u = url.toLowerCase();
  if (u.includes("github.com/")) return "github";
  if (u.includes("twitter.com/") || u.includes("x.com/")) return "twitter";
  if (u.includes("youtube.com/") || u.includes("youtu.be/")) return "youtube";
  if (u.includes("instagram.com/")) return "instagram";
  if (u.includes("linkedin.com/")) return "linkedin";
  return "website";
}

export function ProfileEditor({ user, onClose }: { user: User; onClose: () => void }) {
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState(user.user_name || user.user_id);
  const [bio, setBio] = useState(user.bio ?? "");
  const [links, setLinks] = useState<LinkDraft[]>(
    (user.links ?? []).map((l) => ({ type: l.type, url: l.url, pinned: true })),
  );

  // Escape closes (unsaved changes are discarded).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const name = displayName.trim();
  const nameError =
    name.length === 0 ? "Display name is required." : name.length > 50 ? "Max 50 characters." : null;
  const bioError = bio.length > 100 ? "Max 100 characters." : null;

  const cleanedLinks = links
    .map((l) => ({ type: l.type, url: l.url.trim() }))
    .filter((l) => l.url !== "");
  const linkError = cleanedLinks.some((l) => !URL_PATTERN.test(l.url))
    ? "Links must be full URLs, e.g. https://x.com/alice"
    : null;

  const canSave = !nameError && !bioError && !linkError && !updateProfile.isPending;

  const save = () => {
    if (!canSave) return;
    updateProfile.mutate(
      { user_name: name, bio: bio.trim(), links: cleanedLinks },
      { onSuccess: onClose },
    );
  };

  const patchLink = (index: number, patch: Partial<LinkDraft>) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));

  return (
    <div className="fixed inset-0 z-50">
      <div className="bg-foreground/30 absolute inset-0" onClick={onClose} aria-hidden />

      <section
        role="dialog"
        aria-label="Edit profile"
        className="bg-card text-card-foreground border-border absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l shadow-2xl"
      >
        <header className="border-border flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-base font-semibold">Edit profile</h2>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close editor">
            <X className="size-4" />
          </Button>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Display name */}
          <section>
            <label htmlFor="display-name" className="mb-1.5 block text-sm font-medium">
              Display name
            </label>
            <Input
              id="display-name"
              value={displayName}
              maxLength={50}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={user.user_id}
            />
            {nameError ? (
              <p className="text-destructive mt-1.5 text-xs">{nameError}</p>
            ) : (
              <p className="text-muted-foreground mt-1.5 text-xs">
                1–50 characters. Shown instead of u/{user.user_id}.
              </p>
            )}
          </section>

          {/* Bio */}
          <section>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="bio" className="block text-sm font-medium">
                Bio
              </label>
              <span
                className={cn(
                  "text-xs",
                  bio.length > 100 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {bio.length}/100
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={100}
              rows={3}
              placeholder="Tell the crowd who you are…"
            />
            {bioError && <p className="text-destructive mt-1.5 text-xs">{bioError}</p>}
          </section>

          {/* Links */}
          <section>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm font-medium">Links</span>
              <span className="text-muted-foreground text-xs">{links.length}/3</span>
            </div>
            <div className="space-y-2">
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={link.type}
                    aria-label="Link type"
                    onChange={(e) =>
                      patchLink(i, { type: e.target.value as LinkType, pinned: true })
                    }
                    className="border-border bg-card focus-visible:ring-ring h-9 rounded-lg border px-2 text-sm capitalize focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {LINK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="min-w-0 flex-1">
                    <Input
                      value={link.url}
                      inputMode="url"
                      placeholder="https://…"
                      onChange={(e) =>
                        patchLink(i, {
                          url: e.target.value,
                          type: link.pinned ? link.type : detectLinkType(e.target.value),
                        })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Remove link"
                    onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              {linkError && <p className="text-destructive text-xs">{linkError}</p>}
              {links.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLinks((prev) => [...prev, { type: "website", url: "", pinned: false }])
                  }
                >
                  <Plus className="size-4" />
                  Add link
                </Button>
              )}
            </div>
            <p className="text-muted-foreground mt-1.5 text-xs">
              Up to 3. The type is detected from the URL.
            </p>
          </section>
        </div>

        <footer className="border-border flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={!canSave}>
            {updateProfile.isPending ? <Spinner /> : null}
            Save changes
          </Button>
        </footer>
      </section>
    </div>
  );
}