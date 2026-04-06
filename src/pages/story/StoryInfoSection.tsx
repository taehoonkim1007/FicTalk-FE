import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          placeholder="작품의 제목을 입력하세요"
        />
      </div>

      {/* 저자명 */}
      <div>
        <Label htmlFor="authorName">저자명 *</Label>
        <Input
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={100}
          required
          placeholder="필명을 입력하세요"
        />
      </div>

      {/* 한줄 소개 */}
      <div>
        <Label htmlFor="description">한줄 소개 *</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={300}
          required
          placeholder="작품을 한 문장으로 표현해주세요"
        />
      </div>

      {/* 줄거리 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label htmlFor="summary" className="mb-0">
            줄거리 *
          </Label>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
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
                </span>
              </TooltipTrigger>
              {!isGeneratingSummary && (!title.trim() || !description.trim()) && (
                <TooltipContent side="bottom">
                  <p className="mb-2.5 text-stone-200">
                    ✨ 제목, 한줄 소개를 입력하시면 사용할 수 있어요
                  </p>
                  <ul className="space-y-1.5">
                    <li className={title.trim() ? "text-emerald-400" : "text-red-400"}>
                      {title.trim() ? "✓" : "✗"} 제목
                    </li>
                    <li className={description.trim() ? "text-emerald-400" : "text-red-400"}>
                      {description.trim() ? "✓" : "✗"} 한줄 소개
                    </li>
                  </ul>
                </TooltipContent>
              )}
            </Tooltip>
            <span className="text-sm text-stone-500">{summary.length} / 4000</span>
          </div>
        </div>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={4000}
          required
          rows={8}
          placeholder="작품의 전체적인 줄거리를 입력해주세요. (최대 4000자)"
        />
      </div>
    </div>
  );
};
