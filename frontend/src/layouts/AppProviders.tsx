import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { Toaster } from "@/shared/components/ui/toaster";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { queryClient } from "@/shared/lib/queryClient";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>{children}</AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
