import { AxiosResponse } from 'axios';
import { axiosInstance } from './axios-instance';
import { API_ENDPOINTS } from './endpoints';
import { ApiResponse, User, UserFilters } from './types';

interface UsersResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    items: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}

export const adminApi = {
  // User endpoints
 getUsers: async (filters: UserFilters = {}) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USERS.BASE, 
      { params: filters }
    );
    return response.data; // Trả về cấu trúc gốc từ API
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  
  }
},
  
  getUser: async (userId: string) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USERS.DETAIL(userId)
    );
    return response.data;
  },
  
  updateUser: async (userId: string, userData: Partial<User>) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.USERS.UPDATE(userId),
      userData
    );
    return response.data;
  },
  
  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.USERS.DELETE(userId)
    );
    return response.data;
  },
  
  // Thêm các endpoints khác nếu cần
};
