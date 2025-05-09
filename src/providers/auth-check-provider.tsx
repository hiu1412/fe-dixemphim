"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PropsWithChildren } from "react";
import authService from "@/lib/api/services/auth-service";

export default function AuthCheckProvider({ children }: PropsWithChildren) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Log để debug
    console.log("AuthCheckProvider mounted");
  }, []);

  const { data: authData } = useQuery({
    queryKey: ["auth-check"],
    queryFn: async () => {
      console.log("Fetching user data..."); // Log để debug
      try {
        const response = await authService.getMe();
        console.log("GetMe response:", response); // Log để debug

        if (response.data && response.data.user) {
          const accessToken = localStorage.getItem("access_token") || "";
          const refreshToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("refresh_token="))
            ?.split("=")[1] || "";

          setUser(response.data.user, accessToken, refreshToken);
        }
        return response.data;
      } catch (error) {
        console.error("Lỗi khi kiểm tra người dùng:", error);
        return null;
      }
    },
    enabled: true,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 0, // Luôn fetch lại khi mount
    gcTime: 0, // Không cache kết quả (thay thế cho cacheTime)
  });

  return <>{children}</>;
}

//Đảm bảo rằng trạng thái người dùng được kiểm tra và cập nhật ngay khi ứng dụng được khởi chạy.
//Xác định xem người dùng có đang đăng nhập hay không.