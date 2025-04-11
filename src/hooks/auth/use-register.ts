import { useMutation } from "@tanstack/react-query";
import authService from "@/lib/api/services/auth-service";

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      console.log("Đăng ký thành công:", response.message);
    },
    onError: (error) => {
      console.error("Lỗi khi đăng ký:", error);
    },
  });
};