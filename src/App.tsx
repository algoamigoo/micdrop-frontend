import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Providers } from "./app/providers";
import { AppShell } from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import PromptDetailPage from "./pages/PromptDetailPage";
import { FollowListPage } from "./components/profile/FollowListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingUsernamePage from "./pages/OnboardingUsernamePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Providers>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/p/:postId" element={<PromptDetailPage />} />
            <Route path="/u/:username" element={<ProfilePage />} />
            <Route path="/u/:username/followers" element={<FollowListPage kind="followers" />} />
            <Route path="/u/:username/following" element={<FollowListPage kind="following" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding/username" element={<OnboardingUsernamePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </Providers>
  );
}
