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
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-lg border px-6 py-14 text-center">
      <AlertTriangle className="text-destructive mb-3 size-8" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
