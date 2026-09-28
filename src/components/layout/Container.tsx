import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const widths = { sm: "max-w-xl", md: "max-w-3xl", lg: "max-w-5xl" } as const;
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", widths[size], className)}>{children}</div>
  );
}
