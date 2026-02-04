import { useRef } from "react";

import { ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { getImageUrl } from "@/lib/image";
import { useGenerateBackgroundImage, useGenerateCoverImage } from "@/queries/useStoriesQueries";

interface ImageSectionProps {
  coverImage: string | null;
  onCoverImageChange: (image: string | null) => void;
  backgroundImage: string | null;
  onBackgroundImageChange: (image: string | null) => void;
  title: string;
  description: string;
  summary: string;
}

export const ImageSection = ({
  coverImage,
  onCoverImageChange,
  backgroundImage,
  onBackgroundImageChange,
  title,
  description,
  summary,
}: ImageSectionProps) => {
  // ==========================================
  // Refs
  // ==========================================
  const coverInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { mutate: generateCover, isPending: isGeneratingCover } = useGenerateCoverImage();
  const { mutate: generateBackground, isPending: isGeneratingBackground } =
    useGenerateBackgroundImage();

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const canGenerateImages = !!(title.trim() && description.trim() && summary.trim());

  // ==========================================
  // 핸들러
  // ==========================================
  // 파일 선택
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (image: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // AI 커버 이미지 생성
  const handleGenerateCover = () => {
    if (!title.trim() || !description.trim() || !summary.trim()) {
      toast.error(ERROR_MESSAGES.STORY_FIELDS_REQUIRED);
      return;
    }
    generateCover(
      { title, description, summary },
      {
        onSuccess: (data) => {
          onCoverImageChange(`data:image/png;base64,${data.imageBase64}`);
          toast.success(SUCCESS_MESSAGES.COVER_IMAGE_GENERATED);
        },
        onError: () => {
          toast.error(ERROR_MESSAGES.COVER_IMAGE_FAILED);
        },
      },
    );
  };

  // AI 배경 이미지 생성
  const handleGenerateBackground = () => {
    if (!title.trim() || !description.trim() || !summary.trim()) {
      toast.error(ERROR_MESSAGES.STORY_FIELDS_REQUIRED);
      return;
    }
    generateBackground(
      { title, description, summary },
      {
        onSuccess: (data) => {
          onBackgroundImageChange(`data:image/png;base64,${data.imageBase64}`);
          toast.success(SUCCESS_MESSAGES.BACKGROUND_IMAGE_GENERATED);
        },
        onError: () => {
          toast.error(ERROR_MESSAGES.BACKGROUND_IMAGE_FAILED);
        },
      },
    );
  };

  return (
    <div>
      {/* 커버 이미지 섹션 */}
      <div className="mb-4 flex items-center gap-2 text-stone-400">
        <ImageIcon className="h-4 w-4" />
        <span className="text-sm font-medium">커버 이미지 (900 x 1600, 2:3 비율)</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* 이미지 미리보기 */}
        <div className="relative w-fit">
          <div className="flex h-[300px] w-[200px] items-center justify-center overflow-hidden rounded-lg border border-stone-700 bg-stone-800">
            {isGeneratingCover ? (
              <div className="flex flex-col items-center gap-2 text-stone-400">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xs">생성 중...</span>
              </div>
            ) : coverImage ? (
              <img
                src={getImageUrl(coverImage) || ""}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-stone-500">
                <ImageIcon className="h-10 w-10" />
                <span className="text-xs">미리보기</span>
              </div>
            )}
          </div>
          {/* 제거 버튼 */}
          {coverImage && !isGeneratingCover && (
            <button
              type="button"
              onClick={() => onCoverImageChange(null)}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, onCoverImageChange)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => coverInputRef.current?.click()}
            disabled={isGeneratingCover}
            className="w-28 border-stone-700 bg-white text-black hover:bg-stone-100"
          >
            <Upload className="mr-1 h-4 w-4" />
            파일 업로드
          </Button>
          <Button
            type="button"
            onClick={handleGenerateCover}
            disabled={!canGenerateImages || isGeneratingCover}
            className="w-24 bg-emerald-600 text-white hover:bg-emerald-500"
          >
            {isGeneratingCover ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1 h-4 w-4" />
            )}
            AI 생성
          </Button>
        </div>
      </div>

      {/* 배경 이미지 섹션 */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2 text-stone-400">
          <ImageIcon className="h-4 w-4" />
          <span className="text-sm font-medium">배경 이미지 (1920 x 1080, 16:9 비율)</span>
        </div>

        <div className="flex flex-col gap-3">
          {/* 이미지 미리보기 */}
          <div className="relative w-fit">
            <div className="flex h-[338px] w-[600px] items-center justify-center overflow-hidden rounded-lg border border-stone-700 bg-stone-800">
              {isGeneratingBackground ? (
                <div className="flex flex-col items-center gap-2 text-stone-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-xs">생성 중...</span>
                </div>
              ) : backgroundImage ? (
                <img
                  src={getImageUrl(backgroundImage) || ""}
                  alt="Background"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-500">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-xs">미리보기</span>
                </div>
              )}
            </div>
            {/* 제거 버튼 */}
            {backgroundImage && !isGeneratingBackground && (
              <button
                type="button"
                onClick={() => onBackgroundImageChange(null)}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, onBackgroundImageChange)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => backgroundInputRef.current?.click()}
              disabled={isGeneratingBackground}
              className="w-28 border-stone-700 bg-white text-black hover:bg-stone-100"
            >
              <Upload className="mr-1 h-4 w-4" />
              파일 업로드
            </Button>
            <Button
              type="button"
              onClick={handleGenerateBackground}
              disabled={!canGenerateImages || isGeneratingBackground}
              className="w-24 bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {isGeneratingBackground ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-4 w-4" />
              )}
              AI 생성
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
