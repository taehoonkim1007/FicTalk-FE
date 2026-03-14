import { useState } from "react";

import { Loader2, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/image";
import { useCharacters } from "@/queries/useCharactersQueries";
import type { CharacterWithStory } from "@/types/character";

interface CharacterSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (characterId: string) => void;
  isAdding: boolean;
  existingCharacterIds: string[];
}

export const CharacterSelectModal = ({
  open,
  onOpenChange,
  onSelect,
  isAdding,
  existingCharacterIds,
}: CharacterSelectModalProps) => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  const [search, setSearch] = useState("");

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data, isLoading } = useCharacters({ search, limit: 30 });

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const characters = data?.characters || [];
  // 이미 추가된 캐릭터 제외
  const availableCharacters = characters.filter((c) => !existingCharacterIds.includes(c.id));

  // ==========================================
  // 핸들러
  // ==========================================
  // 캐릭터 선택
  const handleSelect = (character: CharacterWithStory) => {
    onSelect(character.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>대화 상대 추가</DialogTitle>
          <DialogDescription>대화하고 싶은 캐릭터를 선택하세요</DialogDescription>
        </DialogHeader>

        {/* 검색 */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <Input
            placeholder="캐릭터 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 캐릭터 목록 */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : availableCharacters.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-stone-500">
                {search ? "검색 결과가 없습니다" : "추가할 수 있는 캐릭터가 없습니다"}
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {availableCharacters.map((character) => (
                <li key={character.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(character)}
                    disabled={isAdding}
                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-stone-800 disabled:opacity-50"
                  >
                    {/* 아바타 */}
                    <Avatar className="h-12 w-12 shrink-0">
                      {character.profileImage && (
                        <AvatarImage
                          src={getImageUrl(character.profileImage) || ""}
                          alt={character.name}
                        />
                      )}
                      <AvatarFallback className={`${character.imageColor} font-bold text-white`}>
                        {character.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* 캐릭터 정보 */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{character.name}</p>
                      <p className="truncate text-sm text-stone-400">{character.role}</p>
                      <p className="truncate text-xs text-stone-500">{character.story.title}</p>
                    </div>

                    {/* 로딩 표시 */}
                    {isAdding && <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
