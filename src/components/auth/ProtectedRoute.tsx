import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCurrentUser } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import { isGuestUser } from "@/types/auth";

interface ProtectedRouteProps {
  guestAllowed?: boolean;
}

export const ProtectedRoute = ({ guestAllowed = true }: ProtectedRouteProps) => {
  const { accessToken, user, _hasHydrated } = useAuthStore();
  const location = useLocation();
  const { isLoading, data: fetchedUser } = useCurrentUser(!!accessToken);

  // Zustand이 localStorage에서 복원 중이면 대기
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  // accessToken이 있고 사용자 정보 로딩 중이면 대기
  if (accessToken && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const currentUser = user || fetchedUser;

  // 인증되지 않았으면 로그인 페이지로
  if (!accessToken && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 게스트 허용하지 않는 라우트에서 게스트면 로그인 페이지로
  if (!guestAllowed && currentUser && isGuestUser(currentUser)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
