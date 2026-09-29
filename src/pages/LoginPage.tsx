import { Link } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      tagline="Setups. Punchlines. Upvotes."
      googleLabel="Continue with Google"
      footer={
        <>
          New here?{" "}
          <Link
            to="/signup"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign up →
          </Link>
        </>
      }
    />
  );
}