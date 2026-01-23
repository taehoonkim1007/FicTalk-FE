import { QueryProvider } from "./QueryProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryProvider>
      {/* 추후 다른 Provider들 (ThemeProvider, GlobalModalProvider 등) 추가 위치 */}
      {children}
    </QueryProvider>
  );
};
