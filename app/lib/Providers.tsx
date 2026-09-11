"use client";
import React from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { AuthProvider } from "./auth";
import { ToastHost } from "../components/feedback/ToastHost";
import { emitToast } from "./toastBus";

// Any query/mutation can opt out of the automatic error toast (e.g. a form
// that already renders its own inline field errors) via `meta: { silent: true }`.
function reportError(error: unknown, meta: unknown) {
  if ((meta as { silent?: boolean } | undefined)?.silent) return;
  const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
  emitToast(message, "danger");
}

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
  queryCache: new QueryCache({
    onError: (error, query) => reportError(error, query.meta),
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => reportError(error, mutation.meta),
  }),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        {children}
        <ToastHost />
      </AuthProvider>
    </QueryClientProvider>
  );
}
