import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useExchangeCode } from "@/queries/useAuthQueries";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { actions } = useAuthStore();
  const { mutate, isPending, isError, error } = useExchangeCode();

  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      void navigate("/login", { replace: true });
      return;
    }

    mutate(code, {
      onSuccess: (data) => {
        actions.setAccessToken(data.accessToken);
        void navigate("/", { replace: true });
      },
      onError: () => {
        void navigate("/login", { replace: true });
      },
    });
  }, [code, mutate, actions, navigate]);

  return {
    isLoading: isPending,
    isError,
    errorMessage: error?.message,
  };
};
