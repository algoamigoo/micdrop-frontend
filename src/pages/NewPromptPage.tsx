import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";
import { PromptForm } from "@/components/prompt/PromptForm";
import { useCreatePrompt } from "@/features/prompts/mutations";
import { useAuth } from "@/features/auth/useAuth";

export default function NewPromptPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const createPrompt = useCreatePrompt();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Sign in to create a prompt", {
        action: { label: "Sign in", onClick: login },
      });
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, login, navigate]);

  if (!user) return null;

  return (
    <Container size="sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New prompt</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Set the stage. Keep it punchy — 280 characters max.
        </p>
      </div>

      <PromptForm
        submitting={createPrompt.isPending}
        onCancel={() => navigate(-1)}
        onSubmit={(body) => {
          createPrompt.mutate(
            { body },
            { onSuccess: (created) => navigate(`/p/${created.post_id}`) },
          );
        }}
      />
    </Container>
  );
}
