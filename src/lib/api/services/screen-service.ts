import { axiosInstance } from "../axios-instance";
import { Screen, ApiResponse } from "../types";

export const screenService = {
  getAll: () => {
    return axiosInstance.get<ApiResponse<string, Screen[]>>("/api/screens");
  },

  getById: (id: string) => {
    return axiosInstance.get<ApiResponse<string, Screen>>(`/api/screens/${id}`);
  },
} as const;