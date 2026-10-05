import { Link } from "react-router-dom";
import { Mic } from "lucide-react";
import { Container } from "./Container";
import { UserMenu } from "@/features/auth/UserMenu";
import { useAuth } from "@/features/auth/useAuth";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-border bg-card/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
            <Mic className="size-4" />
          </span>
          <span className="text-base tracking-tight">MicDrop</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <nav className="flex items-center gap-4 text-sm">
              <Link
                to="/signup"
                className="text-muted-foreground hover:text-foreground font-medium"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 font-medium"
              >
                Sign in
              </Link>
            </nav>
          )}
        </div>
      </Container>
    </header>
  );
}
