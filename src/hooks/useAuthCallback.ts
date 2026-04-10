import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { authKeys, useExchangeCode } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthCallback = () => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { actions } = useAuthStore();
  const { mutate, isPending, isError, error } = useExchangeCode();

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const code = searchParams.get("code");

  // ==========================================
  // Effects
  // ==========================================
  // OAuth 코드 교환
  useEffect(() => {
    if (!code) {
      void navigate("/login", { replace: true });
      return;
    }

    mutate(code, {
      onSuccess: (data) => {
        // 게스트 상태 초기화하고 새 토큰으로 로그인
        actions.loginWithToken(data.accessToken);
        // 이전 게스트 유저 캐시 제거 → AuthInitializer가 새 토큰으로 재조회
        queryClient.removeQueries({ queryKey: authKeys.currentUser() });
        void navigate("/", { replace: true });
      },
      onError: () => {
        void navigate("/login", { replace: true });
      },
    });
  }, [code, mutate, actions, queryClient, navigate]);

  return {
    isLoading: isPending,
    isError,
    errorMessage: error?.message,
  };
};
