import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { USE_CURRENT_USER_QUERY_KEY } from "./use-current-user";
import { useRef } from "react";
import authService from "@/lib/api/services/auth-service";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const isLoggingOutRef = useRef(false);

  return useMutation({
    mutationFn: async () => {
      if (isLoggingOutRef.current) {
        console.log("Logout đang được xử lý, bỏ qua request trùng lặp");
        return Promise.resolve({ status: "success", message: "Already logging out", data: null });
      }
      
      isLoggingOutRef.current = true;
      
      try {
        return await authService.logout();
      } catch (error) {
        isLoggingOutRef.current = false;
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: USE_CURRENT_USER_QUERY_KEY });
      
      logout();
      
      isLoggingOutRef.current = false;
      
      router.push("/");
    },
    onError: () => {
      isLoggingOutRef.current = false;
    }
  });
};