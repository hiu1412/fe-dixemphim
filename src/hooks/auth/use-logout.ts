import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store";
import authService from "@/lib/api/services/auth-service";

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Cập nhật trạng thái trong store
      logoutStore();
      console.log("Đăng xuất thành công!");
    },
    onError: (error) => {
      console.error("Lỗi khi đăng xuất:", error);
    },
  });
};