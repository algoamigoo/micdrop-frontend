import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, PenLine, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { useAuth } from "./useAuth";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const label = user.user_name || user.user_id;

  const itemClass =
    "data-[highlighted]:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "border-border bg-card flex items-center gap-2 rounded-full border py-1 pr-3 pl-1",
            "hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          )}
        >
          <Avatar userId={user.user_id} size={22} />
          <span className="max-w-[8rem] truncate text-sm font-medium">{label}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="border-border bg-card text-card-foreground z-50 min-w-[12rem] rounded-lg border p-1 shadow-lg"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium">{label}</p>
            <p className="text-muted-foreground truncate text-xs">u/{user.user_id}</p>
          </div>
          <DropdownMenu.Separator className="bg-border my-1 h-px" />
          <DropdownMenu.Item onSelect={() => navigate(`/u/${user.user_id}`)} className={itemClass}>
            <UserIcon className="size-4" />
            View profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => navigate(`/u/${user.user_id}?edit=1`)}
            className={itemClass}
          >
            <PenLine className="size-4" />
            Edit profile
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="bg-border my-1 h-px" />
          <DropdownMenu.Item onSelect={logout} className={itemClass}>
            <LogOut className="size-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}