import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { useDeleteAccount as useDeleteAccountMutation } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actions } = useAuthStore();
  const { mutate, isPending } = useDeleteAccountMutation();

  const deleteAccount = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        actions.clearAuth();
        toast.success(SUCCESS_MESSAGES.ACCOUNT_DELETED);
        void navigate("/");
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.ACCOUNT_DELETE_FAILED);
      },
    });
  };

  return {
    deleteAccount,
    isDeleting: isPending,
  };
};
