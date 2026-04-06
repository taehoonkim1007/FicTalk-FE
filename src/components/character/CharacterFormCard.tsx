import { useRef } from "react";

import {
  Check,
  ImageIcon,
  Loader2,
  Mic,
  Pencil,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getImageUrl } from "@/lib/image";

// ============================================
// 타입 정의: Discriminated Union
// ============================================

/** 공통 데이터 props */
interface CharacterDataProps {
  name: string;
  role: string;
  description: string;
  personality: string | null;
  firstMessage: string | null;
  profileImage: string | null;
  backgroundImage: string | null;
  backgroundColor: string | null;
  voiceId?: string;
  storyBackgroundImage?: string | null;
  useStoryBackground?: boolean;
}

/** 편집 모드 공통 props */
interface EditModeCommonProps {
  onNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPersonalityChange: (value: string) => void;
  onFirstMessageChange: (value: string) => void;
  onProfileImageChange: (imageData: string) => void;
  onBackgroundImageChange: (imageData: string) => void;
  onUseStoryBackgroundChange?: (checked: boolean) => void;
  onGenerateImage: () => void | Promise<void>;
  onGenerateBackgroundImage: () => void | Promise<void>;
  onGenerateVoice: () => void | Promise<void>;
  isGeneratingBackgroundImage?: boolean;
  isGeneratingVoice?: boolean;
}

/** 모드 1: 저장/취소 버튼이 있는 편집 폼 */
interface EditWithSaveProps extends CharacterDataProps, EditModeCommonProps {
  mode: "edit-save";
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

/** 모드 2: 삭제 버튼만 있는 편집 폼 */
interface EditWithDeleteProps extends CharacterDataProps, EditModeCommonProps {
  mode: "edit-delete";
  onDelete: () => void | Promise<void>;
}

/** 모드 3: 보기 모드 카드 */
interface ViewModeProps extends CharacterDataProps {
  mode: "view";
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  onGenerateImage: () => void | Promise<void>;
  onGenerateVoice: () => void | Promise<void>;
  isGeneratingVoice?: boolean;
  isDeleting?: boolean;
}

export type CharacterFormCardProps = EditWithSaveProps | EditWithDeleteProps | ViewModeProps;

// ============================================
// 컴포넌트
// ============================================

export const CharacterFormCard = (props: CharacterFormCardProps) => {
  if (props.mode === "view") {
    return <ViewCard {...props} />;
  }

  return <EditForm {...props} />;
};

// ============================================
// 뷰 모드 카드
// ============================================

const ViewCard = ({
  name,
  role,
  description,
  personality,
  profileImage,
  backgroundImage,
  backgroundColor,
  voiceId,
  storyBackgroundImage,
  useStoryBackground,
  onEdit,
  onDelete,
  onGenerateImage,
  onGenerateVoice,
  isGeneratingVoice,
  isDeleting,
}: ViewModeProps) => {
  const displayBackgroundImage = useStoryBackground ? storyBackgroundImage : backgroundImage;
  const hasCharacterDetail = !!description.trim() && !!(personality ?? "").trim();

  return (
    <div className="group relative h-42 w-full overflow-hidden rounded-xl bg-stone-900 ring-1 ring-white/10 transition-all hover:ring-2 hover:ring-emerald-500">
      {/* 1. 배경 처리 */}
      {displayBackgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${getImageUrl(displayBackgroundImage)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
        </>
      ) : (
        <div className={`absolute inset-0 ${backgroundColor || "bg-stone-800"}`} />
      )}

      {/* 2. 컨텐츠 */}
      <div className="absolute inset-0 flex items-center p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 shrink-0 border-2 border-stone-800/50">
            <AvatarImage
              src={getImageUrl(profileImage) || ""}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="bg-stone-700 text-xl font-bold text-white">
              {name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="relative z-10 min-w-0 flex-1">
            <div>
              <h3 className="text-xl font-bold text-white drop-shadow-md">{name}</h3>
              <span className="mt-1 inline-block rounded border border-stone-700 bg-stone-800/80 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
                {role}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 w-[90%] text-sm text-stone-300 drop-shadow-sm">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 음성 설정 표시 */}
      {voiceId && (
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 rounded-full bg-violet-600/80 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            <Volume2 className="h-3 w-3" />
            음성
          </span>
        </div>
      )}

      {/* 4. 액션 버튼 */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <button
                  onClick={() => void onGenerateVoice()}
                  disabled={isGeneratingVoice || !hasCharacterDetail}
                  className="rounded bg-black/20 p-1.5 text-stone-400 backdrop-blur-sm hover:bg-stone-800 hover:text-violet-400 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isGeneratingVoice ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </span>
            </TooltipTrigger>
            {!isGeneratingVoice && !hasCharacterDetail && (
              <TooltipContent side="bottom">
                <p className="mb-2.5 text-stone-200">✨ 설명, 성격을 입력하시면 사용할 수 있어요</p>
                <ul className="space-y-1.5">
                  <li className={description.trim() ? "text-emerald-400" : "text-red-400"}>
                    {description.trim() ? "✓" : "✗"} 설명
                  </li>
                  <li className={(personality ?? "").trim() ? "text-emerald-400" : "text-red-400"}>
                    {(personality ?? "").trim() ? "✓" : "✗"} 성격
                  </li>
                </ul>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <button
          onClick={() => void onGenerateImage()}
          className="rounded bg-black/20 p-1.5 text-stone-400 backdrop-blur-sm hover:bg-stone-800 hover:text-emerald-400"
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          onClick={onEdit}
          className="rounded bg-black/20 p-1.5 text-stone-400 backdrop-blur-sm hover:bg-stone-800 hover:text-yellow-400"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => void onDelete()}
          disabled={isDeleting}
          className="rounded bg-black/20 p-1.5 text-stone-400 backdrop-blur-sm hover:bg-stone-800 hover:text-red-400 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// 편집 모드 폼
// ============================================

type EditFormProps = EditWithSaveProps | EditWithDeleteProps;

const EditForm = (props: EditFormProps) => {
  const {
    name,
    role,
    description,
    personality,
    firstMessage,
    profileImage,
    backgroundImage,
    voiceId,
    storyBackgroundImage,
    useStoryBackground,
    onNameChange,
    onRoleChange,
    onDescriptionChange,
    onPersonalityChange,
    onFirstMessageChange,
    onProfileImageChange,
    onBackgroundImageChange,
    onUseStoryBackgroundChange,
    onGenerateImage,
    onGenerateBackgroundImage,
    onGenerateVoice,
    isGeneratingBackgroundImage,
    isGeneratingVoice,
  } = props;

  const hasCharacterDetail = !!description.trim() && !!(personality ?? "").trim();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onProfileImageChange(base64);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleBackgroundFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onBackgroundImageChange(base64);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const displayBackgroundImage = useStoryBackground ? storyBackgroundImage : backgroundImage;

  return (
    <div className="rounded-lg border border-stone-700 bg-stone-900 p-4">
      {/* 상단: 프로필 + 입력 필드 */}
      <div className="flex gap-3">
        {/* 아바타 + 버튼 영역 */}
        <div className="flex shrink-0 flex-col gap-2">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-stone-700">
              {profileImage ? (
                <img
                  src={getImageUrl(profileImage) || ""}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg text-stone-400">?</span>
              )}
            </div>
            {profileImage && (
              <button
                type="button"
                onClick={() => onProfileImageChange("")}
                className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-24 items-center justify-center gap-1 rounded-md bg-white px-2 py-1.5 text-xs font-medium text-black hover:bg-stone-100"
          >
            <Upload className="h-3 w-3" />
            파일 업로드
          </button>

          <button
            type="button"
            onClick={() => void onGenerateImage()}
            className="flex w-24 items-center justify-center gap-1 rounded-md bg-emerald-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            <Sparkles className="h-3 w-3" />
            AI 생성
          </button>
        </div>

        {/* 입력 필드 */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="이름"
              maxLength={100}
              className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
            />
            <Input
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              placeholder="역할 (예: 주인공)"
              maxLength={50}
              className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
            />
          </div>
          <Input
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="캐릭터 설명"
            maxLength={500}
            className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
          />
          <Input
            value={personality || ""}
            onChange={(e) => onPersonalityChange(e.target.value)}
            placeholder="성격"
            maxLength={500}
            className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
          />
          <Input
            value={firstMessage || ""}
            onChange={(e) => onFirstMessageChange(e.target.value)}
            placeholder="첫 인사말 (채팅 시작 시 캐릭터가 보내는 메시지)"
            maxLength={100}
            className="h-auto bg-stone-800 px-3 py-2 text-sm ring-stone-700"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex shrink-0 items-start gap-1">
          {props.mode === "edit-save" ? (
            <>
              <button
                type="button"
                onClick={() => void props.onSave()}
                disabled={props.isSaving}
                className="rounded p-1.5 text-emerald-500 hover:bg-stone-800 disabled:opacity-50"
              >
                {props.isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={props.onCancel}
                className="rounded p-1.5 text-stone-500 hover:bg-stone-800 hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void props.onDelete()}
              className="rounded p-1.5 text-stone-500 hover:bg-stone-800 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 하단: 캐릭터 배경 이미지 섹션 */}
      <div className="mt-4 border-t border-stone-700 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-stone-400" />
          <span className="text-sm font-medium text-stone-300">캐릭터 배경 이미지</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-[270px] w-[480px] items-center justify-center overflow-hidden rounded-lg bg-stone-700">
              {displayBackgroundImage ? (
                <img
                  src={getImageUrl(displayBackgroundImage) || ""}
                  alt="background"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-10 w-10 text-stone-500" />
              )}
            </div>
            {backgroundImage && !useStoryBackground && (
              <button
                type="button"
                onClick={() => onBackgroundImageChange("")}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {storyBackgroundImage && onUseStoryBackgroundChange && (
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={useStoryBackground}
                  onCheckedChange={(checked) => onUseStoryBackgroundChange(checked === true)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-stone-300">스토리 배경 이미지 사용</span>
              </label>
            )}

            <input
              ref={backgroundFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundFileSelect}
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => backgroundFileInputRef.current?.click()}
                disabled={useStoryBackground}
                className="flex items-center justify-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-3 w-3" />
                파일 업로드
              </button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <button
                        type="button"
                        onClick={() => void onGenerateBackgroundImage()}
                        disabled={
                          useStoryBackground || isGeneratingBackgroundImage || !hasCharacterDetail
                        }
                        className="flex items-center justify-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {isGeneratingBackgroundImage ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        AI 생성
                      </button>
                    </span>
                  </TooltipTrigger>
                  {!useStoryBackground && !isGeneratingBackgroundImage && !hasCharacterDetail && (
                    <TooltipContent side="bottom">
                      <p className="mb-2.5 text-stone-200">
                        ✨ 설명, 성격을 입력하시면 사용할 수 있어요
                      </p>
                      <ul className="space-y-1.5">
                        <li className={description.trim() ? "text-emerald-400" : "text-red-400"}>
                          {description.trim() ? "✓" : "✗"} 설명
                        </li>
                        <li
                          className={
                            (personality ?? "").trim() ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {(personality ?? "").trim() ? "✓" : "✗"} 성격
                        </li>
                      </ul>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* 하단: 캐릭터 음성 섹션 */}
      <div className="mt-4 border-t border-stone-700 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <Mic className="h-4 w-4 text-stone-400" />
          <span className="text-sm font-medium text-stone-300">캐릭터 음성</span>
          {voiceId && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs text-emerald-400">
              <Volume2 className="h-3 w-3" />
              음성 설정됨
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-stone-400">
            {voiceId
              ? "AI 음성이 설정되어 있습니다. 다시 생성하려면 버튼을 클릭하세요."
              : "캐릭터 설명과 성격을 기반으로 AI 음성을 생성합니다."}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0">
                  <button
                    type="button"
                    onClick={() => void onGenerateVoice()}
                    disabled={isGeneratingVoice || !hasCharacterDetail}
                    className="flex items-center justify-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isGeneratingVoice ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    AI 음성 생성
                  </button>
                </span>
              </TooltipTrigger>
              {!isGeneratingVoice && !hasCharacterDetail && (
                <TooltipContent side="bottom">
                  <p className="mb-2.5 text-stone-200">
                    ✨ 설명, 성격을 입력하시면 사용할 수 있어요
                  </p>
                  <ul className="space-y-1.5">
                    <li className={description.trim() ? "text-emerald-400" : "text-red-400"}>
                      {description.trim() ? "✓" : "✗"} 설명
                    </li>
                    <li
                      className={(personality ?? "").trim() ? "text-emerald-400" : "text-red-400"}
                    >
                      {(personality ?? "").trim() ? "✓" : "✗"} 성격
                    </li>
                  </ul>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
