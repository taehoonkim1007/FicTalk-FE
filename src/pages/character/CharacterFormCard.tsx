import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/image";

export interface CharacterFormCardProps {
  name: string;
  role: string;
  description: string;
  firstMessage?: string;
  profileImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  isEditing?: boolean;
  onNameChange?: (value: string) => void;
  onRoleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onFirstMessageChange?: (value: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const CharacterFormCard = ({
  name,
  role,
  description,
  firstMessage,
  profileImage,
  backgroundImage,
  backgroundColor,
  isEditing,
  onNameChange,
  onRoleChange,
  onDescriptionChange,
  onFirstMessageChange,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isSaving,
  isDeleting,
}: CharacterFormCardProps) => {
  if (isEditing) {
    return (
      <div className="rounded-lg border border-stone-700 bg-stone-900 p-4">
        <div className="flex gap-3">
          {/* 아바타 placeholder/preview */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-700">
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

          {/* 입력 필드 */}
          <div className="min-w-0 flex-1 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange?.(e.target.value)}
                placeholder="이름"
                maxLength={100}
                className="rounded-lg border-0 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-500 ring-1 ring-stone-700 outline-none focus:ring-emerald-500"
              />
              <input
                type="text"
                value={role}
                onChange={(e) => onRoleChange?.(e.target.value)}
                placeholder="역할 (예: 주인공)"
                maxLength={50}
                className="rounded-lg border-0 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-500 ring-1 ring-stone-700 outline-none focus:ring-emerald-500"
              />
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => onDescriptionChange?.(e.target.value)}
              placeholder="캐릭터 설명 및 성격"
              maxLength={500}
              className="w-full rounded-lg border-0 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-500 ring-1 ring-stone-700 outline-none focus:ring-emerald-500"
            />
            <textarea
              value={firstMessage || ""}
              onChange={(e) => onFirstMessageChange?.(e.target.value)}
              placeholder="첫 인사말 (채팅 시작 시 캐릭터가 보내는 메시지)"
              maxLength={1000}
              rows={2}
              className="w-full resize-none rounded-lg border-0 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-500 ring-1 ring-stone-700 outline-none focus:ring-emerald-500"
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex shrink-0 items-start gap-1">
            {onSave && onCancel ? (
              <>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="rounded p-1.5 text-emerald-500 hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded p-1.5 text-stone-500 hover:bg-stone-800 hover:text-stone-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded p-1.5 text-stone-500 hover:bg-stone-800 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 보기 모드
  return (
    <div className="group relative h-32 w-full overflow-hidden rounded-xl bg-stone-900 ring-1 ring-white/10 transition-all hover:ring-2 hover:ring-emerald-500">
      {/* 1. 배경 처리 */}
      {backgroundImage ? (
        <>
          {/* 이미지가 있을 때: 줌인 효과 + 가독성용 그라데이션 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${getImageUrl(backgroundImage)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
        </>
      ) : (
        /* 이미지가 없을 때: 기존 스타일 유지 (단색 배경, 그라데이션 X) */
        <div className={`absolute inset-0 ${backgroundColor || "bg-stone-800"}`} />
      )}

      {/* 2. 컨텐츠 (좌측 정렬) */}
      <div className="absolute inset-0 flex items-center p-4">
        <div className="flex items-center gap-4">
          {/* 아바타 (심플 스타일 유지) */}
          <Avatar className="h-16 w-16 shrink-0 border-2 border-stone-800/50">
            <AvatarImage
              src={getImageUrl(profileImage) || ""}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="bg-stone-700 text-xl font-bold text-white">
              {name[0]}
            </AvatarFallback>
          </Avatar>

          {/* 텍스트 정보 */}
          <div className="relative z-10 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white drop-shadow-md">{name}</h3>
              <span className="rounded border border-stone-700 bg-stone-800/80 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
                {role}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 w-[90%] text-sm text-stone-300 drop-shadow-sm">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 액션 버튼 (우측 상단, 배경 이미지 유무에 따라 색상 조정) */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded bg-black/20 p-1.5 text-stone-400 backdrop-blur-sm hover:bg-stone-800 hover:text-yellow-400"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="rounded bg-black/20 p-1.5 text-stone-400 backdrop-blur-sm hover:bg-stone-800 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
