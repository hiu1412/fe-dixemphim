import authService from "@/lib/api/services/auth-service";
import { AuthResponse, LoginRequest } from "@/lib/api/types";
import { useAuthStore } from "@/store/use-auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { USE_CURRENT_USER_QUERY_KEY } from "./use-current-user";
import { toast } from "sonner";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state)=>state.setUser);

    return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (response: AuthResponse) => {
            setUser(response.data.user, response.data.accessToken);
            //lưu key vào query, gần giống như redis, lần đầu refresh sẽ lâu nhưng lần hai dò key sẽ nhanh
            queryClient.setQueryData(USE_CURRENT_USER_QUERY_KEY, { 
                user: response.data.user

              });
              
              toast.success("Đăng nhập thành công!");
              if (response.data.user.role === "admin") {
                router.push("/dashboard");
              } else {
                router.push("/");
              }
        },
    })
}