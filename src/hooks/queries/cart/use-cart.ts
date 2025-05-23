import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/lib/api/services/cart-service';
import { useCartStore } from '@/store/cart-store';
import { useAuth } from '@/hooks/auth/use-auth';
import { isValidObjectId } from '@/lib/utils';
import { toast } from 'sonner';
import { Cart } from '@/lib/api/types';

export const CART_QUERY_KEY = ['cart'] as const;
const TOAST_DURATION = 1500; // 1.5 seconds

export const useCart = () => {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();
  const { isAuthenticated } = useAuth();

  // Helper function để lấy ID dạng string từ item.product (có thể là object hoặc string)
  const getProductId = (product: any): string => {
    if (!product) return '';
    
    if (typeof product === 'object') {
      return String(product._id || '');
    }
    
    return String(product);
  };

  // Query để fetch cart data từ server (chỉ khi đã login)
  const { data: serverCart, refetch: refetchCart } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60
  });

  // Effect để theo dõi thay đổi của cartStore và cập nhật React Query cache
  useEffect(() => {
    if (isAuthenticated && serverCart) {
      queryClient.setQueryData(CART_QUERY_KEY, cartStore);
    }
  }, [cartStore.items, isAuthenticated, serverCart, queryClient]);

  // Mutation cho update cart
  const { mutate: updateCart } = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: any; quantity: number }) => {
      // Chuẩn hóa productId
      const productIdStr = getProductId(productId);
      
      if (!productIdStr || !isValidObjectId(productIdStr)) {
        throw new Error('Invalid product ID format');
      }

      if (!isAuthenticated) {
        // Nếu không đăng nhập, cập nhật trực tiếp vào cartStore
        await cartStore.updateQuantity(productIdStr, quantity);
        return cartStore;
      }

      // Nếu đã đăng nhập, gọi API và cập nhật store
      const result = await cartService.updateCartItem(productIdStr, quantity);
      cartStore.updateCartFromServer(result);
      return result;
    },
    
    onMutate: async ({ productId, quantity }) => {
      // Chuẩn hóa productId
      const productIdStr = getProductId(productId);
      
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      // Lưu trữ state hiện tại của cartStore
      const previousCartStore = {
        _id: cartStore._id,
        user: cartStore.user,
        items: [...cartStore.items],
        totalAmount: cartStore.totalAmount,
        createdAt: cartStore.createdAt,
        updatedAt: cartStore.updatedAt
      };

      // Optimistic update cho cả local và server state
      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old || !old.items) return old;

        const updatedItems = old.items.map((item: any) => {
          const itemProductId = getProductId(item.product);
          return itemProductId === productIdStr ? { ...item, quantity } : item;
        });
        
        const updatedCart = {
          ...old,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total: number, item: any) => 
            total + (item.price * item.quantity), 0
          )
        };

        return updatedCart;
      });

      return { previousCart, previousCartStore };
    },
    
    onError: (err, variables, context) => {
      toast.error('Lỗi khi cập nhật giỏ hàng', { duration: TOAST_DURATION });
      console.error('useCart - Update error:', err);

      if (isAuthenticated && context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      } else if (!isAuthenticated && context?.previousCartStore) {
        // Khôi phục state của cartStore
        cartStore.updateCartFromServer(context.previousCartStore);
      }
    },
    
    onSuccess: (data) => {
      toast.success('Cập nhật giỏ hàng thành công', { duration: TOAST_DURATION });
      if (isAuthenticated) {
        refetchCart();
      }
      queryClient.setQueryData(CART_QUERY_KEY, data);
    }
  });

  // Mutation cho xóa sản phẩm khỏi giỏ hàng
  const { mutate: removeCart } = useMutation({
    mutationFn: async (productId: any) => {
      const productIdStr = getProductId(productId);
      
      if (!productIdStr || !isValidObjectId(productIdStr)) {
        throw new Error('Invalid product ID format for removal');
      }

      if (!isAuthenticated) {
        // Nếu không đăng nhập, xóa trực tiếp từ cartStore
        await cartStore.removeItem(productIdStr);
        return cartStore;
      }
      
      // Nếu đã đăng nhập, gọi API và cập nhật store
      const result = await cartService.removeCartItem(productIdStr);
      cartStore.updateCartFromServer(result);
      return result;
    },
    
    onMutate: async (productId) => {
      const productIdStr = getProductId(productId);
      
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      // Lưu trữ state hiện tại của cartStore
      const previousCartStore = {
        _id: cartStore._id,
        user: cartStore.user,
        items: [...cartStore.items],
        totalAmount: cartStore.totalAmount,
        createdAt: cartStore.createdAt,
        updatedAt: cartStore.updatedAt
      };

      // Optimistic update
      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old || !old.items) return old;

        const updatedItems = old.items.filter((item: any) => {
          const itemProductId = getProductId(item.product);
          return itemProductId !== productIdStr;
        });
        
        const updatedCart = {
          ...old,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total: number, item: any) => 
            total + (item.price * item.quantity), 0
          )
        };

        return updatedCart;
      });

      return { previousCart, previousCartStore };
    },
    
    onError: (err, variables, context) => {
      toast.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng', { duration: TOAST_DURATION });
      console.error('useCart - Remove error:', err);

      if (isAuthenticated && context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      } else if (!isAuthenticated && context?.previousCartStore) {
        // Khôi phục state của cartStore
        cartStore.updateCartFromServer(context.previousCartStore);
      }
    },
    
    onSuccess: (data) => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng', { duration: TOAST_DURATION });
      if (isAuthenticated) {
        refetchCart();
      }
      queryClient.setQueryData(CART_QUERY_KEY, data);
    }
  });

  return {
    cart: isAuthenticated ? serverCart : cartStore,
    updateCart,
    removeCart,
    refetchCart
  };
};