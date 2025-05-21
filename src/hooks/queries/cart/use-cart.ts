import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/lib/api/services/cart-service';
import { useCartStore } from '@/store/cart-store';
import { useAuth } from '@/hooks/auth/use-auth';
import { isValidObjectId } from '@/lib/utils';

export const CART_QUERY_KEY = ['cart'] as const;

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
  const { data: serverCart } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60
  });

  // Mutation cho update cart với Optimistic Updates
  const { mutate: updateCart } = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: any; quantity: number }) => {
      // Chuẩn hóa productId
      const productIdStr = getProductId(productId);
      
      console.log('useCart - Updating cart:', {
        original: productId,
        normalized: productIdStr,
        quantity
      });
      
      if (!productIdStr || !isValidObjectId(productIdStr)) {
        console.error('useCart - Invalid productId:', productId);
        throw new Error('Invalid product ID format');
      }

      return cartService.updateCartItem(productIdStr, quantity);
    },
    
    onMutate: async ({ productId, quantity }) => {
      // Chuẩn hóa productId
      const productIdStr = getProductId(productId);
      
      if (!isAuthenticated) {
        cartStore.updateQuantity(productIdStr, quantity);
        return;
      }

      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old || !old.items) {
          console.warn('useCart - Old data missing or invalid');
          return old;
        }

        // Xử lý cả trường hợp item.product là object hoặc string
        const updatedItems = old.items.map((item: any) => {
          const itemProductId = getProductId(item.product);
          return itemProductId === productIdStr ? { ...item, quantity } : item;
        });
        
        return {
          ...old,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total: number, item: any) => 
            total + (item.price * item.quantity), 0
          )
        };
      });

      return { previousCart };
    },
    
    onError: (err, variables, context) => {
      console.error('useCart - Update error:', err);
      if (isAuthenticated && context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    
    onSuccess: (data) => {
      console.log('useCart - Update success:', data);
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    }
  });

  // Thêm mutation cho xóa sản phẩm khỏi giỏ hàng
  const { mutate: removeCart } = useMutation({
    mutationFn: async (productId: any) => {
      const productIdStr = getProductId(productId);
      
      if (!productIdStr || !isValidObjectId(productIdStr)) {
        throw new Error('Invalid product ID format for removal');
      }
      
      return cartService.removeCartItem(productIdStr);
    },
    
    onMutate: async (productId) => {
      const productIdStr = getProductId(productId);
      
      if (!isAuthenticated) {
        cartStore.removeItem(productIdStr);
        return;
      }

      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      queryClient.setQueryData(CART_QUERY_KEY, (old: any) => {
        if (!old || !old.items) return old;

        const updatedItems = old.items.filter((item: any) => {
          const itemProductId = getProductId(item.product);
          return itemProductId !== productIdStr;
        });
        
        return {
          ...old,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total: number, item: any) => 
            total + (item.price * item.quantity), 0
          )
        };
      });

      return { previousCart };
    },
    
    onError: (err, variables, context) => {
      console.error('useCart - Remove error:', err);
      if (isAuthenticated && context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    }
  });

  return {
    cart: isAuthenticated ? serverCart : cartStore,
    updateCart,
    removeCart
  };
};