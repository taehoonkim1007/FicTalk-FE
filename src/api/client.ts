import axios, { type AxiosError } from "axios";

import { useAuthStore } from "@/stores/useAuthStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    throw error;
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // 인증 실패: 로그아웃 처리 및 로그인 페이지로 리다이렉트
          useAuthStore.getState().actions.clearAuth();
          window.location.href = "/login";
          break;
        case 403:
          // 권한 없음: 접근 거부 알림 (추후 Toast 등으로 교체 권장)
          console.error("접근 권한이 없습니다.");
          break;
        case 404:
          // 리소스 없음 (추후 Toast 등으로 교체 권장)
          console.error("요청한 리소스를 찾을 수 없습니다.");
          break;
        case 500:
          // 서버 내부 오류 (추후 Toast 등으로 교체 권장)
          console.error("서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          break;
        default:
          console.error(`알 수 없는 오류가 발생했습니다. (Status: ${status})`);
      }
    } else {
      // 네트워크 에러 등 응답이 없는 경우
      console.error("네트워크 오류 또는 서버 응답이 없습니다.");
    }
    throw error;
  },
);
