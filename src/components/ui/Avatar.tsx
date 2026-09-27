import { cn } from "@/lib/cn";

const COLORS = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function pickColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function Avatar({
  userId,
  size = 28,
  className,
}: {
  userId: string;
  size?: number;
  className?: string;
}) {
  const initial = userId.slice(0, 1).toUpperCase();
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        pickColor(userId),
        className,
      )}
    >
      {initial}
    </span>
  );
}