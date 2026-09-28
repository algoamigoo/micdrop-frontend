import { LogIn } from "lucide-react";
import { cn } from "@/lib/cn";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export function LoginButton({ className }: { className?: string }) {
  return (
    <a
      href={`${API_BASE}/auth/google/login`}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        className,
      )}
    >
      <LogIn className="size-4" />
      Sign in with Google
    </a>
  );
}