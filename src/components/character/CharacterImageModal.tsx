import { useState } from "react";

import { ImageIcon, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { useGenerateProfileImage } from "@/queries/useStoriesQueries";

interface CharacterImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: {
    name: string;
    role: string;
    description: string;
    personality: string | null;
  };
  onConfirm: (imageBase64: string) => void | Promise<void>;
}

export const CharacterImageModal = ({
  isOpen,
  onClose,
  character,
  onConfirm,
}: CharacterImageModalProps) => {
  // 편집 가능한 캐릭터 정보 상태
  const [editedCharacter, setEditedCharacter] = useState({
    description: character.description,
    personality: character.personality || "",
  });

  // 생성된 이미지 상태
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // AI 이미지 생성 mutation
  const { mutate: generateImage, isPending: isGenerating } = useGenerateProfileImage();

  // 모달이 열릴 때 캐릭터 정보 초기화
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditedCharacter({
        description: character.description,
        personality: character.personality || "",
      });
      setGeneratedImage(null);
    } else {
      onClose();
    }
  };

  // AI 이미지 생성
  const handleGenerate = () => {
    if (!editedCharacter.description.trim()) {
      toast.error(ERROR_MESSAGES.CHARACTER_DESCRIPTION_REQUIRED);
      return;
    }
    if (!editedCharacter.personality.trim()) {
      toast.error(ERROR_MESSAGES.CHARACTER_PERSONALITY_REQUIRED);
      return;
    }

    generateImage(
      {
        description: editedCharacter.description,
        personality: editedCharacter.personality,
      },
      {
        onSuccess: (data) => {
          setGeneratedImage(data.imageBase64);
          toast.success(SUCCESS_MESSAGES.IMAGE_GENERATED);
        },
        onError: () => {
          toast.error(ERROR_MESSAGES.IMAGE_GENERATE_FAILED);
        },
      },
    );
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    if (generatedImage) {
      void onConfirm(generatedImage);
      onClose();
    }
  };

  // 재시도 버튼 클릭
  const handleRetry = () => {
    setGeneratedImage(null);
    handleGenerate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>캐릭터 이미지 생성</DialogTitle>
          <DialogDescription>
            캐릭터 정보를 확인하고 AI로 프로필 이미지를 생성하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* 이미지 박스 (400x400) */}
          <div className="flex items-center justify-center">
            <div className="flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-lg border border-stone-700 bg-stone-800 sm:h-[280px] sm:w-[280px]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2 text-stone-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm">이미지 생성 중...</span>
                </div>
              ) : generatedImage ? (
                <img
                  src={`data:image/png;base64,${generatedImage}`}
                  alt="Generated character"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-500">
                  <ImageIcon className="h-12 w-12" />
                  <span className="text-sm">이미지가 생성되면 여기에 표시됩니다</span>
                </div>
              )}
            </div>
          </div>

          {/* 캐릭터 정보 입력 필드 */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="char-description" className="mb-1.5 block text-xs text-stone-400">
                캐릭터 설명
              </Label>
              <Textarea
                id="char-description"
                value={editedCharacter.description}
                onChange={(e) =>
                  setEditedCharacter({ ...editedCharacter, description: e.target.value })
                }
                placeholder="캐릭터에 대한 설명을 입력하세요"
                maxLength={1000}
                rows={3}
                className="min-h-0 bg-stone-800 px-3 py-2 text-sm ring-stone-700"
              />
            </div>
            <div>
              <Label htmlFor="char-personality" className="mb-1.5 block text-xs text-stone-400">
                캐릭터 성격
              </Label>
              <Textarea
                id="char-personality"
                value={editedCharacter.personality}
                onChange={(e) =>
                  setEditedCharacter({ ...editedCharacter, personality: e.target.value })
                }
                placeholder="캐릭터의 성격 특성을 입력하세요"
                maxLength={500}
                rows={3}
                className="min-h-0 bg-stone-800 px-3 py-2 text-sm ring-stone-700"
              />
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-3 pt-4">
          {generatedImage ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleRetry}
                disabled={isGenerating}
                className="border-stone-700 bg-transparent text-stone-300 hover:bg-stone-800 hover:text-white"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                재시도
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                확인
              </Button>
            </>
          ) : (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={
                          isGenerating ||
                          !editedCharacter.description.trim() ||
                          !editedCharacter.personality.trim()
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        {isGenerating ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-1 h-4 w-4" />
                        )}
                        AI 생성
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!isGenerating &&
                    (!editedCharacter.description.trim() ||
                      !editedCharacter.personality.trim()) && (
                      <TooltipContent side="bottom">
                        <p className="mb-2.5 text-stone-200">
                          ✨ 설명, 성격을 입력하시면 사용할 수 있어요
                        </p>
                        <ul className="space-y-1.5">
                          <li
                            className={
                              editedCharacter.description.trim()
                                ? "text-emerald-400"
                                : "text-red-400"
                            }
                          >
                            {editedCharacter.description.trim() ? "✓" : "✗"} 설명
                          </li>
                          <li
                            className={
                              editedCharacter.personality.trim()
                                ? "text-emerald-400"
                                : "text-red-400"
                            }
                          >
                            {editedCharacter.personality.trim() ? "✓" : "✗"} 성격
                          </li>
                        </ul>
                      </TooltipContent>
                    )}
                </Tooltip>
              </TooltipProvider>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
                className="bg-white text-black hover:bg-stone-100"
              >
                취소
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
