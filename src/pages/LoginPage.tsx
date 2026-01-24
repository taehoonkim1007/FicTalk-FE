import { Info, Loader2, User as UserIcon, X } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { useLogin } from "@/hooks/useLogin";

export const LoginPage = () => {
  const { loginWithGoogle, loginAsGuest, goBack, isGuestLoading } = useLogin();

  return (
    <div className="animate-in fade-in relative flex min-h-screen items-center justify-center overflow-hidden bg-[#121212] p-4 duration-300">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-900/20 opacity-50 mix-blend-screen blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-indigo-900/10 opacity-50 mix-blend-screen blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center rounded-[32px] border border-stone-800/60 bg-[#1E1E1E] p-8 text-center shadow-2xl">
        <button
          onClick={() => void goBack()}
          className="absolute top-5 right-5 rounded-full p-2 text-stone-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mt-4 mb-8 flex flex-col items-center">
          <Logo className="mb-4" size="lg" />

          <h2 className="mb-3 font-serif text-2xl leading-tight font-bold tracking-tight text-white">
            이야기의 마침표,
            <br />
            <span className="text-emerald-500">새로운 대화의 시작</span>
          </h2>

          <p className="max-w-[260px] text-sm leading-relaxed text-stone-400">
            책을 덮은 뒤 찾아오는 여운을
            <br />
            FicTalk에서 주인공과 함께 이어가세요.
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800" />
            </div>
            <div className="relative flex justify-center text-[11px] font-bold tracking-wider uppercase">
              <span className="bg-[#1E1E1E] px-3 text-stone-600">Log in with</span>
            </div>
          </div>

          <button
            onClick={loginWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-3.5 font-bold text-stone-900 shadow-lg transition-transform hover:bg-stone-200 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-[14px]">Google로 계속하기</span>
          </button>

          <div className="relative my-2 flex justify-center text-[11px] text-stone-600">
            <span>또는</span>
          </div>

          <button
            onClick={loginAsGuest}
            disabled={isGuestLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-700/50 bg-stone-800 py-3.5 font-bold text-stone-300 transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGuestLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UserIcon className="h-5 w-5" />
            )}
            <span className="text-[14px]">
              {isGuestLoading ? "로그인 중..." : "게스트로 계속하기"}
            </span>
          </button>
        </div>

        <div className="mt-6 w-full rounded-xl border border-stone-800 bg-stone-900/50 p-4 text-left">
          <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
            <Info className="h-3.5 w-3.5 text-emerald-600" /> 게스트 이용 안내
          </h4>
          <ul className="list-inside list-disc space-y-1.5 text-[10px] leading-normal text-stone-500">
            <li>게스트 계정은 대화 내용이 현재 기기에만 저장됩니다.</li>
            <li>브라우저 쿠키 삭제 시 데이터가 유실될 수 있습니다.</li>
            <li>계정 연동을 통해 언제든지 데이터를 안전하게 보관하세요.</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] leading-relaxed text-stone-600">
            계속 진행하면 FicTalk의{" "}
            <button className="underline transition-colors hover:text-stone-400">이용약관</button>{" "}
            및 <br />
            <button className="underline transition-colors hover:text-stone-400">
              개인정보처리방침
            </button>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
