//LOGIN
//useMutation: xử lý  các hành động POST,PUT, DELETE
import {useMutation} from '@tanstack/react-query';
import {LoginRequest, AuthResponse } from '@/lib/api/types';
import { useAuthStore } from '@/store/use-auth-store';
import authService from '@/lib/api/services/auth-service';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return useMutation({

    //gửi yêu cầu đăng nhậpa
    mutationFn: (data: LoginRequest) => authService.login(data),
    //THÀNH CÔNG
    onSuccess: (response: AuthResponse) =>{
      console.log(response)
  const { user, accessToken, refreshToken } = response.data; // Truy cập đúng cấu trúc dữ liệu

      //Lưu thông tin người dùng vào store
      setUser(user, accessToken, refreshToken);
// Hiển thị thông báo thành công
toast.success("Đăng nhập thành công!");

// Chuyển hướng dựa trên role
if (user.role === 'admin') {
  router.push('/dashboard');
} else {
  router.push('/');
}
      toast.success("Đăng nhập thành công!");
    },
    //that bai
    onError: (error) =>{
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      console.error("lỗi khi đăng nhập:", error);
    },
  });
}
