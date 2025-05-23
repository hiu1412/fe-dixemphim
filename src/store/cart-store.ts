import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/lib/api/types';
import { cartService } from '@/lib/api/services/cart-service';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface CartState extends Omit<Cart, '_id' | 'user'> {
  _id: string;
  user: string;
  addItem: (product: { _id: string, price: number, name: string, image: string }, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
  getItemsCount: () => number;
  isItemInCart: (productId: string) => boolean;
  syncCartWithServer: () => Promise<void>;
  updateCartFromServer: (serverCart: Cart) => void;
}

const TOAST_DURATION = 1500;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      _id: '',
      user: '',
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      addItem: async (product, quantity = 1) => {
        const state = get();
        const existingItem = state.items.find(
          item => item.product === product._id
        );

        if (existingItem) {
          // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
          set((state) => ({
            ...state,
            items: state.items.map((item) =>
              item.product === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Nếu là sản phẩm mới, thêm vào danh sách
          set((state) => ({
            ...state,
            items: [...state.items, {
              product: product._id,
              price: product.price,
              quantity,
              productName: product.name,
              productImage: product.image
            }],
          }));
        }

        // Tính lại tổng tiền
        set((state) => ({
          ...state,
          totalAmount: state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
          updatedAt: new Date().toISOString()
        }));

        // Nếu đã có user ID (đã đăng nhập), đồng bộ với server
        if (state.user) {
          try {
            await get().syncCartWithServer();
          } catch (error) {
            console.error('Lỗi khi đồng bộ giỏ hàng sau khi thêm sản phẩm:', error);
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        set((state) => {
          const items = state.items.map((item) =>
            item.product === productId ? { ...item, quantity } : item
          );

          return {
            ...state,
            items,
            totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
            updatedAt: new Date().toISOString()
          };
        });

        // Nếu đã đăng nhập, đồng bộ với server
        const state = get();
        if (state.user) {
          try {
            await get().syncCartWithServer();
          } catch (error) {
            console.error('Lỗi khi đồng bộ giỏ hàng sau khi cập nhật số lượng:', error);
          }
        }
      },

      removeItem: async (productId) => {
        set((state) => {
          const items = state.items.filter((item) => item.product !== productId);
          return {
            ...state,
            items,
            totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
            updatedAt: new Date().toISOString()
          };
        });

        // Nếu đã đăng nhập, đồng bộ với server
        const state = get();
        if (state.user) {
          try {
            await get().syncCartWithServer();
          } catch (error) {
            console.error('Lỗi khi đồng bộ giỏ hàng sau khi xóa sản phẩm:', error);
          }
        }
      },

      clearCart: () => {
        set((state) => ({
          ...state,
          items: [],
          totalAmount: 0,
          updatedAt: new Date().toISOString()
        }));

        // Không xóa _id và user để giữ thông tin người dùng
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      isItemInCart: (productId) => {
        return get().items.some(item => item.product === productId);
      },

      updateCartFromServer: (serverCart: Cart) => {
        set({
          _id: serverCart._id,
          user: serverCart.user,
          items: serverCart.items,
          totalAmount: serverCart.totalAmount,
          createdAt: serverCart.createdAt,
          updatedAt: serverCart.updatedAt
        });
      },

      syncCartWithServer: async () => {
        try {
          const { items } = get();
          
          if (items.length > 0) {
            // Đảm bảo productId là đúng định dạng MongoDB ObjectId
            const syncItems = items.map(item => ({
              productId: item.product, // item.product là MongoDB ObjectId string
              quantity: item.quantity
            })).filter(item => {
              // Kiểm tra định dạng MongoDB ObjectId
              const objectIdPattern = /^[0-9a-fA-F]{24}$/;
              return objectIdPattern.test(item.productId);
            });

            if (syncItems.length === 0) {
              toast.error('Không có sản phẩm hợp lệ để đồng bộ', { duration: TOAST_DURATION });
              return;
            }

            const serverCart = await cartService.syncCart(syncItems);
            
            if (serverCart) {
              set({
                _id: serverCart._id,
                user: serverCart.user,
                items: serverCart.items,
                totalAmount: serverCart.totalAmount,
                createdAt: serverCart.createdAt,
                updatedAt: serverCart.updatedAt
              });
              
              toast.success('Đồng bộ giỏ hàng thành công', { duration: TOAST_DURATION });
            }
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'Lỗi khi đồng bộ giỏ hàng';
            toast.error(errorMessage, { duration: TOAST_DURATION });
            console.error('Lỗi khi đồng bộ giỏ hàng:', error.message);
            if (error.response?.data) {
              console.error('Server error:', error.response.data);
            }
          }
          throw error;
        }
      }
    }),
    {
      name: 'shopping-cart',
    }
  )
);
