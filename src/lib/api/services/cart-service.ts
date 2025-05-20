import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { Cart, SyncCartRequest } from "../types";


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
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, { 
      productId, 
      quantity 
    });
    return response.data.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem: async (productId: string): Promise<Cart> => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.CART.REMOVE(productId)
    );
    return response.data.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<Cart> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data.data;
  },

  // Đồng bộ giỏ hàng từ store
  syncCart: async (items: SyncCartRequest["items"]): Promise<Cart> => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.SYNC, { items });
    return response.data.data;
  }
};
