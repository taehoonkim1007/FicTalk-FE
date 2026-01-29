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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  onConfirm: (imageBase64: string) => void;
}

export const CharacterImageModal = ({
  isOpen,
  onClose,
  character,
  onConfirm,
}: CharacterImageModalProps) => {
  // 편집 가능한 캐릭터 정보 상태
  const [editedCharacter, setEditedCharacter] = useState({
    name: character.name,
    role: character.role,
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
        name: character.name,
        role: character.role,
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
    if (!editedCharacter.name.trim()) {
      toast.error("캐릭터 이름을 입력해주세요.");
      return;
    }
    if (!editedCharacter.role.trim()) {
      toast.error("캐릭터 역할을 입력해주세요.");
      return;
    }
    if (!editedCharacter.description.trim()) {
      toast.error("캐릭터 설명을 입력해주세요.");
      return;
    }
    if (!editedCharacter.personality.trim()) {
      toast.error("캐릭터 성격을 입력해주세요.");
      return;
    }

    generateImage(
      {
        name: editedCharacter.name,
        role: editedCharacter.role,
        description: editedCharacter.description,
        personality: editedCharacter.personality,
      },
      {
        onSuccess: (data) => {
          setGeneratedImage(data.imageBase64);
          toast.success("이미지가 생성되었습니다.");
        },
        onError: () => {
          toast.error("이미지 생성에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    if (generatedImage) {
      onConfirm(generatedImage);
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
              <Label htmlFor="char-name" className="mb-1 font-medium text-stone-300">
                이름
              </Label>
              <Input
                id="char-name"
                value={editedCharacter.name}
                onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
                placeholder="캐릭터 이름"
                maxLength={100}
                className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
              />
            </div>
            <div>
              <Label htmlFor="char-role" className="mb-1 font-medium text-stone-300">
                역할
              </Label>
              <Input
                id="char-role"
                value={editedCharacter.role}
                onChange={(e) => setEditedCharacter({ ...editedCharacter, role: e.target.value })}
                placeholder="주인공 또는 조연"
                maxLength={50}
                className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
              />
            </div>
            <div>
              <Label htmlFor="char-description" className="mb-1 font-medium text-stone-300">
                설명
              </Label>
              <Textarea
                id="char-description"
                value={editedCharacter.description}
                onChange={(e) =>
                  setEditedCharacter({ ...editedCharacter, description: e.target.value })
                }
                placeholder="캐릭터에 대한 설명"
                maxLength={1000}
                rows={3}
                className="min-h-0 bg-stone-800 px-3 py-2 text-sm ring-stone-700"
              />
            </div>
            <div>
              <Label htmlFor="char-personality" className="mb-1 font-medium text-stone-300">
                성격
              </Label>
              <Textarea
                id="char-personality"
                value={editedCharacter.personality}
                onChange={(e) =>
                  setEditedCharacter({ ...editedCharacter, personality: e.target.value })
                }
                placeholder="캐릭터의 성격 특성"
                maxLength={500}
                rows={2}
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
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {isGenerating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-4 w-4" />
              )}
              AI 생성
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
