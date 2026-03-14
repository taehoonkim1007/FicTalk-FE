import { useNavigate } from "react-router-dom";

import { useGuestToken } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useLogin = () => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const { guestId, actions } = useAuthStore();
  const { mutate, isPending } = useGuestToken();

  // ==========================================
  // 핸들러
  // ==========================================
  // Google 로그인
  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/google`;
  };

  // 게스트 로그인
  const loginAsGuest = () => {
    mutate(guestId, {
      onSuccess: (data) => {
        actions.setAccessToken(data.accessToken);
        actions.setGuestId(data.guestId);
        void navigate("/");
      },
    });
  };

  // 뒤로 가기
  const goBack = () => navigate("/");

  return {
    loginWithGoogle,
    loginAsGuest,
    goBack,
    isGuestLoading: isPending,
  };
};
