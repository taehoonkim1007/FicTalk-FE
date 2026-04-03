import { Plus, Trash2, Users } from "lucide-react";

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
import { getParticle } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { isGuestUser } from "@/types/auth";
import type { ChatCharacter } from "@/types/chat";

interface ChatSidebarProps {
  characters: ChatCharacter[];
  selectedCharacterId: string | null;
  onSelectCharacter: (character: ChatCharacter) => void;
  onRemoveCharacter: (characterId: string) => void;
  onAddCharacter: () => void;
  isRemoving: boolean;
}

export const ChatSidebar = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  onRemoveCharacter,
  onAddCharacter,
  isRemoving,
}: ChatSidebarProps) => {
  // ==========================================
  // 외부 상태 (Store)
  // ==========================================
  const { user } = useAuthStore();

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const isGuest = user && isGuestUser(user);
  const maxCharacters = isGuest ? 1 : Infinity;
  const canAddCharacter = characters.length < maxCharacters;

  return (
    <aside className="flex h-full w-full flex-col border-l border-stone-800 bg-stone-900 md:w-[22rem]">
      {/* 헤더 */}
      <div className="flex h-16 items-center justify-between border-b border-stone-800 px-4 md:h-24">
        <div className="flex items-center gap-2" data-tour="chat-character-limit">
          <h2 className="font-bold text-white">대화 목록</h2>
          {isGuest && (
            <div className="flex items-center gap-1 rounded-full bg-stone-800 px-2 py-1 text-xs">
              <Users className="h-3 w-3 text-amber-500" />
              <span className="text-stone-400">
                <span className="text-amber-400">
                  {characters.length}/{maxCharacters}
                </span>
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onAddCharacter}
          disabled={!canAddCharacter}
          className="text-stone-400 hover:text-white disabled:opacity-50"
          title={canAddCharacter ? "대화 상대 추가" : "게스트는 캐릭터를 1개만 추가할 수 있습니다"}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* 캐릭터 목록 */}
      <div className="flex-1 overflow-y-auto p-2">
        {characters.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-stone-500">대화 상대가 없습니다</p>
            {isGuest && (
              <p className="text-xs text-stone-600">게스트는 1명의 캐릭터만 추가할 수 있습니다</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onAddCharacter}
              className="border-stone-700 text-stone-300"
            >
              <Plus className="mr-1 h-4 w-4" />
              대화 상대 추가
            </Button>
          </div>
        ) : (
          <ul className="space-y-1">
            {characters.map((character, index) => (
              <li key={character.id} {...(index === 0 && { "data-tour": "chat-character-card" })}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCharacter(character)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectCharacter(character);
                    }
                  }}
                  className={`group relative flex h-36 w-full cursor-pointer items-center gap-4 overflow-hidden rounded-lg p-4 text-left transition-colors ${
                    selectedCharacterId === character.id
                      ? "bg-stone-800 ring-2 ring-emerald-500"
                      : "hover:bg-stone-800/50"
                  }`}
                  style={
                    character.backgroundImage
                      ? {
                          backgroundImage: `url(${getImageUrl(character.backgroundImage)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  {/* 배경 오버레이 (가독성) */}
                  {character.backgroundImage && (
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
                  )}

                  {/* 아바타 */}
                  <Avatar className="relative z-10 h-20 w-20 shrink-0">
                    {character.profileImage && (
                      <AvatarImage src={getImageUrl(character.profileImage)} alt={character.name} />
                    )}
                    <AvatarFallback
                      className={`${character.imageColor} text-2xl font-bold text-white`}
                    >
                      {character.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* 캐릭터 정보 */}
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="truncate text-lg font-medium text-white">{character.name}</p>
                    <p className="truncate text-sm text-stone-400">{character.story.title}</p>
                  </div>

                  {/* 제거 버튼 (우측 중앙) */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isRemoving}
                        className="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-stone-700 text-stone-400 hover:bg-red-500 hover:text-white [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex"
                        title="대화 상대 제거"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>대화 상대 제거</AlertDialogTitle>
                        <AlertDialogDescription>
                          {character.name}
                          {getParticle(character.name)}의 대화 기록이 삭제됩니다. 진행하시겠습니까?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={() => onRemoveCharacter(character.id)}
                          className="bg-red-600 hover:bg-red-500"
                        >
                          삭제
                        </AlertDialogAction>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
