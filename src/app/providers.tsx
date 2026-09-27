import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { IdentityProvider } from "@/features/identity/IdentityProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IdentityProvider>
        {children}
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          toastOptions={{ duration: 4000 }}
        />
      </IdentityProvider>
    </QueryClientProvider>
  );
}