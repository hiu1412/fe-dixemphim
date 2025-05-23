import { axiosInstance } from '@/lib/api/axios-instance';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingDetails: ShippingDetails;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'payos' | 'vnpay';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: Order;
  paymentUrl?: string; // For online payment methods
}

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (
    shippingDetails: ShippingDetails, 
    paymentMethod: Order['paymentMethod']
  ): Promise<CreateOrderResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDER.CREATE, { 
      shippingDetails,
      paymentMethod
    });
    return response.data;
  },

  // Lấy danh sách đơn hàng của người dùng
  getUserOrders: async (): Promise<{ data: Order[] }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.LIST);
    return response.data;
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderDetails: async (orderId: string): Promise<{ data: Order }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.DETAIL(orderId));
    return response.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDER.CANCEL(orderId));
    return response.data;
  },

  // Verify payment status
  verifyPayment: async (orderId: string, paymentMethod: Order['paymentMethod']): Promise<{
    success: boolean;
    data: {
      order: Order;
      paymentStatus: Order['paymentStatus'];
    }
  }> => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.ORDER.BASE}verify-payment`, {
      orderId,
      paymentMethod
    });
    return response.data;
  }
};