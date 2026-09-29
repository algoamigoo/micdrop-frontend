import { LogIn } from "lucide-react";
import { cn } from "@/lib/cn";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export function LoginButton({
  className,
  label = "Continue with Google",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={`${API_BASE}/auth/google/login`}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
        className,
      )}
    >
      <LogIn className="size-4" />
      {label}
    </a>
  );
}