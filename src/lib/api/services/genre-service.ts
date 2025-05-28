import { axiosInstance } from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";
import { Genre } from "../types";

export const genreService = {
  // Lấy danh sách thể loại
  list: async (): Promise<Genre[]> => {
    const res = await axiosInstance.get<Genre[]>(API_ENDPOINTS.GENRE.LIST);
    return res.data;
  },

  // Lấy chi tiết thể loại
  getById: async (id: string): Promise<Genre> => {
    const res = await axiosInstance.get<Genre>(API_ENDPOINTS.GENRE.DETAIL(id));
    return res.data;
  },

  // Thêm thể loại mới
  create: async (data: { name: string }): Promise<Genre> => {
    const res = await axiosInstance.post<Genre>(API_ENDPOINTS.GENRE.CREATE, data);
    return res.data;
  },

  // Cập nhật thể loại
  update: async (id: string, data: { name: string }): Promise<Genre> => {
    const res = await axiosInstance.put<Genre>(API_ENDPOINTS.GENRE.UPDATE(id), data);
    return res.data;
  },

  // Xóa thể loại
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.GENRE.DELETE(id));
  },
};

export default genreService;