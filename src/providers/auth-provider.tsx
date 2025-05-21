"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "@/lib/api/services/auth-service";
import { PropsWithChildren } from "react";
import { useCartStore } from "@/store/cart-store";
import { cartService } from "@/lib/api/services/cart-service";
import { CART_QUERY_KEY } from "@/hooks/queries/cart/use-cart";

export function AuthProvider({ children }: PropsWithChildren) {
  const { setUser, user } = useAuthStore();
  const cartStore = useCartStore();
  const queryClient = useQueryClient();

  const getRefreshTokenFromCookies = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("refresh_token="))
      ?.split("=")[1] || "";
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
          
          if (cartStore.items.length > 0) {
            try {
              // Sync cart từ store lên server
              await cartStore.syncCartWithServer();
              
              // Fetch cart data mới từ server
              const newCart = await cartService.getCart();
              
              // Update cart data trong react-query cache
              queryClient.setQueryData(CART_QUERY_KEY, newCart);
            } catch (error) {
              console.error("Lỗi khi sync cart:", error);
            }
          } else {
            // Nếu không có items trong store, vẫn fetch cart từ server
            try {
              const cart = await cartService.getCart();
              queryClient.setQueryData(CART_QUERY_KEY, cart);
            } catch (error) {
              console.error("Lỗi khi fetch cart:", error);
            }
          }

          return response.data;
        }

        return null;
      } catch (error) {
        console.error("Lỗi khi kiểm tra người dùng:", error);
        return null;
      }
    },
    enabled: true,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return <>{children}</>;
}
