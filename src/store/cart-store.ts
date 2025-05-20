import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/api/types';
import { cartService } from '@/lib/api/services/cart-service';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  addItem: (product: any, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItemsCount: () => number;
  isItemInCart: (productId: string) => boolean;
  syncCartWithServer: (userId: string) => Promise<void>; // Thêm hàm mới
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,

      // Thêm sản phẩm vào giỏ
      addItem: (product, quantity = 1) => {
        // ...existing code...
      },

      // Cập nhật số lượng
      updateQuantity: (productId, quantity) => {
        // ...existing code...
      },

      // Xóa sản phẩm
      removeItem: (productId) => {
        // ...existing code...
      },

      // Xóa toàn bộ giỏ hàng
      clearCart: () => {
        set({ items: [], totalAmount: 0 });
      },

      // Đếm số lượng items trong giỏ
      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      // Kiểm tra sản phẩm có trong giỏ không
      isItemInCart: (productId) => {
        return get().items.some(item => item.product === productId);
      },

      // Đồng bộ giỏ hàng với server khi đăng nhập
       syncCartWithServer: async (userId: string) => {
        try {
          const currentCart = get().items;
          
          if (currentCart.length > 0) {
            // Gọi service để đồng bộ với server
            const mergedCart = await cartService.syncCart(userId, currentCart);
            
            // Cập nhật store với dữ liệu từ server
            set({ 
              items: mergedCart.items || [], 
              totalAmount: mergedCart.totalAmount || 0 
            });
            
            console.log('Đã đồng bộ giỏ hàng thành công');
          }
        } catch (error) {
          console.error('Lỗi khi đồng bộ giỏ hàng:', error);
        }
      }
    }),
    {
      name: 'shopping-cart', // tên key trong localStorage
    }
  )
);