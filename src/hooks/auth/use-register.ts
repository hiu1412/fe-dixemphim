
import { useMutation } from "@tanstack/react-query";
import  {AuthResponse, RegisterRequest } from "@/lib/api/services";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";
import authService from "@/lib/api/services/auth-service";


export const useRegister = () => {
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
  
    const { mutate, isPending } = useMutation({
      mutationFn: (data: RegisterRequest) => authService.register(data),
      onSuccess: (response: AuthResponse) => {
        setRegisteredEmail(response.data.user.email);
        setShowVerifyModal(true);
        toast.success("Đăng ký thành công! Vui lòng xác thực email của bạn.");
      },

    });

    return {
      mutate,
      isPending,
      
    };
  };
