import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useExchangeCode } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthCallback = () => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
        void navigate("/", { replace: true });
      },
      onError: () => {
        void navigate("/login", { replace: true });
      },
    });
  }, [code, mutate, actions, navigate]);

  return {
    isLoading: isPending,
    isError,
    errorMessage: error?.message,
  };
};
