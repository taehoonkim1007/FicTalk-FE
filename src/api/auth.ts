import type {
  CurrentUser,
  ExchangeCodeResponse,
  GuestTokenRequest,
  GuestTokenResponse,
  LogoutResponse,
} from "@/types/auth";

import { apiClient } from "./client";

/**
 * OAuth code를 accessToken으로 교환
 * refreshToken은 httpOnly 쿠키로 자동 저장됨
 */
export const exchangeCode = async (code: string): Promise<ExchangeCodeResponse> => {
  const response = await apiClient.post<ExchangeCodeResponse>("/auth/exchange", { code });
  return response.data;
};

/**
 * 현재 로그인된 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await apiClient.get<CurrentUser>("/auth/me");
  return response.data;
};

/**
 * 게스트 토큰 발급 또는 갱신
 */
export const createGuestToken = async (guestId?: string): Promise<GuestTokenResponse> => {
  const body: GuestTokenRequest = guestId ? { guestId } : {};
  const response = await apiClient.post<GuestTokenResponse>("/auth/guest", body);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
  return response.data;
};
