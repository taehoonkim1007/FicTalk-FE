import { useEffect, useMemo, useRef } from "react";

import { Loader2, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CharacterVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceName: string;
  audioBase64: string | null;
  onConfirm: () => void | Promise<void>;
  isConfirming?: boolean;
}

export const CharacterVoiceModal = ({
  isOpen,
  onClose,
  voiceName,
  audioBase64,
  onConfirm,
  isConfirming,
}: CharacterVoiceModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Base64를 Blob URL로 변환
  const audioUrl = useMemo(() => {
    if (!audioBase64) return null;
    try {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mpeg" });
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }, [audioBase64]);

  // 메모리 누수 방지: Blob URL 정리
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 모달이 닫힐 때 오디오 정지
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    void onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>음성 미리듣기</DialogTitle>
          <DialogDescription>
            AI가 추천한 음성을 미리 들어보세요. 마음에 들면 적용해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 음성 이름 표시 */}
          <div className="flex items-center gap-3 rounded-lg border border-stone-700 bg-stone-800 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600">
              <Volume2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-stone-400">추천 음성</p>
              <p className="font-medium text-white">{voiceName}</p>
            </div>
          </div>

          {/* 오디오 플레이어 */}
          {audioUrl ? (
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              className="w-full rounded-lg"
              style={{
                filter: "invert(1) hue-rotate(180deg)",
              }}
            />
          ) : (
            <div className="flex h-12 items-center justify-center rounded-lg bg-stone-800 text-stone-400">
              오디오를 불러올 수 없습니다
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isConfirming}
            className="border-stone-700 bg-transparent text-stone-300 hover:bg-stone-800 hover:text-white"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming || !audioUrl}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            {isConfirming ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              "적용"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
