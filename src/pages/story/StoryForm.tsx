import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COVER_COLORS } from "@/constants/story";
import type { CreateCharacterRequest, StoryDetail, StoryFormData } from "@/types/story";

interface StoryFormProps {
  initialData?: StoryDetail;
  onSubmit: (data: StoryFormData) => void;
  isSubmitting: boolean;
}

export const StoryForm = ({ initialData, onSubmit, isSubmitting }: StoryFormProps) => {
  const navigate = useNavigate();
  const isEditMode = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [coverColor, setCoverColor] = useState(initialData?.coverColor || "bg-stone-800");
  const [characters, setCharacters] = useState<CreateCharacterRequest[]>(
    initialData?.characters?.map((char) => ({
      name: char.name,
      role: char.role,
      description: char.description,
      imageColor: char.imageColor,
      personality: "",
      firstMessage: "",
    })) || [],
  );

  const handleAddCharacter = () => {
    if (characters.length >= 20) return;
    setCharacters([
      ...characters,
      {
        name: "",
        role: "",
        description: "",
        personality: "",
        firstMessage: "",
        imageColor: "bg-stone-400",
      },
    ]);
  };

  const handleRemoveCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const handleCharacterChange = (
    index: number,
    field: keyof CreateCharacterRequest,
    value: string,
  ) => {
    setCharacters(characters.map((char, i) => (i === index ? { ...char, [field]: value } : char)));
  };

  const isFormValid = title.trim() && authorName.trim() && description.trim() && summary.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      authorName,
      description,
      summary,
      coverColor,
      characters,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-300">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
          placeholder="스토리 제목을 입력하세요"
        />
      </div>

      {/* 작가명 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-300">작가명 *</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={100}
          required
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
          placeholder="작가명을 입력하세요"
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-300">
          간단 설명 * <span className="text-stone-500">({description.length}/300)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={300}
          required
          rows={3}
          className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
          placeholder="스토리에 대한 간단한 설명을 입력하세요"
        />
      </div>

      {/* 줄거리 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-300">
          줄거리 * <span className="text-stone-500">({summary.length}/3000)</span>
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={3000}
          required
          rows={8}
          className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
          placeholder="스토리의 줄거리를 입력하세요"
        />
      </div>

      {/* 커버 색상 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-300">커버 색상</label>
        <div className="flex flex-wrap gap-2">
          {COVER_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setCoverColor(color)}
              className={`h-10 w-10 rounded-lg ${color} ${
                coverColor === color
                  ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-900"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* 캐릭터 (생성 시에만) */}
      {!isEditMode && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-stone-300">
              캐릭터 <span className="text-stone-500">({characters.length}/20)</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddCharacter}
              disabled={characters.length >= 20}
            >
              <Plus className="mr-1 h-4 w-4" /> 캐릭터 추가
            </Button>
          </div>

          {characters.map((char, index) => (
            <div key={index} className="mb-4 rounded-lg border border-stone-700 bg-stone-900 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-stone-400">캐릭터 {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCharacter(index)}
                  className="text-stone-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={char.name}
                  onChange={(e) => handleCharacterChange(index, "name", e.target.value)}
                  placeholder="이름 *"
                  maxLength={100}
                  className="rounded border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={char.role}
                  onChange={(e) => handleCharacterChange(index, "role", e.target.value)}
                  placeholder="역할 * (예: 주인공)"
                  maxLength={50}
                  className="rounded border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>
              <textarea
                value={char.description}
                onChange={(e) => handleCharacterChange(index, "description", e.target.value)}
                placeholder="설명 *"
                maxLength={500}
                rows={2}
                className="mt-3 w-full resize-none rounded border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={() => void navigate(-1)} className="flex-1">
          취소
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex-1 bg-emerald-500 text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditMode ? (
            "수정하기"
          ) : (
            "작성하기"
          )}
        </Button>
      </div>
    </form>
  );
};
