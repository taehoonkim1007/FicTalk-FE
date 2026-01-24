import { useNavigate } from "react-router-dom";

import { useLogout as useLogoutMutation } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const { actions } = useAuthStore();
  const { mutate, isPending } = useLogoutMutation();

  const logout = () => {
    mutate(undefined, {
      onSuccess: () => {
        actions.clearAuth();
        void navigate("/");
      },
      onError: () => {
        // API 실패해도 로컬 상태는 초기화
        actions.clearAuth();
        void navigate("/");
      },
    });
  };

  return {
    logout,
    isLoggingOut: isPending,
  };
};
