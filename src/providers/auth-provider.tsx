"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "@/lib/api/services/auth-service";
import { PropsWithChildren } from "react";
import { useCartStore } from "@/store/cart-store";
import { cartService } from "@/lib/api/services/cart-service";
import { CART_QUERY_KEY } from "@/hooks/queries/cart/use-cart";
import { toast } from "sonner";
import { AxiosError } from "axios";

const TOAST_DURATION = 1500; // 1.5 seconds

export function AuthProvider({ children }: PropsWithChildren) {
  const { setUser, user, logout } = useAuthStore();
  const cartStore = useCartStore();
  const queryClient = useQueryClient();

  const getRefreshTokenFromCookies = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("refresh_token="))
      ?.split("=")[1] || "";
  };

  const handleCartSync = async () => {
    try {
      if (cartStore.items.length > 0) {
        // Thực hiện đồng bộ giỏ hàng với server
        await cartStore.syncCartWithServer();
        
        // Lấy giỏ hàng mới từ server sau khi đồng bộ
        const newCart = await cartService.getCart();
        
        // Cập nhật lại store với dữ liệu mới nhất
        cartStore.updateCartFromServer(newCart);
        
        // Cập nhật react-query cache
        queryClient.setQueryData(CART_QUERY_KEY, newCart);
        
        toast.success('Đã đồng bộ giỏ hàng thành công', { duration: TOAST_DURATION });
      } else {
        // Nếu không có items trong local, lấy giỏ hàng từ server
        const cart = await cartService.getCart();
        cartStore.updateCartFromServer(cart);
        queryClient.setQueryData(CART_QUERY_KEY, cart);
      }
    } catch (error) {
      // Xử lý các loại lỗi cụ thể
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Lỗi khi đồng bộ giỏ hàng';
        toast.error(errorMessage, { duration: TOAST_DURATION });
        console.error("Lỗi khi đồng bộ giỏ hàng:", error.message);
        if (error.response?.data) {
          console.error('Server error:', error.response.data);
        }
      } else {
        toast.error('Lỗi không xác định khi đồng bộ giỏ hàng', { duration: TOAST_DURATION });
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  const { data: authData } = useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      try {
        const response = await authService.getMe();
        
        if (!response?.data) {
          return null;
        }

        const currentRefreshToken = getRefreshTokenFromCookies();

        if (response.data.accessToken && !response.data.user && user) {
          setUser(user, response.data.accessToken, currentRefreshToken);
          return response.data;
        }

        if (response.data.user) {
          const { user: userData, accessToken } = response.data;
          
          await setUser(userData, accessToken, currentRefreshToken);
          
          // Xử lý đồng bộ giỏ hàng khi đăng nhập thành công
          await handleCartSync();

          return response.data;
        }

        return null;
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || 'Lỗi khi kiểm tra người dùng';
          toast.error(errorMessage, { duration: TOAST_DURATION });
          console.error("Lỗi khi kiểm tra người dùng:", error.message);
        } else {
          toast.error('Lỗi không xác định khi kiểm tra người dùng', { duration: TOAST_DURATION });
          console.error("Lỗi không xác định:", error);
        }
        return null;
      }
    },
    enabled: true,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await authService.logout();
      
      // Xóa thông tin user
      logout();
      
      // Xóa cache của react-query
      queryClient.setQueryData(CART_QUERY_KEY, null);
      
      // Giữ lại items trong localStorage nhưng xóa thông tin user
      cartStore.clearCart();
      
      toast.success('Đã đăng xuất thành công', { duration: TOAST_DURATION });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Lỗi khi đăng xuất';
        toast.error(errorMessage, { duration: TOAST_DURATION });
        console.error('Lỗi khi đăng xuất:', error.message);
      } else {
        toast.error('Lỗi không xác định khi đăng xuất', { duration: TOAST_DURATION });
        console.error('Lỗi không xác định:', error);
      }
    }
  };

  useEffect(() => {
    // Đăng ký sự kiện đăng xuất
    window.addEventListener('logout', handleLogout);
    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  return <>{children}</>;
}
