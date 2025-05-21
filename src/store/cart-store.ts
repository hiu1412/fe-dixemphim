import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/lib/api/types';
import { cartService } from '@/lib/api/services/cart-service';
import { AxiosError } from 'axios';

interface CartState extends Omit<Cart, '_id' | 'user'> {
  _id: string;
  user: string;
  addItem: (product: { _id: string, price: number, name: string, image: string }, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItemsCount: () => number;
  isItemInCart: (productId: string) => boolean;
  syncCartWithServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      _id: '',
      user: '',
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            item => item.product === product._id
          );

          const items = existingItem
            ? state.items.map((item) =>
                item.product === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [...state.items, {
                product: product._id,
                price: product.price,
                quantity,
                productName: product.name,
                productImage: product.image
              }];

          return {
            ...state,
            items,
            totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
            updatedAt: new Date().toISOString()
          };
        });
      },

      updateQuantity: (productId, quantity) => {
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
      },

      removeItem: (productId) => {
        set((state) => {
          const items = state.items.filter((item) => item.product !== productId);
          return {
            ...state,
            items,
            totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
            updatedAt: new Date().toISOString()
          };
        });
      },

      clearCart: () => {
        set((state) => ({
          ...state,
          items: [],
          totalAmount: 0,
          updatedAt: new Date().toISOString()
        }));
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      isItemInCart: (productId) => {
        return get().items.some(item => item.product === productId);
      },

      syncCartWithServer: async () => {
        try {
          const { items } = get();
          
          if (items.length > 0) {
            console.log('Cart items before sync:', items);
            
            const syncItems = items.map(item => ({
              productId: item.product,
              quantity: item.quantity
            }));

            console.log('Sync items to send:', syncItems);
            await cartService.syncCart(syncItems);

            set({
              _id: '',
              user: '',
              items: [],
              totalAmount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error('Lỗi khi đồng bộ giỏ hàng:', error.message);
            if (error.response?.data) {
              console.error('Server error:', error.response.data);
            }
          }
        }
      }
    }),
    {
      name: 'shopping-cart',
    }
  )
);
