import { useEffect } from "react";

import { useCurrentUser } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * 앱 시작 시 사용자 정보를 로드하는 컴포넌트
 * - accessToken이 있으면 /auth/me 호출
 * - 토큰 만료 시 interceptor가 자동 갱신
 */
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { accessToken, actions } = useAuthStore();
  const { data: user, isError } = useCurrentUser(!!accessToken);

  useEffect(() => {
    if (user) {
      actions.setUser(user);
    }
  }, [user, actions]);

  useEffect(() => {
    if (isError) {
      actions.clearAuth();
    }
  }, [isError, actions]);

  return <>{children}</>;
};
