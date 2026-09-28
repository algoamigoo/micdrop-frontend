import { Link, NavLink } from "react-router-dom";
import { Mic2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";
import { LoginButton } from "@/features/auth/LoginButton";
import { UserMenu } from "@/features/auth/UserMenu";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/lib/cn";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <Container size="lg" className="flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold">
            <Mic2 className="text-primary size-5" />
            <span>MicDrop</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            <NavItem to="/" label="Feed" end />
            <NavItem to="/new" label="New" />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link to="/new">+ New prompt</Link>
          </Button>
          {isAuthenticated ? <UserMenu /> : <LoginButton />}
        </div>
      </Container>
    </header>
  );
}

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-1.5 transition-colors",
          isActive && "bg-muted text-foreground",
        )
      }
    >
      {label}
    </NavLink>
  );
}
