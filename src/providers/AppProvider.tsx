import { Toaster } from "@/components/ui/sonner";

import { AuthInitializer } from "./AuthInitializer";
import { QueryProvider } from "./QueryProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryProvider>
      <AuthInitializer>{children}</AuthInitializer>
      <Toaster />
    </QueryProvider>
  );
};
