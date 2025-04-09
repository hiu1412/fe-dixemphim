import { useAuthStore } from "@/store/use-auth-store";
import { useCurrentUser } from "./use-current-user";
import { useMemo } from "react";

export const useAuth = () => {
  // Tách các selectors để tránh re-renders không cần thiết
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  // Chỉ fetch user data nếu đã authenticated nhưng chưa có user data
  const { isLoading, error } = useCurrentUser();
  
  // Sử dụng useMemo để cache kết quả
  const authData = useMemo(() => ({
    isAuthenticated,
    user,
    isLoading,
    error,
    isAdmin: user?.role === "admin",
  }), [isAuthenticated, user, isLoading, error]);
  
  return authData;
};

export type UseAuthReturn = ReturnType<typeof useAuth>;
