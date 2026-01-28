import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 10,
}: PaginationProps) => {
  const goToFirst = () => onPageChange(1);
  const goToLast = () => onPageChange(totalPages);
  const goForward10 = () => onPageChange(Math.min(currentPage + 10, totalPages));
  const goBack10 = () => onPageChange(Math.max(currentPage - 10, 1));

  const getPageNumbers = () => {
    const end = Math.min(totalPages, maxVisible);
    return Array.from({ length: end }, (_, i) => i + 1);
  };

  const baseButtonClass =
    "flex h-9 w-9 items-center justify-center rounded text-sm transition-colors";
  const activeClass = "bg-emerald-500 text-black font-medium";
  const inactiveClass = "bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white";
  const disabledClass = "bg-stone-900 text-stone-600 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 맨 앞으로 */}
      <button
        onClick={goToFirst}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
        aria-label="첫 페이지"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* 10페이지 뒤로 */}
      <button
        onClick={goBack10}
        disabled={currentPage <= 10}
        className={`${baseButtonClass} ${currentPage <= 10 ? disabledClass : inactiveClass}`}
        aria-label="10페이지 뒤로"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${baseButtonClass} ${page === currentPage ? activeClass : inactiveClass}`}
          aria-label={`${page} 페이지`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* 10페이지 앞으로 */}
      <button
        onClick={goForward10}
        disabled={currentPage > totalPages - 10}
        className={`${baseButtonClass} ${currentPage > totalPages - 10 ? disabledClass : inactiveClass}`}
        aria-label="10페이지 앞으로"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* 맨 뒤로 */}
      <button
        onClick={goToLast}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
        aria-label="마지막 페이지"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
};
