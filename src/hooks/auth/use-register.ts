import { useMutation } from "@tanstack/react-query";
import authService from "@/lib/api/services/auth-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Lỗi khi đăng ký:", error);
      toast.error(error?.response?.data?.message || "Đăng ký thất bại");
    },
  });
};