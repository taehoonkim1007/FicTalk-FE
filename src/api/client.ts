import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { ERROR_MESSAGES } from "@/constants/messages";
import { useAuthStore } from "@/stores/useAuthStore";
import type { RefreshTokenResponse } from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ==========================================
// API Clients
// ==========================================

/** 메인 API 클라이언트 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // AI 생성 작업을 위해 3분으로 설정
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/** 토큰 갱신 전용 클라이언트 (interceptor 없음) */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// 토큰 갱신 상태 관리
// ==========================================

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// ==========================================
// Request Interceptor
// ==========================================

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ==========================================
// Response Interceptor
// ==========================================

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러 처리
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshClient.post<RefreshTokenResponse>("/auth/refresh");
        const { accessToken } = data;

        useAuthStore.getState().actions.setAccessToken(accessToken);
        onRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        // refresh 실패 시 인증 정보만 클리어 (리다이렉트 안함)
        // 게스트의 경우 refresh token이 없어서 실패할 수 있음
        useAuthStore.getState().actions.clearAuth();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // 의도적으로 취소된 요청은 토스트 표시하지 않음
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      const errorCode = (data as { code?: string })?.code;

      switch (status) {
        case 403:
          // 게스트 관련 에러 처리
          if (errorCode === "GUEST_NOT_ALLOWED") {
            toast.error(ERROR_MESSAGES.GUEST_USAGE_LIMIT);
          } else if (errorCode === "GUEST_CHARACTER_LIMIT") {
            toast.error(ERROR_MESSAGES.GUEST_CHARACTER_LIMIT);
          } else {
            toast.error(ERROR_MESSAGES.FORBIDDEN);
          }
          break;
        case 404:
          toast.error(ERROR_MESSAGES.NOT_FOUND);
          break;
        case 500:
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
          break;
      }
    } else {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    return Promise.reject(error);
  },
);
