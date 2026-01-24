import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Loader2, LogIn, LogOut, MessageSquare, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useLogout } from "@/hooks/useLogout";
import { CATEGORIES } from "@/mocks";
import { useAuthStore } from "@/stores/useAuthStore";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { logout, isLoggingOut } = useLogout();
  const [activeCategory, setActiveCategory] = useState("추천");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    // TODO: Implement Category Routing or Filtering
    if (cat === "추천") void navigate("/");
    else if (cat === "세계 문학") void navigate("/world-lit");
    else if (cat === "한국 문학") void navigate("/korean-lit");
    else if (cat === "창작") void navigate("/creative");
    else void navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#121212]/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Mobile Search Overlay */}
        {isSearchOpen ? (
          <div className="flex w-full items-center gap-2 md:hidden">
            <Search className="h-4 w-4 text-stone-500" />
            <input
              type="text"
              autoFocus
              placeholder="작품, 캐릭터 검색"
              className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-stone-500"
              onBlur={() => setIsSearchOpen(false)}
            />
            <Button size="icon" variant="ghost" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5 text-stone-400" />
            </Button>
          </div>
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
              <Button
                size="sm"
                variant="ghost"
                className="mr-2 text-stone-400 hover:text-emerald-400"
              >
                <MessageSquare className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">내 대화</span>
              </Button>
            )}

            <div className="relative hidden md:flex">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="작품, 캐릭터 검색"
                className="w-64 rounded-full border-none bg-stone-800 py-2 pr-4 pl-9 text-sm text-white transition-all outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
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
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-white text-black"
                  : "text-stone-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
