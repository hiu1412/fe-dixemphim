import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShippingDetails, Order } from '@/lib/api/services/order-service';
import { orderService } from '@/lib/api/services/order-service';
import { toast } from 'sonner';

const TOAST_DURATION = 1500;

interface OrderState {
  currentOrder: Order | null;
  shippingDetails: ShippingDetails | null;
  paymentMethod: Order['paymentMethod'] | null;
  isProcessing: boolean;

  // Actions
  setShippingDetails: (details: ShippingDetails) => void;
  setPaymentMethod: (method: Order['paymentMethod']) => void;
  createOrder: () => Promise<{ success: boolean; paymentUrl?: string }>;
  verifyPayment: (orderId: string) => Promise<boolean>;
  clearOrderData: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      shippingDetails: null,
      paymentMethod: null,
      isProcessing: false,

      setShippingDetails: (details) => {
        set({ shippingDetails: details });
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      createOrder: async () => {
        const { shippingDetails, paymentMethod } = get();

        if (!shippingDetails || !paymentMethod) {
          toast.error('Vui lòng điền đầy đủ thông tin', { duration: TOAST_DURATION });
          return { success: false };
        }

        try {
          set({ isProcessing: true });
          
          const response = await orderService.createOrder(shippingDetails, paymentMethod);

          if (response.success) {
            // Lưu thông tin đơn hàng hiện tại
            set({ 
              currentOrder: response.data,
              isProcessing: false 
            });

            return {
              success: true,
              paymentUrl: response.paymentUrl
            };
          } else {
            throw new Error('Tạo đơn hàng thất bại');
          }
        } catch (error) {
          set({ isProcessing: false });
          
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tạo đơn hàng';
          toast.error(errorMessage, { duration: TOAST_DURATION });
          
          return { success: false };
        }
      },

      verifyPayment: async (orderId) => {
        const { paymentMethod } = get();
        
        if (!paymentMethod) {
          toast.error('Không tìm thấy phương thức thanh toán', { duration: TOAST_DURATION });
          return false;
        }

        try {
          set({ isProcessing: true });
          
          const response = await orderService.verifyPayment(orderId, paymentMethod);
          
          // Cập nhật thông tin đơn hàng mới nhất
          set({ 
            currentOrder: response.data.order,
            isProcessing: false 
          });

          if (response.data.paymentStatus === 'paid') {
            toast.success('Thanh toán thành công', { duration: TOAST_DURATION });
            return true;
          } else {
            toast.error('Thanh toán thất bại', { duration: TOAST_DURATION });
            return false;
          }
        } catch (error) {
          set({ isProcessing: false });
          
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi xác minh thanh toán';
          toast.error(errorMessage, { duration: TOAST_DURATION });
          
          return false;
        }
      },

      clearOrderData: () => {
        // Giữ lại currentOrder để hiển thị thông tin trên trang success/failed
        // Chỉ xóa các thông tin tạm thời
        set({
          shippingDetails: null,
          paymentMethod: null,
          isProcessing: false
        });
      }
    }),
    {
      name: 'order-storage',
      // Chỉ lưu currentOrder trong localStorage
      partialize: (state) => ({ currentOrder: state.currentOrder }),
    }
  )
);