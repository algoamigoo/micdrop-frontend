import { useNavigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { PromptForm } from "@/components/prompt/PromptForm";
import { useCreatePrompt } from "@/features/prompts/mutations";
import { useIdentity } from "@/features/identity/useIdentity";

export default function NewPromptPage() {
  const navigate = useNavigate();
  const { userId } = useIdentity();
  const createPrompt = useCreatePrompt();

  return (
    <Container size="sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New prompt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the stage. Keep it punchy — 280 characters max.
        </p>
      </div>

      <PromptForm
        submitting={createPrompt.isPending}
        onCancel={() => navigate(-1)}
        onSubmit={(body) => {
          createPrompt.mutate(
            { user_id: userId, body },
            {
              onSuccess: (created) => {
                navigate(`/p/${created.post_id}`);
              },
            },
          );
        }}
      />
    </Container>
  );
}