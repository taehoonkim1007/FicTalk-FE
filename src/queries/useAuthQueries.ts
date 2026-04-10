import { useMutation, useQuery } from "@tanstack/react-query";

import { createGuestToken, deleteAccount, exchangeCode, getCurrentUser, logout } from "@/api/auth";

// ==========================================
// Query Keys
// ==========================================

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * 현재 로그인된 사용자 정보 조회
 */
export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * OAuth code → accessToken 교환
 */
export const useExchangeCode = () => {
  return useMutation({
    mutationFn: (code: string) => exchangeCode(code),
  });
};

/**
 * 게스트 토큰 발급/갱신
 */
export const useGuestToken = () => {
  return useMutation({
    mutationFn: (guestId?: string) => createGuestToken(guestId),
  });
};

/**
 * 로그아웃
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

/**
 * 회원탈퇴
 */
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
