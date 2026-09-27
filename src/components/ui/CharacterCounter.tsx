import { BODY_MAX, BODY_WARN } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function CharacterCounter({ length }: { length: number }) {
  const remaining = BODY_MAX - length;
  const over = remaining < 0;
  const warn = length >= BODY_WARN;

  return (
    <span
      className={cn(
        "text-xs tabular-nums text-muted-foreground",
        warn && !over && "text-amber-500",
        over && "text-destructive",
      )}
    >
      {remaining}
    </span>
  );
}