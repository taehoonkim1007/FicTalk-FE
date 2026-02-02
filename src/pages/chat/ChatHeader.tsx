import { ArrowLeft, Keyboard, RotateCcw, Volume2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { ChatCharacter } from "@/types/chat";

export type ChatMode = "text" | "voice";

interface ChatHeaderProps {
  character: ChatCharacter;
  chatMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onBack: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const ChatHeader = ({
  character,
  chatMode,
  onModeChange,
  onBack,
  onReset,
  isResetting,
}: ChatHeaderProps) => {
  const hasVoice = !!character.voiceId;

  return (
    <header className="flex h-24 items-center gap-4 border-b border-stone-800 bg-stone-900 px-4">
      {/* 뒤로가기 */}
      <Button variant="ghost" size="icon" onClick={onBack} className="text-stone-400">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* 캐릭터 아바타 */}
      <Avatar className="h-16 w-16">
        {character.profileImage && (
          <AvatarImage src={getImageUrl(character.profileImage) || ""} alt={character.name} />
        )}
        <AvatarFallback className={`${character.imageColor} text-2xl font-bold text-white`}>
          {character.name[0]}
        </AvatarFallback>
      </Avatar>

      {/* 캐릭터 정보 */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-bold text-white">{character.name}</h1>
        <p className="truncate text-xs text-stone-400">
          {character.role} · {character.story.title}
        </p>
      </div>

      {/* Text/Voice 모드 토글 버튼 */}
      {chatMode === "text" ? (
        // Text → Voice 전환 시 AlertDialog로 요금 안내
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={!hasVoice}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-300",
                hasVoice
                  ? "border-stone-700 bg-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-300"
                  : "cursor-not-allowed border-stone-800 bg-stone-900 text-stone-600 opacity-50",
              )}
              title={!hasVoice ? "이 캐릭터는 음성이 설정되지 않았습니다" : "음성 모드로 전환"}
            >
              <Keyboard className="h-3.5 w-3.5" />
              <span className="tracking-wider uppercase">Text</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Voice Mode 전환</AlertDialogTitle>
              <AlertDialogDescription>
                Voice Mode 변경 시 추가 요금이 발생합니다. 진행하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => onModeChange("voice")}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                확인
              </AlertDialogAction>
              <AlertDialogCancel>취소</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        // Voice → Text 전환은 바로 실행
        <button
          onClick={() => onModeChange("text")}
          className="flex items-center gap-2 rounded-full border border-violet-500 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 hover:bg-violet-500/20"
          title="텍스트 모드로 전환"
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span className="tracking-wider uppercase">Voice</span>
        </button>
      )}

      {/* 대화 초기화 버튼 */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isResetting}
            className="text-stone-400 hover:text-white"
            title="대화 초기화"
          >
            <RotateCcw className={`h-5 w-5 ${isResetting ? "animate-spin" : ""}`} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>대화 초기화</AlertDialogTitle>
            <AlertDialogDescription>
              현재 캐릭터와의 대화가 초기화됩니다. 진행하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onReset} className="bg-emerald-600 hover:bg-emerald-500">
              확인
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};
