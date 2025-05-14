import { useMutation } from "@tanstack/react-query";
import authService from "@/lib/api/services/auth-service";

export const useEmailAuth = () => {
  // Gửi email reset password
  const requestResetEmail = useMutation({
    mutationFn: (email: string) => authService.requestEmail(email),
  });

  // Đổi mật khẩu với token
  const resetPassword = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPasswordEmail(token, newPassword),
  });

  return {
    requestResetEmail,
    resetPassword,
  };
};