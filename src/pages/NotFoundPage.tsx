import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <Container size="sm" className="py-20 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-muted-foreground mt-2 text-sm">We couldn't find that page.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to feed</Link>
      </Button>
    </Container>
  );
}
