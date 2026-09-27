import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Providers } from "./app/providers";
import { AppShell } from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import PromptDetailPage from "./pages/PromptDetailPage";
import NewPromptPage from "./pages/NewPromptPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/p/:postId" element={<PromptDetailPage />} />
            <Route path="/new" element={<NewPromptPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </Providers>
  );
}