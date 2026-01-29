import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StoryInfoSectionProps {
  title: string;
  setTitle: (v: string) => void;
  authorName: string;
  setAuthorName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
  isGeneratingSummary: boolean;
  handleGenerateSummary: () => void;
}

export const StoryInfoSection = ({
  title,
  setTitle,
  authorName,
  setAuthorName,
  description,
  setDescription,
  summary,
  setSummary,
  isGeneratingSummary,
  handleGenerateSummary,
}: StoryInfoSectionProps) => {
  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="mb-2 block text-sm text-stone-400">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
          placeholder="작품의 제목을 입력하세요"
        />
      </div>

      {/* 저자명 */}
      <div>
        <label className="mb-2 block text-sm text-stone-400">저자명 *</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={100}
          required
          className="w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
          placeholder="필명을 입력하세요"
        />
      </div>

      {/* 한줄 소개 */}
      <div>
        <label className="mb-2 block text-sm text-stone-400">한줄 소개 *</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={300}
          required
          className="w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
          placeholder="작품을 한 문장으로 표현해주세요"
        />
      </div>

      {/* 줄거리 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-stone-400">줄거리 *</label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary || !title.trim() || !description.trim()}
              className="border-emerald-700 bg-transparent text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
            >
              {isGeneratingSummary ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-4 w-4" />
              )}
              AI 생성
            </Button>
            <span className="text-sm text-stone-500">{summary.length} / 4000</span>
          </div>
        </div>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={4000}
          required
          rows={8}
          className="w-full resize-none rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
          placeholder="작품의 전체적인 줄거리를 입력해주세요. (최대 4000자)"
        />
      </div>
    </div>
  );
};
