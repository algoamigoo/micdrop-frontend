import { Link } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";

export default function SignupPage() {
  return (
    <AuthCard
      title="Join the crowd."
      tagline="Pick a username, drop setups, rack up upvotes."
      googleLabel="Continue with Google"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign in →
          </Link>
        </>
      }
    />
  );
}