import { useNavigate } from "react-router-dom";

import { useGuestToken } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const { guestId, actions } = useAuthStore();
  const { mutate, isPending } = useGuestToken();

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/google`;
  };

  const loginAsGuest = () => {
    mutate(guestId, {
      onSuccess: (data) => {
        actions.setAccessToken(data.accessToken);
        actions.setGuestId(data.guestId);
        void navigate("/");
      },
    });
  };

  const goBack = () => navigate("/");

  return {
    loginWithGoogle,
    loginAsGuest,
    goBack,
    isGuestLoading: isPending,
  };
};
