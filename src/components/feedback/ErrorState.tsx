import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isApiError } from "@/api/errors";

export function ErrorState({
  error,
  onRetry,
  title = "Something went wrong",
}: {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}) {
  const message = isApiError(error) ? error.message : "Unexpected error. Try again.";

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-14 text-center">
      <AlertTriangle className="mb-3 size-8 text-destructive" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}