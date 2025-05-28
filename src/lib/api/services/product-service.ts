import { axiosInstance } from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { Product, ProductFilters, ProductListResponse } from "../types";

export const productService = {
  // Lấy danh sách sản phẩm
  list: async (filters?: ProductFilters): Promise<ProductListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
    }

    const res = await axiosInstance.get<ProductListResponse>(
      `${API_ENDPOINTS.PRODUCT.LIST}?${params.toString()}`
    );
    return res.data;
  },

  newest: async (): Promise<Product[]> => {
    const res = await axiosInstance.get<Product[]>(API_ENDPOINTS.PRODUCT.NEWEST);
    return res.data;
  },

  // Lấy chi tiết sản phẩm
  getById: async (id: string): Promise<Product> => {
    const res = await axiosInstance.get<Product>(API_ENDPOINTS.PRODUCT.DETAIL(id));
    return res.data;
  },

  // Tạo sản phẩm mới (dùng form-data nếu có file)
  create: async (formData: FormData): Promise<Product> => {
    const res = await axiosInstance.post<Product>(API_ENDPOINTS.PRODUCT.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Cập nhật sản phẩm
  update: async (id: string, formData: FormData): Promise<Product> => {
    const res = await axiosInstance.put<Product>(API_ENDPOINTS.PRODUCT.UPDATE(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Xóa sản phẩm
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PRODUCT.DELETE(id));
  },
};

export default productService;