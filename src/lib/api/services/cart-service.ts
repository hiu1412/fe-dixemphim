import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { Cart } from "../types";

export const cartService = {
  // Lấy giỏ hàng hiện tại
  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data.data;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, { 
      productId, 
      quantity 
    });
    return response.data.data;
  },

  // Cập nhật số lượng sản phẩm
  updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
    try {
      console.log('Cart service - Update request:', {
        productId,
        productIdType: typeof productId,
        productIdLength: productId.length,
        quantity
      });

      const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, {
        productId, // Already a string from MongoDB _id
        quantity: Number(quantity)
      });

      console.log('Cart service - Update response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Cart service - Update error:', error);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem: async (productId: string): Promise<Cart> => {
    try {
      console.log('Cart service - Remove request:', { productId });
      
      const response = await axiosInstance.delete(
        API_ENDPOINTS.CART.REMOVE(productId)
      );
      
      console.log('Cart service - Remove response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Cart service - Remove error:', error);
      throw error;
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<Cart> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data.data;
  },

  // Đồng bộ giỏ hàng từ store
  syncCart: async (items: { productId: string; quantity: number }[]): Promise<Cart> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.SYNC, { items });
    return response.data.data;
  }
}