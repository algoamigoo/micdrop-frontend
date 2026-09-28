import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { getMe } from "@/api/endpoints/users";
import { setAuth, setToken } from "@/features/auth/auth";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const token = params.get("token");

  useEffect(() => {
    if (!token) return; // render handles this case

    setToken(token);

    let cancelled = false;
    getMe()
      .then((user) => {
        if (cancelled) return;
        setAuth(token, user);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        if (cancelled) return;
        localStorage.removeItem("micdrop:token");
        setError(err instanceof Error ? err : new Error("Sign-in failed"));
      });

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  // Derived, not stored — no setState in the effect body.
  const displayError =
    error ?? (!token ? new Error("No token in URL. Try signing in again.") : null);

  if (displayError) {
    return (
      <Container size="sm" className="py-16">
        <ErrorState title="Sign-in failed" error={displayError} />
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <a href="/">Back to home</a>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container size="sm" className="py-16">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-6" />
        <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
      </div>
    </Container>
  );
}