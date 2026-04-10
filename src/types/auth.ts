// ==========================================
// Entity
// ==========================================

/** 게스트 사용자 */
export interface GuestUser {
  id: string;
  role: "guest";
  usageCount: number;
  maxUsage: number;
}

/** 인증된 사용자 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  profileImage: string | null;
  role: "user";
}

/** 현재 사용자 (Guest | User) */
export type CurrentUser = GuestUser | AuthenticatedUser;

// ==========================================
// API Request DTOs
// ==========================================

export interface ExchangeCodeRequest {
  code: string;
}

export interface GuestTokenRequest {
  guestId?: string;
}

// ==========================================
// API Response DTOs
// ==========================================

export interface ExchangeCodeResponse {
  accessToken: string;
}

export interface GuestTokenResponse {
  accessToken: string;
  guestId: string;
  usageCount: number;
  maxUsage: number;
}

export interface LogoutResponse {
  message: string;
}

export interface DeleteAccountResponse {
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// ==========================================
// Common
// ==========================================

export const isGuestUser = (user: CurrentUser): user is GuestUser => {
  return user.role === "guest";
};

export const isAuthenticatedUser = (user: CurrentUser): user is AuthenticatedUser => {
  return user.role === "user";
};
