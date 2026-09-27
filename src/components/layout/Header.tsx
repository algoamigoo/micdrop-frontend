import { Link, NavLink } from "react-router-dom";
import { Mic2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";
import { UserSwitcher } from "@/features/identity/UserSwitcher";
import { cn } from "@/lib/cn";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container size="lg" className="flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold">
            <Mic2 className="size-5 text-primary" />
            <span>MicDrop</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            <NavItem to="/" label="Feed" end />
            <NavItem to="/new" label="New" />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/new">+ New prompt</Link>
          </Button>
          <UserSwitcher />
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
          "rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          isActive && "bg-muted text-foreground",
        )
      }
    >
      {label}
    </NavLink>
  );
}