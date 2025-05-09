import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import authService from "@/lib/api/services/auth-service";
import { useAuthStore } from "@/store/use-auth-store";

export const useGoogleAuth = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  // Hàm xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    setIsRedirecting(true); // Đặt trạng thái đang chuyển hướng
    authService.loginWithGoogle(); // Chuyển hướng đến backend
  };

  const handleGoogleCallback = async () => {
    if (isRedirecting) return; // Ngăn chặn nếu đang xử lý yêu cầu khác

    try {

    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      throw new Error("Không tìm thấy access token trong URL");
    }

    // Lưu accessToken vào localStorage
    localStorage.setItem("access_token", accessToken);

      // Gọi API getMe để lấy thông tin người dùng
      setIsRedirecting(true); // Đặt trạng thái đang chuyển hướng
      const response = await authService.getMe();
      const user = response.data.user;
  
      // Lấy accessToken từ cookies (nếu cần)
  
      // Cập nhật trạng thái người dùng
      setUser(user, accessToken, "");
  
      // Chuyển hướng về trang chủ
      router.push("/");
    } catch (err) {
      console.error("Lỗi khi xử lý callback Google:", err);
      setError("Đã xảy ra lỗi khi xử lý đăng nhập Google");
      setIsRedirecting(false); // Đặt lại trạng thái chuyển hướng
    }
  };

  return {
    handleGoogleLogin,
    handleGoogleCallback,
    isRedirecting,
    error,
  };
};
