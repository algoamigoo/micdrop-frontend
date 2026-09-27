import { cn } from "@/lib/cn";
import type { PromptSort } from "@/types/domain";

const TABS: { value: PromptSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "top", label: "Top" },
];

export function PromptSortTabs({
  value,
  onChange,
}: {
  value: PromptSort;
  onChange: (next: PromptSort) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Sort prompts"
      className="inline-flex rounded-lg border border-border bg-card p-1"
    >
      {TABS.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}