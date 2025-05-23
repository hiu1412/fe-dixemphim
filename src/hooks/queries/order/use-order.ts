import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/lib/api/services/order-service';
import { useOrderStore } from '@/store/order-store';
import { useCartStore } from '@/store/cart-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const ORDER_QUERY_KEY = ['orders'] as const;

const TOAST_DURATION = 1500;

export const useOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const orderStore = useOrderStore();
  const cartStore = useCartStore();

  // Query để lấy danh sách đơn hàng
  const { data: orders, isPending: isLoading } = useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: orderService.getUserOrders,
    select: (data) => data.data,
  });

  // Mutation để tạo đơn hàng mới
  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: async () => {
      try {
        const result = await orderStore.createOrder();
        if (!result.success) {
          throw new Error('Tạo đơn hàng thất bại');
        }
        return result;
      } catch (error) {
        console.error('Checkout error:', error);
        throw error;
      }
    },
    onSuccess: async (result) => {
      // Cập nhật cache đơn hàng
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });

      if (result.paymentUrl) {
        // Nếu là thanh toán online, chuyển đến trang thanh toán
        window.location.href = result.paymentUrl;
      } else {
        // COD: Xóa giỏ hàng sau khi tạo đơn thành công
        await cartStore.clearCart();
        // Chuyển đến trang success và hiển thị thông tin đơn hàng
        router.push('/checkout/success');
      }

      toast.success('Đặt hàng thành công', { duration: TOAST_DURATION });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Đặt hàng thất bại';
      toast.error(errorMessage, { duration: TOAST_DURATION });
      router.push('/checkout/failed');
    }
  });

  // Mutation để hủy đơn hàng
  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      toast.success('Đã hủy đơn hàng', { duration: TOAST_DURATION });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      orderStore.clearOrderData();
      router.push('/cart');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Không thể hủy đơn hàng';
      toast.error(errorMessage, { duration: TOAST_DURATION });
    }
  });

  // Mutation để xác minh thanh toán
  const { mutate: verifyPayment } = useMutation({
    mutationFn: async (orderId: string) => {
      try {
        const success = await orderStore.verifyPayment(orderId);
        if (!success) {
          throw new Error('Xác minh thanh toán thất bại');
        }
        return success;
      } catch (error) {
        console.error('Verify payment error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      cartStore.clearCart(); // Clear cart sau khi verify payment thành công
      router.push('/checkout/success');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Xác minh thanh toán thất bại';
      toast.error(errorMessage, { duration: TOAST_DURATION });
      router.push('/checkout/failed');
    }
  });

  return {
    // Queries
    orders,
    isLoading,

    // Mutations
    checkout,
    isCheckingOut,
    cancelOrder,
    isCancelling,
    verifyPayment,

    // Store state and actions
    currentOrder: orderStore.currentOrder,
    shippingDetails: orderStore.shippingDetails,
    paymentMethod: orderStore.paymentMethod,
    isProcessing: orderStore.isProcessing,
    setShippingDetails: orderStore.setShippingDetails,
    setPaymentMethod: orderStore.setPaymentMethod,
    clearOrderData: orderStore.clearOrderData
  };
};