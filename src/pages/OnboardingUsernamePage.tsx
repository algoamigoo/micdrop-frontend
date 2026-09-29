import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { completeSignup } from "@/api/endpoints/auth";
import { isConflict } from "@/api/errors";
import { setAuth } from "@/features/auth/auth";
import { STORAGE_KEYS } from "@/lib/constants";
import { cn } from "@/lib/cn";

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const RESERVED_USERNAMES = new Set(["me", "admin", "api", "auth", "root", "micdrop", "support"]);

function validateUsername(value: string): string | null {
  if (value.length === 0) return null; // neutral while empty
  if (value.length < 3) return "Must be at least 3 characters";
  if (value.length > 30) return "Must be at most 30 characters";
  if (!USERNAME_PATTERN.test(value)) return "Letters, numbers, _ and - only";
  if (RESERVED_USERNAMES.has(value.toLowerCase())) return "That username is reserved";
  return null;
}

export default function OnboardingUsernamePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [takenValue, setTakenValue] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onboardingToken = sessionStorage.getItem(STORAGE_KEYS.onboardingToken);

  if (!onboardingToken) {
    return (
      <Container size="sm" className="py-16">
        <ErrorState
          title="Signup session expired"
          error={new Error(
            "We couldn't find your signup token. It may have timed out — please start again.",
          )}
        />
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </Container>
    );
  }

  const trimmed = username.trim();
  const clientError = validateUsername(trimmed);
  const taken = takenValue !== null && takenValue === trimmed;
  const inlineError = clientError ?? (taken ? "That username is already taken." : null);
  const valid = trimmed.length >= 3 && !clientError;

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const { token, user } = await completeSignup(trimmed, onboardingToken);
      setAuth(token, user);
      sessionStorage.removeItem(STORAGE_KEYS.onboardingToken);
      toast.success(`Welcome, ${user.user_id}`);
      navigate("/", { replace: true });
    } catch (err) {
      if (isConflict(err)) {
        setTakenValue(trimmed);
      } else {
        toast.error(err instanceof Error ? err.message : "Signup failed — try again.");
      }
      setSubmitting(false);
    }
  };

  return (
    <Container size="sm" className="py-12">
      <div className="border-border bg-card mx-auto w-full max-w-[480px] rounded-xl border p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Pick your username</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          This is how the crowd will know you. Choose wisely — it can't be changed.
        </p>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <span
              className={cn(
                "text-xs",
                trimmed.length > 30 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {trimmed.length}/30
            </span>
          </div>

          <div
            className={cn(
              "flex items-center rounded-lg border",
              inlineError ? "border-destructive" : "border-border",
              "focus-within:ring-ring focus-within:ring-2",
            )}
          >
            <span className="text-muted-foreground border-border select-none border-r px-3 py-2 text-sm font-medium">
              u/
            </span>
            <input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="punchline_pro"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              maxLength={50}
              disabled={submitting}
              className="text-foreground placeholder:text-muted-foreground h-9 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />
          </div>
          {inlineError && <p className="text-destructive mt-1.5 text-xs">{inlineError}</p>}

          <Button type="submit" className="mt-6 h-10 w-full" disabled={!valid || submitting}>
            {submitting ? <Spinner /> : null}
            Continue
          </Button>
        </form>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          3–30 characters · letters, numbers, _ and -
        </p>
      </div>
    </Container>
  );
}