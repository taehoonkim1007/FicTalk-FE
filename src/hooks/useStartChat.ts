import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { ERROR_MESSAGES } from "@/constants/messages";
import { useGuestToken } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export interface ChatNavigateState {
  storyId: string;
  storyTitle: string;
  characterId: string;
  characterName: string;
  firstMessage: string | null;
}

export const useStartChat = () => {
  // ==========================================
  // Refs
  // ==========================================
  const isCreatingGuest = useRef(false);

  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const { accessToken, guestId, actions } = useAuthStore();
  const guestTokenMutation = useGuestToken();

  // ==========================================
  // 핸들러
  // ==========================================
  // 채팅 시작 (게스트 토큰 발급 후 이동)
  const startChat = async (state: ChatNavigateState) => {
    // 인증되지 않은 경우 게스트 토큰 발급
    if (!accessToken && !isCreatingGuest.current) {
      isCreatingGuest.current = true;
      try {
        const data = await guestTokenMutation.mutateAsync(guestId);
        actions.setAccessToken(data.accessToken);
        actions.setGuestId(data.guestId);
        actions.setUser({
          id: data.guestId,
          role: "guest",
          usageCount: data.usageCount,
          maxUsage: data.maxUsage,
        });
      } catch {
        isCreatingGuest.current = false;
        toast.error(ERROR_MESSAGES.GUEST_SESSION_FAILED);
        return;
      }
    }

    void navigate("/chat", { state });
  };

  return {
    startChat,
    isPending: guestTokenMutation.isPending,
  };
};
