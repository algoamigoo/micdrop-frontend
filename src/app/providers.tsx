import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Toaster } from "sonner";
import { getToken, subscribe } from "@/features/auth/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: true, retry: 1 },
    mutations: { retry: 0 },
  },
});

/**
 * viewer_vote comes from the server, so every cached list/detail is
 * identity-dependent. Refetch everything whenever the session changes
 * (login, logout, cross-tab sync, signup) to avoid showing another
 * user's votes — or an anonymous null — under the wrong identity.
 */
function AuthInvalidator() {
  const qc = useQueryClient();
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  const prev = useRef(token);
  useEffect(() => {
    if (prev.current !== token) {
      prev.current = token;
      void qc.invalidateQueries();
    }
  }, [token, qc]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInvalidator />
      {children}
      <Toaster richColors closeButton position="bottom-right" toastOptions={{ duration: 4000 }} />
    </QueryClientProvider>
  );
}
