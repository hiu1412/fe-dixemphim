import { axiosInstance } from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { Artist } from "../types";

export const artistService = {
  // Lấy danh sách nghệ sĩ
  list: async (): Promise<Artist[]> => {
    const res = await axiosInstance.get<Artist[]>(API_ENDPOINTS.ARTIST.LIST);
    return res.data;
  },

  // Lấy chi tiết nghệ sĩ
  getById: async (id: string): Promise<Artist> => {
    const res = await axiosInstance.get<Artist>(API_ENDPOINTS.ARTIST.DETAIL(id));
    return res.data;
  },

  
  // Lấy sản phẩm theo nghệ sĩ
  getProducts: async (id: string) => {
    const res = await axiosInstance.get(API_ENDPOINTS.ARTIST.PRODUCTS(id));
    return res.data;
  },

  // Tạo nghệ sĩ mới (nếu cần)
  create: async (formData: FormData): Promise<Artist> => {
    const res = await axiosInstance.post<Artist>(API_ENDPOINTS.ARTIST.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Cập nhật nghệ sĩ
  update: async (id: string, formData: FormData): Promise<Artist> => {
    const res = await axiosInstance.put<Artist>(API_ENDPOINTS.ARTIST.UPDATE(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Xóa nghệ sĩ
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.ARTIST.DELETE(id));
  },
};

export default artistService;