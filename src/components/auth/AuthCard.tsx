import type { ReactNode } from "react";
import { Mic } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LoginButton } from "@/features/auth/LoginButton";

export function AuthCard({
  title,
  tagline,
  googleLabel,
  footer,
}: {
  title: string;
  tagline: string;
  googleLabel: string;
  footer: ReactNode;
}) {
  return (
    <Container size="sm" className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="border-border bg-card w-full max-w-[420px] rounded-xl border p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
            <Mic className="size-6" />
          </div>
          <span className="mt-4 text-lg font-semibold tracking-tight">MicDrop</span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{tagline}</p>
        </div>

        <LoginButton label={googleLabel} className="mt-8 h-10 w-full" />

        <p className="text-muted-foreground mt-6 text-center text-sm">{footer}</p>

        <p className="text-muted-foreground mt-8 text-center text-xs">
          By continuing you agree to keep it playful and follow the community rules.
        </p>
      </div>
    </Container>
  );
}