import type { TooltipRenderProps } from "react-joyride";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export const TourTooltip = ({
  index,
  isLastStep,
  size,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: TooltipRenderProps) => {
  return (
    <div
      {...tooltipProps}
      className="w-80 rounded-xl border border-stone-700 bg-stone-900 p-5 shadow-2xl"
    >
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between">
        {step.title && <h3 className="text-base font-bold text-emerald-400">{step.title}</h3>}
        <button
          {...skipProps}
          className="rounded-full p-1 text-stone-500 transition-colors hover:bg-stone-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 본문 */}
      <p className="text-sm leading-relaxed text-stone-300">{step.content}</p>

      {/* 하단 */}
      <div className="mt-4 flex items-center justify-between">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: size }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-emerald-500" : "w-1.5 bg-stone-600"
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="text-xs text-stone-400 transition-colors hover:text-white"
            >
              이전
            </button>
          )}
          <Button
            {...primaryProps}
            size="sm"
            className="bg-emerald-500 text-black hover:bg-emerald-400"
          >
            {isLastStep ? "완료" : "다음"}
          </Button>
        </div>
      </div>
    </div>
  );
};
