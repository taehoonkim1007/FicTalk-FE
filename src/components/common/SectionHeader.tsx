import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  emoji?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, emoji, actionLabel, onAction }: SectionHeaderProps) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
      {emoji} {title}
    </h2>
    {actionLabel && onAction && (
      <Button variant="link" size="sm" onClick={onAction} className="text-stone-400">
        {actionLabel} <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    )}
  </div>
);
