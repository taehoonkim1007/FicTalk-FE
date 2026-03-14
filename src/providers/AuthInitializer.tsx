import { useEffect } from "react";

import { useCurrentUser } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * 앱 시작 시 사용자 정보를 로드하는 컴포넌트
 * - accessToken이 있으면 /auth/me 호출하여 사용자 정보 로드
 * - 게스트 토큰은 채팅 진입 시 발급됨 (ChatPage)
 */
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { accessToken, actions } = useAuthStore();
  const { data: user } = useCurrentUser(!!accessToken);

  useEffect(() => {
    if (user) {
      actions.setUser(user);
    }
  }, [user, actions]);

  return <>{children}</>;
};
