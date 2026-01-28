import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BookOpen, Loader2, LogIn, LogOut, MessageSquare, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useLogout } from "@/hooks/useLogout";
import { useCategories } from "@/queries/useCategoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { logout, isLoggingOut } = useLogout();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useCategories();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // 현재 경로에서 활성 카테고리 추출
  const currentSlug = location.pathname.slice(1) || "home";

  const handleCategoryClick = (slug: string) => {
    if (slug === "home") {
      void navigate("/");
    } else {
      void navigate(`/${slug}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#121212]/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Mobile Search Overlay */}
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex w-full items-center gap-2 md:hidden">
            <Search className="h-4 w-4 text-stone-500" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="작품, 캐릭터 검색"
              className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-stone-500"
            />
            <Button
              size="icon"
              variant="ghost"
              type="button"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5 text-stone-400" />
            </Button>
          </form>
        ) : null}

        {/* Default Header Content */}
        <div
          className={`flex w-full items-center justify-between ${
            isSearchOpen ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-stone-400 hover:text-blue-400"
                  onClick={() => void navigate("/my-stories")}
                >
                  <BookOpen className="h-4 w-4 md:mr-1.5" />
                  <span className="hidden md:inline">내 스토리</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mr-2 text-stone-400 hover:text-emerald-400"
                >
                  <MessageSquare className="h-4 w-4 md:mr-1.5" />
                  <span className="hidden md:inline">내 대화</span>
                </Button>
              </>
            )}

            <form onSubmit={handleSearch} className="relative hidden md:flex">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="작품, 캐릭터 검색"
                className="w-64 rounded-full border-none bg-stone-800 py-2 pr-4 pl-9 text-sm text-white transition-all outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </form>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <Button size="sm" variant="white" onClick={logout} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4 rotate-180 md:mr-2" />
                    <span className="hidden md:inline">로그아웃</span>
                  </>
                )}
              </Button>
            ) : (
              <Button size="sm" variant="white" onClick={() => void navigate("/login")}>
                <LogIn className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">로그인</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="no-scrollbar w-full overflow-x-auto border-t border-white/5">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 px-4">
          {/* 홈 버튼 */}
          <button
            onClick={() => handleCategoryClick("home")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              currentSlug === "home"
                ? "bg-white text-black"
                : "text-stone-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            홈
          </button>

          {/* 동적 카테고리 */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                currentSlug === category.slug
                  ? "bg-white text-black"
                  : "text-stone-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
