import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">
          FicTalk
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Button variant="ghost" onClick={handleLogout}>
            로그아웃
          </Button>
        ) : (
          <Button onClick={() => navigate("/login")}>로그인</Button>
        )}
      </div>
    </header>
  );
}
