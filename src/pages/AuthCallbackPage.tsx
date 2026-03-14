import { Loader2 } from "lucide-react";

import { useAuthCallback } from "@/hooks/useAuthCallback";

export const AuthCallbackPage = () => {
  // ==========================================
  // 커스텀 훅 (로직 분리)
  // ==========================================
  const { isError, errorMessage } = useAuthCallback();

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] text-white">
        <p className="mb-4 text-red-400">로그인 처리 중 오류가 발생했습니다.</p>
        <p className="text-sm text-stone-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] text-white">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-stone-400">로그인 처리 중...</p>
    </div>
  );
};
