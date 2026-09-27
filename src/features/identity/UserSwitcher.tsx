import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronsUpDown, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { useIdentity } from "./useIdentity";

export function UserSwitcher() {
  const { userId, knownUsers, setUserId } = useIdentity();
  const [draft, setDraft] = useState("");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Avatar userId={userId} size={20} />
          <span className="max-w-[8rem] truncate">{userId}</span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-50 min-w-[14rem] rounded-lg border border-border bg-card p-1 text-card-foreground shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Switch identity (dev)
          </DropdownMenu.Label>

          {knownUsers.map((id) => (
            <DropdownMenu.Item
              key={id}
              onSelect={() => setUserId(id)}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Avatar userId={id} size={20} />
                {id}
              </span>
              {id === userId && <Check className="size-4 text-primary" />}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <div className="flex items-center gap-2 p-1">
            <UserIcon className="size-4 text-muted-foreground" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && draft.trim()) {
                  setUserId(draft);
                  setDraft("");
                }
              }}
              placeholder="new user_id…"
              className="h-8"
            />
          </div>
          <div className="px-1 pb-1">
            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-center"
              disabled={!draft.trim()}
              onClick={() => {
                setUserId(draft);
                setDraft("");
              }}
            >
              Use this ID
            </Button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}