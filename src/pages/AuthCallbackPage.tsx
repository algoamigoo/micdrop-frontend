import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { getMe } from "@/api/endpoints/users";
import { clearAuth, setAuth, setToken } from "@/features/auth/auth";
import { STORAGE_KEYS } from "@/lib/constants";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const token = params.get("token");
  const onboardingToken = params.get("onboarding");

  useEffect(() => {
    // New Google identity: park the short-lived onboarding token and go
    // pick a username. Any existing session is stale at this point.
    if (onboardingToken) {
      clearAuth();
      sessionStorage.setItem(STORAGE_KEYS.onboardingToken, onboardingToken);
      navigate("/onboarding/username", { replace: true });
      return;
    }

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
        localStorage.removeItem(STORAGE_KEYS.token);
        setError(err instanceof Error ? err : new Error("Sign-in failed"));
      });

    return () => {
      cancelled = true;
    };
  }, [token, onboardingToken, navigate]);

  // Derived, not stored — no setState in the effect body.
  const displayError =
    error ??
    (!token && !onboardingToken ? new Error("No token in URL. Try signing in again.") : null);

  if (displayError) {
    return (
      <Container size="sm" className="py-16">
        <ErrorState title="Sign-in failed" error={displayError} />
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link to="/">Back to home</Link>
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