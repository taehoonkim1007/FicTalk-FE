import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { SUCCESS_MESSAGES } from "@/constants/messages";
import { authKeys, useLogout as useLogoutMutation } from "@/queries/useAuthQueries";
import { chatKeys } from "@/queries/useChatQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useLogout = () => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actions } = useAuthStore();
  const { mutate, isPending } = useLogoutMutation();

  // ==========================================
  // 핸들러
  // ==========================================
  // 로그아웃
  const logout = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: chatKeys.all });
        queryClient.removeQueries({ queryKey: authKeys.currentUser() });
        actions.clearAuth();
        toast.success(SUCCESS_MESSAGES.LOGOUT);
        void navigate("/");
      },
      onError: () => {
        queryClient.removeQueries({ queryKey: chatKeys.all });
        queryClient.removeQueries({ queryKey: authKeys.currentUser() });
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
