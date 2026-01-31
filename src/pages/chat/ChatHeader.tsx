import { ArrowLeft, RotateCcw } from "lucide-react";

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
import type { ChatCharacter } from "@/types/chat";

interface ChatHeaderProps {
  character: ChatCharacter;
  onBack: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const ChatHeader = ({ character, onBack, onReset, isResetting }: ChatHeaderProps) => {
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
