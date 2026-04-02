import { Loader2, Mail, Trash2, User } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useAuthStore } from "@/stores/useAuthStore";
import { isAuthenticatedUser } from "@/types/auth";

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { deleteAccount, isDeleting } = useDeleteAccount();

  if (!user || !isAuthenticatedUser(user)) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col items-center">
        {/* 아바타 */}
        <Avatar size="lg">
          <AvatarImage src={user.profileImage ?? undefined} alt={user.name} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        {/* 이름 + 이메일 */}
        <h1 className="mt-4 text-xl font-bold text-white">{user.name}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-400">
          <Mail className="h-3.5 w-3.5" />
          {user.email}
        </p>

        {/* 구분선 */}
        <div className="mt-8 w-full border-t border-stone-800" />

        {/* 회원탈퇴 */}
        <div className="mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                회원탈퇴
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  탈퇴 시 모든 데이터(스토리, 캐릭터, 대화 기록)가 영구적으로 삭제되며 복구할 수
                  없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={deleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  탈퇴하기
                </AlertDialogAction>
                <AlertDialogCancel>취소</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
};
