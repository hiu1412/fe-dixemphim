import { axiosInstance } from "../axios-instance";
import { Movie, ApiResponse } from "../types";
import { API_ENDPOINTS } from "../endpoints";

export const movieService = {
  getAllMovies: () => {
    return axiosInstance.get<ApiResponse<string, Movie[]>>(API_ENDPOINTS.MOVIES.BASE);
  },

  getById: (id: string) => {
    return axiosInstance.get<ApiResponse<string, Movie>>(API_ENDPOINTS.MOVIES.DETAIL(id));
  },

  create: (data: Partial<Movie>) => {
    return axiosInstance.post<ApiResponse<string, Movie>>(API_ENDPOINTS.MOVIES.CREATE, data);
  },

  update: (id: string, data: Partial<Movie>) => {
    return axiosInstance.put<ApiResponse<string, Movie>>(API_ENDPOINTS.MOVIES.UPDATE(id), data);
  },

  delete: (id: string) => {
    return axiosInstance.delete<ApiResponse<string, null>>(API_ENDPOINTS.MOVIES.DELETE(id));
  },

  getNewest: () => {
    return axiosInstance.get<ApiResponse<string, Movie[]>>(API_ENDPOINTS.MOVIES.NEWEST);
  },
} as const;