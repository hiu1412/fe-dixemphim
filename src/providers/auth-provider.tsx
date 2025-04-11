"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import authService from "@/lib/api/services/auth-service";
import { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const { setUser, user } = useAuthStore();

  // Hàm để lấy refresh token từ cookies
  const getRefreshTokenFromCookies = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("refresh_token="))
      ?.split("=")[1] || "";
  };

  // Query để kiểm tra người dùng hiện tại
  const { data: authData } = useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      try {
        const response = await authService.getMe();

        // Lấy refresh token hiện tại từ cookies
        const currentRefreshToken = getRefreshTokenFromCookies();

        // Kiểm tra xem response có phải từ refresh token không
        if (response.data?.accessToken && !response.data?.user) {
          // Nếu là response từ refresh token, chỉ cập nhật access token
          if (user) {
            // Giữ nguyên refresh token hiện tại trong cookies
            setUser(user, response.data.accessToken, currentRefreshToken);
          }
          return response.data;
        }

        // Nếu là response từ getMe
        if (response.data?.user) {
          const { user: userData, accessToken } = response.data;
          // Giữ nguyên refresh token hiện tại trong cookies
          setUser(userData, accessToken, currentRefreshToken);
          return response.data;
        }

        return null;
      } catch (error) {
        console.error("Lỗi khi kiểm tra người dùng:", error);
        return null;
      }
    },
    enabled: true,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return <>{children}</>;
}