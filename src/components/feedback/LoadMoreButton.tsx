import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function LoadMoreButton({
  onClick,
  loading,
  hasMore,
}: {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
}) {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center pt-4">
      <Button variant="outline" onClick={onClick} disabled={loading}>
        {loading ? <Spinner /> : null}
        Load more
      </Button>
    </div>
  );
}